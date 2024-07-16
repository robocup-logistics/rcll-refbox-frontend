// TEMPLATE --------------------------------------------------------------------
<template>
  <div class="horizontal-flex form-row">
    <div class="vertical-flex form-col">
      <Input
        v-if="advancedOptions"
        ref="input"
        type="url"
        v-model="websocketURL"
        :placeholder="DEFAULT_WS_URL"
      />
      <div class="horizontal-flex form-row">
        <input type="checkbox" v-model="retry" />
        <label>auto reconnect</label>
      </div>
    </div>
    <Button
      icon="fa-link"
      primary
      @click="connectToWebsocket"
      :loading="loading"
    >
      Connect
    </Button>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------

<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { ref, onMounted, nextTick, type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSocketStore } from '@/store/socketStore'
import Button from '@/components/shared/ui/Button.vue'
import Input from '@/components/shared/ui/Input.vue'
import { watch } from 'vue'
import { useAppStore } from '@/store/appStore'

// define emits  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const emit = defineEmits<{
  (e: 'connected'): void
}>()

// Use stores
const socketStore = useSocketStore()
const { DEFAULT_WS_URL, attemptingConnection, socket } =
  storeToRefs(socketStore)
const appStore = useAppStore()
const { advancedOptions } = storeToRefs(appStore)

// Reactive variables
const websocketURL: Ref<string> = ref(DEFAULT_WS_URL.value)
const loading: Ref<boolean> = ref(false)
const retry: Ref<boolean> = ref(true) // Checkbox for retry option

// Connect to websocket
const connectToWebsocket = () => {
  console.log('Connecting to websocket')
  console.log(websocketURL.value)

  loading.value = true
  socketStore.connectToWebsocket(websocketURL.value, retry.value)

  watch(
    () => socket.value,
    (newSocket) => {
      // notify parent
      if (newSocket) {
        emit('connected')
      }
    },
  )

  watch(
    () => attemptingConnection.value,
    (attempting) => {
      if (!attempting) {
        loading.value = false
      }
    },
  )
}

// Focus input on component mount
const input: Ref<HTMLInputElement | null> = ref(null)
onMounted(() => {
  nextTick(() => {
    if (input.value) input.value.focus()
  })
})
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
</style>
