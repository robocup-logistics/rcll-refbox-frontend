// TEMPLATE --------------------------------------------------------------------
<template>
  <div id="topBar">
    <GameInfoBoard />
    <ScoreBoard />
    <OrdersBoard v-if="['PRODUCTION'].includes(phase)" />
    <MenuBoard />
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import MenuBoard from '@/components/spectator/MenuBoard.vue'
import ScoreBoard from '@/components/spectator/ScoreBoard.vue'
import GameInfoBoard from '@/components/spectator/GameInfoBoard.vue'
import OrdersBoard from '@/components/spectator/OrdersBoard.vue'
import { useGameStore } from '@/store/gameStore'
import { storeToRefs } from 'pinia'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const gameStore = useGameStore()
const { phase } = storeToRefs(gameStore)
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

#topBar {
  width: 100%;
  height: global.$scoreBoardHeight;

  display: flex;
  justify-content: space-between;
  gap: 10px;
}
</style>
