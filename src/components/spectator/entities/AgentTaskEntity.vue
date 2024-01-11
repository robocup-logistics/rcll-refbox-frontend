// TEMPLATE --------------------------------------------------------------------
<template>
  <svg class="svg">
    <defs>
      <marker
        id="arrow"
        markerWidth="10"
        markerHeight="10"
        :refX="viewStore.squareDiameterPixels * 0.2"
        refY="3"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path class="arrow-path" d="M0,0 L0,6 L9,3 z"></path>
      </marker>
    </defs>
    <line
      :class="['line', task.task_type == 'MOVE' ? 'arrow' : '']"
      ref="line"
    />
  </svg>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { ref, watch } from 'vue'
import type { PropType, Ref } from 'vue'
import type AgentTask from '@/types/AgentTask'
import { useViewStore } from '@/store/viewStore'
import Robot from '@/types/Robot'

// define props  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const props = defineProps({
  task: {
    type: Object as PropType<AgentTask>,
    required: true,
  },
  robot: {
    type: Object as PropType<Robot | null>,
    required: true,
  },
})

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const viewStore = useViewStore()

// draw arrow  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const line: Ref<SVGLineElement | null> = ref(null)
function drawLine() {
  if (line.value && props.robot) {
    const robotPos = viewStore.positionOfRobot(props.robot)
    const waypointPos = viewStore.positionOfWaypoint(
      props.task.task_parameters[1]
    )

    // set the line position
    line.value.setAttribute('x1', `${robotPos[0]}`)
    line.value.setAttribute('y1', `${robotPos[1]}`)
    line.value.setAttribute('x2', `${waypointPos[0]}`)
    line.value.setAttribute('y2', `${waypointPos[1]}`)

    // make the line end appear like it stops before its real end (only pointing
    // at it)
    line.value.setAttribute(
      'stroke-dasharray',
      `${line.value.getTotalLength() - viewStore.squareDiameterPixels / 3}`
    )
  }
}

// redraw arrow when window size, playing field size or the robot's position
// changes and once initially after the line element has been created
window.addEventListener('resize', () => drawLine())
watch(
  () => viewStore.squareDiameterPixels,
  () => {
    drawLine()
  }
)
watch(
  () => props.robot,
  () => {
    drawLine()
  },
  { deep: true }
)
watch(
  () => line.value,
  () => {
    drawLine()
  },
  { immediate: true }
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

  &.arrow {
    marker-end: url(#arrow);
  }
}

.arrow-path {
  fill: global.$surfaceColor;
}
</style>
