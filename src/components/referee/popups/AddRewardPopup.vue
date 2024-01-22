// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup title="Add reward">
    <div class="horizontal-flex">
      <Input
        type="number"
        ref="pointsInput"
        placeholder="points"
        v-model="points"
        style="width: 100px"
      />
      <Input type="text" placeholder="reason" v-model="reason" />
      <Button
        icon="fa-square-plus"
        primary
        @click="addReward"
        v-shortkey.once="(shortcuts.get('confirmPopup') as Shortcut).keys"
        @shortkey="addReward()"
        :disabled="!points || !reason"
        >Add</Button
      >
    </div>
    <!-- <div v-if="error" class="text-danger">Make sure to fill in both fields</div> -->
  </Popup>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import Popup from '@/components/shared/ui/Popup.vue'
import { ref, inject, onMounted, nextTick } from 'vue'
import type { Ref, PropType } from 'vue'
import { useGameStore } from '@/store/gameStore'
import Color from '@/types/Color'
import Input from '@/components/shared/ui/Input.vue'
import Button from '@/components/shared/ui/Button.vue'
import Shortcut from '@/types/Shortcut'
import { storeToRefs } from 'pinia'
import { useKeyboardStore } from '@/store/keyboardStore'

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const props = defineProps({
  color: {
    type: String as PropType<Color>,
    required: true,
  },
})

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const gameStore = useGameStore()
const keyboardStore = useKeyboardStore()
const { shortcuts } = storeToRefs(keyboardStore)

// add points  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const points: Ref<number | undefined> = ref()
const reason: Ref<string | undefined> = ref()

function addReward() {
  if (points.value && reason.value) {
    gameStore.sendAddReward({
      points: points.value,
      team_color: props.color,
      reason: reason.value,
    })
    togglePopup()
  } else {
    throw new Error('tried to add a reward without points or reason set')
  }
}

// focus input on open - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const pointsInput: Ref<typeof Input | null> = ref(null)
onMounted(() => {
  nextTick(() => {
    if (pointsInput.value) pointsInput.value.focus()
  })
})

// popup - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// -> close
const togglePopup = inject('togglePopup') as Function
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
</style>
