<template>
  <div class="d-flex justify-content-between border">
    <img  alt="Refbox Logo">
    <div class="d-flex my-1">
      <a @click.prevent='toggleConfirmationDialogFieldRnd' class="btn btn-outline-info btn-md"
      data-toggle="tooltip" data-placement="bottom" title="Randomize Field" 
      >
        <font-awesome-icon :icon="['fa','random']" style="font-size: 12px;" />
      </a>
      <ConfirmRandomizeFieldModal v-if="toggle" />
      <div class="d-flex align-items-center justify-items-center">
        <form @submit.prevent="setPortConnection(portAddres)" v-show="addIpAndPort">
          <fieldset>
            <div class="form-group mb-0">
              <input type="text" class="form-control"   ref="portInput" placeholder="Enter Ip and Port Adress To Connect To"
                v-model="portAddres" required
              >
            </div>
          </fieldset>
        </form>
        <a class="btn btn-outline-info btn-md ml-1 mr-1"
            data-toggle="tooltip" data-placement="bottom" title="Change Websocket Port" 
            @click.prevent="toggleAddIpAndPort()">
          <font-awesome-icon :icon="['fa','globe']" style="font-size: 12px;" />
        </a>
        <a v-if="isConnected" class="mx-2 "
            data-toggle="tooltip" data-placement="bottom" title="Connection established!" >
          <font-awesome-icon :icon="['fa','link']" style="font-size: 12px; color:green;" />
        </a>
        <a v-else class="mx-2 icon-unlink"
            data-toggle="tooltip" data-placement="bottom" title="Connection lost!" >
          <font-awesome-icon :icon="['fa','unlink']" style="font-size: 12px; color:red;" />
        </a>
      </div>
    </div>
  </div>
  
</template>

<script>
import ConfirmRandomizeFieldModal from './ConfirmRandomizeFieldModal'
import { mapActions, mapState } from 'vuex'
export default {
  name: 'HeaderLogo',
  components: {
    ConfirmRandomizeFieldModal
  },
  data() {
    return {
      toggle: false,
      addIpAndPort: false,
      portAddres: null
    }
  },
  computed:{
    ...mapState(['isConnected'])
  },
  methods: {
    ...mapActions(['setWebsocketURL', 'connectToWebsocket', 'SOCKET_DISCONNECT']),
    toggleConfirmationDialogFieldRnd() {
      this.toggle = !this.toggle      
    },
    toggleAddIpAndPort() {
      this.addIpAndPort = !this.addIpAndPort
      this.$nextTick(function () {
        this.$refs.portInput.focus()
      })
    },
    setPortConnection(portAddres) {
      const adress = `ws://`+`${portAddres}`
      this.SOCKET_DISCONNECT()
      this.setWebsocketURL(adress)
      this.connectToWebsocket()
      this.toggleAddIpAndPort()

    }
  }
}
</script>

<style>

</style>