// TEMPLATE --------------------------------------------------------------------
<template>
  <div class="start-menu">
    <div class="bg"></div>
    <div class="menu">
      <img src="@/assets/robocupLogo.png" />
      <div class="modes">
        <Popup title="Follow a live game" permanent>
          <template v-if="adminActivated">
            Select view:
            <TabGroup
              :tabs="['spectator', 'referee']"
              @active-changed="(active: string) => updateViewSelection(active)"
            >
              <template #spectator>
                <div class="horizontal-flex">
                  <font-awesome-icon icon="fa-eye" />
                  <span>Spectator</span>
                </div>
              </template>
              <template #referee
                ><div class="horizontal-flex">
                  <font-awesome-icon icon="fa-user-tie" />
                  <span>Referee</span>
                </div></template
              >
            </TabGroup>
          </template>

          <ConnectToWebsocket></ConnectToWebsocket>

          <p v-if="!adminActivated">Connection problems? Ask a supervisor!</p>
        </Popup>

        <Popup title="Review a previous game" permanent v-if="adminActivated">
          <ConnectToDbBackend></ConnectToDbBackend>
        </Popup>
      </div>
    </div>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { useViewStore } from '@/store/viewStore'
import { storeToRefs } from 'pinia'
import ConnectToWebsocket from '@/components/shared/util/ConnectToWebsocket.vue'
import ConnectToDbBackend from '@/components/shared/util/ConnectToDbBackend.vue'
import Popup from '@/components/shared/ui/Popup.vue'
import TabGroup from '@/components/shared/ui/TabGroup.vue'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const viewStore = useViewStore()
const { adminActivated, refereeView } = storeToRefs(viewStore)

// view selection  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function updateViewSelection(newActive: string) {
  if (newActive == 'referee') {
    refereeView.value = true
  } else if (newActive == 'spectator') {
    refereeView.value = false
  }
}
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
    transform: translateX(0) rotate(0.05turn);
  }

  100% {
    transform: translateX(calc(200vw - 100px)) rotate(0.05turn);
  }
}
</style>
