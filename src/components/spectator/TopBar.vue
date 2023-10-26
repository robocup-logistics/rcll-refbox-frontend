// TEMPLATE --------------------------------------------------------------------
<template>
  <div id="topBar">
    <div class="board-wrapper">
      <GameInfoBoard></GameInfoBoard>
    </div>
    <div class="board-wrapper">
      <ScoreBoard></ScoreBoard>
    </div>
    <div class="board-wrapper" v-if="['PRODUCTION'].includes(phase)">
      <OrdersBoard></OrdersBoard>
    </div>
    <div class="board-wrapper">
      <MenuBoard></MenuBoard>
    </div>
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

  .board-wrapper {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 10px;
    gap: 10px;
  }
}
</style>
