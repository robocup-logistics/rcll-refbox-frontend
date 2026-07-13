// TEMPLATE --------------------------------------------------------------------
<template>
  <div id="analyzeView">
    <div class="analyze-header">
      <h1>Game List</h1>
      <PillButton
        description="Back"
        title="Zurück zur Spectator-Ansicht"
        @click="goBack"
      >
        <font-awesome-icon icon="fa-arrow-left" />
      </PillButton>
    </div>
    <div class="analyze-content">

      <div v-if="loadingKPIs || loadingAverages" class="loading">
        <font-awesome-icon icon="fa-spinner" spin />
        <p>KPIs werden geladen...</p>
      </div>
      

      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
        <PillButton @click="loadKPIs">
          <font-awesome-icon icon="fa-refresh" />
          Erneut versuchen
        </PillButton>
      </div>
      
      <!-- Data Display -->
      <div v-else-if="allKPIs.length > 0" class="kpi-list">
        <h2>Anzahl geladener KPIs: {{ allKPIs.length }}</h2>
        
        <!-- Tabelle für KPIs -->
        <div class="table-wrapper">
          <table class="kpi-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Game ID</th>
                <th>Points</th>
                <th>Duration</th>
                <th>Completed Orders</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>

              <tr v-if="averages" class="average-row">
                <td></td>
                <td><strong>Ø Durchschnitt</strong></td>
                <td>
                  <strong>{{ formatAverageValue(avgPoints) }}</strong>
                </td>
                <td>
                  <strong>{{ formatAverageValue(avgDuration, 'seconds') }}</strong>
                </td>
                <td>
                  <strong>{{ formatAverageValue(avgCompletedOrders) }}</strong>
                </td>
                <td></td>
              </tr>

              <tr v-for="(kpi, index) in sortedKPIs" :key="kpi.game_id || index">
                <td class="rank-cell">{{ index + 1 }}</td>
                <td>{{ kpi.game_id || 'N/A' }}</td>
                <td>
                  <span>{{ getPoints(kpi) }}</span>
                  <span v-if="getPointsDeviation(kpi) !== null" :class="getDeviationClass(getPointsDeviation(kpi))">
                    ({{ getPointsDeviation(kpi) }}%)
                  </span>
                </td>
                <td>
                  <span>{{ getDuration(kpi) }}</span>
                  <span v-if="getDurationDeviation(kpi) !== null" :class="getDeviationClass(getDurationDeviation(kpi), true)">
                    ({{ getDurationDeviation(kpi) }}%)
                  </span>
                </td>
                <td>
                  <span>{{ getCompletedOrders(kpi) }}</span>
                  <span v-if="getCompletedOrdersDeviation(kpi) !== null" :class="getDeviationClass(getCompletedOrdersDeviation(kpi))">
                    ({{ getCompletedOrdersDeviation(kpi) }}%)
                  </span>
                </td>
                <td>
                  <button @click="showDetails(kpi)" class="details-btn">
                    Anzeigen
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div v-else class="no-data">
        <p>Keine KPIs verfügbar.</p>
      </div>
    </div>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
import { useAppStore } from '@/store/appStore'
import { useReportStore } from '@/store/reportStore'
import { storeToRefs } from 'pinia'
import { ref, onMounted, computed } from 'vue'
import PillButton from '@/components/shared/ui/PillButton.vue'

const appStore = useAppStore()
const { currentView } = storeToRefs(appStore)

const reportStore = useReportStore()
const { loadingKPIs, averages } = storeToRefs(reportStore)

const allKPIs = ref<any[]>([])
const error = ref<string | null>(null)
const loadingAverages = ref(false)

function getAverageValue(avg: any, flatKey: string | string[]): number | undefined {
  if (!avg) {
    return undefined
  }
  
  const keys = Array.isArray(flatKey) ? flatKey : [flatKey]
  
  for (const key of keys) {
    const value = avg[key]
    if (typeof value === 'number' && !isNaN(value)) {
      return value
    }
  }
  
  return undefined
}

function compareToAverage(value: number, avg: number | undefined): number | null {
  if (!avg || avg === 0 || typeof value !== 'number' || isNaN(value)) return null
  return Number((((value / avg) - 1) * 100).toFixed(1))
}

function formatAverageValue(value: number | undefined, format: 'number' | 'seconds' = 'number'): string {
  if (value === undefined || value === null || isNaN(value)) return 'N/A'
  
  if (format === 'seconds') {
    return `${value.toFixed(2)}s`
  }
  
  return Math.round(value).toString()
}

const avgPoints = computed(() => {
  return getAverageValue(averages.value, ['avg_score', 'avg_points', 'avg_delivery_points', 'avg_performance_points'])
})

const avgDuration = computed(() => {
  return getAverageValue(averages.value, [
    'avg_performance_total_duration_seconds', 
    'avg_total_duration_seconds', 
    'avg_total_duration', 
    'avg_duration_total_seconds', 
    'avg_game_duration', 
    'avg_duration',
    'avg_order_duration' 
  ])
})

const avgCompletedOrders = computed(() => {
  return getAverageValue(averages.value, ['avg_orders_completed', 'avg_completed', 'avg_delivery_completed'])
})

const sortedKPIs = computed(() => {
  const kpis = [...allKPIs.value]
  return kpis.sort((a, b) => {
    const pointsA = a?.performance?.score ?? 0
    const pointsB = b?.performance?.score ?? 0
    return pointsB - pointsA
  })
})

function getPoints(kpi: any): string {
  const points = kpi?.performance?.score
  return points !== undefined && points !== null ? points.toString() : 'N/A'
}

function getPointsDeviation(kpi: any): number | null {
  const points = kpi?.performance?.score
  if (points === undefined || points === null) return null
  return compareToAverage(points, avgPoints.value)
}

function getDuration(kpi: any): string {
  const duration = kpi?.performance?.total_duration_seconds
  if (duration === undefined || duration === null) return 'N/A'
  return `${duration.toFixed(2)}s`
}

function getDurationDeviation(kpi: any): number | null {
  const duration = kpi?.performance?.total_duration_seconds
  if (duration === undefined || duration === null) return null

  const deviation = compareToAverage(duration, avgDuration.value)
  return deviation !== null ? -deviation : null
}

function getCompletedOrders(kpi: any): string {
  const completed = kpi?.orders?.summary?.total_completed
  return completed !== undefined && completed !== null ? completed.toString() : 'N/A'
}

function getCompletedOrdersDeviation(kpi: any): number | null {
  const completed = kpi?.orders?.summary?.total_completed
  if (completed === undefined || completed === null) return null
  return compareToAverage(completed, avgCompletedOrders.value)
}

function getDeviationClass(deviation: number | null, reversed: boolean = false): string {
  if (deviation === null) return ''
  
  if (reversed) {
    return deviation > 0 ? 'deviation-positive' : deviation < 0 ? 'deviation-negative' : ''
  }
  
  return deviation > 0 ? 'deviation-positive' : deviation < 0 ? 'deviation-negative' : ''
}

async function loadKPIs() {
  error.value = null
  try {
    const result = await reportStore.getAllKPIs()
    
    if (result && result.kpis && Array.isArray(result.kpis)) {
      allKPIs.value = result.kpis  // ← Extrahiere das kpis Array!
    } else if (Array.isArray(result)) {
      allKPIs.value = result
    } else {
      allKPIs.value = [result]
    }
    
    loadingAverages.value = true
    try {
      await reportStore.loadGlobalAverages()
    } catch (avgError) {
    } finally {
      loadingAverages.value = false
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Fehler beim Laden der KPIs'
    loadingAverages.value = false
  }
}

function goBack() {
  currentView.value = 'spectator'
}

function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleString('de-DE')
  } catch {
    return 'Ungültiges Datum'
  }
}

async function showDetails(kpi: any) {
  try {
    
    await reportStore.getKPIs(kpi.game_id)
    
    try {
      await reportStore.loadGlobalAverages()
    } catch (avgError) {
      console.warn('konnte durchschnitte nicht laden (optional):', avgError)
    }
    
    appStore.currentView = 'kpi-details'
  } catch (err) {
    console.error('fehler beim laden der kpi details', err)
    const errorMessage = err instanceof Error ? err.message : 'Unbekannter Fehler'
    console.error('fehler-details:', {
      message: errorMessage,
      gameId: kpi?.game_id,
      error: err
    })
    alert(`fehler beim laden der kpi details:\n\n${errorMessage}\n\nbitte prüfe die browser-konsole für weitere details`)
  }
}

onMounted(() => {
  loadKPIs()
})
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

#analyzeView {
  height: 100vh;
  width: 100vw;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: auto;

  .analyze-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding-bottom: 20px;
    border-bottom: 2px solid rgba(255, 255, 255, 0.1);

    h1 {
      margin: 0;
      color: white;
      font-size: 2em;
    }
  }

  .analyze-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
    color: white;
  }

  .loading,
  .error,
  .no-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 2em;
    
    p {
      margin: 0;
      font-size: 1.2em;
    }
  }

  .error {
    color: #ff6b6b;
  }

  .kpi-list {
    h2 {
      margin-bottom: 20px;
      color: white;
    }
  }

  .table-wrapper {
    overflow-x: auto;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
  }

  .kpi-table {
    width: 100%;
    min-width: 600px;
    border-collapse: collapse;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    overflow: hidden;

    thead {
      background: rgba(255, 255, 255, 0.08);
      
      th {
        padding: 12px 16px;
        text-align: left;
        color: #b0bec5;
        font-weight: 500;
        font-size: 0.95em;
        border-bottom: 2px solid rgba(255, 255, 255, 0.15);
      }
    }

    tbody {
      .average-row {
        background: rgba(255, 255, 255, 0.03);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        
        td {
          padding: 12px 16px;
          color: #9e9e9e;
          font-weight: 400;
          font-size: 0.9em;
        }
      }

      tr {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        transition: background 0.2s;

        &:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        &:last-child {
          border-bottom: none;
        }
      }

      td {
        padding: 12px 16px;
        color: #b0bec5;
        font-size: 0.95em;
        
        &.rank-cell {
          text-align: center;
          font-weight: 400;
          color: #9e9e9e;
          width: 50px;
          font-size: 0.9em;
        }
        
        .deviation-positive {
          color: #66bb6a;
          font-size: 0.85em;
          margin-left: 6px;
          opacity: 0.9;
        }
        
        .deviation-negative {
          color: #ef5350;
          font-size: 0.85em;
          margin-left: 6px;
          opacity: 0.9;
        }
      }
    }
  }

  .details-btn {
    padding: 6px 12px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    color: white;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9em;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.3);
    }

    &:active {
      transform: scale(0.98);
    }
  }
}
</style>