// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup title="KPI" icon="fa-gauge" custom-class="kpi-popup">
    <div v-if="loadingKPIs" class="loading">
      <font-awesome-icon icon="fa-spinner" spin />
      <p>KPIs werden geladen...</p>
    </div>
    <div v-else-if="!kpiData" class="no-data">
      <p>Keine KPI-Daten verfügbar. Bitte zuerst KPIs generieren.</p>
    </div>
    <div v-else>
      <TabGroup :tabs="tabs" v-model:active="activeTab" class="sticky">
        <template #[tab] v-for="(tab, i) in tabs">
          <div class="horizontal-flex">
            <font-awesome-icon :icon="tabIcons[i]" />
            <p>{{ tab }}</p>
          </div>
        </template>
      </TabGroup>
      <template v-if="activeTab == 'KPIs'">
        <div class="kpi-content">
          <div
            v-for="(value, key) in kpiData"
            :key="key"
            class="kpi-item content-box"
          >
            <h3>{{ formatKey(String(key)) }}</h3>
            <div v-if="typeof value === 'object' && value !== null">
              <div
                v-for="(subValue, subKey) in value"
                :key="subKey"
                class="kpi-sub-item"
              >
                <strong>{{ formatKey(String(subKey)) }}:</strong>
                <span v-if="typeof subValue === 'object' && subValue !== null">
                  <pre>{{ JSON.stringify(subValue, null, 2) }}</pre>
                </span>
                <span v-else>{{ subValue }}</span>
              </div>
            </div>
            <div v-else class="kpi-value">{{ value }}</div>
          </div>
        </div>
      </template>
      <template v-else-if="activeTab == 'Raw Data'">
        <div class="raw-data content-box">
          <pre>{{ JSON.stringify(kpiData, null, 2) }}</pre>
        </div>
      </template>
    </div>
  </Popup>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
import Popup from '@/components/shared/ui/Popup.vue'
import TabGroup from '@/components/shared/ui/TabGroup.vue'
import { type Ref, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useReportStore } from '@/store/reportStore'

const reportStore = useReportStore()
const { kpiData, loadingKPIs } = storeToRefs(reportStore)

const tabs: string[] = ['KPIs', 'Raw Data']
const tabIcons: string[] = ['fa-gauge', 'fa-code']
const activeTab: Ref<string> = ref('KPIs')

function formatKey(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

.kpi-popup {
  min-width: 800px !important;
  max-width: 80vw !important;
  max-height: 80vh !important;
  width: auto !important;
  transform: translateX(-20%) !important;
}


.loading,
.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2em;
  gap: 1em;
  
  p {
    margin: 0;
  }
}

.kpi-content {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.kpi-item {
  h3 {
    margin-top: 0;
    margin-bottom: 0.5em;
    color: white;
  }
}

.kpi-sub-item {
  display: flex;
  flex-direction: column;
  gap: 0.25em;
  margin-bottom: 0.5em;
  
  strong {
    color: white;
  }
  
  pre {
    margin: 0.5em 0;
    padding: 0.5em;
    background-color: global.$bgColor;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 0.9em;
  }
}

.kpi-value {
  font-size: 1.1em;
  color: white;
}

.raw-data {
  pre {
    margin: 0;
    padding: 1em;
    background-color: global.$bgColor;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 0.85em;
    max-height: 60vh;
    overflow-y: auto;
  }
}
</style>
