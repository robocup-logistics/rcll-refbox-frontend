<template>
  <v-card class="kpi-chart-card">
    <v-card-title>
      Machine Utilization (By Duration)
      <span v-if="averageValue" class="average-badge">
        Ø {{ averageValue }}
        <span v-if="comparisonValue !== null" :class="comparisonClass">
          ({{ comparisonValue > 0 ? '+' : '' }}{{ comparisonValue }}%)
        </span>
      </span>
    </v-card-title>
    <v-card-text>
      <div style="height: 280px;">
        <Doughnut :data="chartData" :options="chartOptions" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps<{ kpiData?: any; averages?: any }>()

const averageValue = computed(() => {
  if (!props.averages) return null
  const avg = props.averages.avg_machine_utilization ?? props.averages.avg_utilization_rate
  if (typeof avg === 'number' && !isNaN(avg)) {
    return avg.toFixed(3)
  }
  return null
})

const comparisonValue = computed(() => {
  const currentValue = props.kpiData?.machines?.by_duration?.utilization ?? 
                       props.kpiData?.machines?.utilization_rate
  const avg = props.averages?.avg_machine_utilization ?? props.averages?.avg_utilization_rate
  
  if (!currentValue || !avg || avg === 0) return null
  return parseFloat((((currentValue / avg) - 1) * 100).toFixed(1))
})

const comparisonClass = computed(() => {
  if (comparisonValue.value === null) return ''
  return comparisonValue.value >= 0 ? 'comparison-positive' : 'comparison-negative'
})

const chartData = computed(() => {
  const m = props.kpiData?.machines
  const stateDurations = m?.by_duration?.state_durations
  
  if (!stateDurations) return { labels: [], datasets: [] }

  const labels = Object.keys(stateDurations)
  const data = Object.values(stateDurations) as number[]

  return {
    labels,
    datasets: [{
      backgroundColor: ['#42A5F5', '#FFCA28', '#EF5350', '#AB47BC', '#26A69A', '#78909C', '#8D6E63'],
      data
    }]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' as const } }
}
</script>

<style scoped>
.kpi-chart-card { height: 100%; }

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

