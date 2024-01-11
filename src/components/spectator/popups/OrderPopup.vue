// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup :title="'Order ' + order.id">
    <div class="horizontal-flex">
      <font-awesome-icon icon="fa-clock" />
      <span>
        {{ formatTime(order.delivery_period[0]) }} -
        {{ formatTime(order.delivery_period[1]) }}
      </span>
      <p v-if="game_time >= order.delivery_period[0] && order.delivery_period[1] - game_time > 0">
        <span>(</span>
          <span>{{ formatTime(order.delivery_period[1] - game_time) }}</span>
        <span>)</span>
      </p>
      <p v-else-if="order.delivery_period[1] - game_time < 0 && phase == 'PRODUCTION'" class="text-danger">
        <span>(</span>
        <div class="horizontal-flex inline">
          <span>{{ formatTime(game_time - order.delivery_period[1]) }}</span>
          <font-awesome-icon icon="fa-bell" />
        </div>
        <span>)</span>
      </p>
    </div>
    <div v-if="order.quantity_delivered[0] != 0" class="horizontal-flex">
      <font-awesome-icon icon="fa-truck" />
      <p>
      Delivered by
      <span class="CYAN-text">{{ teamNameByColor('CYAN') }}</span>
      <span v-if="order.quantity_requested != 1"
        >({{ order.quantity_delivered[0] }} x)</span
      >
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

    <PopupWrapper v-if="order.competitive">
      <template #reference>
        <div  class="horizontal-flex" style="color: orange">
          <font-awesome-icon icon="fa-khanda" />
          <span>This is a competitive order</span>
          <font-awesome-icon icon="fa-info-circle" />
        </div>
      </template>
      <Popup title="Competitive orders">
        <p>
          The first team that delivers a competitive order will receive 10
          extra points, while the second team that delivers the order will be
          deducted 10 points.
        </p>
      </Popup>
    </PopupWrapper>

    <Button v-if="!viewRecipe" icon="fa-bowl-rice" @click="generateRecipe">View example recipe for this order</Button>
    <template v-else>
    <div class="horizontal-flex">
      <font-awesome-icon icon="fa-bowl-rice" />
      <p>Example recipe for this order:</p>
    </div>
    <div class="recipe vertical-flex">
      <div>
        <img :src="`/workpieces/${order.base_color}.svg`"/>
        <div>
          At the <BaseStationExplainable />:
          Grab a {{ colorByWorkpieceItem(order.base_color) }} base.
        </div>
      </div>
      <div v-if="order.ring_colors.some(ring => paymentByRing(ring))">
        <img src="/workpieces/BASE_TRANSPARENT.svg"/>
        <div>
          At the <CapStationExplainable /> with the {{ colorByWorkpieceItem(order.cap_color) }} caps:
          Retrieve a {{ colorByWorkpieceItem(order.cap_color) }} cap. You want to use the transparent base acquired in this step for payment later (though you can also use caps retrieved at the base station).
        </div>
      </div>
      <div v-for="ring in order.ring_colors">
        <img :src="`/workpieces/${ring}.svg`"/>
        <div>
          At the <RingStationExplainable /> with the {{ colorByWorkpieceItem(ring) }} rings:
          <template v-if="paymentByRing(ring)">Pay {{ paymentByRing(ring) }} previously acquired bases.</template>
          Mount the {{ colorByWorkpieceItem(ring) }} ring onto the workpiece.
        </div>
      </div>
      <div>
        <img :src="`/workpieces/${order.cap_color}.svg`"/>
        <div>
          At the <CapStationExplainable /> with the {{ colorByWorkpieceItem(order.cap_color) }} caps:
          <template v-if="!order.ring_colors.some(ring => paymentByRing(ring))">Retrieve a {{ colorByWorkpieceItem(order.cap_color) }} cap.</template>
          Mount the <template v-if="order.ring_colors.some(ring => paymentByRing(ring))">previously retrieved</template> {{ colorByWorkpieceItem(order.cap_color) }} cap onto the workpiece.
        </div>
      </div>
    </div>
  </template>
  </Popup>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { ref, type PropType, Ref } from 'vue'
import type Order from '@/types/Order'
import Popup from '@/components/shared/ui/Popup.vue'
import PopupWrapper from '@/components/shared/ui/PopupWrapper.vue'
import formatTime from '@/utils/formatTime'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/store/gameStore'
import { useMachineStore } from '@/store/machineStore'
import BaseStationExplainable from '@/components/spectator/explainables/BaseStationExplainable.vue'
import CapStationExplainable from '@/components/spectator/explainables/CapStationExplainable.vue'
import RingStationExplainable from '@/components/spectator/explainables/RingStationExplainable.vue'
import Button from '@/components/shared/ui/Button.vue'

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
