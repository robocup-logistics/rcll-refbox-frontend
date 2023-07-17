<template>
  <div class="d-flex justify-content-between border">
    <img alt="Refbox Logo" />
    <div class="d-flex m-0">
      <a
        v-shortkey.once="['f1']"
        class="btn btn-fields btn-md"
        data-toggle="tooltip"
        data-placement="bottom"
        title="Randomize Field"
        @click.prevent="toggleConfirmationDialogFieldRnd"
        @shortkey="toggleConfirmationDialogFieldRnd"
      >
        <font-awesome-icon
          :icon="['fa', 'random']"
          style="font-size: 12px"
        /><!--  -->
      </a>
      <ConfirmRandomizeFieldModal
        v-if="toggle"
        @toggle-confirmation-dialog-field-randomize="
          toggleConfirmationDialogFieldRnd
        "
      />
      <div class="d-flex align-items-center justify-items-center">
        <form
          v-show="addIpAndPort"
          class="form-connection"
          @submit.prevent="setPortConnection"
        >
          <fieldset>
            <div class="mb-0">
              <input
                ref="portInput"
                type="text"
                class="form-control input-connection"
                placeholder="Enter Ip and Port Adress To Connect To"
                required
              />
            </div>
          </fieldset>
        </form>
        <a
          class="btn btn-md ms-1 me-1 btn-connection"
          data-toggle="tooltip"
          data-placement="bottom"
          title="Change Websocket Port"
          @click.prevent="toggleAddIpAndPortAndFocus()"
        >
          <font-awesome-icon :icon="['fa', 'globe']" style="font-size: 12px" />
        </a>
        <a
          v-if="socket"
          class="mx-2"
          data-toggle="tooltip"
          data-placement="bottom"
          title="Connection established!"
        >
          <font-awesome-icon
            :icon="['fa', 'link']"
            style="font-size: 12px; color: green"
          />
        </a>
        <a
          v-else
          class="mx-2 icon-unlink"
          data-toggle="tooltip"
          data-placement="bottom"
          title="No Connection!"
        >
          <font-awesome-icon
            :icon="['fa', 'unlink']"
            style="font-size: 12px; color: red"
          />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, nextTick, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store/mainStore'
import ConfirmRandomizeFieldModal from '@/components/referee/ConfirmRandomizeFieldModal.vue'

const mainStore = useMainStore()
const { socket, addIpAndPort } = storeToRefs(mainStore)

const toggle: Ref<boolean> = ref(false)
const portInput: Ref<HTMLInputElement | null> = ref(null)

onMounted(() => {
  if (portInput.value) {
    portInput.value.value = mainStore.websocketURL
  }
})

function toggleConfirmationDialogFieldRnd() {
  toggle.value = !toggle.value
}

function toggleAddIpAndPortAndFocus() {
  mainStore.toggleAddIpAndPort()
  nextTick(() => {
    if (portInput.value) portInput.value.focus()
  })
}

function setPortConnection() {
  if (!portInput.value) return
  console.log('seeting ' + portInput.value.value)
  const address = `ws://` + `${portInput.value.value}`
  mainStore.SOCKET_DISCONNECT()
  mainStore.websocketURL = address
  mainStore.connectToWebsocket()
  mainStore.toggleAddIpAndPort()
}

defineExpose({
  socket,
  addIpAndPort,
  toggle,
  portInput,
  toggleConfirmationDialogFieldRnd,
  toggleAddIpAndPortAndFocus,
  setPortConnection,
})
</script>

<style scoped>
.btn-connection:hover,
.btn-fields:hover {
  opacity: 0.5 !important;
}

.input-connection {
  max-width: 300px;
  max-height: 1.7em;
}
</style>
