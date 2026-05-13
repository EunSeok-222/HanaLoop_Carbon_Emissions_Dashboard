'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { translations } from "@/lib/translations";

export default function FilterBar() {
  const { filter, setFilter, language, setLanguage } = useDashboardStore();
  const t = translations[language];

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between bg-card p-4 rounded-xl border border-muted/50">
      <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
        {/* 기업 필터 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">
            분석 대상 기업
          </label>
          <Select value={filter || 'all'} onValueChange={setFilter}>
            <SelectTrigger className="w-[200px] h-9">
              <SelectValue placeholder="기업 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 기업</SelectItem>
              <SelectItem value="c1">Acme Corp</SelectItem>
              <SelectItem value="c2">Globex</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 언어 전환 버튼 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">
            Language
          </label>
          <div className="flex border rounded-lg overflow-hidden h-9">
            <button
              onClick={() => setLanguage('ko')}
              className={`px-3 text-[10px] font-bold transition-colors ${language === 'ko' ? 'bg-emerald-600 text-white' : 'bg-background hover:bg-muted'}`}
            >
              KO
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 text-[10px] font-bold transition-colors ${language === 'en' ? 'bg-emerald-600 text-white' : 'bg-background hover:bg-muted'}`}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-2 text-muted-foreground"
          onClick={() => setFilter('all')}
        >
          <RefreshCcw className="h-3.5 w-3.5 mr-2" />
          {t.reset}
        </Button>
        <Button size="sm" className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700">
          탄소세 예측 리포트
        </Button>
      </div>
    </div>
  );
}
