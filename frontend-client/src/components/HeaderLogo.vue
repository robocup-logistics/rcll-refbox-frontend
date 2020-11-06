<template>
  <div class="d-flex justify-content-between border">
    <img  alt="Refbox Logo">
    <div class="d-flex m-0">
      <a @click.prevent='toggleConfirmationDialogFieldRnd' 
      class="btn btn-fields btn-md" data-toggle="tooltip" 
      data-placement="bottom" title="Randomize Field" 
      v-shortkey.once="['f1']" @shortkey="toggleConfirmationDialogFieldRnd"
      >
        <font-awesome-icon :icon="['fa','random']" style="font-size: 12px;" />
      </a>
      <ConfirmRandomizeFieldModal v-if="toggle" />
      <div class="d-flex align-items-center justify-items-center">
        <form  class='form-connection' @submit.prevent="setPortConnection(portAddres)" v-show="addIpAndPort">
          <fieldset>
            <div class="form-group mb-0">
              <input type="text" class="form-control input-connection"   ref="portInput" placeholder="Enter Ip and Port Adress To Connect To"
                v-model="portAddres" required
              >
            </div>
          </fieldset>
        </form>
        <a class="btn btn-md ml-1 mr-1 btn-connection"
            data-toggle="tooltip" data-placement="bottom" title="Change Websocket Port" 
            @click.prevent="toggleAddIpAndPortAndFocus()">
          <font-awesome-icon :icon="['fa','globe']" style="font-size: 12px;" />
        </a>
        <a v-if="isConnected" class="mx-2 "
            data-toggle="tooltip" data-placement="bottom" title="Connection established!" >
          <font-awesome-icon :icon="['fa','link']" style="font-size: 12px; color:green;" />
        </a>
        <a v-else class="mx-2 icon-unlink"
            data-toggle="tooltip" data-placement="bottom" title="No Connection!" >
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
      portAddres: null
    }
  },
  computed:{
    ...mapState(['isConnected', 'addIpAndPort'])
  },
  methods: {
    ...mapActions(['setWebsocketURL', 'connectToWebsocket', 'SOCKET_DISCONNECT', 'toggleAddIpAndPort']),
    toggleConfirmationDialogFieldRnd() {
      this.toggle = !this.toggle      
    },
    toggleAddIpAndPortAndFocus() {
      this.toggleAddIpAndPort()
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
.btn-connection:hover, .btn-fields:hover{
  opacity: 0.5 !important;
}
.input-connection{
  max-width: 180px;
  max-height: 1.7em;
}
</style>