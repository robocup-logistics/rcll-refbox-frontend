// TEMPLATE --------------------------------------------------------------------
<template>
  <p>Connect to a game report provider</p>
  <div class="horizontal-flex form-row">
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
    <div class="filter">
      <Input
        :value="filter"
        @input="(newFilter) => applyFilter(newFilter)"
        placeholder="filter by name or teams"
      />
    </div>

    <div
      v-if="filteredGameReportsList.length"
      v-for="reportItem in filteredGameReportsList"
      class="report-item"
    >
      <div class="horizontal-flex">
        <h2 style="flex-grow: 1">
          {{
            reportItem['report_name'].length
              ? reportItem['report_name'].length
              : 'Unnamed game'
          }}
        </h2>
        <Button
          primary
          icon="fa-arrow-right"
          @click="selectGameReport(reportItem._id)"
        >
          Select
        </Button>
      </div>

      <div>
        <span>
          {{
            new Date(reportItem['start_time']).toLocaleString([], {
              year: '2-digit',
              month: 'numeric',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          }}
        </span>
        <span v-if="reportItem['end_time']">
          for
          {{
            formatTime(
              (new Date(reportItem['end_time']).getTime() -
                new Date(reportItem['start_time']).getTime()) /
                1000,
              true
            )
          }}
          minutes
        </span>
        <span v-else> - aborted</span>
      </div>
      <div class="horizontal-flex">
        <div
          :class="[
            'item',
            pointsByTeam('CYAN', reportItem.points) >
            pointsByTeam('MAGENTA', reportItem.points)
              ? 'CYAN'
              : '',
          ]"
          style="width: fit-content; padding: 5px"
        >
          <p>{{ reportItem['teams'][0] }}</p>
          <div class="horizontal-flex">
            <font-awesome-icon icon="fa-trophy" />
            <span>{{ pointsByTeam('CYAN', reportItem.points) }}</span>
          </div>
        </div>
        <p>vs</p>
        <div
          :class="[
            'item',
            pointsByTeam('CYAN', reportItem.points) <
            pointsByTeam('MAGENTA', reportItem.points)
              ? 'MAGENTA'
              : '',
          ]"
          style="width: fit-content; padding: 5px"
        >
          <p>{{ reportItem['teams'][1] }}</p>
          <div class="horizontal-flex">
            <font-awesome-icon icon="fa-trophy" />
            <span>{{ pointsByTeam('MAGENTA', reportItem.points) }}</span>
          </div>
        </div>
      </div>
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
  inject,
} from 'vue'
import { storeToRefs } from 'pinia'
import { useReportStore } from '@/store/reportStore'
import Button from '@/components/shared/ui/Button.vue'
import Input from '@/components/shared/ui/Input.vue'
import formatTime from '@/utils/formatTime'
import GameReport from '@/types/GameReport'

// define emits  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const emit = defineEmits<{
  (e: 'scrollToTop'): void
  (e: 'connected'): void
}>()

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const reportStore = useReportStore()
const {
  DEFAULT_BACKEND_URL,
  loadingReportsList,
  gameReportsList,
  gameReport,
  pointsByTeam,
} = storeToRefs(reportStore)

// request reports list  - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const backendUrl: Ref<string> = ref(DEFAULT_BACKEND_URL.value)
async function requestGameReportsList() {
  void reportStore.requestGameReportsList(backendUrl.value)
}

// select report - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const filter: Ref<string> = ref('')
const filteredGameReportsList: ComputedRef<GameReport[]> = computed(() => {
  return gameReportsList.value.filter(
    (report) =>
      report['report_name'].includes(filter.value) ||
      report['teams'][0].includes(filter.value) ||
      report['teams'][1].includes(filter.value)
  )
})
const scrollToTop = inject('scrollToTop') as Function
function applyFilter(newFilter: string) {
  filter.value = newFilter
  scrollToTop()
}
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
watch(
  () => gameReport.value,
  (newReport, oldReport) => {
    if (newReport && (!oldReport || oldReport != newReport)) {
      emit('connected')
    }
  }
)
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

.filter {
  position: sticky;
  top: 0;
  z-index: 2;
  background-color: global.$bgColor;
  padding-bottom: 5px;
}
.report-item {
  padding: 10px;
  border-radius: 5px;
  background-color: global.$itemColor;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
