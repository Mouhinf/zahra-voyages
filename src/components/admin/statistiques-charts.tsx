'use client';

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const SOURCE_COLORS = [
  '#2563eb', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#ec4899', // Pink
  '#14b8a6', // Teal
  '#64748b', // Slate
];

interface StatistiquesChartsProps {
  series: Array<{
    date: string;
    pageViews: number;
    uniqueSessions: number;
    quotes: number;
    contacts: number;
    whatsappClicks: number;
    ctaClicks: number;
  }>;
  sources: Array<{
    source: string;
    label: string;
    count: number;
    percentage: number;
  }>;
  devices: Array<{
    device: string;
    label: string;
    count: number;
    percentage: number;
  }>;
  funnel: Array<{
    step: string;
    count: number;
  }>;
}

export default function StatistiquesCharts({
  series,
  sources,
  devices,
  funnel,
}: StatistiquesChartsProps) {
  // Formatage des dates courtes (JJ/MM) pour l'axe X
  const formattedSeries = series.map((s) => ({
    ...s,
    displayDate: s.date.slice(5),
  }));

  const maxFunnel = funnel[0]?.count || 1;

  return (
    <div className="space-y-6">
      {/* 1. Évolution chronologique du trafic et des demandes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Évolution du Trafic et des Demandes</CardTitle>
          <CardDescription>
            Pages vues, visiteurs uniques (sessions estimées), demandes de devis et interactions WhatsApp.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={formattedSeries}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorQuotes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="displayDate" fontSize={12} tickLine={false} />
              <YAxis allowDecimals={false} fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                formatter={(value: number, name: string) => [
                  value.toLocaleString('fr-FR'),
                  name === 'pageViews'
                    ? 'Pages vues'
                    : name === 'uniqueSessions'
                    ? 'Sessions uniques'
                    : name === 'quotes'
                    ? 'Devis reçus'
                    : name === 'whatsappClicks'
                    ? 'Clics WhatsApp'
                    : name,
                ]}
              />
              <Legend
                formatter={(val) =>
                  val === 'pageViews'
                    ? 'Pages vues'
                    : val === 'uniqueSessions'
                    ? 'Sessions uniques'
                    : val === 'quotes'
                    ? 'Devis reçus'
                    : val === 'whatsappClicks'
                    ? 'Clics WhatsApp'
                    : val
                }
              />
              <Area type="monotone" dataKey="pageViews" stroke="#2563eb" strokeWidth={2} fill="url(#colorViews)" />
              <Area type="monotone" dataKey="uniqueSessions" stroke="#8b5cf6" strokeWidth={2} fillOpacity={0} />
              <Area type="monotone" dataKey="quotes" stroke="#10b981" strokeWidth={2} fill="url(#colorQuotes)" />
              <Area type="monotone" dataKey="whatsappClicks" stroke="#16a34a" strokeWidth={1.5} strokeDasharray="3 3" fillOpacity={0} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 2. Sources d'acquisition & Appareils */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Canaux d'Acquisition</CardTitle>
            <CardDescription>Origine des visiteurs (recherche, réseaux sociaux, direct, etc.)</CardDescription>
          </CardHeader>
          <CardContent>
            {sources.length === 0 ? (
              <p className="text-sm text-muted-foreground py-10 text-center">Aucune donnée de source pour la période.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={sources}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    paddingAngle={3}
                  >
                    {sources.map((entry, index) => (
                      <Cell key={entry.source} fill={SOURCE_COLORS[index % SOURCE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value} visites`, 'Volume']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Appareils */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Répartition par Appareil</CardTitle>
            <CardDescription>Mobiles, ordinateurs de bureau et tablettes</CardDescription>
          </CardHeader>
          <CardContent>
            {devices.length === 0 ? (
              <p className="text-sm text-muted-foreground py-10 text-center">Aucune donnée d'appareil pour la période.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={devices} layout="vertical" margin={{ left: 10, right: 20, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} fontSize={12} />
                  <YAxis type="category" dataKey="label" width={90} fontSize={12} />
                  <Tooltip formatter={(value: number) => [`${value} visites`, 'Appareil']} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 3. Entonnoir de Conversion Commerciale */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Entonnoir de Conversion Commerciale</CardTitle>
          <CardDescription>
            De la découverte du site jusqu'à la confirmation de devis dans le CRM.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {funnel.map((step, idx) => {
              const pct = maxFunnel > 0 ? Math.round((step.count / maxFunnel) * 100) : 0;
              return (
                <div key={step.step} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-foreground">
                      {idx + 1}. {step.step}
                    </span>
                    <span className="text-muted-foreground font-mono">
                      {step.count.toLocaleString('fr-FR')} {idx === 0 ? '' : `(${pct}%)`}
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        idx === 0
                          ? 'bg-blue-500'
                          : idx === 1
                          ? 'bg-cyan-500'
                          : idx === 2
                          ? 'bg-amber-500'
                          : idx === 3
                          ? 'bg-emerald-500'
                          : 'bg-emerald-600'
                      }`}
                      style={{ width: `${Math.max(pct, step.count > 0 ? 3 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
