// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup title="Confirm field randomization?">
    <div class="horizontal-flex" style="width: 100%">
      <Button
        primary
        icon="fa-check"
        v-shortkey.once="['enter']"
        @click.prevent="confirmedRandomize()"
        @shortkey="confirmedRandomize()"
      >
        Yes
      </Button>
      <Button
        icon="fa-xmark"
        v-shortkey.once="['esc']"
        @click.prevent="togglePopup()"
        @shortkey="togglePopup()"
      >
        No
      </Button>
    </div>
  </Popup>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import Popup from '@/components/shared/ui/Popup.vue'
import { inject } from 'vue'
import { useSocketStore } from '@/store/socketStore'
import Button from '@/components/shared/ui/Button.vue'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const socketStore = useSocketStore()

// confirm randomize - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function confirmedRandomize() {
  socketStore.randomizeField()
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
