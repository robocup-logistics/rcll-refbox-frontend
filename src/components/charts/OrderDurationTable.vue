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
      <v-data-table
        :headers="headers"
        :items="tableData"
        :items-per-page="-1"
        hide-default-footer
        class="elevation-1"
      >
        <template v-slot:item.duration="{ item }">
          {{ item.duration.toFixed(2) }}s
        </template>
        <template v-slot:item.deviation="{ item }">
          <template v-if="item.deviation !== null">
            <v-chip
              :color="getDeviationColor(item.deviation)"
              variant="flat"
              size="small"
            >
              {{ item.deviation > 0 ? '+' : '' }}{{ item.deviation.toFixed(2) }}s
            </v-chip>
          </template>
          <span v-else class="text-grey">N/A</span>
        </template>
        <template v-slot:item.ratio_to_global_mean_by_complexity="{ item }">
          <v-chip
            :color="getRatioColor(item.ratio_to_global_mean_by_complexity)"
            variant="flat"
            size="small"
          >
            {{ item.ratio_to_global_mean_by_complexity.toFixed(2) }}x
          </v-chip>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  kpiData?: any
  averages?: any
}>()

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

// Echte Daten aus kpiData extrahieren - verwende orders.by_order wie OrderDurationChart
const tableData = computed(() => {
  const data = props.kpiData
  if (!data) return []
  
  // Verwende orders.by_order wie in OrderDurationChart
  const ordersByOrder = data?.orders?.by_order
  if (!ordersByOrder || typeof ordersByOrder !== 'object') {
    console.warn('OrderDurationTable: orders.by_order nicht gefunden')
    return []
  }
  
  // Hole den globalen Durchschnitt für Abweichungsberechnung
  const globalAverage = props.averages?.avg_order_duration ?? 
                        data?.orders?.summary?.mean_duration_seconds ?? 
                        null
  
  // Transformiere das by_order Objekt in ein Array
  return Object.entries(ordersByOrder).map(([orderId, orderData]: [string, any]) => {
    const duration = orderData.duration ?? orderData.duration_seconds ?? 0
    const complexity = orderData.complexity ?? 'Unknown'
    const ratio = orderData.ratio_to_global_mean_by_complexity ?? 1.0
    
    // Berechne Abweichung vom Durchschnitt
    let deviation = null
    if (globalAverage !== null && typeof globalAverage === 'number') {
      deviation = duration - globalAverage
    }
    
    return {
      order_id: orderId,
      duration: typeof duration === 'number' ? duration : parseFloat(duration) || 0,
      complexity: String(complexity),
      ratio_to_global_mean_by_complexity: typeof ratio === 'number' ? ratio : parseFloat(ratio) || 1.0,
      deviation: deviation,
    }
  }).sort((a, b) => {
    // Sortiere nach Order ID (numerisch, falls möglich)
    const aNum = parseInt(a.order_id)
    const bNum = parseInt(b.order_id)
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return aNum - bNum
    }
    return a.order_id.localeCompare(b.order_id)
  })
})

const headers = [
  { title: 'Order ID', key: 'order_id', sortable: true },
  { title: 'Duration', key: 'duration', sortable: true },
  { title: 'Deviation', key: 'deviation', sortable: true },
  { title: 'Complexity', key: 'complexity', sortable: true },
  {
    title: 'Ratio to Global Mean',
    key: 'ratio_to_global_mean_by_complexity',
    sortable: true,
  },
]

function getRatioColor(ratio: number): string {
  if (ratio < 0.8) return 'success'
  if (ratio < 1.2) return 'info'
  return 'warning'
}

function getDeviationColor(deviation: number | null): string {
  if (deviation === null) return 'default'
  if (deviation < 0) return 'success' // Negativ = schneller als Durchschnitt
  if (deviation > 0) return 'warning' // Positiv = langsamer als Durchschnitt
  return 'info' // Genau Durchschnitt
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

