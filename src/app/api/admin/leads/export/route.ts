import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, AuthError } from '@/lib/firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { adminApp } from '@/lib/firebase-admin';
import { LEAD_STATUSES, LEAD_STATUS_LABELS, type LeadStatus } from '@/lib/crm';

export const runtime = 'nodejs';

// ---------------------------------------------------------------------------
// CRM (admin) — export CSV des demandes (quotes + contacts).
//
// Le brief impose un export « avec autorisation » : vérification stricte du
// token admin + rôle, journalisation de l'export (données personnelles),
// et réponse téléchargeable sans exposer plus de champs que nécessaire.
// ---------------------------------------------------------------------------

function csvEscape(value: unknown): string {
  const s = value == null ? '' : String(value);
  // Guillemets doublés ; préfixe anti-injection formule (=, +, -, @).
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
}

const HEADERS = [
  'Référence', 'Type', 'Statut CRM', 'Créée le', 'Nom', 'Téléphone', 'Email',
  'Service', 'Destination', 'Détails', 'Source', 'Assignée à', 'Message',
];

export async function GET(req: NextRequest) {
  try {
    const session = await verifyAdminToken(req);
    const actor = session.email ?? session.uid;

    const db = getFirestore(adminApp);
    const [quotesSnap, contactsSnap] = await Promise.all([
      db.collection('quotes').orderBy('createdAt', 'desc').limit(1000).get(),
      db.collection('contacts').orderBy('createdAt', 'desc').limit(1000).get(),
    ]);

    const rows: string[][] = [];
    for (const doc of quotesSnap.docs) {
      const d = doc.data();
      const status = (LEAD_STATUSES as readonly string[]).includes(String(d.crmStatus))
        ? LEAD_STATUS_LABELS[d.crmStatus as LeadStatus]
        : LEAD_STATUS_LABELS.nouveau;
      rows.push([
        String(d.reference ?? doc.id),
        'Devis',
        status,
        String(d.createdAt ?? ''),
        String(d.name ?? ''),
        String(d.phone ?? ''),
        String(d.email ?? ''),
        String(d.service ?? ''),
        String(d.destination ?? ''),
        [d.travelers ? `Voyageurs: ${d.travelers}` : '', d.departureDate ? `Départ: ${d.departureDate}` : '', d.nights ? `Nuits: ${d.nights}` : ''].filter(Boolean).join(' · '),
        String(d.source ?? ''),
        String(d.assignee ?? ''),
        String(d.message ?? ''),
      ]);
    }
    for (const doc of contactsSnap.docs) {
      const d = doc.data();
      const status = (LEAD_STATUSES as readonly string[]).includes(String(d.crmStatus))
        ? LEAD_STATUS_LABELS[d.crmStatus as LeadStatus]
        : LEAD_STATUS_LABELS.nouveau;
      rows.push([
        doc.id,
        'Message',
        status,
        String(d.createdAt ?? ''),
        String(d.name ?? ''),
        String(d.phone ?? ''),
        String(d.email ?? ''),
        '—',
        '—',
        '—',
        '—',
        String(d.assignee ?? ''),
        String(d.message ?? ''),
      ]);
    }

    // Tri par date décroissante (les deux collections sont fusionnées).
    rows.sort((a, b) => (b[3] ?? '').localeCompare(a[3] ?? ''));

    const csv = [
      HEADERS.map(csvEscape).join(';'),
      ...rows.map((r) => r.map(csvEscape).join(';')),
    ].join('\r\n');

    // Trace d'accès : qui a exporté quoi, quand (données personnelles).
    await db.collection('auditLogs').add({
      action: 'leads_export',
      actor,
      count: rows.length,
      at: new Date().toISOString(),
    }).catch(() => {});

    return new Response('﻿' + csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="demandes-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Admin leads export error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
