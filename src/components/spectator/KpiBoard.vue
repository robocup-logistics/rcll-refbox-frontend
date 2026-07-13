// TEMPLATE --------------------------------------------------------------------
<template>
  <Accordion horizontal title="KPI" expanded-default id="kpiBoard">
    <div class="menu">
      <PillButton
        description="TF"
        title="TF"
        :class="{ invertedButton: isTransform }"
        :disabled="loadingTransformation"
        @click="handleTransformClick"
      >
        <font-awesome-icon 
          :icon="loadingTransformation ? 'fa-spinner' : 'fa-right-left'" 
          :spin="loadingTransformation"
        />
      </PillButton>
      
      <PillButton
        description="OCEL"
        title="OCEL"
        :class="{ invertedButton: isOCEL }"
        :disabled="loadingOCEL"
        @click="handleOCELClick"
      >
        <font-awesome-icon 
          :icon="loadingOCEL ? 'fa-spinner' : 'fa-database'" 
          :spin="loadingOCEL"
        />
      </PillButton>

      <PillButton
        description="CSV"
        title="CSV"
        :class="{ invertedButton: isCSV }"
        :disabled="loadingCSVs"
        @click="handleCSVClick"
      >
        <font-awesome-icon 
          :icon="loadingCSVs ? 'fa-spinner' : 'fa-calculator'" 
          :spin="loadingCSVs"
        />
      </PillButton>

      <PopupWrapper popup-position="bottom" ref="kpi-popup">
        <template #reference>
          <PillButton
            description="KPI"
            title="KPI"
            :class="{ invertedButton: isKPI }"
            :disabled="loadingKPIs"
            @click="handleKPIClick"
          >
            <font-awesome-icon 
              :icon="loadingKPIs ? 'fa-spinner' : 'fa-gauge'" 
              :spin="loadingKPIs"
            />
          </PillButton>
        </template>
        <KPIPopup />
      </PopupWrapper>

      <PillButton
        description="Current"
        title="Aktuelles Spiel analysieren"
        @click="handleGameClick"
      >
        <font-awesome-icon icon="fa-gamepad" />
      </PillButton>
      
      <PillButton
        description="List"
        title="Übersicht aller Spiele"
        @click="handleAnalyzeClick"
      >
        <font-awesome-icon icon="fa-list" />
      </PillButton>


      <PillButton
        description="Comparison"
        title="Spiele-Vergleich"
        @click="handleStatisticsClick"
      >
        <font-awesome-icon icon="fa-chart-bar" />
      </PillButton>
    </div>
  </Accordion>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { storeToRefs } from 'pinia'
import PopupWrapper from '@/components/shared/ui/PopupWrapper.vue'
import PillButton from '@/components/shared/ui/PillButton.vue'
import Accordion from '@/components/shared/ui/Accordion.vue'
import { useReportStore } from '@/store/reportStore'
import KPIPopup from '@/components/spectator/popups/KPIPopup.vue'
import { useAppStore } from '@/store/appStore'
import { ref } from 'vue'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const reportStore = useReportStore()
const { loadingOCEL, loadingCSVs, loadingKPIs, loadingTransformation, gameReport } = storeToRefs(reportStore)
const appStore = useAppStore()
const { currentView } = storeToRefs(appStore)

const isOCEL = ref(false)
const isKPI = ref(false)
const isCSV = ref(false)
const isTransform = ref(false)

async function handleOCELClick() {
  try {
    const result = await reportStore.requestOCEL()
    if (result.exists) {
      alert('OCEL wurde bereits erstellt!')
      isOCEL.value = true
    } else {
      alert('OCEL fertig!')
      isOCEL.value = true
    }
  } catch (error) {
    console.error('Fehler bei OCEL:', error)
    const errorMessage = error instanceof Error ? error.message : 'Fehler bei der OCEL Erstellung.'
    alert(errorMessage)
  }
}

async function handleCSVClick() {
  try {
    const result = await reportStore.requestCSVs()
    if (result.exists) {
      alert('CSVs wurden bereits erstellt!')
      isCSV.value = true
    } else {
      alert('CSVs fertig!')
      isCSV.value = true
    }
  } catch (error) {
    console.error('Fehler bei CSV-Erstellung:', error)
    const errorMessage = error instanceof Error ? error.message : 'Fehler bei der CSV-Erstellung.'
    alert(errorMessage)
  }
}

async function handleKPIClick() {
  try {
    const result = await reportStore.requestKPIs()
    if (result.exists) {
      alert('KPIs wurden bereits erstellt!')
      isKPI.value = true
    } else {
      isKPI.value = true
    }
  } catch (error) {
    console.error('Fehler bei KPI-Erstellung:', error)
    const errorMessage = error instanceof Error ? error.message : 'Fehler bei der KPI-Erstellung.'
    alert(errorMessage)
  }
}

function handleAnalyzeClick() {
  currentView.value = 'analyze'
}

function handleStatisticsClick() {
  currentView.value = 'statistics'
}

async function handleGameClick() {
  if (gameReport.value?._id) {
    try {
      await reportStore.getKPIs(gameReport.value._id)
      try {
        await reportStore.loadGlobalAverages()
      } catch (avgError) {
        console.warn('konnte durchschnitte nicht laden', avgError)
      }
      currentView.value = 'kpi-details'
    } catch (err) {
      console.error('fehler beim laden der kpis', err)
      const errorMessage = err instanceof Error ? err.message : 'Unbekannter Fehler'
      alert(`Fehler beim Laden der Spiel-Analyse:\n\n${errorMessage}\n\nBitte stelle sicher, dass das Spiel bereits analysiert wurde (KPI-Button klicken).`)
    }
  } else {
    alert('kein spiel geladen')
  }
}

async function handleTransformClick() {
  try {
    const result = await reportStore.requestTransformation()
    if (result.exists) {
      alert('transformation wurde bereits durchgeführt')
      isTransform.value = true
    } else {
      alert('transformation fertig')
      isTransform.value = true
    }
  } catch (error) {
    console.error('fehler bei transformation', error)
    const errorMessage = error instanceof Error ? error.message : 'fehler bei transformation'
    alert(errorMessage)
  }
}
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

#kpiBoard {
  .menu {
    width: unset;
    display: inline-grid;
    grid-template-columns: repeat(4, 50px);
    gap: 10px;
  }
}
</style>

