'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardData } from "@/lib/api";
import { Users, Activity, Zap, TrendingUp } from "lucide-react";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { translations } from "@/lib/translations";

interface StatCardsProps {
  data: DashboardData["summary"];
}

export default function StatCards({ data }: StatCardsProps) {
  const { language } = useDashboardStore();
  const t = translations[language];

  const stats = [
    {
      title: t.totalUsers,
      value: data.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: t.growthRate,
      value: `${data.growthRate}%`,
      icon: TrendingUp,
      color: "text-emerald-500",
    },
    {
      title: t.activeSessions,
      value: data.activeSessions.toLocaleString(),
      icon: Activity,
      color: "text-orange-500",
    },
    {
      title: t.performance,
      value: `${data.performanceScore}/100`,
      icon: Zap,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="transition-all hover:shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
            <p className="text-[10px] text-muted-foreground mt-1">
              {t.vsLastPeriod} <span className="text-emerald-500 font-bold">+2.4%</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
