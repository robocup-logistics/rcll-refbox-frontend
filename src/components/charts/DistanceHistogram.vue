<template>
  <v-card class="kpi-chart-card">
    <v-card-title>
      Distance Metrics
      <span v-if="averageValue" class="average-badge">
        Ø {{ averageValue }}
        <span v-if="comparisonValue !== null" :class="comparisonClass">
          ({{ comparisonValue > 0 ? '+' : '' }}{{ comparisonValue }}%)
        </span>
      </span>
    </v-card-title>
    <v-card-text>
      <div style="height: 300px;">
        <Bar :data="chartData" :options="chartOptions" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const props = defineProps<{ kpiData?: any; averages?: any }>()

const averageValue = computed(() => {
  if (!props.averages) return null
  const avg = props.averages.avg_total_distance ?? props.averages.avg_total_distance_m
  if (typeof avg === 'number' && !isNaN(avg)) {
    return `${avg.toFixed(3)}m`
  }
  return null
})

const comparisonValue = computed(() => {
  const currentValue = props.kpiData?.robots?.distances?.sum_of_distances
  const avg = props.averages?.avg_total_distance ?? props.averages?.avg_total_distance_m ?? props.averages?.avg_sum_of_distances
  
  if (!currentValue || !avg || avg === 0) return null
  return parseFloat((((currentValue / avg) - 1) * 100).toFixed(1))
})

const comparisonClass = computed(() => {
  if (comparisonValue.value === null) return ''
  // Für Distance: niedriger ist besser, daher umgekehrte Logik
  return comparisonValue.value <= 0 ? 'comparison-positive' : 'comparison-negative'
})

const chartData = computed(() => {
  const totalDistance = props.kpiData?.robots?.distances?.sum_of_distances

  if (totalDistance === undefined || totalDistance === null) {
    return {
      labels: ['Total Distance'],
      datasets: [{
        label: 'Distance',
        backgroundColor: '#42A5F5',
        data: [0],
      }]
    }
  }

  return {
    labels: ['Total Distance (m)'],
    datasets: [{
      label: 'Distance Metrics',
      backgroundColor: '#42A5F5',
      data: [totalDistance]
    }]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }},
  scales: {
    y: { beginAtZero: true }
  }
}
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
