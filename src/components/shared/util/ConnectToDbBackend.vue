// TEMPLATE --------------------------------------------------------------------
<template>
  <p>Connect to the MongoDB backend</p>
  <div class="horizontal-flex" style="align-items: stretch">
    <Input
      ref="input"
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
  <div class="report-selection" v-if="gameReportsList?.length">
    <p>Select a game report:</p>
    <div
      v-for="reportItem in gameReportsList"
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
    </div>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { ref, onMounted, nextTick, type Ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useReportStore } from '@/store/reportStore'
import { useSocketStore } from '@/store/socketStore'
import Button from '@/components/shared/ui/Button.vue'
import Input from '@/components/shared/ui/Input.vue'

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
const socketStore = useSocketStore()

// review previous game  - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const backendUrl: Ref<string> = ref(DEFAULT_BACKEND_URL.value)
async function requestGameReportsList() {
  // then connect to db backend
  void reportStore.requestGameReportsList(backendUrl.value)

  // notify parent
  /* emit('connected') */
}

async function selectGameReport(reportId: string) {
  void reportStore.requestGameReport(backendUrl.value, reportId)
}

// focus input on open - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const input: Ref<HTMLInputElement | null> = ref(null)
onMounted(() => {
  nextTick(() => {
    if (input.value) input.value.focus()
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
.report-selection {
  display: flex;
  flex-direction: column;
  gap: 10px;
  .report-item {
    padding: 10px;
    border-radius: 5px;
    background-color: black;
  }
}
</style>
