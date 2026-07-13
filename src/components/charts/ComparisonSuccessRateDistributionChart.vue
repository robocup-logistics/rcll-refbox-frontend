<template>
  <v-card class="kpi-chart-card">
    <v-card-title>
      Success Rate – Distribution
      <span v-if="averageValue" class="average-badge">Ø {{ averageValue }}%</span>
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
  const successRates = props.kpis
    .map(k => k.performance?.delivery_success_rate)
    .filter(v => typeof v === "number" && !isNaN(v) && v >= 0 && v <= 100);
  
  if (successRates.length === 0) return null;
  const avg = successRates.reduce((a, b) => a + b, 0) / successRates.length;
  return avg.toFixed(1);
});

const chartData = computed(() => {
  const successRates = props.kpis
    .map(k => k.performance?.delivery_success_rate)
    .filter(v => typeof v === "number" && !isNaN(v) && v >= 0 && v <= 100);

  if (successRates.length === 0) {
    return {
      labels: [],
      datasets: [{ label: "Frequency", data: [], backgroundColor: "#AB47BC" }]
    };
  }

  const bins = 20;
  const min = 0;
  const max = 100;
  const binSize = (max - min) / bins;
  
  const binCounts = Array(bins).fill(0);
  const binLabels = Array(bins).fill(0).map((_, i) => {
    const binStart = min + i * binSize;
    const binEnd = binStart + binSize;
    return `${binStart.toFixed(0)}-${binEnd.toFixed(0)}%`;
  });

  successRates.forEach(rate => {
    const binIndex = Math.min(Math.floor((rate - min) / binSize), bins - 1);
    binCounts[binIndex]++;
  });

  return {
    labels: binLabels,
    datasets: [
      {
        label: "Frequency",
        data: binCounts,
        backgroundColor: "#AB47BC",
        borderColor: "#8E24AA",
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
        text: "Success Rate Range (%)"
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

