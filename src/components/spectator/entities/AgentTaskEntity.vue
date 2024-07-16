// TEMPLATE --------------------------------------------------------------------
<template>
  <svg class="svg">
    <defs>
      <marker
        :id="`arrow-${task.task_id}-${task.robot_id}`"
        markerWidth="10"
        markerHeight="10"
        :refX="squareDiameterPixels * -0.2"
        refY="3"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path class="arrow-path" d="M9,0 L9,6 0,3 z"></path>
      </marker>
    </defs>
    <path
      :d="`M${waypointPos[0]} ${waypointPos[1]}, L${robotPos[0]} ${robotPos[1]}`"
      :stroke-dasharray="
        task.task_type == 'MOVE' ? `0 ${squareDiameterPixels / 2} 200%` : 'none'
      "
      :marker-start="
        task.task_type == 'MOVE'
          ? `url(#arrow-${task.task_id}-${task.robot_id})`
          : 'none'
      "
      :id="`line-${task.task_id}-${task.robot_id}`"
      class="line"
    />
    <circle
      r="5"
      fill="black"
      v-if="['RETRIEVE', 'DELIVER'].includes(task.task_type)"
    >
      <animateMotion
        dur="2s"
        repeatCount="indefinite"
        :keyPoints="task.task_type == 'RETRIEVE' ? '0;1' : '1;0'"
        keyTimes="0;1"
      >
        <mpath :href="`#line-${task.task_id}-${task.robot_id}`" />
      </animateMotion>
    </circle>
  </svg>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { computed } from 'vue'
import type { ComputedRef, PropType } from 'vue'
import type AgentTask from '@/types/AgentTask'
import { useFieldStore } from '@/store/fieldStore'
import Robot from '@/types/Robot'
import { storeToRefs } from 'pinia'

// define props  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const props = defineProps({
  task: {
    type: Object as PropType<AgentTask>,
    required: true,
  },
  robot: {
    type: Object as PropType<Robot>,
    required: true,
  },
})

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const fieldStore = useFieldStore()
const { squareDiameterPixels, positionOfRobot, positionOfWaypoint } =
  storeToRefs(fieldStore)

// endpoints of line - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const robotPos: ComputedRef<[number, number]> = computed(
  () => positionOfRobot.value(props.robot) || [0, 0],
)
const waypointPos: ComputedRef<[number, number]> = computed(
  () =>
    positionOfWaypoint.value(
      props.task.task_type == 'MOVE'
        ? props.task.task_parameters.waypoint
        : props.task.task_parameters.machine_id,
    ) || [0, 0],
)
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

.svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.line {
  stroke-width: 2px;
  stroke: global.$surfaceColor;
}

.arrow-path {
  fill: global.$surfaceColor;
}
</style>
