'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Mail, Send, Loader2, Phone, Clock, Navigation } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Breadcrumbs from '@/components/seo/breadcrumbs';
import { CONTACT, SITE_URL } from '@/lib/site';
import { contactSchema, type ContactInput } from '@/lib/schemas/contact-schema';
import { getStoredAttribution } from '@/lib/tracking/attribution';
import { dispatchConversionEvent } from '@/lib/tracking/provider';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg role="img" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.204-1.634a11.86 11.86 0 005.79 1.499h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
      fill="currentColor"
    />
  </svg>
);

export default function EnglishContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [utmParams, setUtmParams] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const search = new URLSearchParams(window.location.search);
      const params: Record<string, string> = {};
      const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign'];
      for (const k of utmKeys) {
        const val = search.get(k);
        if (val) params[k] = val;
      }
      if (document.referrer) params.referrer = document.referrer;
      params.landingPage = window.location.pathname;
      setUtmParams(params);
    }
  }, []);

  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
      website: '',
      locale: 'en',
    },
  });

  async function onSubmit(values: ContactInput) {
    setIsSubmitting(true);
    const attr = getStoredAttribution();

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          locale: 'en',
          utmSource: attr.utmSource || utmParams.utm_source,
          utmMedium: attr.utmMedium || utmParams.utm_medium,
          utmCampaign: attr.utmCampaign || utmParams.utm_campaign,
          utmContent: attr.utmContent,
          utmTerm: attr.utmTerm,
          gclid: attr.gclid,
          gbraid: attr.gbraid,
          wbraid: attr.wbraid,
          fbclid: attr.fbclid,
          ttclid: attr.ttclid,
          referrer: attr.referrer || utmParams.referrer,
          landingPage: attr.landingPage || utmParams.landingPage,
          website: '', // honeypot
        }),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error || 'Server error');

      // Dispatch verified conversion event
      dispatchConversionEvent('lead_created', {
        reference: body?.id || 'CONTACT-EN',
        leadId: body?.id || 'CONTACT-EN',
        service: 'contact-general',
        channel: 'contact',
        locale: 'en',
      });

      toast({
        title: 'Message sent successfully!',
        description: 'Thank you for reaching out. Our English-speaking travel advisors will reply to your request within 24 business hours.',
      });
      form.reset();
    } catch (err: unknown) {
      console.error('English contact submit error:', err);
      toast({
        title: 'Submission failed',
        description: (err instanceof Error && err.message) || 'We could not save your message. Please try again or chat with us directly on WhatsApp.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto max-w-7xl px-4 pt-4">
          <Breadcrumbs items={[{ label: 'Home', href: '/en' }, { label: 'Contact Us' }]} />
        </div>

        <section className="py-20 sm:py-28 bg-secondary">
          <div className="container mx-auto max-w-7xl px-4 text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">Get in touch</span>
            <h1 className="mt-2 text-4xl md:text-5xl font-bold text-primary font-headline">Contact Our Dakar Team</h1>
            <div className="w-16 h-0.5 bg-accent mx-auto my-5" />
            <p className="text-lg text-secondary-foreground max-w-3xl mx-auto text-balance">
              Planning a trip to Senegal, needing an airport transfer, or organizing a business delegation? Our team based in Dakar Plateau is ready to assist you in English.
            </p>
          </div>
        </section>

        <section id="contact-details" className="py-20 sm:py-28 bg-background">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Left Column: Office Coordinates */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-full shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary font-headline">Our Agency in Dakar</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{CONTACT.address.formatted}</p>
                    <p className="text-xs text-muted-foreground/80 mt-1">Landmark: 3rd floor above Djolof Chicken, corner Rue Mohamed V &amp; Rue de Thiong, Dakar Plateau.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-full shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary font-headline">Direct Phone Lines</h3>
                    <div className="space-y-1 text-sm">
                      <a href={`tel:${CONTACT.phoneIntl}`} className="text-muted-foreground hover:text-primary flex items-center gap-2 font-medium">
                        {CONTACT.phone} <span className="text-xs text-primary/80 font-normal">(Main Desk)</span>
                      </a>
                      <a href={`tel:${CONTACT.phoneSecondaryIntl}`} className="text-muted-foreground hover:text-primary flex items-center gap-2">
                        {CONTACT.phoneSecondary} <span className="text-xs text-muted-foreground/70">(Flight Ticketing &amp; Corporate)</span>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-full shrink-0">
                    <WhatsAppIcon className="h-6 w-6 text-primary fill-current" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary font-headline">WhatsApp Official</h3>
                    <a
                      href="https://wa.me/221773129090?text=Hello%20SLAAC%20Voyages%2C%20I%20would%20like%20information%20about%20your%20services."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary flex items-center gap-2 text-sm"
                    >
                      <WhatsAppIcon className="h-4 w-4 fill-current" /> {CONTACT.phone} (Instant English chat &amp; fast quotes)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-full shrink-0">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary font-headline">Office Hours (GMT)</h3>
                    <p className="text-sm text-muted-foreground">Monday – Friday: 8:30 AM – 6:30 PM</p>
                    <p className="text-sm text-muted-foreground">Saturday: 9:00 AM – 2:00 PM</p>
                    <p className="text-xs text-muted-foreground/80">Sunday: Closed (24/7 emergency WhatsApp on-call support)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-full shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary font-headline">Official Email</h3>
                    <p className="text-muted-foreground text-sm">{CONTACT.email}</p>
                    <p className="text-muted-foreground text-sm mt-0.5">{CONTACT.emailInfo}</p>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary flex items-center gap-1.5">
                      <Navigation className="w-4 h-4 text-primary" /> Google Maps Directions
                    </span>
                    <Button asChild size="sm" variant="outline" className="border-primary/30 text-primary hover:bg-primary hover:text-white">
                      <a href={CONTACT.directionsUrl} target="_blank" rel="noopener noreferrer">
                        Open Google Maps &rarr;
                      </a>
                    </Button>
                  </div>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d913.4299840693265!2d-17.4343981!3d14.668668499999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xec173b82ee767bd%3A0x95a2e5d20c75be4a!2sDjolof%20Chicken%20Dakar-Plateau!5e1!3m2!1sen!2ssn!4v1784546169277!5m2!1sen!2ssn"
                    title="SLAAC Voyages Agency Location in Dakar Plateau"
                    width="100%"
                    height="260"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg shadow-sm border border-border"
                  />
                </div>
              </div>

              {/* Right Column: English Form */}
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Send Us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. John Smith" {...field} />
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
                            <FormLabel>Email Address *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="e.g. john.smith@company.com" {...field} />
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
                            <FormLabel>Phone Number (with country code)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. +1 555 123 4567 or +44 20 7946 0991" {...field} />
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
                            <FormLabel>Your Message *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us about your trip dates, passenger numbers, transfer requirements or destination ideas..."
                                rows={5}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending message...
                          </>
                        ) : (
                          <>
                            Send Message in English <Send className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contact SLAAC Voyages Dakar',
            url: `${SITE_URL}/en/contact`,
            mainEntity: {
              '@type': 'TravelAgency',
              name: 'SLAAC Voyages',
              telephone: CONTACT.phoneIntl,
              email: CONTACT.email,
              address: {
                '@type': 'PostalAddress',
                streetAddress: CONTACT.address.street,
                addressLocality: CONTACT.address.city,
                addressCountry: 'SN',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: CONTACT.geo.latitude,
                longitude: CONTACT.geo.longitude,
              },
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                  opens: '08:30',
                  closes: '18:30',
                },
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Saturday'],
                  opens: '09:00',
                  closes: '14:00',
                },
              ],
            },
          }),
        }}
      />
    </div>
  );
}
