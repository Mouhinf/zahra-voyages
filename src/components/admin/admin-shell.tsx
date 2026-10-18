'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown, ChevronRight, LogOut, Menu, UserRound, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  ADMIN_NAV, activeNavHref, breadcrumbsFor, type AdminNavGroup,
} from '@/components/admin/admin-nav';
import { type AdminRole, type Permission, ROLE_LABELS } from '@/lib/rbac';

// ---------------------------------------------------------------------------
// Coquille du back-office : sidebar (desktop fixe, mobile en panneau),
// topbar (fil d'Ariane, titre, session) et zone de contenu.
// Chaque rubrique est une route Next.js ; la coquille filtre la navigation
// selon les permissions de la session active.
// ---------------------------------------------------------------------------

interface AdminShellProps {
  email: string | null;
  role?: AdminRole | null;
  hasPermission?: (perm: Permission) => boolean;
  onLogout: () => void;
  children: React.ReactNode;
}

function SidebarNav({
  groups,
  hasPermission,
  onNavigate,
}: {
  groups: AdminNavGroup[];
  hasPermission?: (perm: Permission) => boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = activeNavHref(pathname);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  return (
    <nav aria-label="Navigation d'administration" className="flex flex-col gap-4 py-4">
      {groups.map((group) => {
        // Filtrage des éléments selon les permissions du rôle courant
        const allowedItems = group.items.filter(
          (item) => !item.permission || (hasPermission && hasPermission(item.permission))
        );

        if (allowedItems.length === 0) return null;

        const isCollapsed = !!collapsed[group.label];
        const panelId = `admin-group-${group.label.replace(/\s+/g, '-').toLowerCase()}`;
        return (
          <div key={group.label}>
            <button
              type="button"
              aria-expanded={!isCollapsed}
              aria-controls={panelId}
              onClick={() => setCollapsed((c) => ({ ...c, [group.label]: !c[group.label] }))}
              className="flex w-full items-center justify-between px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              {group.label}
              {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" aria-hidden /> : <ChevronDown className="h-3.5 w-3.5" aria-hidden />}
            </button>
            <ul id={panelId} hidden={isCollapsed} className="mt-1 flex flex-col gap-0.5 px-2">
              {allowedItems.map((item) => {
                const isActive = item.href === active;
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        isActive
                          ? 'bg-primary text-primary-foreground font-medium'
                          : 'text-foreground/80 hover:bg-secondary hover:text-foreground'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link href="/admin/dashboard" className="flex items-center gap-2 px-4 py-4 border-b">
      <span className="text-lg font-bold text-primary font-headline">SLAAC Voyages</span>
      <span className="text-xs text-muted-foreground">Admin</span>
    </Link>
  );
}

export default function AdminShell({ email, role, hasPermission, onLogout, children }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const crumbs = breadcrumbsFor(pathname);
  const title = crumbs[crumbs.length - 1]?.label ?? 'Administration';
  const roleLabel = role ? ROLE_LABELS[role] ?? role : 'Administrateur';

  return (
    <div className="min-h-screen bg-secondary/40 lg:flex">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex lg:w-64 lg:shrink-0 lg:flex-col lg:sticky lg:top-0 lg:h-screen border-r bg-background overflow-y-auto">
        <Brand />
        <SidebarNav groups={ADMIN_NAV} hasPermission={hasPermission} />
      </aside>

      {/* Navigation mobile */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0 overflow-y-auto">
          <SheetHeader className="sr-only">
            <SheetTitle>Menu d&apos;administration</SheetTitle>
            <SheetDescription>Navigation entre les rubriques du back-office</SheetDescription>
          </SheetHeader>
          <Brand />
          <SidebarNav
            groups={ADMIN_NAV}
            hasPermission={hasPermission}
            onNavigate={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur-sm">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="min-w-0 flex-1">
              <nav aria-label="Fil d'Ariane" className="hidden sm:block">
                <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                  {crumbs.map((c, i) => (
                    <li key={c.href} className="flex items-center gap-1">
                      {i > 0 && <ChevronRight className="h-3 w-3" aria-hidden />}
                      {i === crumbs.length - 1 ? (
                        <span aria-current="page">{c.label}</span>
                      ) : (
                        <Link href={c.href} className="hover:text-foreground hover:underline">{c.label}</Link>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
              <h1 className="truncate text-lg font-semibold text-primary sm:text-xl">{title}</h1>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2" aria-label="Menu du profil">
                  <UserRound className="h-4 w-4" aria-hidden />
                  <span className="hidden max-w-[12rem] truncate md:inline">{email ?? 'Session'}</span>
                  {role === 'SUPER_ADMIN' && (
                    <Badge variant="secondary" className="ml-1 text-[10px] bg-amber-500/15 text-amber-600 border-amber-300">
                      Super Admin
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="font-normal">
                  <p className="text-xs text-muted-foreground">Connecté en tant que</p>
                  <p className="truncate text-sm font-medium">{email ?? '—'}</p>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Shield className="h-3 w-3 text-primary" />
                    <span>{roleLabel}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" aria-hidden />
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-auto">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
