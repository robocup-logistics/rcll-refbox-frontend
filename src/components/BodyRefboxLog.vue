<template>
  <div>
    <div class="container-fluid p-0 refbox-log text-left">
      <!-- <div class="d-flex justify-content-end mt-2 ">
        <button @click=connectToWebsocket class="btn btn-primary mr-2"> Connect </button>
        <button @click=SOCKET_DISCONNECT class="btn btn-primary  mr-2 ">
          DC
        </button>
        <button @click.prevent=SOCKET_SEND(addMagenta) class="btn btn-primary ">Send Msg</button> 
      </div> -->
      
      <div class="mx-3 mt-3 reflog-normal-msgs-logger">
        <div
          v-if="websocketMsgs.length" 
          class="msg-holder"
        >
          <div 
            v-for="(msg,index) in websocketMsgs"
            :key="index"
          >
            <h6 
              v-if="msg.level !== 'attention'"
              class="mb-0"
              :class="setClassName(msg.level)"
              :style="setMsgColor(msg.message)"
            >
              {{ msg.time }} [{{ msg.component }}]: {{ msg.message }}
            </h6>
            <h6 
              v-else-if="msg.level === 'attention'"
              class="mb-0 text-danger"
            >
              <font-awesome-icon 
                :icon="['fas','exclamation-triangle']"
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

const mainStore = useMainStore()
const { websocketMsgs } = storeToRefs(mainStore)

watch(websocketMsgs, () => {
  setTimeout(scrollToBottomOfLog, 250)
})

function scrollToBottomOfLog() {
  const refLog = document.querySelector('.bodyRefboxLogCmp');
  const msgs = document.querySelector('.msg-holder')
  if (refLog && msgs) {
    refLog.scrollTop = refLog.scrollHeight - refLog.clientHeight
    msgs.scrollTop = msgs.scrollHeight - msgs.clientHeight
  }
}

function setClassName(msgLevel: string) {

  // this.scrollToBottomOfLog()
  if (msgLevel === 'info') {
    return 'text-active'
  } else if (msgLevel === 'warn' ) {
    return 'text-danger'
  } else if (msgLevel === 'error') {
    return 'text-danger'
  } else {
    return 'text-danger'
  }
}

function setMsgColor(msg) {  
      
  let matchC = msg.match(".*(C-|CYAN).*")
  let matchM = msg.match(".*(M-|MAGENTA).*")

  if(matchC) {
    return 'color: var(--main-cyan-color);'
  } else if (matchM){
    return 'color: var(--main-magenta-color);'
  }
}

defineExpose({ websocketMsgs, setClassName, setMsgColor })
</script>

<style>
.refbox-log {
  height: 30vh !important;
}

.reflog-normal-msgs-logger{
height: 100% !important;
padding: 0%;
}

.overflow-y {
  overflow-y: scroll !important;
}
</style>