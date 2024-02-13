// TEMPLATE --------------------------------------------------------------------
<template>
  <AutoScrollContainer
    v-if="attentionMessages.length"
    :watch-data="attentionMessages"
    class="flex-item attmsg-log"
  >
    <p
      v-for="(msg, index) in attentionMessages"
      :key="index"
      class="attention-msg"
    >
      <font-awesome-icon icon="fa-triangle-exclamation" />
      {{ msg.text }}
    </p>
  </AutoScrollContainer>
  <div class="flex-item" v-else>
    <p>-</p>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { useSocketStore } from '@/store/socketStore'
import AutoScrollContainer from '@/components/shared/ui/AutoScrollContainer.vue'
import { storeToRefs } from 'pinia'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const socketStore = useSocketStore()
const { attentionMessages } = storeToRefs(socketStore)
</script>

// STYLE -----------------------------------------------------------------------
<style scoped>
.attmsg-log {
  background-color: red !important;

  .attention-msg {
    font-size: 22px !important;
  }
}
</style>
