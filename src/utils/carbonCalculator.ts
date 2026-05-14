import { GhgEmission, Scope, PCFData, Language } from "@/lib/types";
import { translations } from "@/lib/translations";

/**
 * 1. GHG Scope 분류 함수
 * 배출원(source) 필드에 따라 Scope 1, 2, 3를 구분합니다.
 */
export function classifyScope(source: string): Scope {
  const sourceLower = source.toLowerCase();

  if (["gasoline", "diesel", "lng", "coal", "gas"].includes(sourceLower)) {
    return "Scope 1";
  }

  if (["electricity", "steam"].includes(sourceLower)) {
    return "Scope 2";
  }

  return "Scope 3";
}

/**
 * 2. 총 배출량 계산
 */
export function calculateTotalEmissions(emissions: GhgEmission[]): number {
  return emissions.reduce((total, item) => total + item.emissions, 0);
}

/**
 * 3. PCF(제품 탄소 발자국) 생애주기 시뮬레이션
 * 원재료(30%), 제조(40%), 유통(15%), 사용(10%), 폐기(5%)
 */
export function simulatePCFBreakdown(
  totalEmissions: number,
  language: Language = "ko",
): PCFData[] {
  const t = translations[language];
  const stages: { stage: string; ratio: number }[] = [
    { stage: t.pcfStages.rawMaterial, ratio: 0.3 },
    { stage: t.pcfStages.manufacturing, ratio: 0.4 },
    { stage: t.pcfStages.distribution, ratio: 0.15 },
    { stage: t.pcfStages.use, ratio: 0.1 },
    { stage: t.pcfStages.disposal, ratio: 0.05 },
  ];

  return stages.map(({ stage, ratio }) => ({
    stage,
    emissions: parseFloat((totalEmissions * ratio).toFixed(2)),
    percentage: ratio * 100,
  }));
}

/**
 * 4. 예상 탄소세 계산 (톤당 3만원 가정)
 */
export function calculateCarbonTax(
  emissions: number,
  pricePerTon: number = 30000,
): number {
  return emissions * pricePerTon;
}

/**
 * 5. 월별 추이 데이터 생성 함수
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
export function calculateGrowthRate(emissions: GhgEmission[]): {
  rate: number;
  currentTotal: number;
} {
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
export function getMostEmittedScope(scopeBreakdown: Record<Scope, number>): {
  scope: Scope;
  value: number;
} {
  let maxScope: Scope = "Scope 1";
  let maxValue = -1;

  (Object.entries(scopeBreakdown) as [Scope, number][]).forEach(
    ([scope, value]) => {
      if (value > maxValue) {
        maxValue = value;
        maxScope = scope;
      }
    },
  );

  return { scope: maxScope, value: maxValue };
}

/**
 * 대시보드 요약 데이터를 한 번에 생성하는 헬퍼 함수
 */
export function summarizeEmissions(
  emissions: GhgEmission[],
  language: Language = "ko",
) {
  const totalEmissions = calculateTotalEmissions(emissions);
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
    totalEmissions,
    currentMonthTotal: currentTotal,
    growthRate: rate,
    mostEmittedScope: mostEmitted,
    scopeBreakdown,
    monthlyTrends: calculateMonthlyTrends(emissions),
    pcfSimulation: simulatePCFBreakdown(totalEmissions, language),
    estimatedCarbonTax: calculateCarbonTax(currentTotal),
  };
}
