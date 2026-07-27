// src/lib/guard.ts
/**
 * Guard that checks if the current user is an admin.
 * Supports client‑side (window) and server‑side (request) contexts.
 *
 * Usage:
 *   - In client‑side components: import { useGuard } and call it.
 *   - In API routes: import { adminGuard } and call it.
 */

export function adminGuard() {
  // Vérifie l'admin côté client (via localStorage)
  if (typeof window !== 'undefined' && window.localStorage?.getItem('authUser')) {
    const user = JSON.parse(window.localStorage.getItem('authUser')!);
    return user.email === 'mouhopap@gmail.com';
  }
  return false;
}

/**
 * Vérifie l'admin côté serveur en lisant l'en-tête X-Admin-Email.
 * Utilisé par les API routes pour protéger les points d'accès.
 */
export function adminGuardFromRequest(request: Request) {
  const adminEmail = request.headers.get('x-admin-email')?.toLowerCase();
  return adminEmail === 'mouhopap@gmail.com';
}

export function adminGuardFromRequest(request: Request) {
  const adminEmail = request.headers.get('x-admin-email')?.toLowerCase();
  return adminEmail === 'mouhopap@gmail.com';
}


export function useGuard() {
  const [isAdmin, setIsAdmin] = React.useState(false);
  React.useEffect(() => {
    // If we are on the client we can check via localStorage or auth provider
    if (typeof window !== 'undefined') {
      const user = JSON.parse(window.localStorage.getItem('authUser')!);
      setIsAdmin(user.email === 'mouhopap@gmail.com');
    } else {
      // On server side we cannot know; set to false and let API route handle
      setIsAdmin(false);
    }
  }, []);
  return isAdmin;
}