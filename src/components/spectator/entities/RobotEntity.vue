// TEMPLATE --------------------------------------------------------------------
<template>
  <div
    class="robot-entity"
    :id="`robot-${robot.team_color}-${robot.number}`"
    :style="{ '--robot-rotation': `${computedRotation}` }"
  >
    <div class="robot">
      <PopupWrapper>
        <template #reference>
          <div class="robot-container">
            <div class="robot-rotate">
              <img
                :src="`/robots/robot-${robot.team_color}${robot.number}.svg`"
                class="clickable robot-img"
                draggable="false"
              />
              <div class="workpiece-wrapper" v-if="holdingWorkpiece">
                <WorkpieceEntity
                  :workpiece="holdingWorkpiece"
                  class="workpiece"
                />
              </div>
              <div class="robot-number-wrapper">
                <img
                  :src="`/robots/robot-${robot.team_color}${robot.number}Nc.svg`"
                  class="robot-number"
                  draggable="false"
                />
              </div>
            </div>
            <font-awesome-icon icon="fa-info-circle" class="info" />
          </div>
        </template>
        <RobotPopup
          :robot="robot"
          :agent-task="robotAgentTask"
          :holding-workpiece="holdingWorkpiece"
        ></RobotPopup>
      </PopupWrapper>
    </div>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { ref, watch, type PropType, type Ref, computed } from 'vue'
import type Robot from '@/types/Robot'
import { storeToRefs } from 'pinia'
import { useFieldStore } from '@/store/fieldStore'
import RobotPopup from '@/components/spectator/popups/RobotPopup.vue'
import PopupWrapper from '@/components/shared/ui/PopupWrapper.vue'
import type AgentTask from '@/types/AgentTask'
import { useRobotStore } from '@/store/robotStore'
import { useOrderStore } from '@/store/orderStore'
import type Workpiece from '@/types/Workpiece'
import WorkpieceEntity from '@/components/spectator/entities/WorkpieceEntity.vue'
import { useConfigStore } from '@/store/configStore'

// define props  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const props = defineProps({
  robot: {
    type: Object as PropType<Robot>,
    required: true,
  },
})

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const robotStore = useRobotStore()
const { agentTasks } = storeToRefs(robotStore)
const orderStore = useOrderStore()
const { workpieces } = storeToRefs(orderStore)
const fieldStore = useFieldStore()
const {
  verticalFieldSize,
  fullHorizontalFieldSize,
  fieldWidthPixels,
  fieldHeightPixels,
  squareDiameterPixels,
  isMirroredX,
  isMirroredY,
} = storeToRefs(fieldStore)
const configStore = useConfigStore()

// watch agent tasks - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const robotAgentTask: Ref<AgentTask | undefined> = ref(undefined)
watch(
  () => agentTasks.value,
  (newAgentTasks, _) => {
    robotAgentTask.value = newAgentTasks.find(
      (agentTask) => agentTask.robot_id == props.robot.number,
    )
  },
  { immediate: true },
)

const computedRotation: ComputedRef<number> = computed(() => {
  const baseAngle = props.robot.pose[2] + 90
  if (isMirroredX.value && isMirroredY.value) {
    // When both axes are mirrored, it's equivalent to a 180° rotation of the base.
    // (baseAngle + 180) mod 360 is the same as (robot.pose[2] - 90)
    return props.robot.pose[2] - 90
  } else if (isMirroredY.value) {
    // Horizontal flip (mirror on Y axis): reflects the angle over a vertical line.
    return 180 - baseAngle
  } else if (isMirroredX.value) {
    // Vertical flip (mirror on X axis): reflects the angle over a horizontal line.
    return -baseAngle
  }
  return baseAngle
})

// watch holding workpieces  - - - - - - - - - - - - - - - - - - - - - - - - - -
const holdingWorkpiece: Ref<Workpiece | undefined> = ref(undefined)
watch(
  () => workpieces.value,
  (newWorkpieces, _) => {
    holdingWorkpiece.value = newWorkpieces.find(
      (workpiece) =>
        workpiece.holding == true &&
        workpiece.robot_holding == props.robot.number &&
        workpiece.team == props.robot.team_color,
    )
  },
  { deep: true, immediate: true },
)
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

.robot-entity {
  position: absolute;
  width: calc((v-bind('squareDiameterPixels') * 0.6) * 1px);
  height: calc((v-bind('squareDiameterPixels') * 0.6) * 1px);

  // Default: position relative to left and bottom
  left: calc(
    (v-bind('fieldWidthPixels') / 2 * 1px) +
      (
        v-bind('robot.pose[0]') *
          (v-bind('fieldWidthPixels') / v-bind('fullHorizontalFieldSize')) * 1px
      ) - (v-bind('squareDiameterPixels') * 0.3) * 1px
  );
  bottom: calc(
    v-bind('robot.pose[1]') *
      (v-bind('fieldHeightPixels') / v-bind('verticalFieldSize')) * 1px -
      (v-bind('squareDiameterPixels') * 0.3) * 1px
  );

  .robot {
    .robot-container {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .robot-rotate {
      transform: rotate(calc(var(--robot-rotation) * 1deg));
    }

    .robot-img {
      height: 100%;
      width: 100%;
    }

    .info {
      position: absolute;
      top: 0;
      right: 0;

      color: white;
      background-color: global.$surfaceColor;
      border-radius: 100%;
    }

    .workpiece-wrapper {
      position: absolute;
      top: 23%;
      left: 70%;
    }
    /* Optional: offset the workpiece inside the wrapper to set its orbit radius */
    .workpiece {
      transform: rotate(calc(var(--robot-rotation) * -1deg));
    }
    .robot-number-wrapper {
      width: 100%;
      height: 100%;
    }

    .robot-number {
      position: absolute;
      top: 20%;
      left: 15%;
      width: 45%;
      height: 45%;
      transform-origin: center center;

      /* animation: spins 2s linear infinite; */
      transform: rotate(calc((var(--robot-rotation) + 90) * -1deg));
    }
  }
}

// When mirroring horizontally (i.e. isMirroredY), we want to use the right property instead of left.
.robot-entity.mirroredY {
  left: auto; // disable left
  right: calc(
    (v-bind('fieldWidthPixels') / 2 * 1px) +
      (
        v-bind('robot.pose[0]') *
          (v-bind('fieldWidthPixels') / v-bind('fullHorizontalFieldSize')) * 1px
      ) - (v-bind('squareDiameterPixels') * 0.3) * 1px
  );
}

// When mirroring vertically (i.e. isMirroredX), we want to use the top property instead of bottom.
.robot-entity.mirroredX {
  top: auto; // disable bottom
  bottom: calc(
    (
        v-bind('fieldHeightPixels') -
          (
            v-bind('robot.pose[1]') *
              (v-bind('fieldHeightPixels') / v-bind('verticalFieldSize'))
          )
      ) * 1px - (v-bind('squareDiameterPixels') * 0.3) * 1px
  );
}
</style>
