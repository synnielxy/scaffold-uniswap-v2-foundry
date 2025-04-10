import React from "react";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface PoolReservesChartProps {
  token0Symbol: string;
  token1Symbol: string;
  reserve0: string;
  reserve1: string;
}

const PoolReservesChart: React.FC<PoolReservesChartProps> = ({ token0Symbol, token1Symbol, reserve0, reserve1 }) => {
  // Convert reserves to numbers
  const r0 = parseFloat(reserve0);
  const r1 = parseFloat(reserve1);
  const k = r0 * r1;

  // Generate points for the curve
  const generatePoints = () => {
    const points = [];
    const numPoints = 200; // Increase number of points for smoother curve
    const minX = r0 * 0.1; // Start from 10% of current reserve
    const maxX = r0 * 2; // Go up to 200% of current reserve

    for (let i = 0; i < numPoints; i++) {
      const x = minX + ((maxX - minX) * i) / (numPoints - 1);
      points.push({
        x,
        y: k / x,
      });
    }

    return points;
  };

  const data = {
    datasets: [
      {
        label: "Constant Product Curve (k)",
        data: generatePoints(),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: "Current Position (P)",
        data: [{ x: r0, y: r1 }],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgb(255, 99, 132)",
        pointRadius: 8,
        pointStyle: "circle",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
    scales: {
      x: {
        type: "linear" as const,
        display: true,
        title: {
          display: true,
          text: `${token0Symbol} Reserve`,
          font: {
            size: 14,
            weight: 700,
          },
        },
        min: 0,
        max: r0 * 2,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      y: {
        type: "linear" as const,
        display: true,
        title: {
          display: true,
          text: `${token1Symbol} Reserve`,
          font: {
            size: 14,
            weight: 700,
          },
        },
        min: r1 * 0.1,
        max: r1 * 2,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          callback: function (tickValue: number | string) {
            const value = typeof tickValue === "string" ? parseFloat(tickValue) : tickValue;
            return value.toFixed(2);
          },
          count: 10,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const point = context.raw;
            if (context.dataset.label === "Current Position (P)") {
              return `Current Position P: (${point.x.toFixed(2)} ${token0Symbol}, ${point.y.toFixed(2)} ${token1Symbol})`;
            }
            return `${context.dataset.label}: (${point.x.toFixed(2)} ${token0Symbol}, ${point.y.toFixed(2)} ${token1Symbol})`;
          },
        },
      },
      legend: {
        position: "top" as const,
        labels: {
          font: {
            size: 12,
            weight: 700,
          },
        },
      },
      title: {
        display: true,
        text: `Constant Product AMM: ${token0Symbol}/${token1Symbol}`,
        font: {
          size: 16,
          weight: 700,
        },
      },
    },
  };

  return (
    <div style={{ height: "500px", width: "100%" }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default PoolReservesChart;
