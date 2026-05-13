import { fetchDashboardAnalytics } from "@/lib/api";
import StatCards from "@/components/dashboard/StatCards";
import FilterBar from "@/components/dashboard/FilterBar";
import DashboardChart from "@/components/dashboard/DashboardChart";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ServiceStatus from "@/components/dashboard/ServiceStatus";

/**
 * Carbon Emissions Dashboard (Step 2: UI Engineering)
 */
export default async function Home() {
  // 1단계에서 설계한 분석 데이터를 서버에서 페칭합니다.
  const data = await fetchDashboardAnalytics();

  return (
    <main className="flex-1 overflow-y-auto bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        <DashboardHeader />

        <FilterBar />

        {/* 탄소 배출량 통계 카드 */}
        <StatCards data={data.summary} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* 월별 배출 트렌드 차트 */}
            <DashboardChart data={data.monthlyTrends} />
          </div>

          <div className="lg:col-span-1">
            {/* 1단계 요구사항: 제품 탄소 발자국(PCF) 생애주기 시각화용 데이터 전달 */}
            <ServiceStatus items={data.pcfBreakdown} />
          </div>
        </div>
      </div>
    </main>
  );
}
