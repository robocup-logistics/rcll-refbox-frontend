<template>
  <div>
    <div class="container-fluid p-0 refbox-log text-start">
      <div class="mx-3 mt-3">
        <div v-if="websocketMsgs.length" class="msg-holder">
          <div v-for="(msg, index) in websocketMsgs" :key="index">
            <h6
              v-if="msg.level !== 'attention'"
              class="mb-0 message"
              :class="getClasses(msg)"
            >
              {{ msg.time }} [{{ msg.component }}]: {{ msg.message }}
            </h6>
            <h6 v-else-if="msg.level === 'attention'" class="mb-0 text-danger">
              <font-awesome-icon
                :icon="['fas', 'exclamation-triangle']"
                class="fa-1x"
              />
              {{ msg.text }}
            </h6>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store/mainStore'
import '@/assets/global.scss'

const mainStore = useMainStore()
const { websocketMsgs } = storeToRefs(mainStore)

watch(websocketMsgs, () => {
  setTimeout(scrollToBottomOfLog, 250)
})

function scrollToBottomOfLog() {
  const refLog = document.querySelector('.bodyRefboxLogCmp')
  const msgs = document.querySelector('.msg-holder')
  if (refLog && msgs) {
    refLog.scrollTop = refLog.scrollHeight - refLog.clientHeight
    msgs.scrollTop = msgs.scrollHeight - msgs.clientHeight
  }
}

function getClasses(msg): string[] {
  const classes: string[] = []
  if (msg.level === 'info') {
    classes.push('text-active')
  } else {
    classes.push('text-danger')
  }
  if (msg.message.match('.*(C-|CYAN).*')) {
    classes.push('cyan')
  } else if (msg.message.match('.*(M-|MAGENTA).*')) {
    classes.push('magenta')
  }
  return classes
}

defineExpose({ websocketMsgs, getClasses })
</script>

<style scoped lang="scss">
@use '@/assets/global.scss';

.refbox-log {
  height: 30vh !important;

  .message {
    &.cyan {
      color: global.$main-cyan-color;
    }
    &.magenta {
      color: global.$main-magenta-color;
    }
  }
}
</style>
