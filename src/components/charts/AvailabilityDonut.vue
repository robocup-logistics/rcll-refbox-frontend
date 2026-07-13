<template>
    <v-card class="kpi-chart-card">
      <v-card-title>
        Overall Robot Availability
        <span v-if="averageValue" class="average-badge">
          Ø {{ averageValue }}
          <span v-if="comparisonValue !== null" :class="comparisonClass">
            ({{ comparisonValue > 0 ? '+' : '' }}{{ comparisonValue }}%)
          </span>
        </span>
      </v-card-title>
      <v-card-text>
        <div style="height: 260px;">
          <Pie :data="chartData" :options="chartOptions" />
        </div>
      </v-card-text>
    </v-card>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { Pie } from 'vue-chartjs'
  import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
  
  ChartJS.register(ArcElement, Tooltip, Legend)
  
  const props = defineProps<{ kpiData?: any; averages?: any }>()
  
  const averageValue = computed(() => {
    if (!props.averages) return null
    
    // Versuche verschiedene mögliche Feldnamen
    const avg = props.averages.avg_robot_availability ?? 
                 props.averages.avg_availability_mean ??
                 props.averages.avg_overall_efficiency
    
    if (typeof avg === 'number' && !isNaN(avg)) {
      return avg.toFixed(3)
    }
    return null
  })
  
  const comparisonValue = computed(() => {
    const currentValue = props.kpiData?.robots?.availability?.mean
    const avg = props.averages?.avg_robot_availability ?? 
                props.averages?.avg_availability_mean ??
                props.averages?.avg_overall_efficiency
    
    if (!currentValue || !avg || avg === 0) return null
    return parseFloat((((currentValue / avg) - 1) * 100).toFixed(1))
  })
  
  const comparisonClass = computed(() => {
    if (comparisonValue.value === null) return ''
    return comparisonValue.value >= 0 ? 'comparison-positive' : 'comparison-negative'
  })
  
  const chartData = computed(() => {
    const mean = props.kpiData?.robots?.availability?.mean ?? 0
  
    return {
      labels: ['Available', 'Unavailable'],
      datasets: [
        {
          data: [mean, 1 - mean],
          backgroundColor: ['#42A5F5', '#EF5350'],
          borderWidth: 1
        }
      ]
    }
  })
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const }
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
  