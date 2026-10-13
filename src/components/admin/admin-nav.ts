import {
  BedDouble,
  Briefcase,
  Bus,
  Compass,
  Handshake,
  Inbox,
  LayoutDashboard,
  Megaphone,
  MapPin,
  Ship,
  type LucideIcon,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Navigation du back-office. Une entrée = une rubrique avec sa propre route.
// N'y ajouter que des pages réellement implémentées (pas de pages vides).
// ---------------------------------------------------------------------------

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    label: 'Principal',
    items: [
      { href: '/admin/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
      { href: '/admin/demandes', label: 'Demandes et CRM', icon: Inbox },
    ],
  },
  {
    label: 'Catalogue touristique',
    items: [
      { href: '/admin/destinations', label: 'Destinations', icon: MapPin },
      { href: '/admin/hebergements', label: 'Hébergements', icon: BedDouble },
      { href: '/admin/transports', label: 'Transports', icon: Bus },
      { href: '/admin/voyages-croisieres', label: 'Voyages et croisières', icon: Ship },
      { href: '/admin/excursions', label: 'Circuits et excursions', icon: Compass },
      { href: '/admin/tourisme-affaires', label: "Tourisme d'affaires", icon: Briefcase },
      { href: '/admin/partenaires', label: 'Partenaires', icon: Handshake },
    ],
  },
  {
    label: 'Communication',
    items: [{ href: '/admin/marketing/bandeau', label: 'Bandeau publicitaire', icon: Megaphone }],
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
