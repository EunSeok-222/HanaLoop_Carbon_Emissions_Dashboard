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
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardData } from '@/lib/api';
import { useDashboardStore } from "@/hooks/use-dashboard-store";
import { translations } from "@/lib/translations";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DashboardChartProps {
  data: DashboardData['mainTrends'];
}

export default function DashboardChart({ data }: DashboardChartProps) {
  const { language } = useDashboardStore();
  const t = translations[language];

  // 월 레이블 번역 맵
  const monthLabels: Record<string, string> = {
    '1월': t.jan, '2월': t.feb, '3월': t.mar, '4월': t.apr, '5월': t.may, '6월': t.jun
  };

  const chartData = {
    labels: data.map((item) => monthLabels[item.label] || item.label),
    datasets: [
      {
        label: t.currentValue,
        data: data.map((item) => item.value),
        borderColor: 'rgb(59, 130, 246)', 
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: t.baseline,
        data: data.map((item) => item.baseline),
        borderColor: 'rgba(156, 163, 175, 0.5)', 
        borderDash: [5, 5],
        fill: false,
        tension: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { font: { size: 11 } },
      },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0, 0, 0, 0.05)' } },
      x: { grid: { display: false } },
    },
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold">{t.activityTrends}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <Line data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
