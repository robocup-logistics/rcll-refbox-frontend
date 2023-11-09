// TEMPLATE --------------------------------------------------------------------
<template>
  <div id="menuBoard">
    <div class="section left">
      <div class="item">
        <!-- TITLE (depending on live or review mode) -->
        <template v-if="socket">
          <div class="horizontal-flex" style="color: green">
            <font-awesome-icon icon="fa-circle" />
            <span>Live</span>
          </div>
        </template>
        <template v-else-if="gameReport">
          <div class="horizontal-flex">
            <font-awesome-icon icon="fa-folder-open" />
            <div>
              <span>{{
                gameReport['report-name'].length
                  ? gameReport['report-name'].length
                  : 'Unnamed game'
              }}</span
              ><br /><span>{{
                new Date(gameReport['start-time']).toLocaleDateString()
              }}</span>
            </div>
          </div>
          <p></p>
        </template>
        <!-- TOP MENU ROW -->
        <div class="horizontal-flex">
          <!-- CONNECT TO A LIVE GAME -->

          <PopupWrapper popup-position="bottom">
            <template #reference>
              <PillButton description="Live" title="Connect to live game">
                <font-awesome-icon class="clickable" icon="fa-link" />
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
                <font-awesome-icon class="clickable" icon="fa-folder-open" />
              </PillButton>
            </template>
            <ConnectToDbBackendPopup></ConnectToDbBackendPopup>
          </PopupWrapper>

          <!-- AUTHENTICATE AS REFEREE AND SWITCH VIEW -->
          <PillButton
            description="View"
            v-if="socket"
            title="Switch to referee mode"
          >
            <font-awesome-icon
              @click="authenticateAndSwitchView"
              class="clickable"
              icon="fa-user-tie"
          /></PillButton>
          <!--  <PopupWrapper popup-position="bottom">
            <template #reference>
              <font-awesome-icon
                class="clickable"
                icon="fa-user-tie"
                title="Switch to referee mode"
              />
            </template>
            <Popup title="Authenticate">
              <p>
                You are going to switch to referee mode. If this was not your
                intent, just close this popup. Else, please authenticate:
              </p>
              <div class="horizontal-flex">
                <input />
                <font-awesome-icon
                  @click="authenticateAndSwitchView"
                  class="clickable"
                  icon="fa-paper-plane"
                />
              </div>
            </Popup>
          </PopupWrapper> -->
        </div>
      </div>
    </div>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { storeToRefs } from 'pinia'
import { useReportStore } from '@/store/reportStore'
import { useSocketStore } from '@/store/socketStore'
import { useViewStore } from '@/store/viewStore'
import PopupWrapper from '@/components/shared/ui/PopupWrapper.vue'
import ConnectToDbBackendPopup from '@/components/spectator/popups/ConnectToDbBackendPopup.vue'
import ConnectToWebsocketPopup from '@/components/spectator/popups/ConnectToWebsocketPopup.vue'
import PillButton from '@/components/shared/ui/PillButton.vue'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const reportStore = useReportStore()
const { gameReport } = storeToRefs(reportStore)
const socketStore = useSocketStore()
const { socket } = storeToRefs(socketStore)
const viewStore = useViewStore()

// switch to referee view  - - - - - - - - - - - - - - - - - - - - - - - - - - -
function authenticateAndSwitchView() {
  viewStore.refereeView = true
}
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

#menuBoard {
  .item {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
}
</style>
