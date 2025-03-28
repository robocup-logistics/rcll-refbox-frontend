// TEMPLATE --------------------------------------------------------------------
<template>
  <div class="machine-entity-wrapper">
    <div class="machine-entity" :id="`machine-${machine.name}`">
      <div class="machine">
        <PopupWrapper
          :spectatorOnly="inEditMode"
          style="height: 100%; width: 100%"
        >
          <template #reference>
            <div
              class="img-wrapper"
              :class="{ mirroredX: isMirroredX, mirroredY: isMirroredY }">
              <img :src="`/machines/${getMachineFileName()}`"
                class="clickable"
                draggable="false"
              />
              <font-awesome-icon
                icon="fa-info-circle"
                :class="{ mirroredX: isMirroredX, mirroredY: isMirroredY }"
                class="info"
              />
              <WorkpieceEntity
                v-for="workpiece in havingWorkpieces"
                :class="[
                  'workpiece',
                  workpiece.at_side,
                  { mirroredX: isMirroredX, mirroredY: isMirroredY },
                ]"
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
import { useFieldStore } from '@/store/fieldStore'
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

const fieldStore = useFieldStore()
const { inEditMode, isMirroredX, isMirroredY } = storeToRefs(fieldStore)

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
        workpiece.holding == false &&
        workpiece.at_machine == props.machine.name,
    )
  },
  { deep: true, immediate: true },
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

    .img-wrapper.mirroredX {
      /* Mirror horizontally using scaleX(-1) */
      transform: scaleY(-1) rotate(calc((v-bind('machine?.rotation') - 90) * -1deg));
    }

    .img-wrapper.mirroredY {
      /* Mirror vertically using scaleY(-1) */
      transform: scaleX(-1) rotate(calc((v-bind('machine?.rotation') - 90) * -1deg));
    }

    .img-wrapper.mirroredX.mirroredY {
      /* Both mirrors: equivalent to scale(-1) which flips both axes */
      transform: rotate(calc((v-bind('machine?.rotation') - 90) * -1deg)) scale(-1);
    }

    .img-wrapper {
      height: 100%;
      width: 100%;
      transform: rotate(calc((v-bind('machine?.rotation') - 90) * -1deg));

      img {
        height: 100%;
        width: 100%;

        /* transition: all 400ms; */
      }

      .info {
        position: absolute;
        top: 20%;
        right: -10%;
        --add-transform: rotate(calc((v-bind('machine?.rotation') - 90) * 1deg));

        transform: var(--add-transform);
        color: white;
        background-color: global.$surfaceColor;
        border-radius: 100%;

        &.mirroredX {
            transform: var(--add-transform) scaleY(-1);
        }
        &.mirroredY {
            transform: var(--add-transform) scaleX(-1);
        }
        &.mirroredY.mirroredX {
            transform: var(--add-transform) scale(-1);
        }
      }

      .workpiece {
        position: absolute;
        top: 20%;
        left: 30%;
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
        &.mirroredX {
            transform: var(--add-transform) scaleY(-1);
        }
        &.mirroredY {
            transform: var(--add-transform) scaleX(-1);
        }
        &.mirroredY.mirroredX {
            transform: var(--add-transform) scale(-1);
        }
        transform: var(--add-transform);
      }
    }
  }
}

.mirroredY {
  /* transform: scaleX(-1); */
}
.mirroredY.mirroredX {
  /* transform: scale(-1, -1); */
}
</style>
