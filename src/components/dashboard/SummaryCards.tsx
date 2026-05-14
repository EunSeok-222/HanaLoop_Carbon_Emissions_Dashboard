'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, TrendingUp, TrendingDown, Target, Coins } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { translations } from "@/lib/translations";

interface SummaryCardsProps {
  data: {
    selectedMonth?: string;
    currentMonthTotal: number;
    growthRate: number;
    mostEmittedScope: { 
      scope: string; 
      value: number;
      topSource?: string;
      topStage?: string;
    };
    totalEmissions: number;
    estimatedCarbonTax: number;
  };
}

export default function SummaryCards({ data }: SummaryCardsProps) {
  const { language } = useDashboardStore();
  const t = translations[language];

  const isGrowth = data.growthRate > 0;
  const isDecline = data.growthRate < 0;

  const stats = [
    {
      title: t.summaryTotal,
      value: `${data.currentMonthTotal.toLocaleString()} tCO2eq`,
      description: data.selectedMonth ? `${data.selectedMonth} ${t.summaryTotal}` : t.currentMonthDesc,
      icon: Leaf,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: t.summaryGrowth,
      value: `${Math.abs(data.growthRate)}%`,
      description: isGrowth ? `${t.vsLastMonth} ${t.growthUp}` : isDecline ? `${t.vsLastMonth} ${t.growthDown}` : t.growthEqual,
      icon: isGrowth ? TrendingUp : TrendingDown,
      color: isGrowth ? "text-destructive" : isDecline ? "text-emerald-600" : "text-muted-foreground",
      bg: isGrowth ? "bg-red-50" : isDecline ? "bg-emerald-50" : "bg-slate-50",
      trend: true,
    },
    {
      title: t.summaryMaxScope,
      value: data.mostEmittedScope.scope,
      description: data.mostEmittedScope.topSource ? `${data.mostEmittedScope.topSource} (${data.mostEmittedScope.topStage})` : `${data.mostEmittedScope.value.toLocaleString()} tCO2eq`,
      extra: data.mostEmittedScope.topSource ? `${data.mostEmittedScope.value.toLocaleString()} tCO2eq` : null,
      icon: Target,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: t.summaryCarbonTax,
      value: `${data.estimatedCarbonTax.toLocaleString()} ${t.currencyKrw}`,
      description: t.carbonTaxDesc,
      icon: Coins,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="overflow-hidden border-none shadow-md ring-1 ring-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={cn("p-2 rounded-lg", stat.bg)}>
              <stat.icon className={cn("h-4 w-4", stat.color)} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
            <div className={cn(
              "flex items-center text-xs mt-1 font-medium",
              stat.trend ? stat.color : "text-muted-foreground"
            )}>
              {stat.description}
            </div>
            {stat.extra && (
              <div className="text-[10px] text-muted-foreground mt-0.5 opacity-80">
                {stat.extra}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
