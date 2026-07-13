<template>
  <v-card class="kpi-chart-card">
    <v-card-title>
      Total Distance – Distribution
      <span v-if="averageValue" class="average-badge">Ø {{ averageValue }} km</span>
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
  const distances = props.kpis
    .map(k => k.robots?.distances?.sum_of_distances)
    .filter(v => typeof v === "number" && !isNaN(v) && v > 0);
  
  if (distances.length === 0) return null;
  const avg = distances.reduce((a, b) => a + b, 0) / distances.length;
  return (avg / 1000).toFixed(2);
});

const chartData = computed(() => {
  const distances = props.kpis
    .map(k => k.robots?.distances?.sum_of_distances)
    .filter(v => typeof v === "number" && !isNaN(v) && v > 0);

  if (distances.length === 0) {
    return {
      labels: [],
      datasets: [{ label: "Frequency", data: [], backgroundColor: "#EF5350" }]
    };
  }

  // Erstelle Histogram mit 20 Bins
  const bins = 20;
  const min = Math.min(...distances);
  const max = Math.max(...distances);
  const binSize = (max - min) / bins;
  
  const binCounts = Array(bins).fill(0);
  const binLabels = Array(bins).fill(0).map((_, i) => {
    const binStart = min + i * binSize;
    const binEnd = binStart + binSize;
    return `${(binStart / 1000).toFixed(1)}-${(binEnd / 1000).toFixed(1)} km`;
  });

  distances.forEach(dist => {
    const binIndex = Math.min(Math.floor((dist - min) / binSize), bins - 1);
    binCounts[binIndex]++;
  });

  // Berechne Median
  const sorted = [...distances].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];

  return {
    labels: binLabels,
    datasets: [
      {
        label: "Frequency",
        data: binCounts,
        backgroundColor: "#EF5350",
        borderColor: "#D32F2F",
        borderWidth: 1
      }
    ],
    median: median
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { 
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context: any) => `Count: ${context.parsed.y}`
      }
    }
  },
  scales: {
    y: { 
      beginAtZero: true,
      title: {
        display: true,
        text: "Frequency"
      }
    },
    x: {
      title: {
        display: true,
        text: "Distance Range"
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
