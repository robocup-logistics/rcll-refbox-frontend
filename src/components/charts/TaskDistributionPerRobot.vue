<template>
  <v-card class="kpi-chart-card">
    <v-card-title>
      Task Distribution per Robot
      <span v-if="averageValue" class="average-badge">Ø {{ averageValue }}</span>
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
    import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Legend, Tooltip } from 'chart.js'
    ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip)
    
    const props = defineProps<{ kpiData?: any; averages?: any }>()
    
    // Versuche den globalen Durchschnitt aus averages zu holen, falls vorhanden
    const averageValue = computed(() => {
      // Prüfe zuerst, ob es einen globalen Durchschnitt in averages gibt
      // (aktuell gibt es keinen spezifischen Wert für Task Distribution per Robot)
      // Daher zeigen wir keinen Durchschnitt an, da es keinen globalen Vergleichswert gibt
      return null
    })
    
    const chartData = computed(() => {
      const byRobot = props.kpiData?.robots?.task_distribution?.by_robot
      if (!byRobot || typeof byRobot !== 'object') {
        console.warn('TaskDistributionPerRobot: by_robot nicht gefunden oder ungültig', byRobot)
        return { labels: ['MOVE', 'RETRIEVE', 'DELIVER'], datasets: [] }
      }
    
      const labels = ['MOVE', 'RETRIEVE', 'DELIVER']
      const colors = ['#42A5F5', '#FFCA28', '#66BB6A']
    
      const datasets = Object.entries(byRobot).map(([robot, data]: [string, any], idx: number) => {
        // Unterstütze verschiedene Datenstrukturen
        const move = data?.absolute?.MOVE ?? data?.MOVE ?? data?.move ?? 0
        const retrieve = data?.absolute?.RETRIEVE ?? data?.RETRIEVE ?? data?.retrieve ?? 0
        const deliver = data?.absolute?.DELIVER ?? data?.DELIVER ?? data?.deliver ?? 0
        
        return {
          label: robot,
          backgroundColor: colors[idx % colors.length],
          data: [
            typeof move === 'number' ? move : 0,
            typeof retrieve === 'number' ? retrieve : 0,
            typeof deliver === 'number' ? deliver : 0,
          ] as number[]
        }
      }).filter(dataset => dataset.data.some(val => val > 0)) // Entferne leere Datasets
    
      return {
        labels,
        datasets
      }
    })

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' as const },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
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
</style>
    