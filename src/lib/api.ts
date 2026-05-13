/**
 * Virtual Backend API Stub
 * 
 * 이 모듈은 실제 서버 통신을 시뮬레이션하며, 
 * 비동기 처리 및 에러 상황을 테스트하기 위해 작성되었습니다.
 */

export interface DashboardData {
  summary: {
    totalUsers: number;
    growthRate: number;
    activeSessions: number;
    performanceScore: number;
  };
  mainTrends: {
    label: string;
    value: number;
    baseline: number;
  }[];
  items: {
    id: string;
    title: string;
    status: 'online' | 'away' | 'offline';
    usage: number;
  }[];
}

const mockData: DashboardData = {
  summary: {
    totalUsers: 2450,
    growthRate: 15.2,
    activeSessions: 124,
    performanceScore: 98,
  },
  mainTrends: [
    { label: '1월', value: 400, baseline: 350 },
    { label: '2월', value: 300, baseline: 350 },
    { label: '3월', value: 600, baseline: 350 },
    { label: '4월', value: 800, baseline: 350 },
    { label: '5월', value: 500, baseline: 350 },
    { label: '6월', value: 900, baseline: 350 },
  ],
  items: [
    { id: '1', title: '서비스 A', status: 'online', usage: 75 },
    { id: '2', title: '서비스 B', status: 'away', usage: 30 },
    { id: '3', title: '서비스 C', status: 'offline', usage: 0 },
    { id: '4', title: '서비스 D', status: 'online', usage: 95 },
  ],
};

export async function fetchDashboardData(fail = false): Promise<DashboardData> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (fail) throw new Error('데이터를 불러오지 못했습니다.');
  return mockData;
}
