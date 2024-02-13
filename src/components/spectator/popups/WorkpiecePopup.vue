// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup :title="`Workpiece ${workpiece.name}`">
    <WorkpieceExplainable />
    <div class="horizontal-flex" style="align-items: stretch">
      <img
        :src="`/workpieces/${fileNameByWorkpiece(workpiece)}`"
        alt="img"
        draggable="false"
      />
      <div class="description">
        <p>
          Cap:
          <span v-if="workpiece.cap_color">{{
            colorStringByWorkpieceColor(workpiece.cap_color)
          }}</span
          ><span v-else>-</span>
        </p>
        <p>
          Rings:
          <span
            v-if="workpiece.ring_colors.length"
            v-for="ringColor in workpiece.ring_colors"
            class="ring-color"
            >{{ colorStringByWorkpieceColor(ringColor) }}</span
          >
          <span v-else>-</span>
        </p>
        <p>
          Base:
          <span v-if="workpiece.base_color">{{
            colorStringByWorkpieceColor(workpiece.base_color)
          }}</span
          ><span v-else>-</span>
        </p>
      </div>
    </div>
  </Popup>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { type PropType } from 'vue'
import Popup from '@/components/shared/ui/Popup.vue'
import type Workpiece from '@/types/Workpiece'
import { useOrderStore } from '@/store/orderStore'
import { storeToRefs } from 'pinia'
import { useFieldStore } from '@/store/fieldStore'
import WorkpieceExplainable from '@/components/spectator/explainables/WorkpieceExplainable.vue'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const orderStore = useOrderStore()
const { fileNameByWorkpiece, colorStringByWorkpieceColor } =
  storeToRefs(orderStore)
const fieldStore = useFieldStore()
const { squareDiameterPixels } = storeToRefs(fieldStore)

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
defineProps({
  workpiece: {
    type: Object as PropType<Workpiece>,
    required: true,
  },
})
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

img {
  width: calc(v-bind('squareDiameterPixels') * 1px);
  aspect-ratio: 1;
}

.description {
  flex-grow: 1;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  text-wrap: nowrap;

  .ring-color + .ring-color:before {
    content: ', ';
  }
}
</style>
