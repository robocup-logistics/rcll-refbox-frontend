<template>
  <v-card class="kpi-chart-card">
    <v-card-title>
      Order Durations
      <span v-if="averageValue" class="average-badge">
        Ø {{ averageValue }}
        <span v-if="comparisonValue !== null" :class="comparisonClass">
          ({{ comparisonValue > 0 ? '+' : '' }}{{ comparisonValue }}%)
        </span>
      </span>
    </v-card-title>
    <v-card-text>
      <div style="height: 350px;">
        <Bar :data="chartData" :options="chartOptions" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const props = defineProps<{ kpiData?: any; averages?: any }>();

const averageValue = computed(() => {
  if (!props.averages) return null
  const avg = props.averages.avg_order_duration
  if (typeof avg === 'number' && !isNaN(avg)) {
    return `${avg.toFixed(3)}s`
  }
  return null
})

const comparisonValue = computed(() => {
  const currentValue = props.kpiData?.orders?.summary?.mean_duration_seconds
  const avg = props.averages?.avg_order_duration
  
  if (!currentValue || !avg || avg === 0) return null
  // Für Duration: niedriger ist besser, daher umgekehrte Logik
  const diff = ((currentValue / avg) - 1) * 100
  return parseFloat(diff.toFixed(1))
})

const comparisonClass = computed(() => {
  if (comparisonValue.value === null) return ''
  // Für Duration: niedriger ist besser
  return comparisonValue.value <= 0 ? 'comparison-positive' : 'comparison-negative'
})

const chartData = computed(() => {
  const orders = props.kpiData?.orders?.by_order;
  if (!orders) return { labels: [], datasets: [] };

  const labels = Object.keys(orders);
  const orderDurations = labels.map(key => orders[key].duration);
  const colors = labels.map(key => {
    const c = orders[key].complexity;
    return c === "C3" ? "#EF5350" : c === "C2" ? "#FB8C00" : c === "C1" ? "#42A5F5" : "#66BB6A";
  });

  return {
    labels,
    datasets: [{
      label: 'Order Duration (s)',
      backgroundColor: '#42A5F5',
      data: orderDurations
    }]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: "y" as const,
  scales: {
    x: { beginAtZero: true }
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

.comparison-positive {
  color: #4caf50;
  margin-left: 4px;
}

.comparison-negative {
  color: #f44336;
  margin-left: 4px;
}
</style>
