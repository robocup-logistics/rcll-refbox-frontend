<template>
  <div id="scoreBoard">
    <div id="cyanSection" class="section player-section">
      {{ nameTeamCyan }}
      <br />
      {{ scoreCyan }}
    </div>
    <div class="section game-section">
      {{ phase }}
      <br />
      <span v-if="gamestate == 'INIT'">
        <font-awesome-icon icon="fa-solid fa-clock" />
        LOADING...
      </span>
      <span v-else-if="gamestate == 'WAIT_START'">
        <font-awesome-icon icon="fa-solid fa-check" />
        READY TO START
      </span>
      <span v-else-if="gamestate == 'RUNNING'">
        <font-awesome-icon icon="fa-solid fa-clock" />
        {{ formattedGametime }}
      </span>
      <span v-else-if="gamestate == 'PAUSED'">
        <font-awesome-icon icon="fa-solid fa-pause-circle" />
        {{ formattedGametime }}
      </span>
    </div>
    <div id="magentaSection" class="section player-section">
      {{ nameTeamMagenta }}
      <br />
      {{ scoreMagenta }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store/mainStore'

const mainStore = useMainStore()
const {
  phase,
  gamestate,
  formattedGametime,
  nameTeamCyan,
  nameTeamMagenta,
  scoreCyan,
  scoreMagenta,
} = storeToRefs(mainStore)
</script>

<style scoped lang="scss">
@use '@/assets/global.scss';

$blur: 5px;

#scoreBoard {
  width: fit-content;
  margin: 0 auto;

  display: flex;
  align-items: stretch;

  .section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 20px;

    &.game-section {
      background-color: black;
      box-shadow: 0 0 $blur 0 black;
      text-align: center;
    }

    &.player-section {
      color: black;
      &#cyanSection {
        background-color: global.$main-cyan-color;
        box-shadow: 0 0 $blur 0 global.$main-cyan-color;
        text-align: right;
        border-bottom-left-radius: 10px;
      }

      &#magentaSection {
        background-color: global.$main-magenta-color;
        box-shadow: 0 0 $blur 0 global.$main-magenta-color;
        text-align: left;
        border-bottom-right-radius: 10px;
      }
    }
  }
}
</style>
