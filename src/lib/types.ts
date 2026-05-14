export type Language = "ko" | "en";

/**
 * Carbon Emission Domain Types
 */

export type Scope = "Scope 1" | "Scope 2" | "Scope 3";

export interface GhgEmission {
  yearMonth: string; // e.g., "2025-01"
  source: string; // gasoline, lng, electricity, etc.
  emissions: number; // tons of CO2 equivalent
  scope?: Scope; // Optional, can be derived
}

export interface Company {
  id: string;
  name: string;
  country: string; // Country code (US, DE, KR, etc.)
  emissions: GhgEmission[];
}

export interface Post {
  id: string;
  title: string;
  resourceUid: string; // Company.id
  dateTime: string; // e.g., "2024-02"
  content: string;
}

/**
 * Product Carbon Footprint (PCF) Lifecycle Stages
 */
export type PCFStage =
  | "Raw Material"
  | "Manufacturing"
  | "Distribution"
  | "Use"
  | "Disposal";

export interface PCFData {
  stage: string;
  emissions: number;
  percentage: number;
}

/**
 * Summary Data for Dashboard
 */
export interface DashboardSummary {
  selectedMonth?: string;
  totalEmissions: number;
  currentMonthTotal: number;
  growthRate: number;
  mostEmittedScope: { 
    scope: Scope; 
    value: number;
    topSource?: string;
    topStage?: string;
  };
  scopeBreakdown: Record<Scope, number>;
  estimatedCarbonTax: number;
}

export interface DashboardAnalytics {
  summary: DashboardSummary;
  monthlyTrends: { month: string; emissions: number }[];
  pcfBreakdown: PCFData[];
  companies: { id: string; name: string }[];
}
