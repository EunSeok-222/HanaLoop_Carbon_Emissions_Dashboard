import { Company, Post, GhgEmission, Scope, PCFData } from "@/lib/types";

/**
 * Fake backend (Stub)
 * 시뮬레이션: 네트워크 지연(200~800ms) 및 간헐적 오류(10~20%)
 */

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const jitter = () => 200 + Math.random() * 600; // 200ms ~ 800ms
const maybeFail = () => Math.random() < 0.15; // 15% failure rate

// 배출원별 Scope 분류 매핑
const SOURCE_TO_SCOPE: Record<string, Scope> = {
  gasoline: "Scope 1",
  diesel: "Scope 1",
  lng: "Scope 1",
  electricity: "Scope 2",
  heat: "Scope 2",
  logistics: "Scope 3",
  waste: "Scope 3",
  travel: "Scope 3",
};

// --- Mock Data ---
const companies: Company[] = [
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
    ],
  },
];

let posts: Post[] = [
  {
    id: "p1",
    title: "Sustainability Report 2024",
    resourceUid: "c1",
    dateTime: "2024-02-15",
    content: "Quarterly CO2 update",
  },
];

const pcfData: PCFData[] = [
  { stage: "Raw Material", emissions: 450, percentage: 35 },
  { stage: "Manufacturing", emissions: 380, percentage: 30 },
  { stage: "Distribution", emissions: 150, percentage: 12 },
  { stage: "Use", emissions: 200, percentage: 15 },
  { stage: "Disposal", emissions: 100, percentage: 8 },
];

// --- API Functions ---

export async function fetchCompanies(): Promise<Company[]> {
  await delay(jitter());
  if (maybeFail())
    throw new Error("기업 데이터를 불러오는 중 네트워크 오류가 발생했습니다.");
  return [...companies];
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
      return posts[index];
    }
  }

  const newPost: Post = {
    ...post,
    id: `p${Date.now()}`,
  } as Post;

  posts = [newPost, ...posts];
  return newPost;
}

/**
 * 대시보드 분석 데이터를 가져옵니다.
 */
export async function fetchDashboardAnalytics(companyId?: string) {
  await delay(jitter());
  if (maybeFail())
    throw new Error("통계 데이터를 가공하는 중 오류가 발생했습니다.");

  const filteredCompanies = companyId
    ? companies.filter((c) => c.id === companyId)
    : companies;

  const allEmissions = filteredCompanies.flatMap((c) => c.emissions);

  // 1. Scope별 총합 계산
  const scopeBreakdown: Record<Scope, number> = {
    "Scope 1": 0,
    "Scope 2": 0,
    "Scope 3": 0,
  };

  allEmissions.forEach((e) => {
    const scope = SOURCE_TO_SCOPE[e.source] || "Scope 3";
    scopeBreakdown[scope] += e.emissions;
  });

  // 2. 월별 트렌드
  const trendsMap: Record<string, number> = {};
  allEmissions.forEach((e) => {
    trendsMap[e.yearMonth] = (trendsMap[e.yearMonth] || 0) + e.emissions;
  });

  const monthlyTrends = Object.entries(trendsMap)
    .map(([month, emissions]) => ({ month, emissions }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return {
    summary: {
      totalEmissions: allEmissions.reduce((sum, e) => sum + e.emissions, 0),
      scopeBreakdown,
    },
    monthlyTrends,
    pcfBreakdown: pcfData,
    companies: filteredCompanies.map((c) => ({ id: c.id, name: c.name })),
  };
}
