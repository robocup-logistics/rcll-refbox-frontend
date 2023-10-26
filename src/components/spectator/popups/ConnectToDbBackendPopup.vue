// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup title="Review a previous game">
    <ConnectToDbBackend @connected="(_e) => togglePopup()"></ConnectToDbBackend
  ></Popup>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import Popup from '@/components/shared/ui/Popup.vue'
import { inject } from 'vue'
import ConnectToDbBackend from '@/components/shared/util/ConnectToDbBackend.vue'

// popup - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// -> close
const togglePopup = inject('togglePopup') as Function
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
</style>
