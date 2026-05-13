'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSummary } from "@/types/emission";
import { Leaf, Zap, Truck, Factory } from "lucide-react";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { translations } from "@/lib/translations";

interface StatCardsProps {
  data: DashboardSummary;
}

export default function StatCards({ data }: StatCardsProps) {
  const { language } = useDashboardStore();
  const t = translations[language];

  // GHG Scope 기반의 통계 카드 구성
  const stats = [
    {
      title: "총 탄소 배출량",
      value: `${data.totalEmissions.toLocaleString()} tCO2eq`,
      icon: Leaf,
      color: "text-emerald-600",
    },
    {
      title: "Scope 1 (직접)",
      value: `${data.scopeBreakdown['Scope 1'].toLocaleString()} t`,
      icon: Factory,
      color: "text-blue-500",
    },
    {
      title: "Scope 2 (간접)",
      value: `${data.scopeBreakdown['Scope 2'].toLocaleString()} t`,
      icon: Zap,
      color: "text-amber-500",
    },
    {
      title: "Scope 3 (기타)",
      value: `${data.scopeBreakdown['Scope 3'].toLocaleString()} t`,
      icon: Truck,
      color: "text-slate-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="transition-all hover:shadow-sm border-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
            <p className="text-[10px] text-muted-foreground mt-1">
              전월 대비 <span className="text-emerald-500 font-bold">▼ 4.2%</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
