// TEMPLATE --------------------------------------------------------------------
<template>
  <div class="connect-to-db">
    <!-- CONNECT TO BACKEND AND RETRIEVE LIST -->
    <div class="horizontal-flex form-row">
      <Input
        ref="backendUrlInput"
        type="url"
        v-model="backendUrl"
        :placeholder="DEFAULT_BACKEND_URL"
      />
      <Button
        icon="fa-link"
        primary
        @click="requestGameReportsList"
        :loading="loadingReportsList"
        >Connect</Button
      >
    </div>
    <!-- SELECT A REPORT FROM THE LIST -->
    <template class="report-selection" v-if="gameReportsList?.length">
      <p>Select a game report:</p>
      <!-- FILTER -->
      <div class="sticky">
        <Input
          v-model="filter"
          placeholder="filter by name or teams"
          clearable
        />
      </div>

      <!-- REPORTS LIST -->
      <div
        v-if="filteredGameReportsList.length"
        v-for="reportItem in filteredGameReportsList"
        class="report-item"
      >
        <!-- -> name and select -->
        <div class="horizontal-flex">
          <h1>
            {{
              reportItem.report_name.length
                ? reportItem.report_name.length
                : 'Unnamed game'
            }}
          </h1>
          <Button
            primary
            icon="fa-arrow-right"
            @click="selectGameReport(reportItem._id)"
          >
            Select
          </Button>
        </div>

        <!-- -> time -->
        <div class="horizontal-flex">
          <div class="horizontal-flex">
            <font-awesome-icon icon="fa-clock" />
            <span>
              {{
                new Date(reportItem.start_time).toLocaleString([], {
                  year: '2-digit',
                  month: 'numeric',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              }}
            </span>
          </div>
          <div v-if="reportItem.end_time" class="horizontal-flex inline">
            <font-awesome-icon icon="fa-hourglass" />
            <span>
              {{
                formatTime(
                  (new Date(reportItem.end_time).getTime() -
                    new Date(reportItem.start_time).getTime()) /
                    1000,
                  true
                )
              }}
            </span>
          </div>
          <div v-else class="horizontal-flex inline text-warning">
            <font-awesome-icon icon="fa-triangle-exclamation" />
            <span>Aborted</span>
          </div>
        </div>

        <!-- -> scores -->
        <div class="horizontal-flex">
          <div
            :class="[
              'flex-item',
              scoreByColor('CYAN', reportItem.points) >
              scoreByColor('MAGENTA', reportItem.points)
                ? 'CYAN'
                : '',
            ]"
            style="width: fit-content; padding: 5px"
          >
            <p>{{ reportItem.teams[0] }}</p>
            <div class="horizontal-flex">
              <font-awesome-icon icon="fa-trophy" />
              <span>{{ scoreByColor('CYAN', reportItem.points) }}</span>
            </div>
          </div>
          <p>vs</p>
          <div
            :class="[
              'flex-item',
              scoreByColor('CYAN', reportItem.points) <
              scoreByColor('MAGENTA', reportItem.points)
                ? 'MAGENTA'
                : '',
            ]"
            style="width: fit-content; padding: 5px"
          >
            <p>{{ reportItem.teams[1] }}</p>
            <div class="horizontal-flex">
              <font-awesome-icon icon="fa-trophy" />
              <span>{{ scoreByColor('MAGENTA', reportItem.points) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- IF LIST IS EMPTY -->
      <template v-else>
        <p v-if="filter">No game reports matching your filter</p>
        <p v-else>DB does not contain any valid game reports</p>
      </template>
    </template>
    <!-- INCOMPATIBLE REPORTS -->
    <p v-if="incompatibleCount" class="text-warning">
      <font-awesome-icon icon="fa-warning" /> {{ incompatibleCount }} reports
      incompatible with the version of this web app have been found.
    </p>
  </div>
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
  (e: 'connected'): void
}>()

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const reportStore = useReportStore()
const {
  DEFAULT_BACKEND_URL,
  loadingReportsList,
  gameReportsList,
  incompatibleCount,
  gameReport,
  scoreByColor,
} = storeToRefs(reportStore)

// request reports list  - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const backendUrl: Ref<string> = ref(DEFAULT_BACKEND_URL.value)
async function requestGameReportsList() {
  void reportStore.requestGameReportsList(backendUrl.value)
}

// filter reports  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const filter: Ref<string> = ref('')
const filteredGameReportsList: ComputedRef<GameReport[]> = computed(() => {
  return gameReportsList.value.filter(
    (report) =>
      report.report_name.includes(filter.value) ||
      report.teams[0].includes(filter.value) ||
      report.teams[1].includes(filter.value)
  )
})
const scrollToTop = inject('scrollToTop') as Function
watch(
  () => filter.value,
  () => {
    scrollToTop()
  }
)

// select report - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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

.connect-to-db {
  /* To fix weird flex errors in start menu */
  display: grid;
  gap: 10px;
}

.report-item {
  padding: 10px;
  border-radius: 8px;
  background-color: global.$lighterColor;
  display: flex;
  flex-direction: column;
  gap: 10px;

  h1 {
    flex-grow: 1;
    font-size: 1.2rem;
    text-decoration: underline;
    text-decoration-color: global.$accentColor;
  }
}
</style>
