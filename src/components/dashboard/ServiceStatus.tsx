'use client';

import { PCFData } from "@/types/emission";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { translations } from "@/lib/translations";
import { Progress } from "@/components/ui/progress";

interface ServiceStatusProps {
  items: PCFData[];
}

/**
 * 1단계 요구사항: 제품 탄소 발자국(PCF) 전 과정 시각화
 * 원재료 채취부터 폐기까지의 배출량을 시각화합니다.
 */
export default function ServiceStatus({ items }: ServiceStatusProps) {
  const { language } = useDashboardStore();
  const t = translations[language];

  return (
    <div className="bg-card rounded-xl border p-6 shadow-sm border-muted/50 h-full">
      <div className="flex flex-col gap-1 mb-6">
        <h3 className="text-lg font-bold">제품 탄소 발자국 (PCF)</h3>
        <p className="text-xs text-muted-foreground">제품 생애주기별 배출 비중 (LCA)</p>
      </div>
      
      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.stage} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{item.stage}</span>
              <span className="text-muted-foreground font-mono">{item.emissions} tCO2eq ({item.percentage}%)</span>
            </div>
            {/* Shadcn Progress 컴포넌트를 사용하여 시각화 (임시로 div 구현) */}
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-1000 ease-in-out" 
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
        <p className="text-xs text-emerald-800 leading-relaxed">
          💡 <strong>분석 결과:</strong> 원재료 단계의 배출량이 가장 높습니다. 공급망 최적화를 통해 Scope 3 배출량을 줄이는 것을 권장합니다.
        </p>
      </div>
    </div>
  );
}
