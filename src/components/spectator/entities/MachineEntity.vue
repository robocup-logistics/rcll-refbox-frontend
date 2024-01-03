// TEMPLATE --------------------------------------------------------------------
<template>
  <div class="machine-entity" :id="`machine-${machine.name}`">
    <div class="machine">
      <PopupWrapper>
        <template #reference>
          <img :src="`/machines/${getMachineFileName()}`" class="clickable" />
        </template>
        <MachinePopup :machine="machine"></MachinePopup>
      </PopupWrapper>
    </div>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import type { PropType } from 'vue'
import type Machine from '@/types/Machine'
import MachinePopup from '@/components/spectator/popups/MachinePopup.vue'
import PopupWrapper from '@/components/shared/ui/PopupWrapper.vue'
import type MachineCS from '@/types/MachineCS'
import type MachineRS from '@/types/MachineRS'

// define props  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const props = defineProps({
  machine: {
    type: Object as PropType<Machine>,
    required: true,
  },
})

// get file name - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function getMachineFileName(): string {
  let fileName = 'machine'
  if (props.machine.team) {
    fileName += '-'
    fileName += props.machine.team
  }
  fileName += '-'
  fileName += props.machine.mtype

  switch (props.machine.mtype) {
    case 'CS': {
      fileName += '-'
      fileName += (<MachineCS>props.machine).cs_color
      break
    }
    case 'RS': {
      fileName += '-'
      fileName += (<MachineRS>props.machine).rs_ring_colors.toString()
      break
    }
  }

  fileName += '.svg'
  return fileName
}
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

.machine-entity {
  position: absolute;
  height: 100%;
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  /* z-index: 2; */

  .machine {
    height: 80%;
    width: 80%;
    border-radius: 20px;

    img {
      height: 100%;
      width: 100%;
      transform: rotate(calc((v-bind('machine?.rotation') - 90) * 1deg));
      transition: all 400ms;
    }
  }
}
</style>
