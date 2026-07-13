<template>
    <v-card class="kpi-chart-card">
      <v-card-title>
        Robot Availability
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
    const avg = props.averages.avg_robot_availability ?? props.averages.avg_availability_mean
    if (typeof avg === 'number' && !isNaN(avg)) {
      return avg.toFixed(3)
    }
    return null
  })
  
  const comparisonValue = computed(() => {
    const currentValue = props.kpiData?.robots?.availability?.mean
    const avg = props.averages?.avg_robot_availability ?? props.averages?.avg_availability_mean
    
    if (!currentValue || !avg || avg === 0) return null
    return parseFloat((((currentValue / avg) - 1) * 100).toFixed(1))
  })
  
  const comparisonClass = computed(() => {
    if (comparisonValue.value === null) return ''
    return comparisonValue.value >= 0 ? 'comparison-positive' : 'comparison-negative'
  })
  
  const chartData = computed(() => {
    // Note: Individual robot availability data might not be available in the new structure
    // If robots.availability.robots or robots.movement_availability.robots exist, use them
    // Otherwise, show a message or use the mean value
    const a = props.kpiData?.robots?.availability?.robots
    const m = props.kpiData?.robots?.movement_availability?.robots
  
    if (!a || !m) {
      // Fallback: if individual robot data is not available, show mean value
      const mean = props.kpiData?.robots?.availability?.mean ?? 0
      return {
        labels: ['Overall'],
        datasets: [
          {
            label: 'Availability',
            backgroundColor: '#42A5F5',
            data: [mean]
          }
        ]
      }
    }
  
    const labels = ['Robot 1', 'Robot 2', 'Robot 3']
  
    return {
      labels,
      datasets: [
        {
          label: 'Availability',
          backgroundColor: '#42A5F5',
          data: a
        },
        {
          label: 'Movement Availability',
          backgroundColor: '#66BB6A',
          data: m
        }
      ]
    }
  })
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const },
    },
    scales: { y: { beginAtZero: true, max: 1 } }
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
  