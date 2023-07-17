<template>
  <div id="app">
    <!-- referee view -->
    <div id="refereeView" class="container-fluid" v-if="refereeView">
      <AppHeader />
      <AppBody />
      <AppFooter />
    </div>
    <!-- spectator view -->
    <div id="spectatorView" v-else>
      <ScoreBoard />
      <PlayingField />
      <Player color="cyan" />
      <Player color="magenta" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import { useMainStore } from '@/store/mainStore'

// referee components
import AppHeader from '@/components/referee/AppHeader.vue'
import AppBody from '@/components/referee/AppBody.vue'
import AppFooter from '@/components/referee/AppFooter.vue'

// specator components
import ScoreBoard from '@/components/spectator/ScoreBoard.vue'
import PlayingField from '@/components/spectator/PlayingField.vue'
import Player from '@/components/spectator/Player.vue'

// variable whether the referee view or the spectator view is active
const refereeView: Ref<boolean> = ref(true)

// connect to websocket
const mainStore = useMainStore()
mainStore.connectToWebsocket()

defineExpose({ refereeView })
</script>

<style scoped lang="scss">
#app {
  #refereeView {
    font-family: 'DejaVu Sans Mono', monospace;
  }

  #spectatorView {
    background-color: #252525;
    height: 100vh;
    width: 100vw;
  }
}
</style>
