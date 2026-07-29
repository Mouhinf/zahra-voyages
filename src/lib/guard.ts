import { useEffect, useState } from 'react';

export function useGuard() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userStr = typeof window !== 'undefined' ? window.localStorage.getItem('authUser') : null;
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setIsAdmin(user.email === 'mouhopap@gmail.com');
      } catch {
        setIsAdmin(false);
      }
    }
  }, []);

  return isAdmin;
}
