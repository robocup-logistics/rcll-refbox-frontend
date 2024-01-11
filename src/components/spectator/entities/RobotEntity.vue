// TEMPLATE --------------------------------------------------------------------
<template>
  <div class="robot-entity" :id="`robot-${robot.team_color}-${robot.number}`">
    <div class="robot">
      <PopupWrapper>
        <template #reference>
          <font-awesome-icon icon="fa-info-circle" class="info" />
          <img
            :src="`/robots/robot-${robot.team_color}.svg`"
            class="clickable"
            draggable="false"
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

// define props  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
defineProps({
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

// watch holding workpieces  - - - - - - - - - - - - - - - - - - - - - - - - - -
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

    .info {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 2;
      color: white;
    }
  }
}
</style>
