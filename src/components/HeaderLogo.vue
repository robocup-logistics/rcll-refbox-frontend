<template>
  <div class="d-flex justify-content-between border">
    <img alt="Refbox Logo">
    <div class="d-flex m-0">
      <a @click.prevent='toggleConfirmationDialogFieldRnd' 
        class="btn btn-fields btn-md" data-toggle="tooltip" 
        data-placement="bottom" title="Randomize Field" 
        v-shortkey.once="['f1']" @shortkey="toggleConfirmationDialogFieldRnd"
      >
        <font-awesome-icon :icon="['fa','random']" style="font-size: 12px;" />
      </a>
      <ConfirmRandomizeFieldModal 
        v-if="toggle"
        @toggle-confirmation-dialog-field-randomize="toggleConfirmationDialogFieldRnd"
      />
      <div class="d-flex align-items-center justify-items-center">
        <form  class='form-connection' @submit.prevent="setPortConnection(portAddress)" v-show="addIpAndPort">
          <fieldset>
            <div class="form-group mb-0">
              <input type="text" 
                class="form-control input-connection" ref="portInput"
                placeholder="Enter Ip and Port Adress To Connect To"
                v-model="portAddress" required
              >
            </div>
          </fieldset>
        </form>
        <a class="btn btn-md ml-1 mr-1 btn-connection"
          data-toggle="tooltip" data-placement="bottom" title="Change Websocket Port" 
          @click.prevent="toggleAddIpAndPortAndFocus()"
        >
          <font-awesome-icon :icon="['fa','globe']" style="font-size: 12px;" />
        </a>
        <a v-if="isConnected" class="mx-2 "
          data-toggle="tooltip" data-placement="bottom" title="Connection established!"
        >
          <font-awesome-icon :icon="['fa','link']" style="font-size: 12px; color:green;" />
        </a>
        <a v-else class="mx-2 icon-unlink"
          data-toggle="tooltip" data-placement="bottom" title="No Connection!"
        >
          <font-awesome-icon :icon="['fa','unlink']" style="font-size: 12px; color:red;" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store/mainStore'
import ConfirmRandomizeFieldModal from '@/components/ConfirmRandomizeFieldModal.vue'

const mainStore = useMainStore()
const { isConnected, addIpAndPort } = storeToRefs(mainStore)

const toggle: Ref<boolean> = ref(false)
const portAddress = ref(null)
const portInput: Ref<HTMLInputElement | null> = ref(null)

function toggleConfirmationDialogFieldRnd() {
  toggle.value = !toggle.value      
}

function toggleAddIpAndPortAndFocus() {
  mainStore.toggleAddIpAndPort()
  nextTick(() => {
    if(portInput.value) portInput.value.focus()
  })
}

function setPortConnection(portAddres: string) {

  const address = `ws://`+`${portAddress}`
  mainStore.SOCKET_DISCONNECT()
  mainStore.websocketURL = address
  mainStore.connectToWebsocket()
  mainStore.toggleAddIpAndPort()
}

defineExpose({ isConnected, addIpAndPort, toggle, portAddress, portInput, toggleConfirmationDialogFieldRnd, toggleAddIpAndPortAndFocus, setPortConnection })
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