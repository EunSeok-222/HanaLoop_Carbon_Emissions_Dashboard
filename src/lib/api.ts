import { Company, Post, Scope, PCFData } from "@/lib/types";
import { classifyScope, summarizeEmissions } from "@/utils/carbonCalculator";

/**
 * Fake backend (Stub)
 * 시뮬레이션: 네트워크 지연(200~800ms) 및 간헐적 오류(10~20%)
 */

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const jitter = () => 200 + Math.random() * 600; // 200ms ~ 800ms
const maybeFail = () => Math.random() < 0.15; // 15% failure rate

// --- Mock Data ---
let companies: Company[] = [
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
 * utils/carbonCalculator.ts의 도메인 로직을 재사용합니다.
 */
export async function fetchDashboardAnalytics(companyId?: string) {
  await delay(jitter());
  if (maybeFail())
    throw new Error("통계 데이터를 가공하는 중 오류가 발생했습니다.");

  const filteredCompanies = companyId
    ? companies.filter((c) => c.id === companyId)
    : companies;

  const allEmissions = filteredCompanies.flatMap((c) => c.emissions);

  // 도메인 계산 로직 적용
  const summary = summarizeEmissions(allEmissions);

  return {
    summary: {
      totalEmissions: summary.totalEmissions,
      currentMonthTotal: summary.currentMonthTotal,
      growthRate: summary.growthRate,
      mostEmittedScope: summary.mostEmittedScope,
      scopeBreakdown: summary.scopeBreakdown,
    },
    monthlyTrends: summary.monthlyTrends,
    pcfBreakdown: pcfData,
    companies: filteredCompanies.map((c) => ({ id: c.id, name: c.name })),
  };
}
