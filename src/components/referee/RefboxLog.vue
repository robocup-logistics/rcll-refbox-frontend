<template>
  <AutoScrollContainer :watch-data="infoMessages" class="item refbox-log">
    <div v-for="(msg, index) in infoMessages" :key="index">
      <p v-if="msg.level === 'attention'" class="message text-danger">
        <font-awesome-icon :icon="['fas', 'exclamation-triangle']" />
        {{ msg.text }}
      </p>
      <p
        v-else
        :class="[
          'message',
          msg.level === 'info' ? 'text-active' : 'text-danger',
          msg.message?.match('.*(C-|CYAN).*') ? 'CYAN' : '',
          msg.message?.match('.*(M-|MAGENTA).*') ? 'MAGENTA' : '',
        ]"
      >
        {{ msg.time }} [{{ msg.component }}]: {{ msg.message }}
      </p>
    </div>
  </AutoScrollContainer>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSocketStore } from '@/store/socketStore'
import AutoScrollContainer from '@/components/shared/ui/AutoScrollContainer.vue'
import '@/assets/global.scss'

const socketStore = useSocketStore()
const { infoMessages } = storeToRefs(socketStore)
</script>

<style scoped lang="scss">
@use '@/assets/global.scss';

.refbox-log {
  height: 100% !important;
  flex-shrink: 1;

  .message {
    text-align: left;
    margin-bottom: 0;

    &.CYAN {
      color: global.$cyanColor;
    }
    &.MAGENTA {
      color: global.$magentaColor;
    }
  }
}
</style>
