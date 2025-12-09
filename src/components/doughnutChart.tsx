"use client";

import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

// ✅ 기본 데이터 (props 없을 때 fallback)
const defaultData = {
  labels: ["Food", "Lifestyle", "Beauty", "Tech", "Fashion"],
  datasets: [
    {
      data: [40, 35, 15, 7, 3],
      backgroundColor: [
        "#ff4d4d", // 빨강
        "#f08080", // 분홍1
        "#ffa0a0", // 분홍2
        "#ffcccc", // 연분홍
        "#eeeeee", // 회색
      ],
      borderWidth: 0,
    },
  ],
};

const options: ChartOptions<"doughnut"> = {
  responsive: true,
  maintainAspectRatio: false, // ✅ 부모 박스 비율에 맞게
  cutout: "60%",
  animations: {
    numbers: {
      type: "number",
      duration: 1200,
      easing: "easeOutQuart",
    },
    colors: {
      type: "color",
      duration: 1200,
      easing: "easeOutQuart",
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};

// MyPage에서 넘기는 데이터 타입 기준
type DoughnutItem = {
  label: string;
  value: number;
  percent?: number;
};

interface DoughnutChartProps {
  data?: DoughnutItem[]; // 옵셔널로
}

export default function DoughnutChart({ data }: DoughnutChartProps) {
  const hasDynamicData = Array.isArray(data) && data.length > 0;

  // ✅ MyPage에서 넘겨준 데이터를 Chart.js 형식으로 변환
  const chartData = hasDynamicData
    ? {
        labels: data!.map((d) => d.label),
        datasets: [
          {
            data: data!.map((d) => d.value),
            backgroundColor: [
              "#ff4d4d",
              "#f08080",
              "#ffa0a0",
              "#ffcccc",
              "#eeeeee",
            ],
            borderWidth: 0,
          },
        ],
      }
    : defaultData; // 아무것도 안 넘어오면 기본값 사용

  return (
    <div className="relative mx-auto w-full aspect-square">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
