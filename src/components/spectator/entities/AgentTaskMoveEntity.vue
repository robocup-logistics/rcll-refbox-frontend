// TEMPLATE --------------------------------------------------------------------
<template>
  <svg id="svg">
    <defs>
      <marker
        id="arrow"
        markerWidth="10"
        markerHeight="10"
        :refX="viewStore.squareDiameterPixels * 0.3"
        refY="3"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path id="arrowPath" d="M0,0 L0,6 L9,3 z"></path>
      </marker>
    </defs>
    <line id="line" ref="line" />
  </svg>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { ref, watch } from 'vue'
import type { PropType, Ref } from 'vue'
import type Robot from '@/types/Robot'
import { useViewStore } from '@/store/viewStore'

// define props  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const props = defineProps({
  robot: {
    type: Object as PropType<Robot>,
    required: true,
  },
  waypoint: {
    type: String,
    required: true,
  },
})

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const viewStore = useViewStore()

// draw arrow  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const line: Ref<SVGLineElement | null> = ref(null)
function drawArrow() {
  if (line.value) {
    const robotPos = viewStore.positionOfRobot(props.robot)
    const waypointPos = viewStore.positionOfZone('M_Z34')

    // set the line position
    line.value.setAttribute('x1', `${robotPos[0]}`)
    line.value.setAttribute('y1', `${robotPos[1]}`)
    line.value.setAttribute('x2', `${waypointPos[0]}`)
    line.value.setAttribute('y2', `${waypointPos[1]}`)

    // make the line end appear like it stops before its real end (only pointing
    // at it)
    line.value.setAttribute(
      'stroke-dasharray',
      `${line.value.getTotalLength() - viewStore.squareDiameterPixels / 2}`
    )
  }
}

// redraw arrow when window size or the robot's position changes and once
// initially after the line element has been created
window.addEventListener('resize', () => drawArrow())
watch(
  () => props.robot,
  () => {
    drawArrow()
  },
  { immediate: true, deep: true }
)
watch(
  () => line.value,
  () => {
    drawArrow()
  },
  { immediate: true }
)
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

#svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

#line {
  stroke-width: 2px;
  stroke: global.$accentColor;
  marker-end: url(#arrow);
}

#arrowPath {
  fill: global.$accentColor;
}
</style>
