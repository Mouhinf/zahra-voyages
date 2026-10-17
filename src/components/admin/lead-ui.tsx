"use client";

// Briques partagées par la liste CRM, la fiche d'une demande et la vue d'ensemble.
import { Badge } from '@/components/ui/badge';
import { getAuthInstance } from '@/lib/firebase';
import { MailWarning } from 'lucide-react';

export type Row = Record<string, unknown> & { id: string };

export type CrmStatus = 'nouveau' | 'contacte' | 'en_discussion' | 'devis_envoye' | 'confirme' | 'perdu';

export const STATUS: Array<{ value: CrmStatus; label: string; badgeClass: string }> = [
  { value: 'nouveau', label: 'Nouveau', badgeClass: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'contacte', label: 'Contacté', badgeClass: 'bg-amber-100 text-amber-800 border-amber-200' },
  { value: 'en_discussion', label: 'En discussion', badgeClass: 'bg-purple-100 text-purple-800 border-purple-200' },
  { value: 'devis_envoye', label: 'Devis envoyé', badgeClass: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
  { value: 'confirme', label: 'Confirmé', badgeClass: 'bg-green-100 text-green-800 border-green-200' },
  { value: 'perdu', label: 'Perdu', badgeClass: 'bg-gray-100 text-gray-600 border-gray-200' },
];

export const STATUS_LABEL: Record<string, string> = Object.fromEntries(STATUS.map((s) => [s.value, s.label]));

export function str(v: unknown): string {
  return typeof v === 'string' ? v : v == null ? '' : String(v);
}

export function formatCreatedAt(v: unknown): string {
  if (typeof v === 'string') {
    const d = new Date(v);
    return isNaN(d.getTime()) ? v : d.toLocaleString('fr-FR');
  }
  if (v && typeof v === 'object' && 'seconds' in v) {
    const seconds = Number((v as { seconds: unknown }).seconds);
    if (Number.isFinite(seconds)) return new Date(seconds * 1000).toLocaleString('fr-FR');
  }
  return '';
}

export function createdMs(v: unknown): number {
  if (typeof v === 'string') {
    const t = new Date(v).getTime();
    if (Number.isFinite(t)) return t;
  }
  if (v && typeof v === 'object' && 'seconds' in v) {
    const s = Number((v as { seconds: unknown }).seconds);
    if (Number.isFinite(s)) return s * 1000;
  }
  return NaN;
}

export function isUnhandled(it: Row): boolean {
  const status = str(it.crmStatus) || 'nouveau';
  if (status !== 'nouveau') return false;
  const t = createdMs(it.createdAt);
  return Number.isFinite(t) && Date.now() - t > 48 * 60 * 60 * 1000;
}

export async function adminFetch(url: string, init?: RequestInit): Promise<Record<string, unknown>> {
  const auth = getAuthInstance();
  const user = auth?.currentUser;
  if (!user) throw new Error('Non connecté');
  const token = await user.getIdToken();
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...init?.headers },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((body as { error?: string })?.error || `Erreur ${res.status}`);
  return body as Record<string, unknown>;
}

export function StatusBadge({ value }: { value: string }) {
  const s = STATUS.find((x) => x.value === value) ?? STATUS[0];
  return <Badge variant="outline" className={s.badgeClass}>{s.label}</Badge>;
}

export function NotifyBadge({ value, emailStatus }: { value?: unknown; emailStatus?: unknown }) {
  if (emailStatus && typeof emailStatus === 'object') {
    const statuses = Object.values(emailStatus as Record<string, { status?: string }>).map((s) => s?.status);
    if (statuses.some((s) => s === 'failed' || s === 'permanently_failed')) {
      return (
        <Badge variant="destructive" className="gap-1">
          <MailWarning className="h-3 w-3" /> email en échec
        </Badge>
      );
    }
    if (statuses.length > 0 && statuses.every((s) => s === 'sent')) {
      return (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
          emails livrés
        </Badge>
      );
    }
    if (statuses.some((s) => s === 'processing' || s === 'pending')) {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          envoi en cours
        </Badge>
      );
    }
  }

  const v = str(value);
  if (!v || v === 'pending') return null;
  if (v === 'sent') return <Badge variant="secondary">email envoyé</Badge>;
  if (v.startsWith('failed:')) {
    return (
      <Badge variant="destructive" className="gap-1">
        <MailWarning className="h-3 w-3" /> email non envoyé ({v.slice(7)})
      </Badge>
    );
  }
  return null;
}



export type Note = { at: string; by: string; texte: string };
export type HistoryEvent = { at: string; by: string; event: string };
