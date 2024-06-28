// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup :title="'Order ' + order.id">
    <div class="horizontal-flex">
      <font-awesome-icon icon="fa-clock" />
      <span>
        {{ formatTime(order.delivery_period[0]) }} -
        {{ formatTime(order.delivery_period[1]) }}
      </span>
      <p
        v-if="
          game_time >= order.delivery_period[0] &&
          order.delivery_period[1] - game_time > 0
        "
      >
        <span>(</span>
        <span>{{ formatTime(order.delivery_period[1] - game_time) }}</span>
        <span>)</span>
      </p>
      <p
        v-else-if="
          order.delivery_period[1] - game_time < 0 && phase == 'PRODUCTION'
        "
        class="text-danger"
      >
        <span>(</span>
        <span class="horizontal-flex inline">
          <span>{{ formatTime(game_time - order.delivery_period[1]) }}</span>
          <font-awesome-icon icon="fa-bell" />
        </span>
        <span>)</span>
      </p>
    </div>
    <div v-if="order.quantity_delivered[0] != 0" class="horizontal-flex">
      <font-awesome-icon icon="fa-truck" />
      <p>
        Delivered by
        <span class="CYAN-text">{{ teamNameByColor('CYAN') }}</span>
        <span v-if="order.quantity_requested != 1">
          ({{ order.quantity_delivered[0] }} x)
        </span>
      </p>
    </div>
    <div v-if="order.quantity_delivered[1] != 0" class="horizontal-flex">
      <font-awesome-icon icon="fa-truck" />
      <p>
        Delivered by
        <span class="MAGENTA-text">{{ teamNameByColor('MAGENTA') }}</span>
        <span v-if="order.quantity_requested != 1"
          >({{ order.quantity_delivered[1] }} x)</span
        >
      </p>
    </div>

    <div class="horizontal-flex text-warning">
      <font-awesome-icon icon="fa-khanda" />
      <span>This is a <CompetitiveOrderExplainable /></span>
    </div>

    <Button v-if="!viewRecipe" icon="fa-bowl-rice" @click="generateRecipe"
      >View a recipe for this order</Button
    >
    <template v-else>
      <div class="horizontal-flex">
        <font-awesome-icon icon="fa-bowl-rice" />
        <p>A recipe for this order:</p>
      </div>
      <div class="recipe vertical-flex">
        <div class="content-box">
          <img :src="`/workpieces/${order.base_color}.svg`" />
          <div>
            At the <BaseStationExplainable />: Grab a
            {{ colorByWorkpieceItem(order.base_color) }} base.
          </div>
        </div>
        <div
          v-if="order.ring_colors.some((ring) => paymentByRing(ring))"
          class="content-box"
        >
          <img src="/workpieces/BASE_CLEAR.svg" />
          <div>
            At the <CapStationExplainable /> with the
            {{ colorByWorkpieceItem(order.cap_color) }} caps: Retrieve a
            {{ colorByWorkpieceItem(order.cap_color) }} cap. You want to use the
            transparent base acquired in this step for payment later (though you
            can also use caps retrieved at the base station).
          </div>
        </div>
        <div v-for="ring in order.ring_colors" class="content-box">
          <img :src="`/workpieces/${ring}.svg`" />
          <div>
            At the <RingStationExplainable /> with the
            {{ colorByWorkpieceItem(ring) }} rings:
            <template v-if="paymentByRing(ring)"
              >Pay {{ paymentByRing(ring) }} previously acquired
              bases.</template
            >
            Mount the {{ colorByWorkpieceItem(ring) }} ring onto the workpiece.
          </div>
        </div>
        <div class="content-box">
          <img :src="`/workpieces/${order.cap_color}.svg`" />
          <div>
            At the <CapStationExplainable /> with the
            {{ colorByWorkpieceItem(order.cap_color) }} caps:
            <template
              v-if="!order.ring_colors.some((ring) => paymentByRing(ring))"
              >Retrieve a
              {{ colorByWorkpieceItem(order.cap_color) }} cap.</template
            >
            Mount the
            <template
              v-if="order.ring_colors.some((ring) => paymentByRing(ring))"
              >previously retrieved</template
            >
            {{ colorByWorkpieceItem(order.cap_color) }} cap onto the workpiece.
          </div>
        </div>
      </div>
      <Accordion
        title="A note about order recipes"
        class="content-box"
        style="padding: 0"
      >
        These order recipes are only basic drafts of the required steps and do
        not include e.g. the acquisition of additional bases from the base
        station for payment. Teams can additionally choose to combine the
        production steps of several different orders in a smart way.
      </Accordion>
    </template>
  </Popup>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { ref, type PropType, type Ref } from 'vue'
import type Order from '@/types/Order'
import Popup from '@/components/shared/ui/Popup.vue'
import CompetitiveOrderExplainable from '@/components/spectator/explainables/CompetitiveOrderExplainable.vue'
import formatTime from '@/utils/formatTime'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/store/gameStore'
import { useMachineStore } from '@/store/machineStore'
import BaseStationExplainable from '@/components/spectator/explainables/BaseStationExplainable.vue'
import CapStationExplainable from '@/components/spectator/explainables/CapStationExplainable.vue'
import RingStationExplainable from '@/components/spectator/explainables/RingStationExplainable.vue'
import Button from '@/components/shared/ui/Button.vue'
import Accordion from '@/components/shared/ui/Accordion.vue'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const gameStore = useGameStore()
const { teamNameByColor, game_time, phase } = storeToRefs(gameStore)
const machineStore = useMachineStore()
const { paymentByRing, colorByWorkpieceItem } = storeToRefs(machineStore)

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
defineProps({
  order: {
    type: Object as PropType<Order>,
    required: true,
  },
})

// recipe  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const viewRecipe: Ref<boolean> = ref(false)
function generateRecipe() {
  viewRecipe.value = true
}
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

.recipe {
  img {
    float: left;
    width: 80px;
    flex-shrink: 0;
    margin: 0 10px 10px 0;
  }
}
</style>
