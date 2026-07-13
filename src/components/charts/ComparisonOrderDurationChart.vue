<template>
  <v-card class="kpi-chart-card">
    <v-card-title>
      Mean Order Duration – Distribution
      <span v-if="averageValue" class="average-badge">Ø {{ averageValue }}s</span>
    </v-card-title>
    <v-card-text>
      <div style="height: 330px;">
        <Bar :data="chartData" :options="chartOptions" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Bar } from "vue-chartjs";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const props = defineProps<{ kpis: any[] }>();

const averageValue = computed(() => {
  const durations = props.kpis
    .map(k => k.orders?.summary?.mean_duration_seconds)
    .filter(v => typeof v === "number" && !isNaN(v) && v > 0);
  
  if (durations.length === 0) return null;
  const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
  return avg.toFixed(1);
});

const chartData = computed(() => {
  const durations = props.kpis
    .map(k => k.orders?.summary?.mean_duration_seconds)
    .filter(v => typeof v === "number" && !isNaN(v) && v > 0);

  if (durations.length === 0) {
    return {
      labels: [],
      datasets: [{ label: "Frequency", data: [], backgroundColor: "#FFCA28" }]
    };
  }

  const bins = 20;
  const min = Math.min(...durations);
  const max = Math.max(...durations);
  const binSize = (max - min) / bins;
  
  const binCounts = Array(bins).fill(0);
  const binLabels = Array(bins).fill(0).map((_, i) => {
    const binStart = min + i * binSize;
    const binEnd = binStart + binSize;
    return `${binStart.toFixed(1)}-${binEnd.toFixed(1)}s`;
  });

  durations.forEach(duration => {
    const binIndex = Math.min(Math.floor((duration - min) / binSize), bins - 1);
    binCounts[binIndex]++;
  });

  return {
    labels: [...binLabels].reverse(),
    datasets: [
      {
        label: "Frequency",
        data: [...binCounts].reverse(),
        backgroundColor: "#FFCA28",
        borderColor: "#FFB300",
        borderWidth: 1
      }
    ]
  };
});

const chartOptions = {
  indexAxis: 'y' as const,
  responsive: true,
  maintainAspectRatio: false,
  plugins: { 
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context: any) => `Count: ${context.parsed.x}`
      }
    }
  },
  scales: {
    x: { 
      beginAtZero: true,
      title: {
        display: true,
        text: "Frequency"
      }
    },
    y: {
      title: {
        display: true,
        text: "Duration Range"
      }
    }
  }
};
</script>

<style scoped>
.kpi-chart-card {
  height: 100%;
}

.average-badge {
  font-size: 0.75em;
  font-weight: normal;
  color: rgba(255, 255, 255, 0.7);
  margin-left: 8px;
}
</style>
