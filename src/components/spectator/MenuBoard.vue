// TEMPLATE --------------------------------------------------------------------
<template>
  <Accordion id="menuBoard" title="Menu">
    <div class="horizontal-flex">
      <div class="menu item transparent">
        <!-- CONNECT TO A LIVE GAME -->
        <PopupWrapper popup-position="bottom">
          <template #reference>
            <PillButton description="Live" title="Connect to live game">
              <font-awesome-icon icon="fa-link" />
            </PillButton>
          </template>
          <ConnectToWebsocketPopup></ConnectToWebsocketPopup>
        </PopupWrapper>

        <!-- REVIEW A PREVIOUSLY PLAYED AND RECORDED GAME -->
        <PopupWrapper popup-position="bottom">
          <template #reference>
            <PillButton
              description="DB"
              title="Connect to previous game summary"
            >
              <font-awesome-icon icon="fa-folder-open" />
            </PillButton>
          </template>
          <ConnectToDbBackendPopup></ConnectToDbBackendPopup>
        </PopupWrapper>

        <!-- AUTHENTICATE AS REFEREE AND SWITCH VIEW -->
        <PillButton
          description="View"
          v-if="socket"
          title="Switch to referee mode"
          @click="authenticateAndSwitchView"
        >
          <font-awesome-icon icon="fa-user-tie"
        /></PillButton>

        <PillButton
          description="Lock"
          title="Disable referee functionality and advanced options like changing the socket or viewing game reports"
          @click.prevent="lockOptions"
          @shortkey="lockOptions"
        >
          <font-awesome-icon icon="fa-lock"
        /></PillButton>
      </div>
    </div>
  </Accordion>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { storeToRefs } from 'pinia'
import { useReportStore } from '@/store/reportStore'
import PopupWrapper from '@/components/shared/ui/PopupWrapper.vue'
import PillButton from '@/components/shared/ui/PillButton.vue'
import { useSocketStore } from '@/store/socketStore'
import ConnectToDbBackendPopup from '@/components/spectator/popups/ConnectToDbBackendPopup.vue'
import ConnectToWebsocketPopup from '@/components/spectator/popups/ConnectToWebsocketPopup.vue'
import { useViewStore } from '@/store/viewStore'
import Accordion from '@/components/shared/ui/Accordion.vue'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const socketStore = useSocketStore()
const { socket } = storeToRefs(socketStore)
const viewStore = useViewStore()

// switch to referee view  - - - - - - - - - - - - - - - - - - - - - - - - - - -
function authenticateAndSwitchView() {
  viewStore.refereeView = true
}
function lockOptions() {
  viewStore.adminActivated = false
}
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
#menuBoard {
  .menu {
    width: unset;
    display: inline-grid;
    grid-template-columns: 50px 50px;
    gap: 10px;
    overflow: hidden;
  }
}
</style>
