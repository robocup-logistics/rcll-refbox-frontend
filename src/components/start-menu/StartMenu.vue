// TEMPLATE --------------------------------------------------------------------
<template>
  <div class="start-menu">
    <div class="bg"></div>
    <div class="menu">
      <img src="@/assets/robocupLogo.png" />
      <div class="modes">
        <Popup title="Watch a game live" icon="fa-eye" permanent>
          <ConnectToWebsocket @connected="currentView = 'spectator'" />
          <p v-if="!advancedOptions">Connection problems? Ask a supervisor!</p>
        </Popup>

        <Popup
          v-if="advancedOptions"
          title="Referee a game"
          icon="fa-user-tie"
          permanent
        >
          <ConnectToWebsocket
            @connected="currentView = 'referee'"
          ></ConnectToWebsocket>
        </Popup>

        <Popup
          v-if="advancedOptions"
          title="Review a game report"
          icon="fa-magnifying-glass"
          permanent
        >
          <ConnectToDbBackend @connected="currentView = 'spectator'" />
        </Popup>
      </div>
    </div>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { useAppStore } from '@/store/appStore'
import { storeToRefs } from 'pinia'
import ConnectToWebsocket from '@/components/shared/util/ConnectToWebsocket.vue'
import ConnectToDbBackend from '@/components/shared/util/ConnectToDbBackend.vue'
import Popup from '@/components/shared/ui/Popup.vue'
// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const appStore = useAppStore()
const { advancedOptions, currentView } = storeToRefs(appStore)
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
.start-menu {
  .bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('@/assets/wallpaper.jpeg');
    background-size: cover;
    background-position: center;
    opacity: 0.5;
    /* background-color: global.$surfaceColor; */

    &::after {
      content: '';
      position: absolute;
      top: -10vh;
      left: -50vh;
      width: 100px;
      bottom: -10vh;
      background-color: rgba(global.$accentColor, 0.3);
      animation: moveEffect 4s infinite;
    }
  }

  .menu {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 80px;

    * {
      z-index: 1;
    }

    .modes {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }
  }
}

@keyframes moveEffect {
  0% {
    transform: translateX(0) rotate(-30deg);
  }

  100% {
    transform: translateX(calc(200vw - 100px)) rotate(0.05turn);
  }
}
</style>
