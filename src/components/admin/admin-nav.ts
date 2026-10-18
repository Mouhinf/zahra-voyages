import {
  BarChart3,
  BedDouble,
  Briefcase,
  Bus,
  Calendar,
  Compass,
  FileText,
  Handshake,
  Inbox,
  LayoutDashboard,
  Megaphone,
  MapPin,
  Mail,
  ShieldAlert,
  Ship,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { Permission } from '@/lib/rbac';

// ---------------------------------------------------------------------------
// Navigation du back-office. Une entrée = une rubrique avec sa propre route.
// N'y ajouter que des pages réellement implémentées (pas de pages vides).
// ---------------------------------------------------------------------------

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  permission?: Permission;
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    label: 'Direction',
    items: [
      { href: '/admin/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
      { href: '/admin/statistiques', label: 'Statistiques & Acquisition', icon: BarChart3, permission: 'reports.view' },
    ],
  },
  {
    label: 'Gestion commerciale',
    items: [
      { href: '/admin/demandes', label: 'Demandes & CRM', icon: Inbox, permission: 'crm.view' },
      { href: '/admin/dossiers', label: 'Dossiers de voyage', icon: Briefcase, permission: 'dossiers.view' },
      { href: '/admin/proposals', label: 'Devis officiels', icon: FileText, permission: 'quotes.view' },
    ],
  },
  {
    label: 'Organisation & Équipe',
    items: [
      { href: '/admin/tasks', label: 'Tâches & Relances', icon: Calendar, permission: 'tasks.view' },
      { href: '/admin/users', label: 'Collaborateurs & Rôles', icon: Users, permission: 'users.view' },
    ],
  },
  {
    label: 'Catalogue touristique',
    items: [
      { href: '/admin/destinations', label: 'Destinations', icon: MapPin, permission: 'content.view' },
      { href: '/admin/hebergements', label: 'Hébergements', icon: BedDouble, permission: 'content.view' },
      { href: '/admin/transports', label: 'Transports', icon: Bus, permission: 'content.view' },
      { href: '/admin/voyages-croisieres', label: 'Voyages et croisières', icon: Ship, permission: 'content.view' },
      { href: '/admin/excursions', label: 'Circuits et excursions', icon: Compass, permission: 'content.view' },
      { href: '/admin/tourisme-affaires', label: "Tourisme d'affaires", icon: Briefcase, permission: 'content.view' },
      { href: '/admin/partenaires', label: 'Partenaires', icon: Handshake, permission: 'content.view' },
    ],
  },
  {
    label: 'Marketing & Communication',
    items: [
      { href: '/admin/marketing/bandeau', label: 'Bandeau publicitaire', icon: Megaphone, permission: 'marketing.manage' },
    ],
  },
  {
    label: 'Système & Audit',
    items: [
      { href: '/admin/audit-logs', label: "Journal d'audit", icon: ShieldAlert, permission: 'audit.view' },
      { href: '/admin/notifications', label: 'Notifications Emails', icon: Mail, permission: 'notifications.view' },
    ],
  },
];

/** Libellés des sous-pages (fil d'Ariane et titre), au-delà des entrées de menu. */
const SUB_LABELS: Record<string, string> = {
  '/admin': 'Administration',
  '/admin/demandes/devis': 'Devis',
  '/admin/demandes/contacts': 'Messages de contact',
  '/admin/demandes/newsletter': 'Newsletter',
  '/admin/marketing': 'Marketing',
};

const ALL_LABELS: Record<string, string> = {
  ...Object.fromEntries(ADMIN_NAV.flatMap((g) => g.items.map((i) => [i.href, i.label]))),
  ...SUB_LABELS,
};

export interface Crumb {
  href: string;
  label: string;
}

/**
 * Fil d'Ariane déduit de l'URL : chaque segment cumulé qui possède un libellé
 * devient une étape. Les segments inconnus (identifiants) sont ignorés.
 */
export function breadcrumbsFor(pathname: string): Crumb[] {
  const segments = pathname.split('/').filter(Boolean);
  const crumbs: Crumb[] = [];
  let current = '';
  for (const segment of segments) {
    current += `/${segment}`;
    const label = ALL_LABELS[current];
    if (label) crumbs.push({ href: current, label });
  }
  return crumbs;
}

/** Entrée de menu active : la plus longue route de menu qui préfixe l'URL. */
export function activeNavHref(pathname: string): string | null {
  const hrefs = ADMIN_NAV.flatMap((g) => g.items.map((i) => i.href));
  const matches = hrefs.filter((h) => pathname === h || pathname.startsWith(`${h}/`));
  return matches.sort((a, b) => b.length - a.length)[0] ?? null;
}
