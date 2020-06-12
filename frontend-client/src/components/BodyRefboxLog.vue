<template>
  <div class="container-fluid  border p-0 refbox-log overflow-auto text-left">
    <div class="d-flex justify-content-end mt-2">
      <button @click=connectToWebsocket class="btn btn-primary mr-2"> Connect </button>
       <button @click=SOCKET_DISCONNECT class="btn btn-primary  mr-2 ">
        DC
      </button>
      <!-- <button @click.prevent=send(addMagenta) >Magenta Name</button>
      <button @click.prevent=send(addMagenta) class="btn btn-primary ">Send Msg</button> --> 
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

  data() {
    return {
      msgArray: [],
      status: 'disconnected',
      socket: null,
      addMagenta: {"command" : "set_teamname",
    "color" : "CYAN",
    "name" : "Carologistics"}
    }
  },
  computed: {
    ...mapState(['websocketMsgs', 'socket'])
  },
  methods: {
    ...mapActions(['connectToWebsocket', 'SOCKET_DISCONNECT']),
          // const refLog = document.querySelector('.refbox-log');
          // refLog.scrollTop = refLog.scrollHeight;

    // send(message) {
      
    //   this.socket.send(JSON.stringify(message))
    //   console.log(message, "asd");
    //   console.log('sent!');
    // },

    // disconnect() {
    //   this.status = 'disconnected';
    //   this.socket.close();
    // },

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