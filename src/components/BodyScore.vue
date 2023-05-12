<template>
  <div class="awarded-points-parent-container">
    <div :class="['awarded-points-container-'+ color]">
      <div class="row m-0 text-left ">
        <div 
          class="col-md-6 " 
          v-for="(award,index) in selectPointsArray(color)" 
          :key='index'
        >
          <div v-if="selectPointsArray(color).length !== 0">
            <h6 style="font-size: 13px;">
              {{index + 1}}.
              [{{formatSeconds(award['game_time'])}}]
              {{award.phase.substring(0,3)}}
              <span class="text-light">{{award.points}}</span> point(s)
              <br>
              <span class="text-success" style="font-weight:300">{{award.reason}}</span>
              <!-- If the rest of the reason isn`t needed -->
              <!-- <span class="text-success" style="font-weight:300">{{award.reason.split(':')[0]}}</span> -->
            </h6>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store/mainStore'

const props = defineProps({
  color: {
    type: String,
    required: true
  }
})

const mainStore = useMainStore()
const { cyanAwardedPoints, magentaAwardedPoints } = storeToRefs(mainStore)

onMounted(() => {
  if (props.color === 'cyan') {
    scrollToEndOfCyanPointsDiv()
  } else {
    scrollToEndOfMagentaPointsDiv()
  }
})
 
watch(cyanAwardedPoints, () => {
  if (props.color === 'cyan') {
    setTimeout(scrollToEndOfCyanPointsDiv, 500)
  }
})

watch(magentaAwardedPoints, () => {
  if (props.color === 'magenta') {
    setTimeout(scrollToEndOfMagentaPointsDiv, 500)
  }
})

// scroll to end of cyan points div
function scrollToEndOfCyanPointsDiv() {
  let container = document.querySelector('.awarded-points-container-cyan');
  if (container) container.scrollTop = container.scrollHeight;
}

// scroll to end of magenta points div
function scrollToEndOfMagentaPointsDiv() {
  let container = document.querySelector('.awarded-points-container-magenta');
  if (container) container.scrollTop = container.scrollHeight;
}

function selectPointsArray(color: string){
  if (color === 'cyan') {
    return cyanAwardedPoints.value
  } else {
    return magentaAwardedPoints.value
  }
}

defineExpose({ selectPointsArray })
</script>

<style scoped>
.awarded-points-container-magenta, .awarded-points-container-cyan{
  overflow: auto !important;
  height: 33vh !important;
}

</style>