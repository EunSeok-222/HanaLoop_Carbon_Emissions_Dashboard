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
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { translations } from "@/lib/translations";

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
  pcfBreakdown: { stage: string; emissions: number; percentage: number }[];
  selectedMonth?: string | null;
  onMonthSelect?: (month: string) => void;
}

export default function EmissionCharts({ 
  monthlyTrends, 
  pcfBreakdown, 
  selectedMonth, 
  onMonthSelect 
}: EmissionChartsProps) {
  const { language } = useDashboardStore();
  const t = translations[language];

  // Bar Chart Data
  const barData = {
    labels: monthlyTrends.map((t) => t.month),
    datasets: [
      {
        label: t.unitEmission,
        data: monthlyTrends.map((t) => t.emissions),
        backgroundColor: monthlyTrends.map((t) => 
          t.month === selectedMonth ? 'rgba(16, 185, 129, 1)' : 'rgba(16, 185, 129, 0.4)'
        ),
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  // PCF Doughnut Chart Data
  const pcfData = {
    labels: pcfBreakdown.map((item) => item.stage),
    datasets: [
      {
        data: pcfBreakdown.map((item) => item.emissions),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // Raw Material
          'rgba(16, 185, 129, 0.8)', // Manufacturing
          'rgba(245, 158, 11, 0.8)', // Distribution
          'rgba(139, 92, 246, 0.8)', // Use
          'rgba(100, 116, 139, 0.8)', // Disposal
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
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-none shadow-md ring-1 ring-border/50 overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b">
          <CardTitle className="text-lg font-bold">{t.chartTrendTitle}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[350px]">
            <Bar 
              data={barData} 
              options={{
                ...chartOptions,
                onClick: (event, elements) => {
                  if (elements.length > 0 && onMonthSelect) {
                    const index = elements[0].index;
                    onMonthSelect(monthlyTrends[index].month);
                  }
                },
                scales: {
                  y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
                  x: { grid: { display: false } }
                }
              }} 
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md ring-1 ring-border/50 overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b">
          <CardTitle className="text-lg font-bold">{t.chartPcfTitle}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[350px] flex items-center justify-center">
            <Doughnut 
              data={pcfData} 
              options={{
                ...chartOptions,
                cutout: '65%',
              }} 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
