import { GhgEmission, Scope } from "@/lib/types";

/**
 * 1. GHG Scope 분류 함수
 * 배출원(source) 필드에 따라 Scope 1, 2, 3를 구분합니다.
 */
export function classifyScope(source: string): Scope {
  const sourceLower = source.toLowerCase();

  if (["gasoline", "diesel", "lng", "coal"].includes(sourceLower)) {
    return "Scope 1";
  }

  if (["electricity", "steam"].includes(sourceLower)) {
    return "Scope 2";
  }

  return "Scope 3";
}

/**
 * 2. PCF(제품 탄소 발자국) 요약 함수
 */
export function calculateTotalEmissions(emissions: GhgEmission[]): number {
  return emissions.reduce((total, item) => total + item.emissions, 0);
}

/**
 * 3. 월별 추이 데이터 생성 함수
 */
export function calculateMonthlyTrends(
  emissions: GhgEmission[],
): { month: string; emissions: number }[] {
  const trendsMap: Record<string, number> = {};

  emissions.forEach((item) => {
    trendsMap[item.yearMonth] =
      (trendsMap[item.yearMonth] || 0) + item.emissions;
  });

  return Object.entries(trendsMap)
    .map(([month, emissions]) => ({
      month,
      emissions,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

/**
 * 전월 대비 증감률 계산
 */
export function calculateGrowthRate(emissions: GhgEmission[]): { rate: number; currentTotal: number } {
  const trends = calculateMonthlyTrends(emissions);
  if (trends.length < 1) return { rate: 0, currentTotal: 0 };
  
  const current = trends[trends.length - 1].emissions;
  if (trends.length < 2) return { rate: 0, currentTotal: current };

  const previous = trends[trends.length - 2].emissions;
  if (previous === 0) return { rate: 0, currentTotal: current };

  const rate = ((current - previous) / previous) * 100;
  return { rate: parseFloat(rate.toFixed(1)), currentTotal: current };
}

/**
 * 가장 많이 배출된 Scope 찾기
 */
export function getMostEmittedScope(scopeBreakdown: Record<Scope, number>): { scope: Scope; value: number } {
  let maxScope: Scope = "Scope 1";
  let maxValue = -1;

  (Object.entries(scopeBreakdown) as [Scope, number][]).forEach(([scope, value]) => {
    if (value > maxValue) {
      maxValue = value;
      maxScope = scope;
    }
  });

  return { scope: maxScope, value: maxValue };
}

/**
 * 대시보드 요약 데이터를 한 번에 생성하는 헬퍼 함수
 */
export function summarizeEmissions(emissions: GhgEmission[]) {
  const scopeBreakdown: Record<Scope, number> = {
    "Scope 1": 0,
    "Scope 2": 0,
    "Scope 3": 0,
  };

  emissions.forEach((item) => {
    const scope = classifyScope(item.source);
    scopeBreakdown[scope] += item.emissions;
  });

  const { rate, currentTotal } = calculateGrowthRate(emissions);
  const mostEmitted = getMostEmittedScope(scopeBreakdown);

  return {
    totalEmissions: calculateTotalEmissions(emissions),
    currentMonthTotal: currentTotal,
    growthRate: rate,
    mostEmittedScope: mostEmitted,
    scopeBreakdown,
    monthlyTrends: calculateMonthlyTrends(emissions),
  };
}
