// TEMPLATE --------------------------------------------------------------------
<template>
  <div id="app">
    <div id="startMenuView" v-if="!socket && !gameReport">
      <startMenu></startMenu>
    </div>
    <!-- referee view -->
    <RefereeApp v-else-if="refereeView && socket"></RefereeApp>
    <!-- spectator view -->
    <div id="spectatorView" v-else>
      <div id="outerWrapper">
        <div id="innerWrapper">
          <TopBar />
          <PlayingField />
        </div>
      </div>
    </div>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { useSocketStore } from '@/store/socketStore'
import { useViewStore } from '@/store/viewStore'
import TopBar from '@/components/spectator/TopBar.vue'
import PlayingField from '@/components/spectator/PlayingField.vue'
import { storeToRefs } from 'pinia'
import startMenu from '@/components/start-menu/StartMenu.vue'
import { useReportStore } from '@/store/reportStore'
import RefereeApp from '@/components/referee/RefereeApp.vue'

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
  background-color: global.$bgColorDarker;
  overflow: hidden;

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
      max-width: 100vw;
      max-height: 100vh;
      overflow: hidden;

      #innerWrapper {
        border-radius: 5px;
      }
    }
  }
}
</style>
