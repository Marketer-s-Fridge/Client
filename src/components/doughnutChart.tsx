'use client';

import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: ['Food', 'Lifestyle', 'Beauty', 'Tech', 'Fashion'],
  datasets: [
    {
      data: [40, 35, 15, 7, 3],
      backgroundColor: [
        '#ff4d4d',   // 빨강
        '#f08080',   // 분홍1
        '#ffa0a0',   // 분홍2
        '#ffcccc',   // 연분홍
        '#eeeeee',   // 회색
      ],
      borderWidth: 0,
    },
  ],
};

const options = {
  responsive: true,
  cutout: '60%',
  animations: {
    numbers: {
      type: 'number',
      duration: 1200,
      easing: 'easeOutQuart',
    },
    colors: {
      type: 'color',
      duration: 1200,
      easing: 'easeOutQuart',
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
} as const;

export default function DoughnutChart() {
  return (
    <div className="w-[280px] sm:w-[300px] md:w-[340px] mx-auto">
      <Doughnut data={data} options={options} />
    </div>
  );
}
