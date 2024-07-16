// TEMPLATE --------------------------------------------------------------------
<template>
  <div class="flex-item logo-and-actions">
    <div class="content horizontal-flex">
      <img src="@/assets/robocupLogo.png" alt="Refbox Logo" />
      <div class="horizontal-flex">
        <PopupWrapper popup-position="bottom">
          <template #reference>
            <PillButton
              description="Reset"
              title="Restart the refbox, requires re-connect of frontend"
            >
              <font-awesome-icon icon="fa-arrow-rotate-left" />
            </PillButton>
          </template>
          <ConfirmResetPopup />
        </PopupWrapper>
        <PillButton
          description="Menu"
          title="Go back to the start menu"
          @click.prevent="currentView = 'start'"
        >
          <font-awesome-icon icon="fa-arrow-left"
        /></PillButton>
        <PillButton
          description="Watch"
          title="Switch to spectator view"
          @click.prevent="currentView = 'spectator'"
        >
          <font-awesome-icon icon="fa-eye"
        /></PillButton>
        <p style="flex-shrink: 0">•</p>
        <PopupWrapper popup-position="bottom">
          <template #reference>
            <PillButton
              description="Connect"
              :title="`${
                socket ? '[Connected]' : '[Disconnected]'
              } Edit websocket URL`"
            >
              <font-awesome-icon
                icon="fa-link"
                :class="[socket ? 'text-success' : 'text-danger']"
              />
            </PillButton>
          </template>
          <EditSocketConnectionPopup />
        </PopupWrapper>
        <PopupWrapper popup-position="bottom">
          <template #reference>
            <PillButton description="Config" title="Edit game config">
              <font-awesome-icon icon="fa-screwdriver-wrench" />
            </PillButton>
          </template>
          <GameConfigPopup />
        </PopupWrapper>
        <PopupWrapper popup-position="bottom">
          <template #reference>
            <PillButton description="Presets" title="Set Config Presets">
              <font-awesome-icon icon="fa-gears" />
            </PillButton>
          </template>
          <ConfigPresetsPopup />
        </PopupWrapper>
        <PopupWrapper popup-position="bottom">
          <template #reference>
            <PillButton description="Field" title="Randomize Field">
              <font-awesome-icon icon="fa-random" />
            </PillButton>
          </template>
          <ConfirmFieldRandomizationPopup />
        </PopupWrapper>
        <PopupWrapper popup-position="bottom">
          <template #reference>
            <PillButton description="Instruct" title="Instruct Machines">
              <font-awesome-icon icon="fa-walkie-talkie" />
            </PillButton>
          </template>
          <InstructMachinePopup />
        </PopupWrapper>
        <PopupWrapper popup-position="bottom">
          <template #reference>
            <PillButton description="help" title="Help">
              <font-awesome-icon icon="fa-question" />
            </PillButton>
          </template>
          <HelpPopup />
        </PopupWrapper>
      </div>
    </div>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { useAppStore } from '@/store/appStore'
import EditSocketConnectionPopup from '@/components/referee/popups/EditSocketConnectionPopup.vue'
import PopupWrapper from '@/components/shared/ui/PopupWrapper.vue'
import ConfirmFieldRandomizationPopup from '@/components/referee/popups/ConfirmFieldRandomizationPopup.vue'
import HelpPopup from '@/components/referee/popups/HelpPopup.vue'
import PillButton from '@/components/shared/ui/PillButton.vue'
import ConfirmResetPopup from '@/components/referee/popups/ConfirmResetPopup.vue'
import GameConfigPopup from '@/components/referee/popups/GameConfigPopup.vue'
import InstructMachinePopup from '@/components/referee/popups/InstructMachinePopup.vue'
import ConfigPresetsPopup from '@/components/referee/popups/ConfigPresetsPopup.vue'
import { useSocketStore } from '@/store/socketStore'
import { storeToRefs } from 'pinia'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const appStore = useAppStore()
const { currentView } = storeToRefs(appStore)
const socketStore = useSocketStore()
const { socket } = storeToRefs(socketStore)
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
.logo-and-actions {
  padding: 10px;
  min-width: fit-content;

  .content {
    width: 100%;
    justify-content: space-between !important;

    img {
      height: 100%;
    }
  }
}
</style>
