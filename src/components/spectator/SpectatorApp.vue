// TEMPLATE --------------------------------------------------------------------
<template>
  <div id="spectatorView">
    <div id="topBar">
      <ScoreBoard />
      <GameInfoBoard />
      <OrdersBoard v-if="['PRODUCTION', 'POST_GAME'].includes(phase)" />
      <MenuBoard v-if="advancedOptions" />
    </div>
    <div id="fieldAndEvents">
      <EventBoard />
      <PlayingField />
    </div>
  </div>
  <WelcomeModal />
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import PlayingField from '@/components/spectator/PlayingField.vue'
import WelcomeModal from '@/components/spectator/WelcomeModal.vue'
import EventBoard from '@/components/spectator/EventBoard.vue'
import ScoreBoard from '@/components/spectator/ScoreBoard.vue'
import GameInfoBoard from '@/components/spectator/GameInfoBoard.vue'
import OrdersBoard from '@/components/spectator/OrdersBoard.vue'
import MenuBoard from '@/components/spectator/MenuBoard.vue'
import { useGameStore } from '@/store/gameStore'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/appStore'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const gameStore = useGameStore()
const { phase } = storeToRefs(gameStore)
const appStore = useAppStore()
const { advancedOptions } = storeToRefs(appStore)
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

#spectatorView {
  height: 100vh;
  width: 100vw;
  padding: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 10px;

  #topBar {
    flex-shrink: 0;
    flex-grow: 0;
    width: 100%;
    height: global.$topBarHeight;

    display: flex;
    justify-content: left;
    gap: 10px;
  }

  #fieldAndEvents {
    height: calc(100vh - global.$topBarHeight - 30px);

    display: flex;
    flex-direction: row;
    gap: 10px;
  }
}
</style>
