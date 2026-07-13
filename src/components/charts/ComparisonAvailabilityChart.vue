<template>
  <v-card class="kpi-chart-card">
    <v-card-title>Movement Availability – Distribution</v-card-title>
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

const chartData = computed(() => {
  const availabilities = props.kpis
    .map(k => {
      // Versuche movement_availability?.mean, sonst berechne Durchschnitt aus robots Array
      if (typeof k.robots?.movement_availability?.mean === "number") {
        return k.robots.movement_availability.mean;
      }
      if (Array.isArray(k.robots?.movement_availability?.robots) && 
          k.robots.movement_availability.robots.length > 0) {
        const sum = k.robots.movement_availability.robots.reduce((a: number, b: number) => a + b, 0);
        return sum / k.robots.movement_availability.robots.length;
      }
      return null;
    })
    .filter(v => typeof v === "number" && !isNaN(v) && v >= 0 && v <= 1);

  if (availabilities.length === 0) {
    return {
      labels: [],
      datasets: [{ label: "Frequency", data: [], backgroundColor: "#66BB6A" }]
    };
  }

  // Erstelle Histogram mit 20 Bins
  const bins = 20;
  const min = 0;
  const max = 1;
  const binSize = (max - min) / bins;
  
  const binCounts = Array(bins).fill(0);
  const binLabels = Array(bins).fill(0).map((_, i) => {
    const binStart = min + i * binSize;
    const binEnd = binStart + binSize;
    return `${binStart.toFixed(2)}-${binEnd.toFixed(2)}`;
  });

  availabilities.forEach(avail => {
    const binIndex = Math.min(Math.floor((avail - min) / binSize), bins - 1);
    binCounts[binIndex]++;
  });

  return {
    labels: binLabels,
    datasets: [
      {
        label: "Frequency",
        data: binCounts,
        backgroundColor: "#66BB6A",
        borderColor: "#43A047",
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
        text: "Movement Availability Range"
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
