// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup title="Add points">
    <form
      class="horizontal-flex"
      style="align-items: stretch"
      @submit.prevent="addPoints"
    >
      <Input type="text" ref="pointsAndReason" placeholder="points, reason" />
      <Button icon="fa-square-plus" primary @click="addPoints">Add</Button>
    </form>
  </Popup>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import Popup from '@/components/shared/ui/Popup.vue'
import { ref, inject, onMounted, nextTick } from 'vue'
import type { Ref, PropType } from 'vue'
import { useGameStore } from '@/store/gameStore'
import { useSocketStore } from '@/store/socketStore'
import type AddPointsTeamOutMsg from '@/types/messages/outgoing/AddPointsTeamOutMsg'
import Color from '@/types/Color'
import Input from '@/components/shared/ui/Input.vue'
import Button from '@/components/shared/ui/Button.vue'

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const props = defineProps({
  color: {
    type: String as PropType<Color>,
    required: true,
  },
})

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const gameStore = useGameStore()
const socketStore = useSocketStore()

// add points  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const pointsAndReason: Ref<typeof Input | null> = ref(null)

function addPoints() {
  // Input Format: points, Reason
  if (!pointsAndReason.value) return
  const splitInput = pointsAndReason.value.getValue().split(/,(.+)/)
  const points = parseInt(splitInput[0])
  const reason = splitInput[1]

  const msg: AddPointsTeamOutMsg = {
    command: 'add_points_team',
    points: points,
    team_color: `${props.color}`,
    game_time: gameStore.game_time,
    phase: `${gameStore.phase}`,
    reason: `${reason}`,
  }

  socketStore.SOCKET_SEND(msg)
  togglePopup()
}

// focus input on open - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
onMounted(() => {
  nextTick(() => {
    if (pointsAndReason.value) pointsAndReason.value.focus()
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
