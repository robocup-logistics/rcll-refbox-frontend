<template>
  <v-card class="kpi-chart-card">
    <v-card-title>Average Order Duration by Complexity</v-card-title>
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
  const complexityMap = new Map<string, number[]>();
  
  props.kpis.forEach(kpi => {
    const byComplexity = kpi?.orders?.by_complexity;
    if (byComplexity && typeof byComplexity === 'object') {
      Object.entries(byComplexity).forEach(([complexity, duration]) => {
        if (typeof duration === 'number' && !isNaN(duration) && duration > 0) {
          if (!complexityMap.has(complexity)) {
            complexityMap.set(complexity, []);
          }
          complexityMap.get(complexity)!.push(duration);
        }
      });
    }
  });

  if (complexityMap.size === 0) {
    return {
      labels: [],
      datasets: [{ label: "Average Duration (s)", data: [], backgroundColor: "#FFCA28" }]
    };
  }

  const complexities = Array.from(complexityMap.keys()).sort();
  const averages = complexities.map(complexity => {
    const durations = complexityMap.get(complexity)!;
    const sum = durations.reduce((a, b) => a + b, 0);
    return sum / durations.length;
  });

  return {
    labels: complexities,
    datasets: [
      {
        label: "Average Duration (s)",
        data: averages,
        backgroundColor: "#FFCA28",
        borderColor: "#FFB300",
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
        label: (context: any) => {
          const value = context.parsed.y;
          return `Average: ${value.toFixed(2)}s`;
        }
      }
    }
  },
  scales: {
    y: { 
      beginAtZero: true,
      title: {
        display: true,
        text: "Average Duration (seconds)"
      }
    },
    x: {
      title: {
        display: true,
        text: "Complexity"
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

