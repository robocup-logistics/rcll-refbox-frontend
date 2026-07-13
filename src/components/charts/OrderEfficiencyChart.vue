<template>
    <v-card class="kpi-chart-card">
      <v-card-title>
        Order Efficiency (Actual vs Expected)
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
  import { computed } from "vue"
  import { Bar } from "vue-chartjs"
  import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js"
  
  ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)
  
  const props = defineProps<{ kpiData?: any; averages?: any }>()
  
  const averageValue = computed(() => {
    if (!props.averages) return null
    const avg = props.averages.avg_overall_efficiency
    if (typeof avg === 'number' && !isNaN(avg)) {
      return avg.toFixed(3)
    }
    return null
  })
  
  const comparisonValue = computed(() => {
    const currentValue = props.kpiData?.performance?.overall_efficiency
    const avg = props.averages?.avg_overall_efficiency
    
    if (!currentValue || !avg || avg === 0) return null
    return parseFloat((((currentValue / avg) - 1) * 100).toFixed(1))
  })
  
  const comparisonClass = computed(() => {
    if (comparisonValue.value === null) return ''
    return comparisonValue.value >= 0 ? 'comparison-positive' : 'comparison-negative'
  })
  
  const chartData = computed(() => {
    const orders = props.kpiData?.orders?.by_order
    if (!orders) return { labels: [], datasets: [] }
  
    const labels = Object.keys(orders)
    const values = labels.map(order => orders[order].ratio_to_global_mean_by_complexity) as number[]
  
    return {
      labels,
      datasets: [
        {
          label: "Actual / Expected Duration Ratio",
          backgroundColor: values.map(v =>
            v > 1 ? "#EF5350" : "#66BB6A"   // rot = schlechter, grün = besser
          ),
          data: values
        }
      ]
    }
  })
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: 1.5
      }
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
  