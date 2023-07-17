<template>
  <div class="add-points-container">
    <form
      class="add-points-form"
      @submit.prevent="formatAndSendInputToWebsocket"
    >
      <input
        ref="pointsAndReason"
        type="text"
        class="p-0 add-points-input"
        required
        placeholder="Format: points, reason"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, onMounted, nextTick } from 'vue'
import { useMainStore } from '@/store/mainStore'

const props = defineProps({
  color: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['toggleShowAddPoints'])

const mainStore = useMainStore()

const pointsAndReason: Ref<HTMLInputElement | null> = ref(null)

onMounted(() => {
  nextTick(() => {
    if (pointsAndReason.value) pointsAndReason.value.focus()
  })
})

function formatAndSendInputToWebsocket() {
  // Input Format: points, Reason
  if (!pointsAndReason.value) return
  const splitInput = pointsAndReason.value.value.split(/,(.+)/)
  const points = parseInt(splitInput[0])
  const reason = splitInput[1]

  const msg = {
    command: 'add_points_team',
    points: points,
    team_color: `${props.color.toUpperCase()}`,
    game_time: mainStore.gametime,
    phase: `${mainStore.phase}`,
    reason: `${reason}`,
  }

  mainStore.SOCKET_SEND(msg)
  emit('toggleShowAddPoints')
}

defineExpose({ pointsAndReason, formatAndSendInputToWebsocket })
</script>

<style scoped>
.add-points-container {
  margin: auto !important;
}
.add-points-form {
  border-left: 0 !important;
  border-right: 0 !important;
  border-top: 0 !important;
  border-bottom: 1px solid !important;
  border-radius: 2px !important;
  outline: 0 !important;
  background-color: #2b3e50 !important;
}
.add-points-input {
  border-left: 0 !important;
  border-right: 0 !important;
  border-top: 0 !important;
  border-bottom: 0 !important;
  border-radius: 2px !important;
  outline: 0 !important;
  background-color: #2b3e50 !important;
  text-align: center !important;
  color: #fff;
  min-width: 25vw;
}
</style>
