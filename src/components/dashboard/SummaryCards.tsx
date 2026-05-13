'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, TrendingUp, TrendingDown, Target, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryCardsProps {
  data: {
    currentMonthTotal: number;
    growthRate: number;
    mostEmittedScope: { scope: string; value: number };
    totalEmissions: number;
  };
}

export default function SummaryCards({ data }: SummaryCardsProps) {
  const isGrowth = data.growthRate > 0;
  const isDecline = data.growthRate < 0;

  const stats = [
    {
      title: "당월 총 배출량",
      value: `${data.currentMonthTotal.toLocaleString()} tCO2eq`,
      description: "이번 달 합산 배출량",
      icon: Leaf,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "전월 대비 증감률",
      value: `${Math.abs(data.growthRate)}%`,
      description: isGrowth ? "전월 대비 상승" : isDecline ? "전월 대비 하락" : "전월과 동일",
      icon: isGrowth ? TrendingUp : TrendingDown,
      color: isGrowth ? "text-destructive" : isDecline ? "text-emerald-600" : "text-muted-foreground",
      bg: isGrowth ? "bg-red-50" : isDecline ? "bg-emerald-50" : "bg-slate-50",
      trend: true,
    },
    {
      title: "최대 배출 Scope",
      value: data.mostEmittedScope.scope,
      description: `${data.mostEmittedScope.value.toLocaleString()} tCO2eq`,
      icon: Target,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "누적 총 배출량",
      value: `${data.totalEmissions.toLocaleString()} t`,
      description: "연간 누적 배출 통계",
      icon: Zap,
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
