// TEMPLATE --------------------------------------------------------------------
<template>
  <div id="spectatorView">
    <div id="outerWrapper">
      <div id="innerWrapper">
        <TopBar />
        <PlayingField />
      </div>
    </div>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import TopBar from '@/components/spectator/TopBar.vue'
import PlayingField from '@/components/spectator/PlayingField.vue'
import { storeToRefs } from 'pinia'
import { useReportStore } from '@/store/reportStore'
import ReportOptionsBar from '@/components/spectator/ReportOptionsBar.vue'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const reportStore = useReportStore()
const { gameReport } = storeToRefs(reportStore)
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

#spectatorView {
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;

  #outerWrapper {
    display: flex;
    justify-content: center;
    flex-direction: row;
    gap: 10px;
    max-width: 100vw;
    max-height: 100vh;
    overflow: hidden;

    #innerWrapper {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  }
}
</style>
