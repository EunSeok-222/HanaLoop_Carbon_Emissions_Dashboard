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
  const chartData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        label: 'Current Value',
        data: data.map((item) => item.value),
        borderColor: 'rgb(59, 130, 246)', // Blue 500
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Baseline',
        data: data.map((item) => item.baseline),
        borderColor: 'rgba(156, 163, 175, 0.5)', // Gray 400
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
        <CardTitle className="text-lg font-bold">Activity Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <Line data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
