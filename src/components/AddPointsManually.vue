<template>
  <div class="add-points-container">
    <form @submit.prevent="formatAndSendInputToWebsocket(pointsAndReason)" class="add-points-form">
      <input type="text" class="p-0 add-points-input" required placeholder="Format: points, reason"
             v-model="pointsAndReason"
             ref="addInput"
      >
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, onMounted, nextTick } from 'vue'
import { useMainStore } from '@/store/mainStore'

const props = defineProps({
  color: {
    type: String,
    required: true
  }
})

const emit = defineEmits<{
  (e: 'toggleShowAddPoints'): void
}>()

const mainStore = useMainStore()

const addInput: Ref<HTMLInputElement | null> = ref(null)

onMounted(() => {
  nextTick(() => {
    if(addInput.value) addInput.value.focus()
  })
})

function formatAndSendInputToWebsocket(input: string){

  // Input Format: points, Reason
  const splitInput = input.split(/,(.+)/)
  const points = parseInt(splitInput[0])
  const reason = splitInput[1]
  
  const msg = {
    "command": "add_points_team",
    "points": points,
    "team_color": `${props.color.toUpperCase()}`,
    "game_time": mainStore.gametime,
    "phase": `${mainStore.phase}`,
    "reason": `${reason}`
  }

  mainStore.sendAddPointsTeam(msg)
  emit('toggleShowAddPoints')
}

defineExpose({addInput, formatAndSendInputToWebsocket})
</script>

<style scoped>
.add-points-container{
  margin: auto !important;
}
.add-points-form{
 border-left: 0 !important;
  border-right: 0 !important;
  border-top: 0 !important;
  border-bottom: 1px solid !important;
  border-radius: 2px !important;
  outline: 0 !important;
  background-color: #2B3E50 !important;
}
.add-points-input{
    border-left: 0 !important;
  border-right: 0 !important;
  border-top: 0 !important;
  border-bottom: 0 !important;
  border-radius: 2px !important;
  outline: 0 !important;
  background-color: #2B3E50 !important;
  text-align: center !important;
  color: #FFF;
  min-width: 25vw;
}
</style>