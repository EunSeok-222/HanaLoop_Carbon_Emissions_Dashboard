import { GhgEmission, Scope, PCFData, Language } from "@/lib/types";
import { translations } from "@/lib/translations";

/**
 * 1. GHG Scope 분류 함수
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
 * Scope별 배출 비중에 따라 생애주기별 비율을 동적으로 산출합니다.
 */
export function simulatePCFBreakdown(
  totalEmissions: number,
  scopeBreakdown: Record<Scope, number>,
  language: Language = "ko",
): PCFData[] {
  const t = translations[language];

  const s1 = scopeBreakdown["Scope 1"] || 0;
  const s2 = scopeBreakdown["Scope 2"] || 0;
  const s3 = scopeBreakdown["Scope 3"] || 0;
  const total = s1 + s2 + s3 || 1;

  // 동적 비율 산출 로직 (시뮬레이션)
  // Scope 3 비중이 높을수록 원재료 단계 상승
  const rawRatio = parseFloat((0.15 + (s3 / total) * 0.3).toFixed(3));
  // Scope 2와 Scope 1 비중이 높을수록 제조 단계 상승
  const manRatio = parseFloat(
    (0.25 + (s2 / total) * 0.2 + (s1 / total) * 0.1).toFixed(3),
  );
  // Scope 1 비중이 높을수록 유통 단계 상승
  const distRatio = parseFloat((0.05 + (s1 / total) * 0.2).toFixed(3));
  // 사용 단계는 비교적 고정적
  const useRatio = 0.1;
  // 나머지는 폐기 단계
  const dispRatio = parseFloat(
    (1 - (rawRatio + manRatio + distRatio + useRatio)).toFixed(3),
  );

  const stages: { stage: string; ratio: number }[] = [
    { stage: t.pcfStages.rawMaterial, ratio: rawRatio },
    { stage: t.pcfStages.manufacturing, ratio: manRatio },
    { stage: t.pcfStages.distribution, ratio: distRatio },
    { stage: t.pcfStages.use, ratio: useRatio },
    { stage: t.pcfStages.disposal, ratio: Math.max(0.01, dispRatio) },
  ];

  // 총합이 정확히 100%가 되도록 보정 (부동소수점 오차 방지)
  const currentTotalRatio = stages.reduce((acc, s) => acc + s.ratio, 0);
  if (currentTotalRatio !== 1) {
    stages[1].ratio += 1 - currentTotalRatio;
  }

  return stages.map(({ stage, ratio }) => ({
    stage,
    emissions: parseFloat((totalEmissions * ratio).toFixed(2)),
    percentage: parseFloat((ratio * 100).toFixed(1)),
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
 * 대시보드 요약 데이터를 한 번에 생성하는 헬퍼 함수
 */
export function summarizeEmissions(
  emissions: GhgEmission[],
  language: Language = "ko",
  targetMonth?: string,
) {
  const monthlyTrends = calculateMonthlyTrends(emissions);

  // 타겟 월 결정
  const selectedMonth =
    targetMonth ||
    (monthlyTrends.length > 0
      ? monthlyTrends[monthlyTrends.length - 1].month
      : "");

  // 전체 데이터 중 해당 월 데이터만 추출
  const currentMonthData = emissions.filter(
    (e) => e.yearMonth === selectedMonth,
  );
  const currentTotal = calculateTotalEmissions(currentMonthData);

  // 증감률 계산 (선택 월 vs 전월)
  const currentIndex = monthlyTrends.findIndex(
    (t) => t.month === selectedMonth,
  );
  let growthRate = 0;
  if (currentIndex > 0) {
    const previousTotal = monthlyTrends[currentIndex - 1].emissions;
    growthRate =
      previousTotal > 0
        ? ((currentTotal - previousTotal) / previousTotal) * 100
        : 0;
  }

  // Scope 및 배출원(Source) 분석
  const scopeBreakdown: Record<Scope, number> = {
    "Scope 1": 0,
    "Scope 2": 0,
    "Scope 3": 0,
  };
  const sourceBreakdown: Record<string, number> = {};

  currentMonthData.forEach((item) => {
    const scope = classifyScope(item.source);
    scopeBreakdown[scope] += item.emissions;
    sourceBreakdown[item.source] =
      (sourceBreakdown[item.source] || 0) + item.emissions;
  });

  // 가장 배출량이 높은 Scope 찾기
  let mostEmittedScope: Scope = "Scope 1";
  let maxScopeValue = -1;
  (Object.entries(scopeBreakdown) as [Scope, number][]).forEach(
    ([scope, val]) => {
      if (val > maxScopeValue) {
        maxScopeValue = val;
        mostEmittedScope = scope;
      }
    },
  );

  // 해당 Scope 내에서 가장 많이 배출된 Source 찾기
  const scopeSources = currentMonthData.filter(
    (e) => classifyScope(e.source) === mostEmittedScope,
  );
  const sourceTotals: Record<string, number> = {};
  scopeSources.forEach((s) => {
    sourceTotals[s.source] = (sourceTotals[s.source] || 0) + s.emissions;
  });
  const topSource =
    Object.entries(sourceTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  // PCF 분석 시뮬레이션 (동적 로직 적용)
  const pcfSimulation = simulatePCFBreakdown(
    currentTotal,
    scopeBreakdown,
    language,
  );
  const topStage =
    [...pcfSimulation].sort((a, b) => b.emissions - a.emissions)[0]?.stage ||
    "N/A";

  return {
    selectedMonth,
    totalEmissions: calculateTotalEmissions(emissions),
    currentMonthTotal: currentTotal,
    growthRate: parseFloat(growthRate.toFixed(1)),
    mostEmittedScope: {
      scope: mostEmittedScope,
      value: maxScopeValue,
      topSource,
      topStage,
    },
    scopeBreakdown,
    monthlyTrends,
    pcfSimulation,
    estimatedCarbonTax: calculateCarbonTax(currentTotal),
  };
}
