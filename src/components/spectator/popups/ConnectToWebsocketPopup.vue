// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup title="Connect to live game">
    <ConnectToWebsocket @connected="(_e) => togglePopup()"></ConnectToWebsocket>
  </Popup>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import Popup from '@/components/shared/ui/Popup.vue'
import { inject } from 'vue'
import ConnectToWebsocket from '@/components/shared/util/ConnectToWebsocket.vue'

// popup - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// -> close
const togglePopup = inject('togglePopup') as Function
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
</style>
