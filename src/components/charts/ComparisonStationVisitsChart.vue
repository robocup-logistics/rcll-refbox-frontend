<template>
  <v-card class="kpi-chart-card">
    <v-card-title>
      Total Station Visits – Distribution
      <span v-if="averageValue" class="average-badge">Ø {{ averageValue }}</span>
    </v-card-title>
    <v-card-text>
      <div style="height: 320px;">
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
  const visits = props.kpis
    .map(k => k.machines?.station_visits?.sum)
    .filter(v => typeof v === "number" && !isNaN(v) && v > 0);
  
  if (visits.length === 0) return null;
  const avg = visits.reduce((a, b) => a + b, 0) / visits.length;
  return Math.round(avg);
});

const chartData = computed(() => {
  const visits = props.kpis
    .map(k => k.machines?.station_visits?.sum)
    .filter(v => typeof v === "number" && !isNaN(v) && v > 0);

  if (visits.length === 0) {
    return {
      labels: [],
      datasets: [{ label: "Frequency", data: [], backgroundColor: "#29B6F6" }]
    };
  }

  const bins = 20;
  const min = Math.min(...visits);
  const max = Math.max(...visits);
  const binSize = (max - min) / bins;
  
  const binCounts = Array(bins).fill(0);
  const binLabels = Array(bins).fill(0).map((_, i) => {
    const binStart = min + i * binSize;
    const binEnd = binStart + binSize;
    return `${Math.round(binStart)}-${Math.round(binEnd)}`;
  });

  visits.forEach(visit => {
    const binIndex = Math.min(Math.floor((visit - min) / binSize), bins - 1);
    binCounts[binIndex]++;
  });

  return {
    labels: binLabels,
    datasets: [
      {
        label: "Frequency",
        data: binCounts,
        backgroundColor: "#29B6F6",
        borderColor: "#0288D1",
        borderWidth: 1
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
        text: "Station Visits Range"
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
