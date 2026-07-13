<template>
  <v-card class="kpi-chart-card">
    <v-card-title>
      Task Distribution
      <span v-if="moveRatioAverage !== null" class="average-badge">
        (Ø {{ moveRatioAverage }})
        <span v-if="moveRatioComparison !== null" :class="moveRatioComparisonClass">
          {{ moveRatioComparison > 0 ? '+' : '' }}{{ moveRatioComparison }}%
        </span>
      </span>
    </v-card-title>
    <v-card-text>
      <div style="height: 300px;">
        <Pie :data="chartData" :options="chartOptions" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps<{ kpiData?: any; averages?: any }>()

const moveRatioAverage = computed(() => {
  if (!props.averages) return null
  // Suche nach verschiedenen möglichen Feldnamen
  const avg = props.averages.avg_taskratio_move_ratio ?? 
              props.averages.avg_move_ratio ??
              props.averages.avg_task_ratios_move_ratio
  if (typeof avg === 'number' && !isNaN(avg)) {
    return `${(avg * 100).toFixed(1)}%`
  }
  return null
})

const moveRatioComparison = computed(() => {
  const currentValue = props.kpiData?.performance?.task_ratios?.move_ratio
  const avg = props.averages?.avg_taskratio_move_ratio ?? 
              props.averages?.avg_move_ratio ??
              props.averages?.avg_task_ratios_move_ratio
  
  if (!currentValue || !avg || avg === 0) return null
  return parseFloat((((currentValue / avg) - 1) * 100).toFixed(1))
})

const moveRatioComparisonClass = computed(() => {
  if (moveRatioComparison.value === null) return ''
  return moveRatioComparison.value >= 0 ? 'comparison-positive' : 'comparison-negative'
})

const chartData = computed(() => {
  const ratio = props.kpiData?.robots?.task_distribution?.ratio

  if (!ratio) {
    return {
      labels: ['MOVE (70%)', 'RETRIEVE (15%)', 'DELIVER (15%)'],
      datasets: [
        {
          label: 'Task Distribution',
          backgroundColor: ['#42A5F5', '#FFCA28', '#66BB6A'],
          borderColor: ['#1E88E5', '#FFB300', '#43A047'],
          borderWidth: 1,
          data: [70, 15, 15],
        },
      ],
    }
  }

  const labels = Object.keys(ratio)
  const values = Object.values(ratio) as number[]
  
  // Berechne Gesamtsumme
  const total = values.reduce((sum, val) => sum + val, 0)
  
  // Konvertiere zu Prozent: Wenn Summe > 1, normalisiere zu Prozent, sonst multipliziere mit 100
  const normalizedValues = total > 1 
    ? values.map(val => (val / total) * 100)  // Absolute Werte -> normalisiere zu Prozent
    : values.map(val => val * 100)              // Dezimal (0-1) -> multipliziere mit 100
  
  // Labels mit Prozentwerten
  const labelsWithPercent = labels.map((label, idx) => {
    const percent = normalizedValues[idx].toFixed(1)
    return `${label} (${percent}%)`
  })

  return {
    labels: labelsWithPercent,
    datasets: [
      {
        label: 'Task Distribution',
        backgroundColor: ['#42A5F5', '#FFCA28', '#66BB6A'],
        borderColor: ['#1E88E5', '#FFB300', '#43A047'],
        borderWidth: 1,
        data: normalizedValues,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' as const },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const label = context.label || ''
          const value = context.parsed || 0
          return `${label.split(' (')[0]}: ${value.toFixed(1)}%`
        }
      }
    }
  },
}
</script>

<style scoped>
.kpi-chart-card {
  height: 100%;
}

.v-card-title {
  display: flex;
  align-items: center;
  min-height: 40px;
}

.average-badge {
  font-size: 0.75em;
  font-weight: normal;
  color: rgba(255, 255, 255, 0.7);
  margin-left: 8px;
  display: inline-flex;
  align-items: center;
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
