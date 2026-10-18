'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Cookie, Settings2 } from 'lucide-react';
import {
  getConsentPreferences,
  acceptAllConsent,
  refuseAllConsent,
  saveConsentPreferences,
  type ConsentPreferences,
} from '@/lib/tracking/consent';

export function ConsentBanner() {
  const pathname = usePathname();
  const isEn = pathname?.startsWith('/en');

  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [customPrefs, setCustomPrefs] = useState<{
    analytics: boolean;
    marketing: boolean;
  }>({
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    setMounted(true);
    const prefs = getConsentPreferences();
    if (!prefs.hasInteracted) {
      // Affichage léger différé pour ne pas gêner le First Contentful Paint
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  // Écouteur pour réouverture via le lien footer "Paramètres des cookies"
  useEffect(() => {
    const handleOpenModal = () => {
      const current = getConsentPreferences();
      setCustomPrefs({
        analytics: current.analytics_storage === 'granted',
        marketing: current.ad_storage === 'granted',
      });
      setModalOpen(true);
    };

    window.addEventListener('slaac_open_consent_modal', handleOpenModal);
    return () => window.removeEventListener('slaac_open_consent_modal', handleOpenModal);
  }, []);

  if (!mounted) return null;

  const handleAcceptAll = () => {
    acceptAllConsent();
    setVisible(false);
  };

  const handleRefuseAll = () => {
    refuseAllConsent();
    setVisible(false);
  };

  const handleOpenCustomize = () => {
    const current = getConsentPreferences();
    setCustomPrefs({
      analytics: current.analytics_storage === 'granted',
      marketing: current.ad_storage === 'granted',
    });
    setModalOpen(true);
  };

  const handleSaveCustom = () => {
    saveConsentPreferences({
      analytics_storage: customPrefs.analytics ? 'granted' : 'denied',
      ad_storage: customPrefs.marketing ? 'granted' : 'denied',
      ad_user_data: customPrefs.marketing ? 'granted' : 'denied',
      ad_personalization: customPrefs.marketing ? 'granted' : 'denied',
    });
    setModalOpen(false);
    setVisible(false);
  };

  return (
    <>
      {/* Bandeau Flottant Bas de Page */}
      {visible && (
        <aside
          role="region"
          aria-label={isEn ? 'Cookie Consent' : 'Consentement aux cookies'}
          className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-lg z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <Card className="p-4 sm:p-5 shadow-2xl border-slate-200/90 bg-white/95 backdrop-blur-md rounded-2xl">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 rounded-xl bg-slaac-gold-50 text-slaac-gold-600 shrink-0">
                <Cookie className="w-5 h-5" />
              </div>
              <div className="flex-grow">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  {isEn ? 'Privacy & Cookie Preferences' : 'Respect de votre vie privée & Cookies'}
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  {isEn
                    ? 'SLAAC Voyages uses essential technical cookies and optional audience measurement to tailor our travel services. You can accept all, refuse, or customize your preferences anytime.'
                    : 'SLAAC Voyages utilise des cookies techniques essentiels et des traceurs de mesure facultatifs pour vous proposer des prestations adaptées. Vous pouvez accepter, refuser ou personnaliser vos choix à tout moment.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleOpenCustomize}
                className="text-xs text-slate-500 hover:text-slate-800 underline flex items-center gap-1 py-1"
              >
                <Settings2 className="w-3.5 h-3.5" />
                {isEn ? 'Customize' : 'Personnaliser'}
              </button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRefuseAll}
                  className="text-xs h-8 px-3 border-slate-200"
                >
                  {isEn ? 'Decline' : 'Refuser'}
                </Button>
                <Button
                  type="button"
                  variant="gold"
                  size="sm"
                  onClick={handleAcceptAll}
                  className="text-xs h-8 px-4 font-semibold"
                >
                  {isEn ? 'Accept All' : 'Tout accepter'}
                </Button>
              </div>
            </div>
          </Card>
        </aside>
      )}

      {/* Modale de Personnalisation Détaillée */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-slate-900 font-headline">
              <ShieldCheck className="w-5 h-5 text-slaac-gold-600" />
              {isEn ? 'Customize Cookie Preferences' : 'Gestion de vos préférences de cookies'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {isEn
                ? 'In accordance with Senegalese Law No. 2008-12 and international standards, you have full control over your personal data.'
                : 'Conformément à la loi sénégalaise n° 2008-12 relative à la protection des données (CDP), vous gardez le contrôle de vos préférences.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Cookies Essentiels (Obligatoires) */}
            <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="space-y-0.5">
                <Label className="text-xs font-bold text-slate-900">
                  {isEn ? 'Essential Cookies (Mandatory)' : 'Cookies Techniques Essentiels (Obligatoires)'}
                </Label>
                <p className="text-[11px] text-slate-500 leading-tight">
                  {isEn
                    ? 'Required for site security, session integrity, form submission, and language switching.'
                    : 'Indispensables pour la sécurité, le fonctionnement des formulaires de devis et la sélection de langue.'}
                </p>
              </div>
              <Switch checked={true} disabled className="opacity-70 mt-1" />
            </div>

            {/* Mesure d'Audience (Analytics) */}
            <div className="flex items-start justify-between gap-3 p-3 rounded-xl border border-slate-200">
              <div className="space-y-0.5">
                <Label htmlFor="analytics-toggle" className="text-xs font-bold text-slate-900 cursor-pointer">
                  {isEn ? 'Audience Measurement & Performance' : 'Mesure d’Audience & Performance'}
                </Label>
                <p className="text-[11px] text-slate-500 leading-tight">
                  {isEn
                    ? 'Helps us analyze aggregate visits and optimize loading speed without storing raw IP addresses.'
                    : 'Nous aide à comprendre l’utilisation du site et à améliorer la rapidité d’affichage sans stocker d’adresses IP brutes.'}
                </p>
              </div>
              <Switch
                id="analytics-toggle"
                checked={customPrefs.analytics}
                onCheckedChange={(val) => setCustomPrefs((prev) => ({ ...prev, analytics: val }))}
                className="mt-1"
              />
            </div>

            {/* Publicité & Réseaux Sociaux */}
            <div className="flex items-start justify-between gap-3 p-3 rounded-xl border border-slate-200">
              <div className="space-y-0.5">
                <Label htmlFor="marketing-toggle" className="text-xs font-bold text-slate-900 cursor-pointer">
                  {isEn ? 'Targeted Advertising (Meta, Google, TikTok)' : 'Publicité Ciblée (Google, Meta, TikTok)'}
                </Label>
                <p className="text-[11px] text-slate-500 leading-tight">
                  {isEn
                    ? 'Allows relevant travel promotions and prevents showing repetitive advertisements.'
                    : 'Permet de mesurer l’efficacité de nos campagnes et d’afficher des annonces pertinentes lors de vos recherches de voyage.'}
                </p>
              </div>
              <Switch
                id="marketing-toggle"
                checked={customPrefs.marketing}
                onCheckedChange={(val) => setCustomPrefs((prev) => ({ ...prev, marketing: val }))}
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter className="flex-row items-center justify-between gap-2 pt-2 sm:justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRefuseAll}
              className="text-xs"
            >
              {isEn ? 'Refuse All' : 'Tout refuser'}
            </Button>
            <Button
              type="button"
              variant="gold"
              size="sm"
              onClick={handleSaveCustom}
              className="text-xs font-semibold"
            >
              {isEn ? 'Save Preferences' : 'Enregistrer mes choix'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * Déclencheur global permettant d'ouvrir la modale de consentement depuis le footer.
 */
export function openConsentModal(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('slaac_open_consent_modal'));
  }
}
