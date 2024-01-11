// TEMPLATE --------------------------------------------------------------------
<template>
  <p>Connect to the game:</p>
  <div class="horizontal-flex form-row">
    <Input
      v-if="adminActivated"
      ref="input"
      type="url"
      :value="websocketURL"
      @input="(newUrl) => (websocketURL = newUrl)"
      :placeholder="DEFAULT_WS_URL"
    />
    <Button
      icon="fa-link"
      primary
      @click="connectToWebsocket"
      :loading="attemptingConnection"
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
import { useViewStore } from '@/store/viewStore'

// define emits  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const emit = defineEmits<{
  (e: 'connected'): void
}>()

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const socketStore = useSocketStore()
const { DEFAULT_WS_URL, attemptingConnection } = storeToRefs(socketStore)
const viewStore = useViewStore()
const { adminActivated } = storeToRefs(viewStore)

// connect to websocket  - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const websocketURL: Ref<string> = ref(DEFAULT_WS_URL.value)

function connectToWebsocket() {
  // first remove potential loaded game
  // TODO

  // then connect to websocket
  socketStore.connectToWebsocket(websocketURL.value)
}

watch(
  () => attemptingConnection.value,
  (newConnectionState, oldConnectionState) => {
    // notify parent
    if (newConnectionState == false && oldConnectionState == true) {
      emit('connected')
    }
  }
)

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
