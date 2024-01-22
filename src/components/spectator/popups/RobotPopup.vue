// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup
    :title="`<span class='${robot.team_color}-text'>${
      robot.team
    }</span> ${nameByRobot(robot)}`"
    icon="fa-robot"
  >
    <div class="horizontal-flex" style="justify-content: space-between">
      <!-- maintenance cycles -->
      <div
        class="horizontal-flex"
        :style="{
          color:
            robot.maintenance_cycles > MAX_MAINTENANCE_CYCLES
              ? 'red '
              : 'unset',
        }"
      >
        <font-awesome-icon icon="fa-screwdriver-wrench" />
        <span>{{ robot.maintenance_cycles }}/2</span>
      </div>

      <!-- state -->
      <div
        class="horizontal-flex"
        :style="{ color: color, 'padding-left': '5px' }"
      >
        <font-awesome-icon
          v-if="robot.warning_sent"
          icon="fa-triangle-exclamation"
        />
        <font-awesome-icon
          v-else-if="robot.state == 'ACTIVE'"
          icon="fa-circle"
          beat
          style="--fa-animation-duration: 2s"
        />
        <font-awesome-icon
          v-else-if="robot.state == 'MAINTENANCE'"
          icon="fa-screwdriver-wrench"
          shake
          style="--fa-animation-duration: 5s"
        />
        <span>{{ robot.warning_sent ? 'DISCONNECTED' : robot.state }}</span>
        <PopupWrapper
          v-if="robot.state == 'DISQUALIFIED'"
          popup-position="bottom"
        >
          <template #reference>
            <font-awesome-icon class="clickable" icon="fa-info-circle" />
          </template>
          <Popup title="Reason">
            <p v-if="robot.maintenance_cycles > MAX_MAINTENANCE_CYCLES">
              The robot exceeded the maximum number of allowed maintenance
              phases ({{ robot.maintenance_cycles }}/{{
                MAX_MAINTENANCE_CYCLES
              }})
            </p>
            <p v-else>
              The last maintenance phase lasted longer than two minutes
              {{ MAX_MAINTENANCE_CYCLES }}
            </p>
          </Popup>
        </PopupWrapper>
      </div>
    </div>

    <!-- agent task -->
    <div v-if="agentTask" class="horizontal-flex content-box">
      <template v-if="agentTask.task_type == 'MOVE'">
        <span><b>MOVING</b> to {{ agentTask.task_parameters.waypoint }}</span>
      </template>
      <template v-else-if="agentTask.task_type == 'RETRIEVE'">
        <span
          ><b>RETRIEVING</b> at {{ agentTask.task_parameters.machine_id }}</span
        >
      </template>
      <template v-else-if="agentTask.task_type == 'DELIVER'">
        <span
          ><b>DELIVERING</b> at {{ agentTask.task_parameters.machine_id }}</span
        >
      </template>
    </div>

    <!-- holding workpiece -->
    <div v-if="holdingWorkpiece" class="content-box horizontal-flex">
      <b>HOLDING</b><WorkpieceEntity :workpiece="holdingWorkpiece" clickable />
    </div>
  </Popup>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { computed, type PropType, type ComputedRef } from 'vue'
import type Robot from '@/types/Robot'
import { useRobotStore } from '@/store/robotStore'
import Popup from '@/components/shared/ui/Popup.vue'
import PopupWrapper from '@/components/shared/ui/PopupWrapper.vue'
import type AgentTask from '@/types/AgentTask'
import { storeToRefs } from 'pinia'
import type Workpiece from '@/types/Workpiece'
import WorkpieceEntity from '@/components/spectator/entities/WorkpieceEntity.vue'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const robotStore = useRobotStore()
const { MAX_MAINTENANCE_CYCLES, nameByRobot } = storeToRefs(robotStore)

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const props = defineProps({
  robot: {
    type: Object as PropType<Robot>,
    required: true,
  },
  agentTask: {
    type: Object as PropType<AgentTask>,
    required: false,
  },
  holdingWorkpiece: {
    type: Object as PropType<Workpiece>,
    required: false,
  },
})

// state styling - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const color: ComputedRef<string> = computed(() => {
  if (props.robot.warning_sent) {
    return 'red'
  }
  switch (props.robot.state) {
    case 'ACTIVE':
      return 'green'
    case 'MAINTENANCE':
      return 'yellow'
    case 'DISQUALIFIED':
      return 'red'
  }
  return 'unset'
})
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
</style>
