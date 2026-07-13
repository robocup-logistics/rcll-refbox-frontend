<template>
  <v-card class="kpi-chart-card">
    <v-card-title>
      Station Visit Frequency
      <span v-if="averageValue" class="average-badge">
        Ø {{ averageValue }}
        <span v-if="comparisonValue !== null" :class="comparisonClass">
          ({{ comparisonValue > 0 ? '+' : '' }}{{ comparisonValue }}%)
        </span>
      </span>
    </v-card-title>
    <v-card-text>
      <div style="height: 320px;">
        <Bar :data="chartData" :options="chartOptions" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const props = defineProps<{ kpiData?: any; averages?: any }>()

const averageValue = computed(() => {
  if (!props.averages) return null
  const avg = props.averages.avg_station_visits
  if (typeof avg === 'number' && !isNaN(avg)) {
    return Math.round(avg).toString()
  }
  return null
})

const comparisonValue = computed(() => {
  // Calculate total visits from machines.station_visits
  const stationVisits = props.kpiData?.machines?.station_visits
  if (!stationVisits) return null
  
  const currentValue = stationVisits.sum ?? 
    Object.values(stationVisits.total || {}).reduce(
      (sum: number, count: any) => sum + (typeof count === 'number' ? count : 0),
      0
    )
  const avg = props.averages?.avg_station_visits
  
  if (!currentValue || !avg || avg === 0) return null
  return parseFloat((((currentValue / avg) - 1) * 100).toFixed(1))
})

const comparisonClass = computed(() => {
  if (comparisonValue.value === null) return ''
  return comparisonValue.value >= 0 ? 'comparison-positive' : 'comparison-negative'
})

const chartData = computed(() => {
  const stationVisits = props.kpiData?.machines?.station_visits
  if (!stationVisits || !stationVisits.total) return { labels: [], datasets: [] }

  // Transform station_visits.total object into chart format
  const labels: string[] = []
  const data: number[] = []
  
  Object.entries(stationVisits.total).forEach(([machineName, count]: [string, any]) => {
    labels.push(machineName)
    data.push(typeof count === 'number' ? count : 0)
  })

  return {
    labels,
    datasets: [{
      label: 'Visits',
      backgroundColor: '#66BB6A',
      data
    }]
  }
})

const chartOptions = {
  indexAxis: 'y' as const,  // horizontal bars
  responsive: true,
  maintainAspectRatio: false,
  scales: { x: { beginAtZero: true } }
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
