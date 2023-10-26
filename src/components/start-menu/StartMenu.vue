// TEMPLATE --------------------------------------------------------------------
<template>
  <div class="bg"></div>
  <div id="startMenu">
    <img src="@/assets/robocupLogo.png" />
    <div class="modes">
      <Popup title="Websocket mode" permanent>
        Select view:
        <TabGroup
          :tabs="['spectator', 'referee']"
          @active-changed="(active: string | undefined) => updateViewSelection(active)"
        >
          <template #spectator>
            <div class="horizontal-flex">
              <font-awesome-icon
                icon="fa-solid fa-eye"
                style="font-size: 12px"
              />
              <span>Spectator</span>
            </div>
          </template>
          <template #referee
            ><div class="horizontal-flex">
              <font-awesome-icon
                icon="fa-solid fa-user-tie"
                style="font-size: 12px"
              />
              <span>Referee</span>
            </div></template
          >
        </TabGroup>
        <ConnectToWebsocket></ConnectToWebsocket>
      </Popup>

      <Popup title="Game report mode" permanent>
        <ConnectToDbBackend></ConnectToDbBackend>
      </Popup>
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
const { refereeView } = storeToRefs(viewStore)

// view selection  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function updateViewSelection(newActive: string | undefined) {
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

.bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('@/assets/wallpaper.jpeg');
  background-size: cover;
  background-position: center;
  opacity: 0.8;

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

@keyframes moveEffect {
  0% {
    transform: translateX(0) rotate(0.05turn);
  }

  100% {
    transform: translateX(calc(200vw - 100px)) rotate(0.05turn);
  }
}

#startMenu {
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
</style>
