'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Veuillez entrer une adresse email valide.' }),
  password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères.' }),
});

export default function AdminLoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Un administrateur déjà connecté est redirigé directement vers le
  // tableau de bord (pas besoin de se reconnecter).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { getAuthInstance } = await import('@/lib/firebase');
      const { onAuthStateChanged } = await import('firebase/auth');
      onAuthStateChanged(getAuthInstance(), async (user) => {
        if (cancelled || !user) return;
        try {
          const token = await user.getIdToken();
          const res = await fetch('/api/admin/session', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!cancelled && res.ok) router.replace('/admin');
        } catch {
          // pas admin ou erreur — rester sur la page de connexion
        }
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const { getAuthInstance } = await import('@/lib/firebase');
      const credential = await signInWithEmailAndPassword(getAuthInstance(), values.email, values.password);

      // Vérification immédiate des droits côté serveur : permet d'afficher
      // la VRAIE raison d'un refus (rôle manquant, configuration serveur…)
      // au lieu de renvoyer l'utilisateur à l'aveugle vers /admin.
      const token = await credential.user.getIdToken();
      const res = await fetch('/api/admin/session', {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });

      if (res.ok) {
        toast({
          title: 'Connexion réussie',
          description: 'Vous allez être redirigé vers le tableau de bord.',
        });
        router.push('/admin');
        return;
      }

      const body = await res.json().catch(() => ({}));
      if (res.status === 503) {
        toast({
          title: 'Administration non configurée sur ce serveur',
          description:
            body.error ||
            'Ajoutez FIREBASE_SERVICE_ACCOUNT_KEY dans .env.local (ou les variables Vercel) puis redémarrez le serveur.',
          variant: 'destructive',
        });
      } else if (res.status === 403) {
        toast({
          title: 'Ce compte n’a pas les droits administrateur',
          description:
            'L’email doit être vérifié et figurer dans ADMIN_EMAILS (ou porter le custom claim admin — voir scripts/set-admin-claim.mjs).',
          variant: 'destructive',
        });
        await getAuthInstance().signOut();
      } else {
        toast({
          title: 'Vérification du compte impossible',
          description: body.error || `Erreur ${res.status} — réessayez.`,
          variant: 'destructive',
        });
        await getAuthInstance().signOut();
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      const code = (error as { code?: string })?.code ?? '';
      const messages: Record<string, string> = {
        'auth/invalid-credential': 'Email ou mot de passe incorrect.',
        'auth/wrong-password': 'Mot de passe incorrect.',
        'auth/user-not-found': 'Aucun compte n’existe avec cet email.',
        'auth/too-many-requests': 'Trop de tentatives — réessayez dans quelques minutes.',
        'auth/network-request-failed': 'Réseau indisponible — vérifiez votre connexion.',
        'auth/invalid-email': 'Adresse email invalide.',
      };
      toast({
        title: 'Erreur de connexion',
        description: messages[code] ?? 'Vérifiez votre email et votre mot de passe.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Connexion Administrateur</CardTitle>
          <CardDescription>Accédez à votre tableau de bord</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" autoComplete="email" placeholder="admin@zahravoyages.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="current-password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Se connecter
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}