Workpiece entities are displayed right on the playing field as well as in the
popups of the entities (robots or machines) that currently hold them............
//TEMPLATE ---------------------------------------------------------------------
<template>
  <PopupWrapper v-if="clickable">
    <template #reference>
      <div class="workpiece-entity clickable">
        <img
          :src="`/workpieces/${fileNameByWorkpiece(workpiece)}`"
          alt="img"
          draggable="false"
        />
      </div>
    </template>
    <WorkpiecePopup :workpiece="workpiece" />
  </PopupWrapper>
  <div v-else class="workpiece-entity">
    <img
      :src="`/workpieces/${fileNameByWorkpiece(workpiece)}`"
      alt="img"
      draggable="false"
    />
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { type PropType } from 'vue'
import type Workpiece from '@/types/Workpiece'
import { useOrderStore } from '@/store/orderStore'
import { storeToRefs } from 'pinia'
import { useFieldStore } from '@/store/fieldStore'
import WorkpiecePopup from '@/components/spectator/popups/WorkpiecePopup.vue'
import PopupWrapper from '@/components/shared/ui/PopupWrapper.vue'

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
defineProps({
  workpiece: {
    type: Object as PropType<Workpiece>,
    required: true,
  },
  clickable: {
    type: Boolean as PropType<Boolean>,
    required: false,
    default: false,
  },
})

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const orderStore = useOrderStore()
const { fileNameByWorkpiece } = storeToRefs(orderStore)
const fieldStore = useFieldStore()
const { squareDiameterPixels } = storeToRefs(fieldStore)
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
.workpiece-entity {
  transform: translate(-50%, -50%) var(--add-transform);

  width: fit-content;
  aspect-ratio: 1;

  background-color: rgba(global.$lightestColor, 0.8);
  border-radius: 4px;
  font-size: 1px;

  display: flex;
  flex-direction: column;
  justify-content: center;

  img {
    width: calc(v-bind('squareDiameterPixels') * 0.3px);
    aspect-ratio: 1;
  }
}
</style>
