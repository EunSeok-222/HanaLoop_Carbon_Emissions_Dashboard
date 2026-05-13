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
import { RefreshCcw, Languages } from "lucide-react";
import { translations } from "@/lib/translations";

export default function FilterBar() {
  const { filter, setFilter, language, setLanguage } = useDashboardStore();
  const t = translations[language];

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between bg-card p-4 rounded-xl border">
      <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">
            {t.filterLabel}
          </label>
          <Select value={filter || 'all'} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder={t.selectPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allSources}</SelectItem>
              <SelectItem value="src-a">Source A</SelectItem>
              <SelectItem value="src-b">Source B</SelectItem>
              <SelectItem value="src-c">Source C</SelectItem>
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
              className={`px-3 text-xs font-bold transition-colors ${language === 'ko' ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}
            >
              KO
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 text-xs font-bold transition-colors ${language === 'en' ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}
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
        <Button size="sm" className="h-9 px-4">
          {t.export}
        </Button>
      </div>
    </div>
  );
}
