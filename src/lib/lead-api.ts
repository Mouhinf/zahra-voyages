import { NextRequest, NextResponse } from 'next/server';
import { listLeads, type LeadCollection } from './crm';

/**
 * Réponse commune des listes de demandes (devis, contacts) : une page, les plus
 * récentes d'abord. Paramètres : ?limit (1–200, défaut 50) et ?cursor (id du
 * dernier élément reçu).
 */
export async function pageOfLeads(request: NextRequest, collection: LeadCollection) {
  const limitParam = Number(request.nextUrl.searchParams.get('limit') || '50');
  const limit = Number.isFinite(limitParam) ? Math.min(Math.max(Math.trunc(limitParam), 1), 200) : 50;
  const cursor = request.nextUrl.searchParams.get('cursor') || undefined;
  const page = await listLeads(collection, limit, cursor);
  if ('error' in page) return NextResponse.json({ error: page.error }, { status: 400 });
  return NextResponse.json(page);
}
