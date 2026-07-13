<template>
  <v-card class="kpi-chart-card">
    <v-card-title>Station Visits vs. Points</v-card-title>
    <v-card-text>
      <div style="height: 320px;">
        <Scatter :data="chartData" :options="chartOptions" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Scatter } from "vue-chartjs";
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

const props = defineProps<{ kpis: any[] }>();

function calculateLinearRegression(dataPoints: { x: number; y: number }[]) {
  if (dataPoints.length < 2) return [];
  const n = dataPoints.length;
  const sumX = dataPoints.reduce((sum, p) => sum + p.x, 0);
  const sumY = dataPoints.reduce((sum, p) => sum + p.y, 0);
  const sumXY = dataPoints.reduce((sum, p) => sum + p.x * p.y, 0);
  const sumXX = dataPoints.reduce((sum, p) => sum + p.x * p.x, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  const xValues = dataPoints.map(p => p.x);
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  return [
    { x: minX, y: slope * minX + intercept },
    { x: maxX, y: slope * maxX + intercept }
  ];
}

const chartData = computed(() => {
  const dataPoints = props.kpis
    .map(k => ({
      x: k.machines?.station_visits?.sum ?? 0,
      y: k.performance?.score ?? 0
    }))
    .filter(point => 
      typeof point.x === "number" && 
      typeof point.y === "number" && 
      !isNaN(point.x) && 
      !isNaN(point.y) &&
      point.x >= 0 &&
      point.y >= 0
    );

  const regressionLine = calculateLinearRegression(dataPoints);

  return {
    datasets: [
      {
        label: "Games",
        data: dataPoints,
        backgroundColor: "rgba(156, 39, 176, 0.6)",
        borderColor: "#9C27B0",
        pointRadius: 5,
        pointHoverRadius: 7
      },
      {
        label: "Trend Line",
        data: regressionLine,
        borderColor: "#FF9800",
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        pointHoverRadius: 0,
        showLine: true,
        fill: false,
        tension: 0
      }
    ]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { 
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const point = context.raw;
          return `Station Visits: ${point.x}, Points: ${point.y}`;
        }
      }
    }
  },
  scales: {
    x: { 
      beginAtZero: true,
      title: {
        display: true,
        text: "Station Visits"
      }
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Points"
      }
    }
  }
};
</script>

<style scoped>
.kpi-chart-card {
  height: 100%;
}
</style>

