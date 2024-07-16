// TEMPLATE --------------------------------------------------------------------
<template>
  <div class="robot-entity" :id="`robot-${robot.team_color}-${robot.number}`">
    <div class="robot">
      <PopupWrapper>
        <template #reference>
          <img
            :src="`/robots/robot-${robot.team_color}.svg`"
            class="clickable"
            draggable="false"
          />
          <font-awesome-icon icon="fa-info-circle" class="info" />
          <WorkpieceEntity
            v-if="holdingWorkpiece"
            :workpiece="holdingWorkpiece"
            class="workpiece"
          />
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
import { ref, watch, type PropType, type Ref } from 'vue'
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

// watch holding workpieces  - - - - - - - - - - - - - - - - - - - - - - - - - -
const holdingWorkpiece: Ref<Workpiece | undefined> = ref(undefined)
watch(
  () => workpieces.value,
  (newWorkpieces, _) => {
    holdingWorkpiece.value = newWorkpieces.find(
      (workpiece) =>
        workpiece.holding == true &&
        workpiece.robot_holding == props.robot.number,
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
  left: calc(
    (v-bind('fieldWidthPixels') / 2 * 1px) +
      (
        v-bind('robot.pose[0]') *
          v-bind('fieldWidthPixels / fullHorizontalFieldSize') * 1px
      ) - (v-bind('squareDiameterPixels') * 0.3) * 1px
  );
  bottom: calc(
    v-bind('robot.pose[1]') * v-bind('fieldHeightPixels / verticalFieldSize') *
      1px - (v-bind('squareDiameterPixels') * 0.3) * 1px
  );

  .robot {
    img {
      height: 100%;
      width: 100%;
      transform: rotate(calc((v-bind('robot.pose[2]') + 90) * 1deg));
    }

    .info {
      position: absolute;
      top: 0;
      right: 0;

      color: white;
      background-color: global.$surfaceColor;
      border-radius: 100%;
    }

    .workpiece {
      position: absolute;
      top: 120%;
      left: 50%;
      --add-transform: rotate(calc((v-bind('robot.pose[2]')) * -1deg));
    }
  }
}
</style>
