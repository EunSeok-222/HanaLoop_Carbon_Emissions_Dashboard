import { GhgEmission, Scope } from "@/lib/types";

/**
 * 1. GHG Scope 분류 함수
 * 배출원(source) 필드에 따라 Scope 1, 2, 3를 구분합니다.
 */
export function classifyScope(source: string): Scope {
  const sourceLower = source.toLowerCase();

  // Scope 1 (직접 배출)
  if (["gasoline", "diesel", "lng", "coal"].includes(sourceLower)) {
    return "Scope 1";
  }

  // Scope 2 (에너지 간접 배출)
  if (["electricity", "steam"].includes(sourceLower)) {
    return "Scope 2";
  }

  // Scope 3 (기타 간접 배출)
  return "Scope 3";
}

/**
 * 2. PCF(제품 탄소 발자국) 요약 함수
 * 모든 배출량 데이터를 합산하여 총 배출량(tCO2eq)을 계산합니다.
 */
export function calculateTotalEmissions(emissions: GhgEmission[]): number {
  return emissions.reduce((total, item) => total + item.emissions, 0);
}

/**
 * 3. 월별 추이 데이터 생성 함수
 * yearMonth 별로 배출량을 그룹화하여 차트 시각화용 데이터를 생성합니다.
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

  return {
    totalEmissions: calculateTotalEmissions(emissions),
    scopeBreakdown,
    monthlyTrends: calculateMonthlyTrends(emissions),
  };
}
