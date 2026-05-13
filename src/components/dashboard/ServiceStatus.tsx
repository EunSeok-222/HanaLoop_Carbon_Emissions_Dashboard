'use client';

import { DashboardData } from "@/lib/api";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { translations } from "@/lib/translations";

interface ServiceStatusProps {
  items: DashboardData["items"];
}

export default function ServiceStatus({ items }: ServiceStatusProps) {
  const { language } = useDashboardStore();
  const t = translations[language];

  return (
    <div className="bg-card rounded-xl border p-6 shadow-sm">
      <h3 className="text-lg font-bold mb-4">{t.serviceStatus}</h3>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
            <div className="flex flex-col">
              <span className="font-semibold text-sm">{item.title}</span>
              <span className="text-xs text-muted-foreground">{t.usage} {item.usage}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${
                item.status === 'online' ? 'bg-emerald-500' : 
                item.status === 'away' ? 'bg-amber-500' : 'bg-slate-400'
              }`} />
              <span className="text-[10px] font-bold uppercase text-muted-foreground">
                {item.status === 'online' ? t.statusNormal : item.status === 'away' ? t.statusDelay : t.statusDown}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
