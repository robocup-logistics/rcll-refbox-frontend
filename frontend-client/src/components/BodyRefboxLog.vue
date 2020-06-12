<template>
  <div class="container-fluid  border p-0 refbox-log overflow-auto text-left">
    <div class="d-flex justify-content-end mt-2">
      <button @click=connectToWebsocket class="btn btn-primary mr-2"> Connect </button>
       <button @click=SOCKET_DISCONNECT class="btn btn-primary  mr-2 ">
        DC
      </button>
      <button @click.prevent=SOCKET_SEND(addMagenta) class="btn btn-primary ">Send Msg</button> 
    </div>
    
    <div class="mx-3 mt-3">
      <div v-if="websocketMsgs !== []">
        <div v-for="(msg,index) in websocketMsgs" :key=index>
            <h6 v-if="msg.level !== 'attention' " class= "mb-0" :class="setClassName(msg.level)">{{msg.time}} [{{msg.component}}]: {{msg.message}}</h6>
            <!-- If Its attention message -->
            <h6 v-else-if="msg.level === 'attention' " class= "mb-0 text-danger" > !Attention: {{msg.text}}</h6>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'BodyRefboxLog',
  computed: {
    ...mapState(['websocketMsgs', 'socket'])
  },
  watch: {
    websocketMsgs: () => {
      const refLog = document.querySelector('.refbox-log');
      refLog.scrollTop = refLog.scrollHeight;
    } 
  },
  methods: {
    ...mapActions(['connectToWebsocket', 'SOCKET_DISCONNECT', 'SOCKET_SEND']),
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
  min-height: 29vh;
  max-height: 29vh;
}
</style>