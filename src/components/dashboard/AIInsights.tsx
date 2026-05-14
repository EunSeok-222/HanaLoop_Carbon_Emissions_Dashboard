'use client';

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Brain, RefreshCw, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { translations } from "@/lib/translations";
import { generateCarbonInsights } from "@/app/actions/ai-actions";
import { DashboardAnalytics } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { createOrUpdatePost, fetchLatestAIInsight } from "@/lib/api";

interface AIInsightsProps {
  data: DashboardAnalytics;
  companyId: string;
}

export default function AIInsights({ data, companyId }: AIInsightsProps) {
  const { language } = useDashboardStore();
  const t = translations[language];
  
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRecent, setIsRecent] = useState(true); // Is this a pre-existing record?
  const [error, setError] = useState<string | null>(null);

  // Load the most recently saved insight from the database
  const loadRecentInsight = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const latest = await fetchLatestAIInsight(companyId);
      if (latest) {
        setInsight(latest.content);
        setIsRecent(true);
      } else {
        setInsight(null);
      }
    } catch (err) {
      console.error("Failed to load recent insight:", err);
      setError(language === 'ko' ? "최근 기록을 불러오지 못했습니다." : "Failed to load recent history.");
    } finally {
      setLoading(false);
    }
  }, [companyId, language]);

  // Request a brand new insight from AI and auto-save it
  const handleRequestNewInsight = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateCarbonInsights(data, language);
      setInsight(result);
      setIsRecent(false);
      
      // Auto-save to reports
      await createOrUpdatePost({
        title: `${t.aiReportTitle} (${new Date().toISOString().slice(0, 10)})`,
        resourceUid: companyId,
        dateTime: new Date().toISOString(),
        content: result,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t.aiInsightError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecentInsight();
  }, [loadRecentInsight]);

  return (
    <Card className="relative overflow-hidden border-none shadow-xl ring-1 ring-emerald-100 bg-gradient-to-br from-white to-emerald-50/30">
      {/* Decorative Gradient Flare */}
      <div className="absolute -top-10 -right-10 h-32 w-32 bg-emerald-200/40 blur-3xl rounded-full" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-blue-200/30 blur-3xl rounded-full" />

      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-emerald-100/50 bg-white/50 backdrop-blur-sm relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
              {t.aiInsightTitle}
              {insight && isRecent && !loading && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 uppercase tracking-wider">
                  <Clock size={10} />
                  {language === 'ko' ? '최근 기록' : 'RECENT'}
                </span>
              )}
            </CardTitle>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <Brain size={12} className="text-emerald-400" />
              {t.aiInsightExpertName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleRequestNewInsight} 
            disabled={loading}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all shadow-sm",
              "bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
            )}
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            {language === 'ko' ? '최신 분석 요청' : 'Request Latest Analysis'}
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-6 relative z-10">
        {loading && !insight ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <div className="pt-4 space-y-2">
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
            <AlertCircle className="h-12 w-12 text-red-400 mb-3" />
            <p className="text-base font-medium">{error}</p>
            <button 
              onClick={handleRequestNewInsight}
              className="mt-4 text-sm text-emerald-600 font-bold hover:underline"
            >
              {t.retry}
            </button>
          </div>
        ) : !insight ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-emerald-100 rounded-xl bg-emerald-50/20">
            <div className="p-4 bg-emerald-100 rounded-full mb-4">
              <Brain className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              {language === 'ko' ? '저장된 분석 결과가 없습니다' : 'No Analysis Found'}
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              {language === 'ko' 
                ? '최신 분석 요청 버튼을 눌러 AI의 전문적인 감축 전략을 받아보세요.' 
                : 'Click the Request button to get professional reduction strategies from AI.'}
            </p>
            <button 
              onClick={handleRequestNewInsight}
              className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              {language === 'ko' ? '지금 분석 시작하기' : 'Start Analysis Now'}
              <RefreshCw size={14} />
            </button>
          </div>
        ) : (
          <div className={cn("prose prose-slate max-w-none transition-opacity", loading && "opacity-50")}>
            <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-medium">
              {insight.split('\n').map((line, i) => (
                <p key={i} className={cn(
                  line.startsWith('###') ? "text-lg font-bold text-slate-900 mt-6 mb-3 border-l-4 border-emerald-500 pl-3" : "",
                  line.startsWith('**') ? "font-bold text-emerald-700" : "",
                  "mb-2"
                )}>
                  {line.replace(/###/g, '').replace(/\*\*/g, '')}
                </p>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
