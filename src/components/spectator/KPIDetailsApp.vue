<template>
  <v-app>
    <div id="kpiDetailsView">
      <!-- HEADER -->
      <div class="details-header">
        <h1>KPI Details</h1>

        <PillButton
          description="Back"
          title="Zurück zur Analyze-Ansicht"
          @click="goBack"
        >
          <font-awesome-icon icon="fa-arrow-left" />
        </PillButton>
      </div>

      <!-- LOADING STATE -->
      <div v-if="loadingKPIs" class="loading">
        <font-awesome-icon icon="fa-spinner" spin />
        <p>KPIs werden geladen...</p>
      </div>

      <!-- DATA LOADED -->
      <div class="details-content" v-else-if="kpiData">
        <h2 class="game-id">Game ID: {{ kpiData.game_id || "N/A" }}</h2>

        <!-- KPI HEADER CARDS -->
        <v-container fluid class="kpi-cards-container">
          <v-row dense>
            <v-col cols="12" md="3" v-for="(kpi, i) in headerKpis" :key="i">
              <div class="kpi-card-wrapper">

                <!-- KPI CARD -->
                <KpiCard 
                  :title="kpi.title" 
                  :value="kpi.value" 
                  :icon="kpi.icon" 
                  :average="kpi.average"
                  :isPositive="kpi.isPositive !== undefined ? kpi.isPositive : (kpi.comparison !== null && parseFloat(kpi.comparison) >= 0)"
                />

                <!-- COMPARISON BADGE -->
                <div
                  v-if="kpi.comparison !== null"
                  class="comparison-badge"
                  :class="{
                    positive: kpi.isPositive !== undefined ? kpi.isPositive : (parseFloat(kpi.comparison) >= 0),
                    negative: kpi.isPositive !== undefined ? !kpi.isPositive : (parseFloat(kpi.comparison) < 0)
                  }"
                >
                  <font-awesome-icon
                    :icon="parseFloat(kpi.comparison) >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'"
                  />
                  {{ kpi.comparison }}% vs. Ø
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>

        <!-- KPI SECTIONS -->
        <div class="kpi-sections">

          <!-- ROBOTS SECTION -->
          <div class="chart-section">
            <h3 class="section-title">
              <font-awesome-icon icon="fa-robot" class="section-icon" />
              Robots
            </h3>

            <v-container fluid>
              <v-row dense>
                <v-col cols="12" md="6">
                  <TaskDistributionChart :kpiData="kpiData" :averages="unwrappedAverages" />
                </v-col>
                <v-col cols="12" md="6">
                  <AvailabilityDonut :kpiData="kpiData" :averages="unwrappedAverages" />
                </v-col>
                <v-col cols="12">
                  <TaskDistributionPerRobot :kpiData="kpiData" :averages="unwrappedAverages" />
                </v-col>
                <v-col cols="12" md="6">
                  <AvailabilityBarChart :kpiData="kpiData" :averages="unwrappedAverages" />
                </v-col>
                <v-col cols="12" md="6">
                  <DistanceHistogram :kpiData="kpiData" :averages="unwrappedAverages" />
                </v-col>
              </v-row>
            </v-container>
          </div>

          <!-- ORDERS SECTION -->
          <div class="chart-section">
            <h3 class="section-title">
              <font-awesome-icon icon="fa-box" class="section-icon" />
              Orders
            </h3>

            <v-container fluid>
              <v-row dense>
                <v-col cols="12" md="6">
                  <DeliverySuccessrateChart :kpiData="kpiData" :averages="unwrappedAverages" />
                </v-col>
                <v-col cols="12" md="6">
                  <OrderEfficiencyChart :kpiData="kpiData" :averages="unwrappedAverages" />
                </v-col>
                <v-col cols="12">
                  <OrderDurationChart :kpiData="kpiData" :averages="unwrappedAverages" />
                </v-col>
                <v-col cols="12">
                  <OrderDurationTable :kpiData="kpiData" :averages="unwrappedAverages" />
                </v-col>
              </v-row>
            </v-container>
          </div>

          <!-- MACHINES SECTION -->
          <div class="chart-section">
            <h3 class="section-title">
              <font-awesome-icon icon="fa-industry" class="section-icon" />
              Machines & Stations
            </h3>

            <v-container fluid>
              <v-row dense>
                <v-col cols="12" md="6">
                  <MachineUtilizationChartByCount :kpiData="kpiData" :averages="unwrappedAverages" />
                </v-col>
                <v-col cols="12" md="6">
                  <MachineUtilizationChartByDuration :kpiData="kpiData" :averages="unwrappedAverages" />
                </v-col>
                <v-col cols="12" md="6">
                  <StationVisitChart :kpiData="kpiData" :averages="unwrappedAverages" />
                </v-col>
              </v-row>
            </v-container>
          </div>

        </div>

        <!-- JSON RAW VIEW -->
        <div class="json-section">
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-title>
                <span class="text-h6">JSON Daten anzeigen</span>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <pre class="json-box">{{ JSON.stringify(kpiData, null, 2) }}</pre>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </div>

      <!-- EMPTY STATE -->
      <div v-else class="no-data">
        <p>Kein KPI ausgewählt.</p>
        <PillButton @click="goBack">Zurück</PillButton>
      </div>
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useAppStore } from "@/store/appStore";
import { useReportStore } from "@/store/reportStore";
import { storeToRefs } from "pinia";

import PillButton from "@/components/shared/ui/PillButton.vue";
import KpiCard from "@/components/KPICard.vue";

import TaskDistributionChart from "@/components/charts/TaskDistributionChart.vue";
import TaskDistributionPerRobot from "@/components/charts/TaskDistributionPerRobot.vue";
import AvailabilityDonut from "@/components/charts/AvailabilityDonut.vue";
import AvailabilityBarChart from "@/components/charts/AvailabilityBarChart.vue";
import DistanceHistogram from "@/components/charts/DistanceHistogram.vue";

import OrderDurationChart from "@/components/charts/OrderDurationChart.vue";
import OrderDurationTable from "@/components/charts/OrderDurationTable.vue";
import DeliverySuccessrateChart from "@/components/charts/DeliverySuccessrateChart.vue";
import OrderEfficiencyChart from "@/components/charts/OrderEfficiencyChart.vue";

import MachineUtilizationChartByCount from "@/components/charts/MachineUtilizationChartByCount.vue";
import MachineUtilizationChartByDuration from "@/components/charts/MachineUtilizationChartByDuration.vue";
import StationVisitChart from "@/components/charts/StationVisitChart.vue";

const appStore = useAppStore();
const { currentView } = storeToRefs(appStore);

const reportStore = useReportStore();
const { kpiData, loadingKPIs, averages, gameReport } = storeToRefs(reportStore);

onMounted(async () => {
  if (!averages.value) {
    try {
      await reportStore.loadGlobalAverages();
    } catch (err) {
      console.warn("Durchschnittswerte konnten nicht geladen werden:", err);
    }
  }
});

function goBack() {
  if (gameReport.value) {
    currentView.value = "spectator";
  } else {
    currentView.value = "analyze";
  }
}

function compareToAverage(value: number | undefined | null, avg: number | undefined) {
  if (value === null || value === undefined || !avg || avg === 0 || isNaN(value) || isNaN(avg)) {
    return null;
  }
  const result = ((value / avg) - 1) * 100;
  if (isNaN(result) || !isFinite(result)) return null;
  return result.toFixed(1);
}

function getAverageValue(avg: any, flatKey: string | string[]): number | undefined {
  if (!avg) {
    return undefined;
  }
  
  // Wenn ein Array von möglichen Schlüsseln übergeben wird, versuche alle
  const keys = Array.isArray(flatKey) ? flatKey : [flatKey];
  
  for (const key of keys) {
    // Versuche direkten Zugriff
    let value = avg[key];
    
    // Wenn nicht gefunden, versuche case-insensitive Suche
    if (value === undefined) {
      const lowerKey = key.toLowerCase();
      const foundKey = Object.keys(avg).find(k => k.toLowerCase() === lowerKey);
      if (foundKey) {
        value = avg[foundKey];
      }
    }
    
    // Wenn immer noch nicht gefunden, versuche Teilstring-Match
    if (value === undefined) {
      const foundKey = Object.keys(avg).find(k => 
        k.toLowerCase().includes(key.toLowerCase().replace('avg_', ''))
      );
      if (foundKey) {
        value = avg[foundKey];
      }
    }
    
    if (typeof value === 'number' && !isNaN(value)) {
      return value;
    }
  }
  
  return undefined;
}

function formatAverage(value: number | undefined | null, format: 'number' | 'decimal' | 'seconds' | 'meters'): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value !== 'number' || isNaN(value)) {
    return null;
  }
  
  let result: string;
  switch (format) {
    case 'number':
      result = Math.round(value).toString();
      break;
    case 'decimal':
      result = value.toFixed(3);
      break;
    case 'seconds':
      result = `${value.toFixed(3)}s`;
      break;
    case 'meters':
      result = `${value.toFixed(3)}m`;
      break;
    default:
      result = value.toString();
  }
  
  return result;
}

// Unwrapped averages for passing to charts
const unwrappedAverages = computed(() => {
  // Stelle sicher, dass immer ein Objekt zurückgegeben wird
  return averages.value || {}
})

const headerKpis = computed(() => {
  if (!kpiData.value) return [];
  const avg = averages.value;
  
  // Calculate total station visits from machines.station_visits
  const calculateTotalStationVisits = () => {
    // Neue Struktur: machines.station_visits.sum oder machines.station_visits.total
    if (kpiData.value?.machines?.station_visits) {
      return kpiData.value.machines.station_visits.sum ?? 
             Object.values(kpiData.value.machines.station_visits.total || {}).reduce(
               (sum: number, count: any) => sum + (typeof count === 'number' ? count : 0),
               0
             );
    }
    // Alte Struktur: machines.instances
    if (kpiData.value?.machines?.instances) {
      return Object.values(kpiData.value.machines.instances).reduce(
        (sum: number, instance: any) => sum + (instance.visits || 0),
        0
      );
    }
    return 0;
  };

  return [
    {
      title: "Score",
      value: kpiData.value.performance?.score ?? 0,
      average: formatAverage(
        getAverageValue(avg, ['avg_points', 'avg_score', 'avg_performance_score']),
        'number'
      ),
      comparison: compareToAverage(
        kpiData.value.performance?.score,
        getAverageValue(avg, ['avg_points', 'avg_score', 'avg_performance_score'])
      ),
      icon: "mdi-speedometer",
    },
    {
      title: "Orders Completed",
      // Fallback: Unterstütze sowohl neue (summary.total_completed) als auch alte (counts.completed) Struktur
      value: kpiData.value.orders?.summary?.total_completed ?? 
             kpiData.value.orders?.counts?.completed ?? 0,
      average: formatAverage(
        getAverageValue(avg, [
          'avg_orders_completed', 
          'avg_completed', 
          'avg_delivery_completed',
          'avg_total_completed',
          'avg_orders_summary_total_completed'
        ]),
        'number'
      ),
      comparison: compareToAverage(
        kpiData.value.orders?.summary?.total_completed ?? kpiData.value.orders?.counts?.completed,
        getAverageValue(avg, [
          'avg_orders_completed', 
          'avg_completed', 
          'avg_delivery_completed',
          'avg_total_completed',
          'avg_orders_summary_total_completed'
        ])
      ),
      icon: "mdi-check-circle",
    },
    {
      title: "Overall Efficiency",
      value: `${(
        kpiData.value.performance?.overall_efficiency ?? 0
      ).toFixed(3)}`,
      average: formatAverage(
        getAverageValue(avg, 'avg_overall_efficiency'),
        'decimal'
      ),
      comparison: compareToAverage(
        kpiData.value.performance?.overall_efficiency,
        getAverageValue(avg, 'avg_overall_efficiency')
      ),
      icon: "mdi-speedometer",
    },
    {
      title: "Velocity",
      // Fallback: Unterstütze sowohl neue (average_velocity.mean_speed) als auch alte (fleet_velocity_mps) Struktur
      value: `${(
        kpiData.value.performance?.average_velocity?.mean_speed ?? 
        kpiData.value.performance?.fleet_velocity_mps ?? 0
      ).toFixed(3)} m/s`,
      average: formatAverage(
        getAverageValue(avg, [
          'avg_fleet_velocity_mean_speed', 
          'avg_fleet_velocity', 
          'avg_fleet_velocity_mps', 
          'avg_mean_speed'
        ]),
        'decimal'
      ),
      comparison: compareToAverage(
        kpiData.value.performance?.average_velocity?.mean_speed ?? kpiData.value.performance?.fleet_velocity_mps,
        getAverageValue(avg, [
          'avg_fleet_velocity_mean_speed', 
          'avg_fleet_velocity', 
          'avg_fleet_velocity_mps', 
          'avg_mean_speed'
        ])
      ),
      icon: "mdi-speedometer",
    },
    {
      title: "Delivery Success Rate",
      // Fallback: Neue Struktur ist bereits in Prozent (80.0), alte war als Dezimal (0.8)
      value: (() => {
        const rate = kpiData.value.performance?.delivery_success_rate ?? 0;
        // Wenn Wert < 1, ist es wahrscheinlich die alte Struktur (Dezimal), multipliziere mit 100
        return rate < 1 ? `${(rate * 100).toFixed(1)}%` : `${rate.toFixed(1)}%`;
      })(),
      average: (() => {
        const avgValue = getAverageValue(avg, [
          'avg_delivery_success_rate',
          'avg_performance_delivery_success_rate'
        ]);
        if (avgValue === undefined) return null;
        // Wenn Durchschnitt < 1, ist es als Dezimal, sonst als Prozent
        const normalized = avgValue < 1 ? avgValue * 100 : avgValue;
        return `${normalized.toFixed(1)}%`;
      })(),
      comparison: compareToAverage(
        (() => {
          const rate = kpiData.value.performance?.delivery_success_rate ?? 0;
          // Normalisiere auf Dezimal (0-1) für Vergleich
          return rate < 1 ? rate : rate / 100;
        })(),
        (() => {
          const avgValue = getAverageValue(avg, [
            'avg_delivery_success_rate',
            'avg_performance_delivery_success_rate'
          ]);
          if (avgValue === undefined) return undefined;
          // Normalisiere Durchschnitt auf Dezimal (0-1) für Vergleich
          return avgValue < 1 ? avgValue : avgValue / 100;
        })()
      ),
      icon: "mdi-check-circle-outline",
    },
    {
      title: "Machine Utilization",
      // Neue Struktur: machines.by_duration.utilization
      value: `${(
        kpiData.value.machines?.by_duration?.utilization ?? 
        kpiData.value.machines?.by_count?.utilization ?? 
        kpiData.value.machines?.utilization_rate ?? 0
      ).toFixed(3)}`,
      average: formatAverage(
        getAverageValue(avg, [
          'avg_machine_utilization', 
          'avg_utilization_rate',
          'avg_machines_utilization',
          'avg_machines_by_duration_utilization',
          'avg_machines_by_duration_utilization_rate',
          'avg_machines_by_count_utilization'
        ]),
        'decimal'
      ),
      comparison: compareToAverage(
        kpiData.value.machines?.by_duration?.utilization ?? 
        kpiData.value.machines?.by_count?.utilization ?? 
        kpiData.value.machines?.utilization_rate,
        getAverageValue(avg, [
          'avg_machine_utilization', 
          'avg_utilization_rate',
          'avg_machines_utilization',
          'avg_machines_by_duration_utilization',
          'avg_machines_by_duration_utilization_rate',
          'avg_machines_by_count_utilization'
        ])
      ),
      icon: "mdi-cog",
    },
    {
      title: "Total Distance",
      // Fallback: Unterstütze sowohl neue (distances.sum_of_distances) als auch alte (total_distance_m) Struktur
      value: `${(
        kpiData.value.robots?.distances?.sum_of_distances ?? 
        kpiData.value.robots?.total_distance_m ?? 0
      ).toFixed(3)}m`,
      average: formatAverage(
        getAverageValue(avg, ['avg_total_distance', 'avg_total_distance_m', 'avg_sum_of_distances']),
        'meters'
      ),
      comparison: compareToAverage(
        kpiData.value.robots?.distances?.sum_of_distances ?? kpiData.value.robots?.total_distance_m,
        getAverageValue(avg, ['avg_total_distance', 'avg_total_distance_m', 'avg_sum_of_distances'])
      ),
      icon: "mdi-map-marker-distance",
      isPositive: (() => {
        const currentValue = kpiData.value.robots?.distances?.sum_of_distances ?? kpiData.value.robots?.total_distance_m ?? 0;
        const avgValue = getAverageValue(avg, ['avg_total_distance', 'avg_total_distance_m', 'avg_sum_of_distances']);
        // Bei Distanz ist weniger besser, also umgekehrte Logik
        return avgValue !== undefined && currentValue < avgValue;
      })(),
    },
    {
      title: "Station Visits",
      value: calculateTotalStationVisits(),
      average: formatAverage(
        getAverageValue(avg, 'avg_station_visits'),
        'number'
      ),
      comparison: compareToAverage(
        calculateTotalStationVisits(),
        getAverageValue(avg, 'avg_station_visits')
      ),
      icon: "mdi-map-marker",
    },
  ];
});
</script>

<style scoped lang="scss">
#kpiDetailsView {
  padding: 20px;
  max-width: 100%;
}

.details-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 0;

  h1 {
    margin: 0;
    color: white;
    font-size: 2em;
  }
}

.details-content {
  color: white;

  .game-id {
    margin: 0 0 24px 0;
    font-size: 1.5em;
    font-weight: 500;
    color: white;
  }
}

.kpi-cards-container {
  padding: 0 !important;
  margin: 0 0 32px 0;

  .v-row {
    margin: 0;
  }

  .v-col {
    padding: 0 12px 16px 0;
    
    @media (max-width: 960px) {
      padding: 0 0 16px 0;
    }
  }
}

.kpi-sections {
  .v-container {
    padding: 0 !important;
    
    .v-row {
      margin: 0;
      
      .v-col {
        padding: 0 12px 16px 0;
        
        @media (max-width: 960px) {
          padding: 0 0 16px 0;
        }
      }
    }
  }
}

.kpi-card-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.comparison-badge {
  margin-top: 8px;
  padding: 6px 10px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.85em;
  align-items: center;
  display: inline-flex;
  gap: 6px;
  width: fit-content;

  &.positive {
    background: rgba(76, 175, 80, 0.2);
    color: #4caf50;
  }

  &.negative {
    background: rgba(244, 67, 54, 0.2);
    color: #f44336;
  }
}

.kpi-sections {
  margin-top: 32px;
}

.chart-section {
  margin-bottom: 48px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  margin: 0 0 24px 0;
  padding: 0;
  font-size: 1.5em;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
}

.section-icon {
  color: #42a5f5;
}

.json-section {
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.json-box {
  color: #ddd;
  background: rgba(255, 255, 255, 0.05);
  padding: 12px;
  border-radius: 8px;
  font-size: 0.9em;
  overflow: auto;
}

.kpi-chart-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
}

.loading,
.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 2em;
  color: white;

  p {
    margin: 0;
    font-size: 1.2em;
  }
}
</style>
