// TEMPLATE --------------------------------------------------------------------
<template>
  <div id="app">
    <StartMenu v-if="!socket && !gameReport" />
    <RefereeApp v-else-if="refereeView && socket" />
    <SpectatorApp v-else />
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { useSocketStore } from '@/store/socketStore'
import { useViewStore } from '@/store/viewStore'
import { storeToRefs } from 'pinia'
import StartMenu from '@/components/start-menu/StartMenu.vue'
import { useReportStore } from '@/store/reportStore'
import RefereeApp from '@/components/referee/RefereeApp.vue'
import SpectatorApp from './components/spectator/SpectatorApp.vue'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const reportStore = useReportStore()
const { gameReport } = storeToRefs(reportStore)
const socketStore = useSocketStore()
const { socket } = storeToRefs(socketStore)
const viewStore = useViewStore()
const { refereeView } = storeToRefs(viewStore)
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

#app {
  background-color: global.$bgColor;
  overflow: hidden;
}
</style>
