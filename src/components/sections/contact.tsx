'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Mail, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.204-1.634a11.86 11.86 0 005.79 1.499h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="currentColor"/>
    </svg>
);


const formSchema = z.object({
  name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères.' }),
  email: z.string().email({ message: 'Veuillez entrer une adresse email valide.' }),
  phone: z.string().optional(),
  message: z.string().min(10, { message: 'Le message doit contenir au moins 10 caractères.' }),
});

export default function Contact() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'Message envoyé !',
      description: 'Merci de nous avoir contactés. Nous reviendrons vers vous rapidement.',
    });
    form.reset();
  }

  return (
    <section id="contact" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-headline">Prêt à Partir ? Contactez-nous !</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Racontez-nous votre projet de voyage, demandez un devis ou posez-nous simplement une question. Notre équipe est là pour vous aider à planifier votre prochaine aventure.
            </p>
        </div>
        <div className="mt-12 grid lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-full"><MapPin className="h-6 w-6 text-primary" /></div>
                <div>
                    <h3 className="text-lg font-semibold text-primary">Notre Bureau</h3>
                    <p className="text-muted-foreground">Avenue Lamine Guèye Centre-ville, Dakar, Sénégal</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-full"><WhatsAppIcon className="h-6 w-6 text-primary" /></div>
                <div>
                    <h3 className="text-lg font-semibold text-primary">WhatsApp</h3>
                    <a href="https://wa.me/221775396325" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary flex items-center gap-2">
                        <WhatsAppIcon className="h-4 w-4 fill-current" /> +221 77 539 63 25 (Discussion instantanée)
                    </a>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-full"><Mail className="h-6 w-6 text-primary" /></div>
                <div>
                    <h3 className="text-lg font-semibold text-primary">Écrivez-nous</h3>
                    <p className="text-muted-foreground">contact@zahravoyages.com</p>
                </div>
            </div>
             <div className="pt-6">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d913.4299840693265!2d-17.4343981!3d14.668668499999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xec173b82ee767bd%3A0x95a2e5d20c75be4a!2sDjolof%20Chicken%20Dakar-Plateau!5e1!3m2!1sfr!2ssn!4v1784546169277!5m2!1sfr!2ssn"
                    title="Localisation SLAAC Voyages à Dakar"
                    width="100%"
                    height="300"
                    style={{border:0}}
                    allowFullScreen={true}
                    loading="lazy"
                    className="rounded-lg shadow-md"
                ></iframe>
            </div>
          </div>
          <Card className="w-full">
            <CardHeader>
                <CardTitle>Envoyez-nous un message</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom complet</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre nom et prénom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre adresse email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone (Optionnel)</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre numéro de téléphone" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Votre message</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Bonjour, je souhaiterais obtenir des informations sur..." rows={5} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" size="lg">
                        Envoyer ma demande <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
