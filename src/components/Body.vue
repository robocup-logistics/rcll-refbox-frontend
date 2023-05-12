<template>
  <div >
    <div class="row m-0">
      <div class="team-cyan-body-container col-md-6 border ">
        <div class="row " >
          <div class="col-md-3 body-machines-container p-0 border-right">
            <BodyMachines color='cyan'/>
          </div>

          <div class="col-md-9 p-0 mt-1">
            <div class="d-flex flex-column m-0">
              <div class="robots-container col-md-12 p-0 "
                  :class="phase === 'PRE_GAME' ? 'border-0' : 'border-bottom'">
                <BodyRobots v-if="phase !== 'PRE_GAME'" color='cyan'/>
              </div>
              <div class="score-container col-md-12 p-0 "
                   :class="phase === 'PRE_GAME' ? '' : ''"  >
                <BodyScore v-if="phase !== 'PRE_GAME'" color='cyan'/>
              </div>
            </div>
          </div>  
        </div>
      </div>

      <div class="team-magenta-body-container col-md-6 border">
        <div class="row " >

          <div class="col-md-9 p-0 mt-1">
            <div class="d-flex flex-column m-0">
              <div class="robots-container col-md-12 p-0 "
                  :class="phase === 'PRE_GAME' ? 'border-0' : 'border-bottom'">
                <BodyRobots v-if="phase !== 'PRE_GAME'" color='magenta' />
              </div>
              <div class="score-container col-md-12 p-0 "
                   :class="phase === 'PRE_GAME' ? '' : ''"  >
                <BodyScore v-if="phase !== 'PRE_GAME'" color='magenta'/>
              </div>
            </div>
          </div>  
          <div class="col-md-3 body-machines-container p-0 border-left">
            <BodyMachines color='magenta'/>
          </div>
          <!-- Magenta Row ends here -->
        </div>
      </div>
    </div>

    <div class="border-right border-left row m-0 log-msgs-main-container h-100"
         :style="phase === 'PRE_GAME' ? 'height: 35vh !important;' : ''">
      <BodyRefboxLog class="border-bottom-0 p-0 pb-3 col-md-9 bodyRefboxLogCmp"/>
      <AttentionMessagesLogger class="col-md-3 p-0 overflow-auto"/>
    </div>

  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store/mainStore'
import BodyMachines from '@/components/BodyMachines.vue'
import BodyScore from '@/components/BodyScore.vue'
import BodyRobots from '@/components/BodyRobots.vue'
import BodyRefboxLog from '@/components/BodyRefboxLog.vue'
import AttentionMessagesLogger from '@/components/AttentionMessagesLogger.vue'

const mainStore = useMainStore()
const { phase } = storeToRefs(mainStore)
mainStore.connectToWebsocket()

defineExpose({phase})
</script>

<style scoped>
.team-cyan-body-container, .team-magenta-body-container {
  min-height: 40vh !important;
}
.log-msgs-main-container {
  height:30vh;
}
.bodyRefboxLogCmp {
  overflow-y: auto;
}
.score-container {
  padding-top: 0.1rem !important;
}
</style>