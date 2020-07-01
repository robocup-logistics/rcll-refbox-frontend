<template>
<div>
  <div class="container-fluid border-top  p-0  refbox-log overflow-y
   text-left">
    <!-- <div class="d-flex justify-content-end mt-2 ">
      <button @click=connectToWebsocket class="btn btn-primary mr-2"> Connect </button>
       <button @click=SOCKET_DISCONNECT class="btn btn-primary  mr-2 ">
        DC
      </button>
      <button @click.prevent=SOCKET_SEND(addMagenta) class="btn btn-primary ">Send Msg</button> 
    </div> -->
    
    <div class="mx-3 mt-3 reflog-normal-msgs-logger overflow-auto  ">
      <div v-if="websocketMsgs !== []" class="">
        <div v-for="(msg,index) in websocketMsgs" :key=index>
            <h6 v-if="msg.level !== 'attention' " class= "mb-0" :class="setClassName(msg.level)">{{msg.time}} [{{msg.component}}]: {{msg.message}}</h6>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'AttentionMessagesLogger',
  computed: {
    ...mapState(['websocketMsgs', 'socket'])
  },
  mounted() {
    setInterval(this.scrollToBottomOfLog, 1000)
  },
  methods: {
    ...mapActions(['connectToWebsocket', 'SOCKET_DISCONNECT', 'SOCKET_SEND', 'scrollToBottomOfLog']),
    setClassName(msgLevel) {
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
  }
}
</script>

<style >
.refbox-log {
  min-height: 26vh !important;
  max-height: 31vh !important;
}
.reflog-normal-msgs-logger{
height: 100% !important;
padding: 0%;
}
.overflow-y {
  overflow-y: scroll !important;
}

</style>