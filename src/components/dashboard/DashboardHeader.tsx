'use client';

import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { translations } from "@/lib/translations";

export default function DashboardHeader() {
  const { language } = useDashboardStore();
  const t = translations[language];

  return (
    <header className="flex flex-col gap-1">
      <h1 className="text-2xl font-bold tracking-tight">{t.title}</h1>
      <p className="text-sm text-muted-foreground">
        {t.description}
      </p>
    </header>
  );
}
