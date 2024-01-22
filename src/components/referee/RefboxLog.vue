// TEMPLATE --------------------------------------------------------------------
<template>
  <AutoScrollContainer :watch-data="logMessages" class="flex-item refbox-log">
    <div v-for="(msg, index) in logMessages" :key="index">
      <p v-if="msg.level === 'attention'" class="message text-danger">
        <font-awesome-icon icon="fa-triangle-exclamation" />
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

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { storeToRefs } from 'pinia'
import { useSocketStore } from '@/store/socketStore'
import AutoScrollContainer from '@/components/shared/ui/AutoScrollContainer.vue'
import '@/assets/global.scss'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const socketStore = useSocketStore()
const { logMessages } = storeToRefs(socketStore)
</script>

// STYLE -----------------------------------------------------------------------
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
