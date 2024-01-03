<template>
  <div class="item horizontal-flex logo-and-actions">
    <img src="@/assets/robocupLogo.png" alt="Refbox Logo" />
    <div class="horizontal-flex">
      <PopupWrapper popup-position="bottom">
        <template #reference>
          <PillButton
            description="Connect"
            title="[Connection established]"
            v-if="socket"
          >
            <font-awesome-icon icon="fa-link" style="color: green" />
          </PillButton>
          <PillButton description="Connect" title="[No connection]" v-else>
            <font-awesome-icon icon="fa-unlink" style="color: red" />
          </PillButton>
        </template>
        <ConnectToWebsocketPopup></ConnectToWebsocketPopup>
      </PopupWrapper>
      <PopupWrapper popup-position="bottom">
        <template #reference>
          <PillButton
            description="Field"
            title="Randomize Field"
            v-shortkey.once="['f1']"
          >
            <font-awesome-icon icon="fa-random" />
          </PillButton>
        </template>
        <ConfirmFieldRandomizationPopup></ConfirmFieldRandomizationPopup>
      </PopupWrapper>
      <PillButton
        description="View"
        title="Switch to spectator view"
        @click.prevent="switchToSpectatorView"
        @shortkey="switchToSpectatorView"
      >
        <font-awesome-icon icon="fa-eye"
      /></PillButton>
      <PopupWrapper popup-position="bottom">
        <template #reference>
          <PillButton description="help" title="Help">
            <font-awesome-icon icon="fa-question" />
          </PillButton>
        </template>
        <HelpPopup></HelpPopup>
      </PopupWrapper>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSocketStore } from '@/store/socketStore'
import { useViewStore } from '@/store/viewStore'
import ConnectToWebsocketPopup from '@/components/spectator/popups/ConnectToWebsocketPopup.vue'
import PopupWrapper from '@/components/shared/ui/PopupWrapper.vue'
import ConfirmFieldRandomizationPopup from '@/components/referee/popups/ConfirmFieldRandomizationPopup.vue'
import HelpPopup from '@/components/referee/popups/HelpPopup.vue'
import PillButton from '@/components/shared/ui/PillButton.vue'

const socketStore = useSocketStore()
const { socket } = storeToRefs(socketStore)
const viewStore = useViewStore()

function switchToSpectatorView() {
  viewStore.refereeView = false
}
</script>

<style scoped lang="scss">
.logo-and-actions {
  padding: 10px;
  min-width: fit-content;
  justify-content: space-between !important;

  img {
    height: 100%;
  }
}
</style>
