<template>
    <v-card class="kpi-chart-card">
      <v-card-title>
        Delivery Success Rate
        <span v-if="averageCompleted !== null" class="average-badge">
          Ø {{ averageCompleted }}
          <span v-if="comparisonValue !== null" :class="comparisonClass">
            ({{ comparisonValue > 0 ? '+' : '' }}{{ comparisonValue }}%)
          </span>
        </span>
      </v-card-title>
  
      <v-card-text>
        <div style="height: 300px;">
          <Doughnut :data="chartData" :options="chartOptions" />
        </div>
      </v-card-text>
    </v-card>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { Doughnut } from 'vue-chartjs'
  import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
  } from 'chart.js'
  
  ChartJS.register(ArcElement, Tooltip, Legend)
  
  const props = defineProps<{ kpiData?: any; averages?: any }>()
  
  const averageCompleted = computed(() => {
    if (!props.averages) return null
    // Versuche verschiedene mögliche Feldnamen für Delivery Success Rate Durchschnitt
    const avg = props.averages.avg_delivery_success_rate ?? 
                props.averages.avg_orders_completed ?? 
                props.averages.avg_completed
    if (typeof avg === 'number' && !isNaN(avg)) {
      // Wenn avg < 1, ist es wahrscheinlich als Dezimal (0.8), sonst als Prozent (80)
      return avg < 1 ? `${(avg * 100).toFixed(1)}%` : `${avg.toFixed(1)}%`
    }
    return null
  })
  
  const comparisonValue = computed(() => {
    // Delivery Success Rate aus performance
    const rate = props.kpiData?.performance?.delivery_success_rate ?? 0
    // Normalisiere auf Dezimal (0-1) für Vergleich
    const currentValue = rate < 1 ? rate : rate / 100
    
    const avg = props.averages?.avg_delivery_success_rate
    if (!avg || avg === 0) return null
    
    // Normalisiere Durchschnitt auf Dezimal
    const normalizedAvg = avg < 1 ? avg : avg / 100
    
    if (!currentValue || normalizedAvg === 0) return null
    return parseFloat((((currentValue / normalizedAvg) - 1) * 100).toFixed(1))
  })
  
  const comparisonClass = computed(() => {
    if (comparisonValue.value === null) return ''
    return comparisonValue.value >= 0 ? 'comparison-positive' : 'comparison-negative'
  })
  
  const chartData = computed(() => {
    // Delivery Success Rate aus performance (als Prozent: 80.0 oder Dezimal: 0.8)
    const rate = props.kpiData?.performance?.delivery_success_rate ?? 0
    // Normalisiere auf Prozent (0-100)
    const successRatePercent = rate < 1 ? rate * 100 : rate
    const failureRatePercent = 100 - successRatePercent
  
    return {
      labels: [`Success (${successRatePercent.toFixed(1)}%)`, `Failed (${failureRatePercent.toFixed(1)}%)`],
      datasets: [
        {
          backgroundColor: ['#4CAF50', '#FF7043'],
          borderColor: ['#2E7D32', '#D84315'],
          data: [successRatePercent, failureRatePercent] as number[]
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
  