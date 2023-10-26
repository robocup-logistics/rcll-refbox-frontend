// TEMPLATE --------------------------------------------------------------------
<template>
  <div class="robot-entity">
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
import { computed } from 'vue'
import type { PropType, ComputedRef, StyleValue } from 'vue'
import type Robot from '@/types/Robot'
import { storeToRefs } from 'pinia'
import { useViewStore } from '@/store/viewStore'
import RobotPopup from '@/components/spectator/popups/RobotPopup.vue'
import PopupWrapper from '@/components/shared/ui/PopupWrapper.vue'

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
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

.robot-entity {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: calc((v-bind('squareDiameterPixels') * 0.7) * 1px);
  height: calc((v-bind('squareDiameterPixels') * 0.7) * 1px);
  transform: translate(
    calc(
      -50% + (v-bind('parseFloat(robot.pose[0])') *
            v-bind('fieldWidthPixels / fullHorizontalFieldSize') * 1px)
    ),
    calc(
      50% -
        (
          v-bind('parseFloat(robot.pose[1])') *
            v-bind('fieldHeightPixels / verticalFieldSize') * 1px
        )
    )
  );

  img {
    height: 80%;
    width: 80%;
    transform: rotate(calc((v-bind('robot.pose[2]') + 90) * 1deg));
  }
}
</style>
