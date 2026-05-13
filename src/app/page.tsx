import { fetchDashboardData } from "@/lib/api";
import StatCards from "@/components/dashboard/StatCards";
import FilterBar from "@/components/dashboard/FilterBar";
import DashboardChart from "@/components/dashboard/DashboardChart";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ServiceStatus from "@/components/dashboard/ServiceStatus";

/**
 * Dashboard Boilerplate Entry Point (Server Component)
 * 데이터는 서버에서 페칭하여 하위 클라이언트 컴포넌트로 전달합니다.
 */
export default async function Home() {
  const data = await fetchDashboardData();

  return (
    <main className="flex-1 overflow-y-auto bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        {/* 클라이언트 사이드 헤더 (언어 변경 대응) */}
        <DashboardHeader />

        <FilterBar />

        <StatCards data={data.summary} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <DashboardChart data={data.mainTrends} />
          </div>

          <div className="lg:col-span-1">
            {/* 클라이언트 사이드 서비스 상태 (언어 변경 대응) */}
            <ServiceStatus items={data.items} />
          </div>
        </div>
      </div>
    </main>
  );
}
