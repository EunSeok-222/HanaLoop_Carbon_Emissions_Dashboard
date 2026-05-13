'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchDashboardAnalytics, fetchCompanies } from '@/lib/api';
import { Company } from '@/lib/types';
import SummaryCards from '@/components/dashboard/SummaryCards';
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
  const [dashboardData, setDashboardData] = useState<any>(null);

  const loadInitialData = useCallback(async () => {
    try {
      const companiesData = await fetchCompanies();
      setCompanies(companiesData);
    } catch (err) {
      console.error("Failed to load companies:", err);
    }
  }, []);

  const loadDashboardData = useCallback(async (companyId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDashboardAnalytics(companyId === "all" ? undefined : companyId);
      setDashboardData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.loadingData);
    } finally {
      setLoading(false);
    }
  }, [t.loadingData]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    loadDashboardData(selectedCompany);
  }, [selectedCompany, loadDashboardData]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
        <Alert variant="destructive" className="max-w-md shadow-lg">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>{t.errorTitle}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button 
          onClick={() => loadDashboardData(selectedCompany)} 
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
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="w-[200px] bg-card shadow-sm border-muted-foreground/20">
              <SelectValue placeholder={t.allCompanies} />
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

      {loading ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* Summary Section */}
          <section>
            <SummaryCards data={dashboardData.summary} />
          </section>

          {/* Charts Section */}
          <section>
            <EmissionCharts 
              monthlyTrends={dashboardData.monthlyTrends} 
              scopeBreakdown={dashboardData.summary.scopeBreakdown}
            />
          </section>
        </>
      )}
    </div>
  );
}
