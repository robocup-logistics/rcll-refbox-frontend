// TEMPLATE --------------------------------------------------------------------
<template>
  <Accordion horizontal title="Menu" expanded-default id="menuBoard">
    <div class="menu">
      <!-- SWITCH VIEW -->
      <PillButton
        description="Menu"
        title="Go back to the start menu"
        @click.prevent="currentView = 'start'"
      >
        <font-awesome-icon icon="fa-arrow-left"
      /></PillButton>
      <PillButton
        description="Referee"
        v-if="socket"
        title="Switch to referee mode"
        @click="currentView = 'referee'"
      >
        <font-awesome-icon icon="fa-user-tie"
      /></PillButton>

      <!-- CONNECT TO A LIVE GAME -->
      <PopupWrapper popup-position="bottom">
        <template #reference>
          <PillButton description="Live" title="Connect to live game">
            <font-awesome-icon icon="fa-link" />
          </PillButton>
        </template>
        <WatchGameLivePopup></WatchGameLivePopup>
      </PopupWrapper>

      <!-- REVIEW A PREVIOUSLY PLAYED AND RECORDED GAME -->
      <PopupWrapper popup-position="bottom">
        <template #reference>
          <PillButton description="DB" title="Connect to previous game summary">
            <font-awesome-icon icon="fa-folder-open" />
          </PillButton>
        </template>
        <ReviewGameReportPopup></ReviewGameReportPopup>
      </PopupWrapper>
    </div>
  </Accordion>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { storeToRefs } from 'pinia'
import PopupWrapper from '@/components/shared/ui/PopupWrapper.vue'
import PillButton from '@/components/shared/ui/PillButton.vue'
import { useSocketStore } from '@/store/socketStore'
import ReviewGameReportPopup from '@/components/spectator/popups/ReviewGameReportPopup.vue'
import WatchGameLivePopup from '@/components/spectator/popups/WatchGameLivePopup.vue'
import { useAppStore } from '@/store/appStore'
import Accordion from '@/components/shared/ui/Accordion.vue'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const socketStore = useSocketStore()
const { socket } = storeToRefs(socketStore)
const appStore = useAppStore()
const { currentView } = storeToRefs(appStore)
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
  }
}
</style>
