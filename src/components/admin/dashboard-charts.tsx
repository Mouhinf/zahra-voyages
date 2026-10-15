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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CHART_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'];

interface DashboardChartsProps {
  leadsPerDay: Array<{ date: string; count: number }>;
  topServices: Array<{ name: string; count: number }>;
  analyticsPerDay: Array<{ date: string; count: number }>;
  sources: Array<{ source: string; count: number }>;
  pages: Array<{ page: string; count: number }>;
}

function zeroFill30(series: Array<{ date: string; count: number }>): Array<{ date: string; count: number }> {
  const map = new Map(series.map((p) => [p.date, p.count]));
  const out: Array<{ date: string; count: number }> = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    out.push({ date: key.slice(5), count: map.get(key) ?? 0 });
  }
  return out;
}

export default function DashboardCharts({
  leadsPerDay,
  topServices,
  analyticsPerDay,
  sources,
  pages,
}: DashboardChartsProps) {
  return (
    <Tabs defaultValue="demandes" className="w-full">
      <TabsList className="flex flex-wrap h-auto gap-1">
        <TabsTrigger value="demandes">Demandes (30 j)</TabsTrigger>
        <TabsTrigger value="services">Services demandés</TabsTrigger>
        <TabsTrigger value="visites">Visites (30 j)</TabsTrigger>
        <TabsTrigger value="sources">Sources de trafic</TabsTrigger>
        <TabsTrigger value="pages">Pages populaires</TabsTrigger>
      </TabsList>

      <TabsContent value="demandes" className="mt-4">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={zeroFill30(leadsPerDay)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" fontSize={12} />
            <YAxis allowDecimals={false} fontSize={12} />
            <Tooltip />
            <Area type="monotone" dataKey="count" name="Demandes" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </TabsContent>

      <TabsContent value="services" className="mt-4">
        {topServices.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Aucune demande enregistrée pour le moment.</p>
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(220, topServices.length * 48)}>
            <BarChart data={topServices} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} fontSize={12} />
              <YAxis type="category" dataKey="name" width={180} fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" name="Demandes" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </TabsContent>

      <TabsContent value="visites" className="mt-4">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={zeroFill30(analyticsPerDay)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" fontSize={12} />
            <YAxis allowDecimals={false} fontSize={12} />
            <Tooltip />
            <Area type="monotone" dataKey="count" name="Visites" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </TabsContent>

      <TabsContent value="sources" className="mt-4">
        {sources.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Aucune visite enregistrée pour le moment.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={sources} dataKey="count" nameKey="source" cx="50%" cy="50%" outerRadius={100} label>
                {sources.map((entry, index) => (
                  <Cell key={entry.source} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </TabsContent>

      <TabsContent value="pages" className="mt-4">
        {pages.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Aucune visite enregistrée pour le moment.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pages}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="page" fontSize={12} />
              <YAxis allowDecimals={false} fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" name="Visites" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </TabsContent>
    </Tabs>
  );
}
