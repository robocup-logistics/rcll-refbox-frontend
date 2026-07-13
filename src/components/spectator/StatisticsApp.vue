<template>
  <v-app>
    <div id="gameComparisonView">
      <div class="statistics-header">
        <h1>Game Comparison Dashboard</h1>

        <PillButton
          description="Back"
          title="Zurück zur Spectator-Ansicht"
          @click="goBack"
        >
          <font-awesome-icon icon="fa-arrow-left" />
        </PillButton>
      </div>

      <div v-if="loading" class="loading">
        <font-awesome-icon icon="fa-spinner" spin />
        <p>Daten werden geladen...</p>
      </div>

      <div v-else class="statistics-content">

        <div class="chart-section">
          <h3 class="section-title">Performance</h3>
          <v-container fluid>
            <v-row>
              <v-col cols="12" md="6">
                <GameScoreDistribution :kpis="games" />
              </v-col>
              <v-col cols="12" md="6">
                <ComparisonEfficiencyChart :kpis="games" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <ComparisonVelocityChart :kpis="games" />
              </v-col>
              <v-col cols="12" md="6">
                <ComparisonSuccessRateDistributionChart :kpis="games" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <ComparisonEfficiencyVsUtilizationChart :kpis="games" />
              </v-col>
              <v-col cols="12" md="6">
                <ComparisonVelocityVsPoints :kpis="games" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <ComparisonSuccessRateVsPoints :kpis="games" />
              </v-col>
            </v-row>
          </v-container>
        </div>

        <div class="chart-section">
          <h3 class="section-title">Orders</h3>
          <v-container fluid>
            <v-row>
              <v-col cols="12" md="6">
                <ComparisonOrderDurationChart :kpis="games" />
              </v-col>
              <v-col cols="12" md="6">
                <ComparisonOrderDurationByComplexityChart :kpis="games" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <ComparisonSuccessRateChart :kpis="games" />
              </v-col>
              <v-col cols="12" md="6">
                <ComparisonOrdersDeliveredVsPoints :kpis="games" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <ComparisonMeanDurationRatioVsPoints :kpis="games" />
              </v-col>
            </v-row>
          </v-container>
        </div>

        <div class="chart-section">
          <h3 class="section-title">Machines</h3>
          <v-container fluid>
            <v-row>
              <v-col cols="12" md="6">
                <ComparisonMachineUtilizationByCountChart :kpis="games" />
              </v-col>
              <v-col cols="12" md="6">
                <ComparisonMachineUtilizationByDurationChart :kpis="games" />
              </v-col>
              <v-col cols="12">
                <ComparisonStationVisitsChart :kpis="games" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <ComparisonUtilizationVsPoints :kpis="games" />
              </v-col>
              <v-col cols="12" md="6">
                <ComparisonStationVisitsVsPoints :kpis="games" />
              </v-col>
            </v-row>
          </v-container>
        </div>

        <div class="chart-section">
          <h3 class="section-title">Robots</h3>
          <v-container fluid>
            <v-row>
              <v-col cols="12" md="6">
                <ComparisonMoveRatioChart :kpis="games" />
              </v-col>
              <v-col cols="12" md="6">
                <ComparisonDistanceVsPoints :kpis="games" />
              </v-col>
              <v-col cols="12">
                <ComparisonDistanceChart :kpis="games" />
              </v-col>
            </v-row>
          </v-container>
        </div>

      </div>
    </div>
  </v-app>
</template>


<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useAppStore } from "@/store/appStore"
import { useReportStore } from "@/store/reportStore"
import PillButton from "@/components/shared/ui/PillButton.vue"

import ComparisonEfficiencyChart from "@/components/charts/ComparisonEfficiencyChart.vue"
import ComparisonSuccessRateChart from "@/components/charts/ComparisonSuccessRateChart.vue"
import ComparisonSuccessRateDistributionChart from "@/components/charts/ComparisonSuccessRateDistributionChart.vue"
import ComparisonSuccessRateVsPoints from "@/components/charts/ComparisonSuccessRateVsPoints.vue"
import GameScoreDistribution from "@/components/charts/GameScoreDistribution.vue"
import ComparisonDistanceChart from "@/components/charts/ComparisonDistanceChart.vue"
import ComparisonMachineUtilizationByCountChart from "@/components/charts/ComparisonMachineUtilizationByCountChart.vue"
import ComparisonMachineUtilizationByDurationChart from "@/components/charts/ComparisonMachineUtilizationByDurationChart.vue"
import ComparisonStationVisitsChart from "@/components/charts/ComparisonStationVisitsChart.vue"
import ComparisonOrderDurationChart from "@/components/charts/ComparisonOrderDurationChart.vue"
import ComparisonOrderDurationByComplexityChart from "@/components/charts/ComparisonOrderDurationByComplexityChart.vue"
import ComparisonMoveRatioChart from "@/components/charts/ComparisonMoveRatioChart.vue"
import ComparisonVelocityChart from "@/components/charts/ComparisonVelocityChart.vue"
import ComparisonVelocityVsPoints from "@/components/charts/ComparisonVelocityVsPoints.vue"
import ComparisonEfficiencyVsUtilizationChart from "@/components/charts/ComparisonEfficiencyVsUtilizationChart.vue"
import ComparisonOrdersDeliveredVsPoints from "@/components/charts/ComparisonOrdersDeliveredVsPoints.vue"
import ComparisonStationVisitsVsPoints from "@/components/charts/ComparisonStationVisitsVsPoints.vue"
import ComparisonDistanceVsPoints from "@/components/charts/ComparisonDistanceVsPoints.vue"
import ComparisonUtilizationVsPoints from "@/components/charts/ComparisonUtilizationVsPoints.vue"
import ComparisonMeanDurationRatioVsPoints from "@/components/charts/ComparisonMeanDurationRatioVsPoints.vue"

const appStore = useAppStore()
const reportStore = useReportStore()
const games = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    loading.value = true
    const result = await reportStore.getAllKPIs()
    
    if (result && result.kpis && Array.isArray(result.kpis)) {
      games.value = result.kpis
    } else if (Array.isArray(result)) {
      games.value = result
    } else {
      games.value = [result]
    }
      } catch (err) {
    console.error("fehler beim laden aller kpis", err)
  } finally {
    loading.value = false
  }
})

function goBack() {
  appStore.currentView = "spectator"
}
</script>


<style scoped lang="scss">
@use "@/assets/global.scss";

#gameComparisonView {
  padding: 20px;
  height: 100vh;
  width: 100vw;
  overflow-y: auto;
  color: white;

  .statistics-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 15px;

    h1 {
      margin: 0;
      font-size: 2em;
      color: white;
    }
  }

  .welcome-message {
    margin-top: 20px;
    margin-bottom: 40px;
    text-align: center;

    h2 {
      font-size: 1.6em;
    }

    p {
      color: #ccc;
    }
  }

  .chart-section {
    margin-bottom: 40px;

    .section-title {
      font-size: 1.4em;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid rgba(255, 255, 255, 0.1);
    }
  }

  .loading {
    text-align: center;
    padding-top: 50px;
  }
}
</style>
