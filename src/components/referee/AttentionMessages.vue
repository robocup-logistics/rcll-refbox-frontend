<template>
  <AutoScrollContainer
    v-if="attentionMessages.length"
    :watch-data="() => attentionMessages"
    class="item attmsg-log"
  >
    <p
      v-for="(msg, index) in attentionMessages"
      :key="index"
      class="attention-msg"
    >
      <font-awesome-icon :icon="['fas', 'exclamation-triangle']" />
      {{ msg.text }}
    </p>
  </AutoScrollContainer>
  <div class="item" v-else>
    <p>-</p>
  </div>
</template>

<script setup lang="ts">
import { useSocketStore } from '@/store/socketStore'
import AutoScrollContainer from '@/components/shared/ui/AutoScrollContainer.vue'
import { storeToRefs } from 'pinia'

const socketStore = useSocketStore()
const { attentionMessages } = storeToRefs(socketStore)
</script>

<style scoped>
.attmsg-log {
  background-color: red !important;

  .attention-msg {
    font-size: 22px !important;
  }
}
</style>
