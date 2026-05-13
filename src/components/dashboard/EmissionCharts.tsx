'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface EmissionChartsProps {
  monthlyTrends: { month: string; emissions: number }[];
  scopeBreakdown: Record<string, number>;
}

export default function EmissionCharts({ monthlyTrends, scopeBreakdown }: EmissionChartsProps) {
  // Bar Chart Data
  const barData = {
    labels: monthlyTrends.map((t) => t.month),
    datasets: [
      {
        label: '배출량 (tCO2eq)',
        data: monthlyTrends.map((t) => t.emissions),
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  // Doughnut Chart Data
  const doughnutData = {
    labels: Object.keys(scopeBreakdown),
    datasets: [
      {
        data: Object.values(scopeBreakdown),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // Scope 1 - Blue
          'rgba(245, 158, 11, 0.8)', // Scope 2 - Amber
          'rgba(100, 116, 139, 0.8)', // Scope 3 - Slate
        ],
        hoverOffset: 4,
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12 },
        },
      },
    },
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Monthly Trend Bar Chart */}
      <Card className="lg:col-span-2 border-none shadow-md ring-1 ring-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-bold">월별 탄소 배출량 추이</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <Bar 
              data={barData} 
              options={{
                ...chartOptions,
                scales: {
                  y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
                  x: { grid: { display: false } }
                }
              }} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Scope Proportion Doughnut Chart */}
      <Card className="border-none shadow-md ring-1 ring-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Scope별 배출 비중</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] flex items-center justify-center">
            <Doughnut 
              data={doughnutData} 
              options={{
                ...chartOptions,
                cutout: '70%',
              }} 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
