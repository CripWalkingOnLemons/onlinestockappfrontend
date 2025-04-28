import React, { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  LineController,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
  Filler,
  CategoryScale,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { Chart } from "react-chartjs-2";
import "chartjs-adapter-date-fns";

ChartJS.register(
  LineController,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
  Filler,
  CategoryScale,
  zoomPlugin
);

const StockChart = ({ data }) => {
  const chartRef = useRef();

  const chartData = {
    labels: data.map((d) => new Date(d.timestamp)),
    datasets: [
      {
        label: "Price",
        data: data.map((d) => ({
          x: new Date(d.timestamp),
          y: d.Close,
        })),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.4)",
        fill: true,
        pointRadius: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
        time: {
          tooltipFormat: "MMM d, h:mm a",
          unit: "hour",
        },
        title: { display: true, text: "Time" },
      },
      y: {
        title: { display: true, text: "Price ($)" },
      },
    },
    plugins: {
      legend: { display: false },
      zoom: {
        pan: { enabled: true, mode: "x" },
        zoom: {
          pinch: { enabled: true },
          wheel: { enabled: true },
          mode: "x",
        },
      },
    },
  };

  const handleResetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  return (
    <div style={{ height: "400px" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "5px" }}>
        <button
          onClick={handleResetZoom}
          style={{
            backgroundColor: "#999",
            color: "white",
            border: "none",
            padding: "5px 10px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Reset Zoom
        </button>
      </div>
      <Chart ref={chartRef} type="line" data={chartData} options={chartOptions} />
    </div>
  );
};

export default StockChart;
