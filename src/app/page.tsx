import { fetchDashboardData } from "@/lib/api";
import StatCards from "@/components/dashboard/StatCards";
import FilterBar from "@/components/dashboard/FilterBar";
import DashboardChart from "@/components/dashboard/DashboardChart";

/**
 * Dashboard Boilerplate Entry Point
 */
export default async function Home() {
  const data = await fetchDashboardData();

  return (
    <main className="flex-1 overflow-y-auto bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground">
            Monitor your application performance and user metrics.
          </p>
        </header>

        <FilterBar />

        <StatCards data={data.summary} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <DashboardChart data={data.mainTrends} />
          </div>

          <div className="bg-card rounded-xl border p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Service Status</h3>
            <div className="space-y-4">
              {data.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">{item.title}</span>
                    <span className="text-xs text-muted-foreground">Usage {item.usage}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${
                      item.status === 'online' ? 'bg-emerald-500' : 
                      item.status === 'away' ? 'bg-amber-500' : 'bg-slate-400'
                    }`} />
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
