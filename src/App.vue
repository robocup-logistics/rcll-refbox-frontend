This is the main component - based on whether the advanced options are enabled,
what preferred view is selected and whether we have a connection with a socket
or a selected game report, one of the views is selected: • Start menu (only if
we have no connection and no game report selected yet) • Spectator app to watch
live games or review a game report • Referee app to control a live game. The
code for the respective views/'apps' can be found in their corresponding
subfolders.
//TEMPLATE----------------------------------------------------------------------
<template>
  <div
    id="app"
    v-shortkey="(shortcuts.get('toggleAdvancedOptions') as Shortcut).keys"
    @shortkey.native="toggleOptions()"
  >
    <StartMenu v-if="currentView == 'start'" />
    <RefereeApp v-else-if="currentView == 'referee'" />
    <SpectatorApp v-else />
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { useAppStore } from '@/store/appStore'
import { storeToRefs } from 'pinia'
import StartMenu from '@/components/start-menu/StartMenu.vue'
import RefereeApp from '@/components/referee/RefereeApp.vue'
import SpectatorApp from './components/spectator/SpectatorApp.vue'
import { useKeyboardStore } from './store/keyboardStore'
import { useFieldStore } from '@/store/fieldStore'
import type Shortcut from '@/types/Shortcut'
import { onMounted } from 'vue'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const appStore = useAppStore()
const { advancedOptions, currentView } = storeToRefs(appStore)
const keyboardStore = useKeyboardStore()
const { shortcuts } = storeToRefs(keyboardStore)
const fieldStore = useFieldStore()
const { inEditMode } = storeToRefs(fieldStore)

// toggle options  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function toggleOptions() {
  advancedOptions.value = !advancedOptions.value
  if (!advancedOptions.value) {
    inEditMode.value = false
  }
  // Save the current advancedOptions value to localStorage
  localStorage.setItem('advancedOptions', JSON.stringify(advancedOptions.value))
}

onMounted(() => {
  const savedAdvancedOptions = localStorage.getItem('advancedOptions')
  if (savedAdvancedOptions !== null) {
    advancedOptions.value = JSON.parse(savedAdvancedOptions)
  }
})
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss' as global;

#app {
  background-color: global.$bgColor;
  overflow: hidden;
}
</style>
