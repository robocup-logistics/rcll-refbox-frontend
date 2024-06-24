// TEMPLATE --------------------------------------------------------------------
<template>
  <div class="horizontal-flex form-row">
    <Input
      v-if="advancedOptions"
      ref="input"
      type="url"
      v-model="websocketURL"
      :placeholder="DEFAULT_WS_URL"
    />
    <Button
      icon="fa-link"
      primary
      @click="connectToWebsocket"
      :loading="loading"
      >Connect</Button
    >
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

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const socketStore = useSocketStore()
const { DEFAULT_WS_URL, attemptingConnection, socket } =
  storeToRefs(socketStore)
const appStore = useAppStore()
const { advancedOptions } = storeToRefs(appStore)

// connect to websocket  - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const websocketURL: Ref<string> = ref(DEFAULT_WS_URL.value)
const loading: Ref<boolean> = ref(false)
function connectToWebsocket() {
  console.log('connecting to websocket')
  console.log(websocketURL)

  loading.value = true
  socketStore.connectToWebsocket(websocketURL.value)

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

// focus input on open - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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
