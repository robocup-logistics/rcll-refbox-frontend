// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup title="Randomize field?" icon="fa-random">
    <div class="horizontal-flex" style="width: 100%">
      <Button icon="fa-xmark" @click.prevent="togglePopup()"> Abort </Button>
      <Button
        primary
        icon="fa-check"
        v-shortkey.once="(shortcuts.get('confirmPopup') as Shortcut).keys"
        @click.prevent="confirmedRandomize()"
        @shortkey="confirmedRandomize()"
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
import { useFieldStore } from '@/store/fieldStore'
import Button from '@/components/shared/ui/Button.vue'
import { useKeyboardStore } from '@/store/keyboardStore'
import { storeToRefs } from 'pinia'
import type Shortcut from '@/types/Shortcut'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const fieldStore = useFieldStore()
const keyboardStore = useKeyboardStore()
const { shortcuts } = storeToRefs(keyboardStore)

// confirm randomize - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function confirmedRandomize() {
  fieldStore.sendRandomizeField()
  togglePopup()
}

// popup - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// -> close
const togglePopup = inject('togglePopup') as Function
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
</style>
