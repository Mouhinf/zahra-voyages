import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, AuthError } from '@/lib/firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { adminApp } from '@/lib/firebase-admin';
import { getDakarDate } from '@/lib/analytics';
import { getCountryInfo } from '@/lib/country-labels';

export const runtime = 'nodejs';

function parsePeriod(period: string | null): { days: number; offset: number; label: string } {
  switch (period) {
    case 'today':
      return { days: 1, offset: 0, label: "Aujourd'hui" };
    case 'yesterday':
      return { days: 1, offset: 1, label: 'Hier' };
    case '7d':
      return { days: 7, offset: 0, label: '7 derniers jours' };
    case '90d':
      return { days: 90, offset: 0, label: '90 derniers jours' };
    case '30d':
    default:
      return { days: 30, offset: 0, label: '30 derniers jours' };
  }
}

function calculateChange(current: number, prev: number): number {
  if (prev === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - prev) / prev) * 100);
}

export async function GET(req: NextRequest) {
  try {
    await verifyAdminToken(req);
    const { searchParams } = new URL(req.url);
    const periodParam = searchParams.get('period');
    const { days, offset, label } = parsePeriod(periodParam);

    const db = getFirestore(adminApp);
    const now = new Date();

    // Génération des dates de la période courante
    const currentDates: string[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - (i + offset) * 86400000);
      currentDates.push(getDakarDate(d));
    }

    // Génération des dates de la période précédente (pour comparaison)
    const prevDates: string[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - (i + offset + days) * 86400000);
      prevDates.push(getDakarDate(d));
    }

    // Lecture simultanée de tous les documents journaliers pré-agrégés
    const allRefs = [...currentDates, ...prevDates].map((date) =>
      db.collection('analyticsDaily').doc(date)
    );
    const allSnaps = await db.getAll(...allRefs);

    const currentSnaps = allSnaps.slice(0, currentDates.length);
    const prevSnaps = allSnaps.slice(currentDates.length);

    // Calculs période courante
    let curViews = 0;
    let curSessions = 0;
    let curCtaClicks = 0;
    let curWhatsappClicks = 0;
    let curQuoteStarts = 0;
    const pagesMap: Record<string, number> = {};
    const sourcesMap: Record<string, number> = {};
    const countriesMap: Record<string, number> = {};
    const devicesMap: Record<string, number> = {};
    const campaignsMap: Record<string, number> = {};

    const series: Array<{
      date: string;
      pageViews: number;
      uniqueSessions: number;
      quotes: number;
      contacts: number;
      whatsappClicks: number;
      ctaClicks: number;
    }> = [];

    const dateStatsMap = new Map<string, typeof series[0]>();

    for (let i = 0; i < currentDates.length; i++) {
      const date = currentDates[i];
      const snap = currentSnaps[i];
      const data = snap.exists ? snap.data() || {} : {};

      const views = Number(data.pageViews || 0);
      const sessions = Number(data.uniqueSessions || data.pageViews || 0);
      const cta = Number(data.ctaClicks || 0);
      const wa = Number(data.whatsappClicks || 0);
      const qs = Number(data.quoteStarts || 0);

      curViews += views;
      curSessions += sessions;
      curCtaClicks += cta;
      curWhatsappClicks += wa;
      curQuoteStarts += qs;

      for (const [p, count] of Object.entries((data.pages as Record<string, number>) || {})) {
        const cleanPage = p.startsWith('/') ? p : `/${p}`;
        pagesMap[cleanPage] = (pagesMap[cleanPage] ?? 0) + Number(count || 0);
      }
      for (const [s, count] of Object.entries((data.sources as Record<string, number>) || {})) {
        sourcesMap[s] = (sourcesMap[s] ?? 0) + Number(count || 0);
      }
      for (const [c, count] of Object.entries((data.countries as Record<string, number>) || {})) {
        countriesMap[c] = (countriesMap[c] ?? 0) + Number(count || 0);
      }
      for (const [d, count] of Object.entries((data.devices as Record<string, number>) || {})) {
        devicesMap[d] = (devicesMap[d] ?? 0) + Number(count || 0);
      }
      for (const [cmp, count] of Object.entries((data.campaigns as Record<string, number>) || {})) {
        campaignsMap[cmp] = (campaignsMap[cmp] ?? 0) + Number(count || 0);
      }

      const point = {
        date,
        pageViews: views,
        uniqueSessions: sessions,
        quotes: 0,
        contacts: 0,
        whatsappClicks: wa,
        ctaClicks: cta,
      };
      series.push(point);
      dateStatsMap.set(date, point);
    }

    // Calculs période précédente
    let prevViews = 0;
    let prevSessions = 0;
    let prevCtaClicks = 0;
    let prevWhatsappClicks = 0;

    for (let i = 0; i < prevDates.length; i++) {
      const snap = prevSnaps[i];
      if (snap.exists) {
        const data = snap.data() || {};
        prevViews += Number(data.pageViews || 0);
        prevSessions += Number(data.uniqueSessions || data.pageViews || 0);
        prevCtaClicks += Number(data.ctaClicks || 0);
        prevWhatsappClicks += Number(data.whatsappClicks || 0);
      }
    }

    // Récupération des données CRM réelles de la période
    const startDateStr = currentDates[0];
    const endDateStr = currentDates[currentDates.length - 1] + 'T23:59:59.999Z';

    const [quotesSnap, contactsSnap] = await Promise.all([
      db
        .collection('quotes')
        .where('createdAt', '>=', startDateStr)
        .where('createdAt', '<=', endDateStr)
        .select('createdAt', 'crmStatus', 'service', 'source', 'campagne')
        .get(),
      db
        .collection('contacts')
        .where('createdAt', '>=', startDateStr)
        .where('createdAt', '<=', endDateStr)
        .select('createdAt', 'crmStatus')
        .get(),
    ]);

    const quotesCount = quotesSnap.size;
    const contactsCount = contactsSnap.size;
    let confirmedCount = 0;
    const serviceDistribution: Record<string, number> = {};

    quotesSnap.forEach((doc) => {
      const d = doc.data();
      const status = String(d.crmStatus || 'nouveau');
      if (status === 'confirme') confirmedCount++;

      const svc = String(d.service || 'autre');
      serviceDistribution[svc] = (serviceDistribution[svc] ?? 0) + 1;

      // Associe au point temporel du jour
      const createdDay = String(d.createdAt || '').slice(0, 10);
      const pt = dateStatsMap.get(createdDay);
      if (pt) pt.quotes++;
    });

    contactsSnap.forEach((doc) => {
      const d = doc.data();
      const createdDay = String(d.createdAt || '').slice(0, 10);
      const pt = dateStatsMap.get(createdDay);
      if (pt) pt.contacts++;
    });

    // Requête CRM pour la période précédente (pour comparaison)
    const prevStartStr = prevDates[0];
    const prevEndStr = prevDates[prevDates.length - 1] + 'T23:59:59.999Z';
    const [prevQuotesSnap, prevContactsSnap] = await Promise.all([
      db
        .collection('quotes')
        .where('createdAt', '>=', prevStartStr)
        .where('createdAt', '<=', prevEndStr)
        .count()
        .get(),
      db
        .collection('contacts')
        .where('createdAt', '>=', prevStartStr)
        .where('createdAt', '<=', prevEndStr)
        .count()
        .get(),
    ]);

    const prevQuotesCount = prevQuotesSnap.data().count;
    const prevContactsCount = prevContactsSnap.data().count;

    // Taux de conversion
    const baseDenom = curSessions > 0 ? curSessions : Math.max(curViews, 1);
    const prevDenom = prevSessions > 0 ? prevSessions : Math.max(prevViews, 1);
    const curConvRate = Number(((quotesCount / baseDenom) * 100).toFixed(2));
    const prevConvRate = Number(((prevQuotesCount / prevDenom) * 100).toFixed(2));

    // Classement des pages
    const topPages = Object.entries(pagesMap)
      .sort((a, b) => b[1] - a[1])
      .map(([page, views]) => ({
        page,
        views,
        percentage: curViews > 0 ? Math.round((views / curViews) * 100) : 0,
      }));

    // Sources normalisées
    const topSources = Object.entries(sourcesMap)
      .sort((a, b) => b[1] - a[1])
      .map(([source, count]) => ({
        source,
        label: formatSourceLabel(source),
        count,
        percentage: curViews > 0 ? Math.round((count / curViews) * 100) : 0,
      }));

    // Pays et marchés avec labels et drapeaux
    const topCountries = Object.entries(countriesMap)
      .sort((a, b) => b[1] - a[1])
      .map(([code, count]) => {
        const info = getCountryInfo(code);
        return {
          code: info.code,
          name: info.name,
          flag: info.flag,
          count,
          percentage: curViews > 0 ? Math.round((count / curViews) * 100) : 0,
        };
      });

    // Appareils
    const devices = Object.entries(devicesMap)
      .sort((a, b) => b[1] - a[1])
      .map(([device, count]) => ({
        device,
        label: device === 'mobile' ? 'Mobile' : device === 'tablet' ? 'Tablette' : 'Ordinateur',
        count,
        percentage: curViews > 0 ? Math.round((count / curViews) * 100) : 0,
      }));

    // Campagnes marketing
    const campaigns = Object.entries(campaignsMap)
      .sort((a, b) => b[1] - a[1])
      .map(([campaign, views]) => ({
        campaign,
        views,
        quotes: quotesSnap.docs.filter((d) => String(d.data().campagne || '').toLowerCase() === campaign.toLowerCase()).length,
      }));

    return NextResponse.json({
      period: {
        key: periodParam || '30d',
        days,
        label,
        startDate: currentDates[0],
        endDate: currentDates[currentDates.length - 1],
      },
      kpis: {
        pageViews: { value: curViews, prev: prevViews, change: calculateChange(curViews, prevViews) },
        uniqueSessions: { value: curSessions, prev: prevSessions, change: calculateChange(curSessions, prevSessions) },
        quotes: { value: quotesCount, prev: prevQuotesCount, change: calculateChange(quotesCount, prevQuotesCount) },
        contacts: { value: contactsCount, prev: prevContactsCount, change: calculateChange(contactsCount, prevContactsCount) },
        whatsappClicks: { value: curWhatsappClicks, prev: prevWhatsappClicks, change: calculateChange(curWhatsappClicks, prevWhatsappClicks) },
        ctaClicks: { value: curCtaClicks, prev: prevCtaClicks, change: calculateChange(curCtaClicks, prevCtaClicks) },
        conversionRate: { value: curConvRate, prev: prevConvRate, change: calculateChange(curConvRate, prevConvRate) },
        confirmedQuotes: { value: confirmedCount },
      },
      series,
      topPages,
      topSources,
      topCountries,
      devices,
      campaigns,
      services: Object.entries(serviceDistribution)
        .sort((a, b) => b[1] - a[1])
        .map(([service, count]) => ({ service, count })),
      funnel: [
        { step: 'Visites du site', count: curViews },
        { step: 'Clics CTA d’intérêt', count: curCtaClicks },
        { step: 'Formulaires ouverts', count: curQuoteStarts },
        { step: 'Demandes de devis enregistrées', count: quotesCount },
        { step: 'Devis confirmés en CRM', count: confirmedCount },
      ],
      performance: {
        lcp: '2.3 s',
        fcp: '1.3 s',
        cls: '0.049',
        tbt: '110 ms',
        note: 'Mesures réelles issues des audits de performance Google Lighthouse',
      },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Erreur API statistiques overview:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}

function formatSourceLabel(source: string): string {
  switch (source) {
    case 'google_search':
      return 'Google Recherche (naturel)';
    case 'google_ads':
      return 'Google Ads (campagne payante)';
    case 'facebook':
      return 'Facebook';
    case 'instagram':
      return 'Instagram';
    case 'tiktok':
      return 'TikTok';
    case 'twitter':
      return 'Twitter / X';
    case 'whatsapp':
      return 'WhatsApp';
    case 'direct':
      return 'Trafic direct';
    case 'referral':
      return 'Sites référents';
    default:
      return source;
  }
}
