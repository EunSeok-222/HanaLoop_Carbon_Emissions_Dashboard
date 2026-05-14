'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Brain, RefreshCw, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { translations } from "@/lib/translations";
import { generateCarbonInsights } from "@/app/actions/ai-actions";
import { DashboardAnalytics } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

interface AIInsightsProps {
  data: DashboardAnalytics;
}

export default function AIInsights({ data }: AIInsightsProps) {
  const { language } = useDashboardStore();
  const t = translations[language];
  
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateCarbonInsights(data, language);
      setInsight(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.aiInsightError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInsights();
  }, [data.summary.currentMonthTotal, language]);

  return (
    <Card className="relative overflow-hidden border-none shadow-xl ring-1 ring-emerald-100 bg-gradient-to-br from-white to-emerald-50/30">
      {/* Decorative Gradient Flare */}
      <div className="absolute -top-10 -right-10 h-32 w-32 bg-emerald-200/40 blur-3xl rounded-full" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-blue-200/30 blur-3xl rounded-full" />

      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-emerald-100/50 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-slate-800">
              {t.aiInsightTitle}
            </CardTitle>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <Brain size={12} className="text-emerald-400" />
              {t.aiInsightExpertName}
            </p>
          </div>
        </div>
        <button 
          onClick={getInsights} 
          disabled={loading}
          className="p-2 hover:bg-emerald-100 rounded-full transition-colors disabled:opacity-50"
        >
          <RefreshCw className={cn("h-4 w-4 text-emerald-600", loading && "animate-spin")} />
        </button>
      </CardHeader>

      <CardContent className="p-6">
        {loading ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <div className="pt-4 space-y-2">
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-slate-500">
            <AlertCircle className="h-10 w-10 text-red-400 mb-2" />
            <p className="text-sm font-medium">{error}</p>
            <button 
              onClick={getInsights}
              className="mt-4 text-sm text-emerald-600 font-semibold hover:underline"
            >
              {t.retry}
            </button>
          </div>
        ) : (
          <div className="prose prose-slate max-w-none">
            <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-medium">
              {insight?.split('\n').map((line, i) => (
                <p key={i} className={cn(
                  line.startsWith('###') ? "text-lg font-bold text-slate-900 mt-4 mb-2" : "",
                  line.startsWith('**') ? "font-bold text-emerald-700" : "",
                  "mb-1"
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
