'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchDashboardAnalytics, fetchCompanies } from '@/lib/api';
import { Company } from '@/lib/types';
import SummaryCards from '@/components/dashboard/SummaryCards';
import AIInsights from '@/components/dashboard/AIInsights';
import EmissionCharts from '@/components/dashboard/EmissionCharts';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { translations } from "@/lib/translations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DashboardPage() {
  const { language } = useDashboardStore();
  const t = translations[language];

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);

  const loadInitialData = useCallback(async () => {
    try {
      const companiesData = await fetchCompanies();
      setCompanies(companiesData);
    } catch (err) {
      console.error("Failed to load companies:", err);
    }
  }, []);

  const loadDashboardData = useCallback(async (companyId?: string, month?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDashboardAnalytics(
        companyId === "all" ? undefined : companyId,
        language,
        month
      );
      setDashboardData(data);
      if (data.summary.selectedMonth) {
        setSelectedMonth(data.summary.selectedMonth);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t.loadingData);
    } finally {
      setLoading(false);
    }
  }, [t.loadingData, language]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    loadDashboardData(selectedCompany);
  }, [selectedCompany, loadDashboardData]);

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month);
    loadDashboardData(selectedCompany, month);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
        <Alert variant="destructive" className="max-w-md shadow-lg">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>{t.errorTitle}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button
          onClick={() => loadDashboardData(selectedCompany, selectedMonth || undefined)}
          variant="outline"
          className="gap-2 transition-all hover:bg-accent"
        >
          <RefreshCcw className="h-4 w-4" />
          {t.retry}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t.dashboardTitle}</h1>
          <p className="text-muted-foreground mt-1">{t.dashboardDesc}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">{t.companySelect}:</span>
          <Select value={selectedCompany} onValueChange={(val) => {
            if (val) {
              setSelectedCompany(val);
              setSelectedMonth(null); // Reset month when company changes
            }
          }}>
            <SelectTrigger className="w-[200px] bg-card shadow-sm border-muted-foreground/20">
              <SelectValue>
                {selectedCompany === "all"
                  ? t.allCompanies
                  : companies.find(c => c.id === selectedCompany)?.name || selectedCompany}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allCompanies}</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading && !dashboardData ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* Summary Section */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
            <SummaryCards data={dashboardData.summary} />
          </section>

          {/* Charts Section */}
          <section className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both">
            <EmissionCharts
              monthlyTrends={dashboardData.monthlyTrends}
              pcfBreakdown={dashboardData.pcfBreakdown}
              selectedMonth={selectedMonth}
              onMonthSelect={handleMonthSelect}
            />
          </section>

          {/* AI Insights Section */}
          <section className="animate-in fade-in slide-in-from-bottom-5 duration-600 delay-100 fill-mode-both">
            <AIInsights data={dashboardData} companyId={selectedCompany} />
          </section>
        </>
      )}
    </div>
  );
}
