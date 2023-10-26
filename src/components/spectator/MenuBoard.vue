// TEMPLATE --------------------------------------------------------------------
<template>
  <div id="menuBoard">
    <div class="section left">
      <div class="item">
        <!-- TITLE (depending on live or review mode) -->
        <template v-if="socket">
          <div class="horizontal-flex" style="color: green">
            <font-awesome-icon icon="fa-solid fa-circle" />
            <span>Live</span>
          </div>
        </template>
        <template v-else-if="gameReport">
          <div class="horizontal-flex">
            <font-awesome-icon icon="fa-solid fa-folder-open" />
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
              <font-awesome-icon
                class="clickable"
                icon="fa-solid fa-link"
                title="Connect to live game"
              />
            </template>
            <ConnectToWebsocketPopup></ConnectToWebsocketPopup>
          </PopupWrapper>
          <!-- REVIEW A PREVIOUSLY PLAYED AND RECORDED GAME -->
          <PopupWrapper popup-position="bottom">
            <template #reference>
              <font-awesome-icon
                class="clickable"
                icon="fa-solid fa-folder-open"
                title="Connect to previous game summary"
              />
            </template>
            <ConnectToDbBackendPopup></ConnectToDbBackendPopup>
          </PopupWrapper>
          <!-- AUTHENTICATE AS REFEREE AND SWITCH VIEW -->
          <font-awesome-icon
            @click="authenticateAndSwitchView"
            class="clickable"
            icon="fa-solid fa-user-tie"
            title="Switch to referee mode"
            v-if="socket"
          />
          <!--  <PopupWrapper popup-position="bottom">
            <template #reference>
              <font-awesome-icon
                class="clickable"
                icon="fa-solid fa-user-tie"
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
                  icon="fa-solid fa-paper-plane"
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
  height: 100%;

  .item {
    display: flex;
    flex-direction: column;
    gap: 15px;

    .clickable {
      font-size: 1.5em;
    }
  }
}
</style>
