<template>
  <div class="d-flex justify-content-between border">
    <img  alt="Refbox Logo">
    <div class="d-flex my-1">
      <a @click.prevent='toggleConfirmationDialogFieldRnd' class="btn btn-outline-info btn-md">
        <font-awesome-icon :icon="['fa','random']" style="font-size: 12px;" />
      </a>
      <ConfirmRandomizeFieldModal v-if="toggle" />
      <div class="d-flex align-items-center justify-items-center">
        <form @submit.prevent="setPortConnection(portAddres)" v-show="addPort">
          <fieldset>
            <div class="form-group mb-0">
              <input type="text" class="form-control"   ref="portInput" placeholder="Enter Port Adress"
                v-model="portAddres" required
              >
            </div>
          </fieldset>
        </form>
        <a class="btn btn-outline-info btn-md ml-1 mr-1"
            @click.prevent="toggleAddPort()">
          <font-awesome-icon :icon="['fa','globe']" style="font-size: 12px;" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import ConfirmRandomizeFieldModal from './ConfirmRandomizeFieldModal'
import { mapActions } from 'vuex'
export default {
  name: 'HeaderLogo',
  components: {
    ConfirmRandomizeFieldModal
  },
  data() {
    return {
      toggle: false,
      addPort: false,
      portAddres: null
    }
  },
  methods: {
    ...mapActions(['setWebsocketURL', 'connectToWebsocket', 'SOCKET_DISCONNECT']),
    toggleConfirmationDialogFieldRnd() {
      this.toggle = !this.toggle      
    },
    toggleAddPort() {
      this.addPort = !this.addPort
      this.$nextTick(function () {
        this.$refs.portInput.focus()
      })
    },
    setPortConnection(portAddres) {
      this.SOCKET_DISCONNECT()
      this.setWebsocketURL(portAddres)
      this.connectToWebsocket()
      this.toggleAddPort()

    }
  }
}
</script>

<style>

</style>