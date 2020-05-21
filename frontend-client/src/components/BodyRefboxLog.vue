<template>
  <div class="container-fluid  border p-0 refbox-log overflow-auto text-left">
    <div class="d-flex justify-content-end">
      <button @click=connect class="btn btn-primary "> Connect </button>
      <button @click=disconnect class="btn btn-primary  ">
        DC
      </button>
      <button @click=send class="btn btn-primary ">Send Msg</button>
    </div>
    
    <div class="mx-3 mt-3">
      <div v-for="(msg,index) in msgArray" :key=index>
        <h6 class= "mb-0" :class="setClassName(msg.level)">{{msg.time}} [{{msg.component}}]: {{msg.message}}</h6>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BodyRefboxLog',

  data() {
    return {
      msgArray: [],
      status: 'disconnected',
      socket: null
    }
  },

  mounted() {
    this.connect();
  },

  methods: {

    connect() {
      this.socket = new WebSocket('ws://localhost:1234');

      this.socket.onopen = (e) => {
        console.log("Connection established", e);
        this.status = 'connected';
      }

      this.socket.onclose = (e) => {
        console.log("Connection debunked", e);
      }

      this.socket.onmessage = (e) => { 
        console.log(e);
        let msgObj = JSON.parse(e.data);
        this.msgArray.push(msgObj);
        const refLog = document.querySelector('.refbox-log');
        refLog.scrollTop = refLog.scrollHeight;
      }
    },

    send() {
      this.socket.send(`{"message": "testuu"}`)
      console.log('sent!');
    },

    disconnect() {
      this.status = 'disconnected';
      this.socket.close();
    },

    setClassName(msgLevel) {
      if (msgLevel === 'info') {
        return 'text-light'
      } else if (msgLevel === 'warn' ) {
        return 'text-danger'
      } else if (msgLevel === 'error') {
        return 'text-danger'
      } else {
        return 'text-primary'
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