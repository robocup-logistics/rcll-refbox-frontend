// TEMPLATE --------------------------------------------------------------------
<template>
  <div class="machine-entity-wrapper">
    <div class="machine-entity" :id="`machine-${machine.name}`">
      <div class="machine">
        <PopupWrapper style="height: 100%; width: 100%">
          <template #reference>
            <div class="img-wrapper">
              <img
                :src="`/machines/${getMachineFileName()}`"
                class="clickable"
                draggable="false"
              />
              <font-awesome-icon icon="fa-info-circle" class="info" />
              <WorkpieceEntity
                v-for="workpiece in havingWorkpieces"
                :class="['workpiece', workpiece.at_side]"
                :workpiece="workpiece"
              />
            </div>
          </template>
          <MachinePopup
            :machine="machine"
            :workpieces="havingWorkpieces"
          ></MachinePopup>
        </PopupWrapper>
      </div>
    </div>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { type PropType, watch, Ref, ref } from 'vue'
import type Machine from '@/types/Machine'
import MachinePopup from '@/components/spectator/popups/MachinePopup.vue'
import PopupWrapper from '@/components/shared/ui/PopupWrapper.vue'
import { useEventStore } from '@/store/eventStore'
import Workpiece from '@/types/Workpiece'
import { useOrderStore } from '@/store/orderStore'
import { storeToRefs } from 'pinia'
import WorkpieceEntity from '@/components/spectator/entities/WorkpieceEntity.vue'

// define props  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const props = defineProps({
  machine: {
    type: Object as PropType<Machine>,
    required: true,
  },
})

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const eventStore = useEventStore()
const orderStore = useOrderStore()
const { workpieces } = storeToRefs(orderStore)

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
      fileName += props.machine.available_color
      break
    }
    case 'RS': {
      fileName += '-'
      fileName += props.machine.available_colors.toString()
      break
    }
  }

  fileName += '.svg'
  return fileName
}

// -> watch workpieces - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const havingWorkpieces: Ref<Workpiece[]> = ref([])
watch(
  () => workpieces.value,
  (newWorkpieces, _) => {
    havingWorkpieces.value = newWorkpieces.filter(
      (workpiece) =>
        workpiece.holding == false && workpiece.at_machine == props.machine.name
    )
  },
  { immediate: true }
)
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

  .machine {
    height: 80%;
    width: 80%;

    .img-wrapper {
      height: 100%;
      width: 100%;
      transform: rotate(calc((v-bind('machine?.rotation') - 90) * -1deg));
      img {
        height: 100%;
        width: 100%;

        transition: all 400ms;
      }

      .info {
        position: absolute;
        top: 20%;
        right: -10%;
        transform: rotate(calc((v-bind('machine?.rotation') - 90) * 1deg));

        color: white;
        background-color: global.$surfaceColor;
        border-radius: 100%;
      }

      .workpiece {
        position: absolute;
        top: 50%;
        left: 50%;
        --add-transform: rotate(
          calc((v-bind('machine?.rotation') - 90) * 1deg)
        );

        &.INPUT {
          --add-transform: translateY(-120%)
            rotate(calc((v-bind('machine?.rotation') - 90) * 1deg));
        }

        &.OUTPUT {
          --add-transform: translateY(120%)
            rotate(calc((v-bind('machine?.rotation') - 90) * 1deg));
        }

        &.SLIDE {
          --add-transform: translate(-80%, -50%)
            rotate(calc((v-bind('machine?.rotation') - 90) * 1deg));
        }

        &.LEFT,
        &.MIDDLE,
        &.RIGHT {
          --add-transform: translate(80%, -50%)
            rotate(calc((v-bind('machine?.rotation') - 90) * 1deg));
        }
      }
    }
  }
}
</style>
