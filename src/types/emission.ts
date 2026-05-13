/**
 * Carbon Emission Domain Types
 */

export interface GhgEmission {
  yearMonth: string; // "2025-01", "2025-02", "2025-03"
  source: string; // gasoline, lpg, diesel, etc
  emissions: number; // tons of CO2 equivalent
}

export interface Company {
  id: string;
  name: string;
  country: string;
  emissions: GhgEmission[];
}

export interface Post {
  id: string;
  title: string;
  resourceUid: string; // Refers to Company.id
  dateTime: string; // e.g., "2024-02-15"
  content: string;
}

export type Scope = "Scope 1" | "Scope 2" | "Scope 3";

export interface PCFData {
  stage: string;
  emissions: number;
  percentage: number;
}

export interface DashboardSummary {
  totalEmissions: number;
  scopeBreakdown: Record<Scope, number>;
}
