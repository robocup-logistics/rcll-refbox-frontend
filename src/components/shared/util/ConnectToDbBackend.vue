// TEMPLATE --------------------------------------------------------------------
<template>
  <p>Connect to the MongoDB backend</p>
  <div class="horizontal-flex" style="align-items: stretch">
    <Input
      ref="backendUrlInput"
      type="url"
      :value="backendUrl"
      @input="(newUrl) => (backendUrl = newUrl)"
      :placeholder="DEFAULT_BACKEND_URL"
    />
    <Button
      icon="fa-paper-plane"
      primary
      @click="requestGameReportsList"
      :loading="loadingReportsList"
      >Connect</Button
    >
  </div>
  <template class="report-selection" v-if="gameReportsList?.length">
    <p>Select a game report:</p>
    <Input
      :value="filter"
      @input="(newFilter) => (filter = newFilter)"
      placeholder="filter"
      style="position: sticky; top: 0"
    />
    <div
      v-if="filteredGameReportsList.length"
      v-for="reportItem in filteredGameReportsList"
      class="report-item clickable"
      @click="selectGameReport(reportItem._id)"
    >
      <p>
        {{
          reportItem['report-name'].length
            ? reportItem['report-name'].length
            : 'Unnamed game'
        }}
      </p>
      <p>{{ new Date(reportItem['start-time']).toLocaleString() }}</p>
      <p v-if="reportItem['end-time']">
        Duration:
        {{
          formatTime(
            (new Date(reportItem['end-time']).getTime() -
              new Date(reportItem['start-time']).getTime()) /
              1000,
            true
          )
        }}
        minutes
      </p>
      <p v-else>Not ended</p>
    </div>
    <template v-else>
      <p v-if="filter">No game reports matching your filter</p>
      <p v-else>DB does not contain any game reports</p>
    </template>
  </template>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import {
  ref,
  onMounted,
  nextTick,
  type Ref,
  type ComputedRef,
  watch,
  computed,
} from 'vue'
import { storeToRefs } from 'pinia'
import { useReportStore } from '@/store/reportStore'
import Button from '@/components/shared/ui/Button.vue'
import Input from '@/components/shared/ui/Input.vue'
import formatTime from '@/utils/formatTime'
import GameReport from '@/types/GameReport'

// define emits  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const emit = defineEmits<{
  (e: 'connected'): void
}>()

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const reportStore = useReportStore()
const {
  DEFAULT_BACKEND_URL,
  loadingReportsList,
  loadingReport,
  gameReportsList,
  gameReport,
} = storeToRefs(reportStore)

// request reports list  - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const backendUrl: Ref<string> = ref(DEFAULT_BACKEND_URL.value)
async function requestGameReportsList() {
  void reportStore.requestGameReportsList(backendUrl.value)
}

// select report - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const filter: Ref<string> = ref('')
const filteredGameReportsList: ComputedRef<GameReport[]> = computed(() => {
  return gameReportsList.value.filter((report) =>
    report['report-name'].includes(filter.value)
  )
})
async function selectGameReport(reportId: string) {
  void reportStore.requestGameReport(backendUrl.value, reportId)
}

// focus backend url input on open - - - - - - - - - - - - - - - - - - - - - - -
const backendUrlInput: Ref<HTMLInputElement | null> = ref(null)
onMounted(() => {
  nextTick(() => {
    if (backendUrlInput.value) backendUrlInput.value.focus()
  })
})

// emit event to close the popup when game report was selected - - - - - - - - -
watch(gameReport, (newReport, oldReport) => {
  if (newReport && (!oldReport || oldReport != newReport)) {
    emit('connected')
  }
})
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
.report-item {
  padding: 10px;
  border-radius: 5px;
  background-color: black;
}
</style>
