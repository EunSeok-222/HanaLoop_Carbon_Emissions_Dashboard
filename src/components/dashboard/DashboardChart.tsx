'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { translations } from "@/lib/translations";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DashboardChartProps {
  data: { month: string; emissions: number }[];
}

/**
 * 월별 탄소 배출 트렌드 (Bar Chart)
 */
export default function DashboardChart({ data }: DashboardChartProps) {
  const { language } = useDashboardStore();
  const t = translations[language];

  const chartData = {
    labels: data.map((item) => item.month),
    datasets: [
      {
        label: '총 배출량 (tCO2eq)',
        data: data.map((item) => item.emissions),
        backgroundColor: 'rgba(16, 185, 129, 0.8)', // Emerald 500
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        title: {
          display: true,
          text: '배출량 (t)',
          font: { size: 10 }
        }
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <Card className="w-full border-muted/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-lg font-bold">월별 배출 트렌드</CardTitle>
          <p className="text-xs text-muted-foreground">기업 전체 사업장의 통합 탄소 배출 통계</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
