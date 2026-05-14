import { Company, Post, DashboardAnalytics, Language } from "@/lib/types";
import { summarizeEmissions } from "@/utils/carbonCalculator";

/**
 * Fake backend (Stub)
 * 시뮬레이션: 네트워크 지연(200~800ms) 및 간헐적 오류(10~20%)
 */

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const jitter = () => 200 + Math.random() * 600; // 200ms ~ 800ms
const maybeFail = () => Math.random() < 0.15; // 15% failure rate

// --- LocalStorage Helpers ---
const POSTS_KEY = 'hanaloop_posts_v1';
const COMPANIES_KEY = 'hanaloop_companies_v1';

const saveToStorage = (key: string, data: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

const loadFromStorage = (key: string) => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
  }
  return null;
};

// --- Initial Mock Data ---
const initialCompanies: Company[] = [
  {
    id: "c1",
    name: "Acme Corp",
    country: "US",
    emissions: [
      { yearMonth: "2024-01", source: "lng", emissions: 120 },
      { yearMonth: "2024-01", source: "electricity", emissions: 85 },
      { yearMonth: "2024-02", source: "gasoline", emissions: 110 },
      { yearMonth: "2024-02", source: "electricity", emissions: 90 },
      { yearMonth: "2024-03", source: "lng", emissions: 95 },
      { yearMonth: "2024-03", source: "electricity", emissions: 80 },
      { yearMonth: "2024-04", source: "gasoline", emissions: 85 },
      { yearMonth: "2024-04", source: "electricity", emissions: 75 },
      { yearMonth: "2024-05", source: "lng", emissions: 70 },
      { yearMonth: "2024-05", source: "electricity", emissions: 70 },
      { yearMonth: "2024-06", source: "lng", emissions: 65 },
      { yearMonth: "2024-06", source: "electricity", emissions: 65 },
      { yearMonth: "2024-06", source: "etc", emissions: 30 },
    ],
  },
  {
    id: "c2",
    name: "Globex",
    country: "DE",
    emissions: [
      { yearMonth: "2024-01", source: "gasoline", emissions: 80 },
      { yearMonth: "2024-01", source: "electricity", emissions: 150 },
      { yearMonth: "2024-02", source: "lng", emissions: 105 },
      { yearMonth: "2024-02", source: "electricity", emissions: 140 },
      { yearMonth: "2024-03", source: "lng", emissions: 120 },
      { yearMonth: "2024-03", source: "electricity", emissions: 160 },
      { yearMonth: "2024-04", source: "gasoline", emissions: 130 },
      { yearMonth: "2024-04", source: "lng", emissions: 125 },
      { yearMonth: "2024-04", source: "electricity", emissions: 170 },
      { yearMonth: "2024-05", source: "lng", emissions: 140 },
      { yearMonth: "2024-05", source: "electricity", emissions: 180 },
      { yearMonth: "2024-06", source: "lng", emissions: 155 },
      { yearMonth: "2024-06", source: "electricity", emissions: 190 },
      { yearMonth: "2024-06", source: "steam", emissions: 55 },
      { yearMonth: "2024-06", source: "etc", emissions: 90 },
      { yearMonth: "2024-06", source: "gas", emissions: 90 },
    ],
  },
];

const initialPosts: Post[] = [
  {
    id: "p1",
    title: "Sustainability Report 2024",
    resourceUid: "c1",
    dateTime: "2024-02-15",
    content: "Quarterly CO2 update",
  },
];

// --- Mutable State ---
let companies: Company[] = loadFromStorage(COMPANIES_KEY) || initialCompanies;
let posts: Post[] = loadFromStorage(POSTS_KEY) || initialPosts;

// Sync back to storage if it was empty
if (typeof window !== 'undefined' && !localStorage.getItem(COMPANIES_KEY)) {
  saveToStorage(COMPANIES_KEY, companies);
  saveToStorage(POSTS_KEY, posts);
}

// --- API Functions ---

export async function fetchCompanies(): Promise<Company[]> {
  await delay(jitter());
  if (maybeFail())
    throw new Error("기업 데이터를 불러오는 중 네트워크 오류가 발생했습니다.");
  return [...companies];
}

export async function updateCompany(
  id: string,
  data: Partial<Pick<Company, "name" | "country" | "emissions">>
): Promise<Company> {
  await delay(jitter());
  if (maybeFail())
    throw new Error("기업 정보를 수정하는 중 네트워크 오류가 발생했습니다.");

  const index = companies.findIndex((c) => c.id === id);
  if (index === -1) throw new Error("해당 기업을 찾을 수 없습니다.");

  companies[index] = { ...companies[index], ...data };
  saveToStorage(COMPANIES_KEY, companies);
  return companies[index];
}

export async function fetchPosts(): Promise<Post[]> {
  await delay(jitter());
  if (maybeFail())
    throw new Error(
      "게시물 데이터를 불러오는 중 네트워크 오류가 발생했습니다.",
    );
  return [...posts];
}

export async function createOrUpdatePost(
  post: Omit<Post, "id"> & { id?: string },
): Promise<Post> {
  await delay(jitter());
  if (maybeFail())
    throw new Error("게시물을 저장하는 중 네트워크 오류가 발생했습니다.");

  if (post.id) {
    const index = posts.findIndex((p) => p.id === post.id);
    if (index !== -1) {
      posts[index] = { ...posts[index], ...post } as Post;
      saveToStorage(POSTS_KEY, posts);
      return posts[index];
    }
  }

  const newPost: Post = {
    ...post,
    id: `p${Date.now()}`,
  } as Post;

  posts = [newPost, ...posts];
  saveToStorage(POSTS_KEY, posts);
  return newPost;
}

/**
 * 대시보드 분석 데이터를 가져옵니다.
 * utils/carbonCalculator.ts의 도메인 로직을 재사용합니다.
 */
export async function fetchDashboardAnalytics(
  companyId?: string,
  language: Language = "ko",
): Promise<DashboardAnalytics> {
  await delay(jitter());
  if (maybeFail())
    throw new Error("통계 데이터를 가공하는 중 오류가 발생했습니다.");

  const filteredCompanies = companyId && companyId !== "all"
    ? companies.filter((c) => c.id === companyId)
    : companies;

  const allEmissions = filteredCompanies.flatMap((c) => c.emissions);

  // 도메인 계산 로직 적용
  const summary = summarizeEmissions(allEmissions, language);

  return {
    summary: {
      totalEmissions: summary.totalEmissions,
      currentMonthTotal: summary.currentMonthTotal,
      growthRate: summary.growthRate,
      mostEmittedScope: summary.mostEmittedScope,
      scopeBreakdown: summary.scopeBreakdown,
      estimatedCarbonTax: summary.estimatedCarbonTax,
    },
    monthlyTrends: summary.monthlyTrends,
    pcfBreakdown: summary.pcfSimulation,
    companies: filteredCompanies.map((c) => ({ id: c.id, name: c.name })),
  };
}

/**
 * AI 탄소 인사이트를 가져옵니다.
 * 실제 구현 시 Gemini API 등을 호출합니다.
 */
export async function fetchAIInsights(
  data: DashboardAnalytics,
  language: Language = "ko",
): Promise<string> {
  await delay(jitter() * 1.5); // AI 연산은 조금 더 오래 걸림
  if (maybeFail() && Math.random() < 0.3)
    throw new Error("AI 엔진 연결 중 일시적인 오류가 발생했습니다.");

  const { summary, pcfBreakdown } = data;
  const maxStage = [...pcfBreakdown].sort((a, b) => b.emissions - a.emissions)[0];
  const maxScope = summary.mostEmittedScope.scope;

  // 전문가의 견해를 담은 프롬프트 기반 응답 시뮬레이션
  if (language === "ko") {
    return `### 🌍 전문 컨설턴트 분석 보고서

현재 **${summary.mostEmittedScope.scope}**에서 가장 많은 배출량(${summary.mostEmittedScope.value.toLocaleString()} tCO2eq)이 발생하고 있습니다. 특히 PCF 생애주기 중 **${maxStage.stage}** 단계가 전체의 **${maxStage.percentage}%**를 차지하고 있어 집중적인 관리가 필요합니다.

**추천 전략:**
1. **${maxStage.stage} 최적화**: 해당 단계의 에너지 효율을 15% 개선할 경우, 예상 탄소세를 약 **${(summary.estimatedCarbonTax * 0.15).toLocaleString()}원** 절감할 수 있습니다.
2. **신재생 에너지 전환**: ${maxScope === "Scope 2" ? "전력 소비(Scope 2) 비중이 높으므로 RE100 이행을 검토하십시오." : "연료 소비(Scope 1) 비중이 높으므로 전동화 전환이 시급합니다."}
3. **공급망 협업**: Scope 3 비중을 줄이기 위해 원재료 협력사의 저탄소 공정 도입을 지원하십시오.

이러한 조치를 통해 차기 분기 배출량을 **10% 이상** 감축할 수 있을 것으로 기대됩니다.`;
  } else {
    return `### 🌍 Expert Sustainability Report

Currently, **${summary.mostEmittedScope.scope}** is the primary emission source (${summary.mostEmittedScope.value.toLocaleString()} tCO2eq). Notably, the **${maxStage.stage}** stage accounts for **${maxStage.percentage}%** of the total PCF, requiring urgent attention.

**Recommended Strategies:**
1. **${maxStage.stage} Optimization**: Improving energy efficiency in this stage by 15% could reduce your estimated carbon tax by approximately **${(summary.estimatedCarbonTax * 0.15).toLocaleString()} KRW**.
2. **Renewable Energy Transition**: ${maxScope === "Scope 2" ? "High electricity consumption (Scope 2) suggests a need for RE100 initiatives." : "High fuel consumption (Scope 1) suggests a priority for electrification."}
3. **Supply Chain Collaboration**: Support suppliers in adopting low-carbon processes to mitigate Scope 3 impacts.

Implementing these measures is expected to reduce next quarter's emissions by **over 10%**.`;
  }
}

/**
 * 특정 기업의 가장 최근 AI 인사이트 리포트를 가져옵니다.
 */
export async function fetchLatestAIInsight(companyId: string): Promise<Post | null> {
  await delay(jitter());
  const companyPosts = posts.filter(
    (p) => p.resourceUid === companyId && p.title.includes("AI")
  );
  if (companyPosts.length === 0) return null;

  // 날짜 역순 정렬 후 가장 최근 것 반환
  return companyPosts.sort(
    (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
  )[0];
}
