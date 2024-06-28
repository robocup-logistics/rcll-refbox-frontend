// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup title="Change Machine Poses?" icon="fa-random">
    <div class="horizontal-flex" style="width: 100%">
      <Button icon="fa-xmark" @click.prevent="abortChange()"> Abort </Button>
      <Button
        primary
        icon="fa-check"
        v-shortkey.once="(shortcuts.get('confirmPopup') as Shortcut).keys"
        @click.prevent="confirmChange()"
        @shortkey="confirmChange()"
      >
        Yes
      </Button>
    </div>
  </Popup>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import Popup from '@/components/shared/ui/Popup.vue'
import { inject } from 'vue'
import { useGameStore } from '@/store/gameStore'
import Button from '@/components/shared/ui/Button.vue'
import { useKeyboardStore } from '@/store/keyboardStore'
import { storeToRefs } from 'pinia'
import type Shortcut from '@/types/Shortcut'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const gameStore = useGameStore()
const keyboardStore = useKeyboardStore()
const { shortcuts } = storeToRefs(keyboardStore)

// confirm choice- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function confirmChange() {
  emit('update:isConfirmed', true)
}

function abortChange() {
  emit('update:isConfirmed', false)
}

const emit = defineEmits(['update:isConfirmed'])

// popup - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// -> close
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
</style>
