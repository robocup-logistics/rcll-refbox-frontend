// TEMPLATE --------------------------------------------------------------------
<template>
  <div class="robot-entity" :id="`robot-${robot.team_color}-${robot.number}`">
    <div class="robot">
      <PopupWrapper>
        <template #reference>
          <img
            :src="`/robots/robot-${robot.team_color}.svg`"
            class="clickable"
          />
        </template>
        <RobotPopup :robot="robot"></RobotPopup>
      </PopupWrapper>
    </div>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { onMounted, ref } from 'vue'
import type { PropType, Ref } from 'vue'
import type Robot from '@/types/Robot'
import { storeToRefs } from 'pinia'
import { useViewStore } from '@/store/viewStore'
import RobotPopup from '@/components/spectator/popups/RobotPopup.vue'
import PopupWrapper from '@/components/shared/ui/PopupWrapper.vue'
import AgentTaskMoveEntity from '@/components/spectator/entities/AgentTaskMoveEntity.vue'

// define props  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const props = defineProps({
  robot: {
    type: Object as PropType<Robot>,
    required: true,
  },
})

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const viewStore = useViewStore()
const {
  verticalFieldSize,
  fullHorizontalFieldSize,
  fieldWidthPixels,
  fieldHeightPixels,
  squareDiameterPixels,
} = storeToRefs(viewStore)

// agent tasks
// -> move
const agentTaskMoveEntity: Ref<typeof AgentTaskMoveEntity | null> = ref(null)
onMounted(() => {
  if (agentTaskMoveEntity.value) {
    agentTaskMoveEntity.value.drawArrow()
  }
})
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
        v-bind('parseFloat(robot.pose[0])') *
          v-bind('fieldWidthPixels / fullHorizontalFieldSize') * 1px
      ) - (v-bind('squareDiameterPixels') * 0.3) * 1px
  );
  bottom: calc(
    v-bind('parseFloat(robot.pose[1])') *
      v-bind('fieldHeightPixels / verticalFieldSize') * 1px -
      (v-bind('squareDiameterPixels') * 0.3) * 1px
  );
  /* z-index: 2; */

  .robot {
    img {
      height: 100%;
      width: 100%;
      transform: rotate(calc((v-bind('robot.pose[2]') + 90) * 1deg));
    }
  }
}
</style>
