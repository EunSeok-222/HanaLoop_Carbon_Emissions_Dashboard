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
    { label: 'Jan', value: 400, baseline: 350 },
    { label: 'Feb', value: 300, baseline: 350 },
    { label: 'Mar', value: 600, baseline: 350 },
    { label: 'Apr', value: 800, baseline: 350 },
    { label: 'May', value: 500, baseline: 350 },
    { label: 'Jun', value: 900, baseline: 350 },
  ],
  items: [
    { id: '1', title: 'Service A', status: 'online', usage: 75 },
    { id: '2', title: 'Service B', status: 'away', usage: 30 },
    { id: '3', title: 'Service C', status: 'offline', usage: 0 },
    { id: '4', title: 'Service D', status: 'online', usage: 95 },
  ],
};

export async function fetchDashboardData(fail = false): Promise<DashboardData> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (fail) throw new Error('Failed to fetch dashboard data.');
  return mockData;
}
