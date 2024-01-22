// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup
    :title="`<span class='${machine.team}-text'>Machine ${machine.name}</span>`"
    icon="fa-gears"
    class="machine-popup"
  >
    <!-- ABOUT MACHINE TYPE -->
    <div>
      <span>Type: </span>
      <BaseStationExplainable v-if="machine.mtype == 'BS'" />
      <CapStationExplainable v-else-if="machine.mtype == 'CS'" />
      <DeliveryStationExplainable v-else-if="machine.mtype == 'DS'" />
      <RingStationExplainable v-else-if="machine.mtype == 'RS'" />
      <StorageStationExplainable v-else-if="machine.mtype == 'SS'" />
    </div>

    <!-- STATION-SPECIFIC INFORMATION -->
    <!-- -> base station -->
    <template v-if="machine.mtype == 'BS'">
      <p>Available bases:</p>
      <div class="content-box horizontal-flex">
        <img :src="`/workpieces/BASE_BLACK.svg`" alt="BASE_BLACK" />
        <img :src="`/workpieces/BASE_RED.svg`" alt="BASE_RED" />
        <img :src="`/workpieces/BASE_SILVER.svg`" alt="BASE_SILVER" />
      </div>
    </template>

    <!-- -> cap station -->
    <template v-else-if="machine.mtype == 'CS'">
      <div class="content-box shelf">
        <div class="shelf-shelf cs">
          <div class="shelf-slot" v-for="_slot in 3">
            <img
              :src="`/workpieces/BASE_CLEAR-${machine.available_color}.svg`"
              :alt="`BASE_CLEAR-${machine.available_color}`"
            />
          </div>
        </div>
      </div>
    </template>

    <!-- -> delivery station -->
    <template v-else-if="machine.mtype == 'DS'">
      <template
        v-if="ordersDeliveredByTeam(teamNameByColor(machine.team)).length"
      >
        <p>Delivered orders (by {{ teamNameByColor(machine.team) }}):</p>
        <div class="horizontal-flex content-box">
          <OrderEntity
            v-for="order in ordersDeliveredByTeam(
              teamNameByColor(machine.team)
            )"
            :order="order"
          >
          </OrderEntity>
        </div>
      </template>
      <template v-else>
        <p>
          <span :class="`${machine.team}-text`">{{
            teamNameByColor(machine.team)
          }}</span>
          has not delivered any order yet.
        </p>
      </template>
    </template>

    <!-- -> ring station -->
    <template v-else-if="machine.mtype == 'RS'">
      <p>Available rings:</p>
      <div v-for="ringColor in machine.available_colors" class="content-box">
        <div class="horizontal-flex">
          <img :src="`/workpieces/${ringColor}.svg`" :alt="ringColor" />
          <div class="horizontal-flex">
            <font-awesome-icon icon="fa-coins" />
            <span>:</span>
            <p
              v-if="
                ringSpecs.find((ringspec) => ringspec.color == ringColor)
                  ?.req_bases == 0
              "
            >
              free
            </p>
            <p v-else>
              <template
                v-if="
                  machine.bases_added != undefined &&
                  machine.bases_used != undefined
                "
              >
                <span
                  :class="[(<RingSpec>ringSpecs.find((ringspec) => ringspec.color == ringColor))
                .req_bases - (machine.bases_added - machine.bases_used) > 0 ? 'text-warning' : 'text-success']"
                >
                  {{ machine.bases_added - machine.bases_used }}
                </span>
                <span>/</span>
              </template>
              <span
                >{{
                  ringSpecs.find((ringspec) => ringspec.color == ringColor)
                    ?.req_bases
                }}
                bases</span
              >
            </p>
          </div>
        </div>
      </div>
    </template>

    <!-- -> storage station -->
    <template v-else-if="machine.mtype == 'SS'">
      <div class="horizontal-flex text-warning">
        <font-awesome-icon icon="fa-warning" />
        <span>
          The storage station shelf can not be displayed because this feature is
          not yet implemented in the current version of the RefBox!
        </span>
      </div>
      <!-- Replace the upper part of the part below as soon as base_color, ring_colors and cap_color are available -->
      <!-- <div class="content-box shelf">
        <div class="shelf-shelf ss" v-for="shelf in 6">
          <div class="shelf-slot" v-for="slot in 8">
            <img
              v-if="
                shelfSlots.find(
                  (slotFi) =>
                    slotFi.name == machine.name &&
                    slotFi.shelf == shelf &&
                    slotFi.slot == slot
                )
              "
              :src="`/workpieces/${fileNameByWorkpiece(<ShelfSlot>shelfSlots.find(slotFi => slotFi.name == machine.name && slotFi.shelf == shelf && slotFi.slot == slot))}`"
            />
          </div>
        </div>
      </div> -->
    </template>

    <!-- WORKPIECES -->
    <template v-if="workpieces && workpieces.length">
      <p>Workpieces:</p>
      <div
        class="content-box horizontal-flex workpiece-box"
        v-if="workpiecesAtInput.length"
      >
        <p>at the input:</p>
        <WorkpieceEntity
          v-for="workpiece in workpiecesAtInput"
          :workpiece="workpiece"
          clickable
        />
      </div>
      <div
        class="content-box horizontal-flex workpiece-box"
        v-if="workpiecesAtOutput.length"
      >
        <p>at the output:</p>
        <WorkpieceEntity
          v-for="workpiece in workpiecesAtOutput"
          :workpiece="workpiece"
          clickable
        />
      </div>
      <div
        class="content-box horizontal-flex workpiece-box"
        v-if="workpiecesAtShelf.length"
      >
        <p>at the shelf:</p>
        <WorkpieceEntity
          v-for="workpiece in workpiecesAtShelf"
          :workpiece="workpiece"
          clickable
        />
      </div>
      <div
        class="content-box horizontal-flex workpiece-box"
        v-if="workpiecesAtSlide.length"
      >
        <p>in the payment slideeeeee:</p>
        <WorkpieceEntity
          v-for="workpiece in workpiecesAtSlide"
          :workpiece="workpiece"
          clickable
        />
      </div>
    </template>
  </Popup>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { computed, type ComputedRef, type PropType } from 'vue'
import type Machine from '@/types/Machine'
import Popup from '@/components/shared/ui/Popup.vue'
import { useMachineStore } from '@/store/machineStore'
import { storeToRefs } from 'pinia'
import BaseStationExplainable from '@/components/spectator/explainables/BaseStationExplainable.vue'
import CapStationExplainable from '@/components/spectator/explainables/CapStationExplainable.vue'
import DeliveryStationExplainable from '@/components/spectator/explainables/DeliveryStationExplainable.vue'
import RingStationExplainable from '@/components/spectator/explainables/RingStationExplainable.vue'
import StorageStationExplainable from '@/components/spectator/explainables/StorageStationExplainable.vue'
import { useOrderStore } from '@/store/orderStore'
import { useGameStore } from '@/store/gameStore'
import OrderEntity from '@/components/spectator/entities/OrderEntity.vue'
import type RingSpec from '@/types/RingSpec'
import WorkpieceEntity from '@/components/spectator/entities/WorkpieceEntity.vue'
import type Workpiece from '@/types/Workpiece'
import type ShelfSlot from '@/types/ShelfSlot'

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const props = defineProps({
  machine: {
    type: Object as PropType<Machine>,
    required: true,
  },
  workpieces: {
    type: Array as PropType<Workpiece[]>,
    required: false,
  },
})

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const gameStore = useGameStore()
const machineStore = useMachineStore()
const orderStore = useOrderStore()
const { teamNameByColor } = storeToRefs(gameStore)
const { shelfSlots, ringSpecs } = storeToRefs(machineStore)
const { ordersDeliveredByTeam, fileNameByWorkpiece } = storeToRefs(orderStore)

// workpieces  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const workpiecesAtInput: ComputedRef<Workpiece[]> = computed(
  () =>
    props.workpieces?.filter((workpiece) => workpiece.at_side == 'INPUT') || []
)
const workpiecesAtOutput: ComputedRef<Workpiece[]> = computed(
  () =>
    props.workpieces?.filter((workpiece) => workpiece.at_side == 'OUTPUT') || []
)
const workpiecesAtSlide: ComputedRef<Workpiece[]> = computed(
  () =>
    props.workpieces?.filter((workpiece) => workpiece.at_side == 'SLIDE') || []
)
const workpiecesAtShelf: ComputedRef<Workpiece[]> = computed(
  () =>
    props.workpieces?.filter((workpiece) =>
      ['LEFT', 'MIDDLE', 'RIGHT'].includes(workpiece.at_side)
    ) || []
)
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

.machine-popup {
  .workpiece-box {
    flex-wrap: wrap;
    * {
      flex-shrink: 0;
    }
  }
}

.shelf {
  position: relative;

  padding: 60px 50px;

  display: block;

  &:after {
    content: 'SHELF';
    position: absolute;
    top: 10px;
    left: 10px;

    padding: 0 5px;
    background-color: global.$surfaceColor;
    border-radius: 8px;
  }

  .shelf-shelf {
    margin: -30px 0;
    transform: rotateX(50deg) rotateZ(30deg);

    display: grid;
    gap: 5px;

    &.cs {
      grid-template-columns: 1fr 1fr 1fr;

      &:after {
        content: 'Not live | sample';
        position: absolute;
        top: -30px;
        right: 0px;

        padding: 0 5px;
        background-color: global.$surfaceColor;
        border-radius: 8px;
      }
    }

    &.ss {
      grid-template-columns: 1fr 1fr 1fr 1fr;
    }

    .shelf-slot {
      width: 80px;
      aspect-ratio: 1;
      background-color: global.$lighterColor;
      border-radius: 8px;

      img {
        width: 100%;
        transform: rotateX(-30deg) rotateZ(-30deg);
      }
    }
  }
}
</style>
