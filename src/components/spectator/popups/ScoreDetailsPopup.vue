// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup :title="'Score details for ' + teamName">
    <!-- ORDER TABS -->
    <TabGroup
      :tabs="[
        '0',
        ...ordersDeliveredByTeam(teamName).map((order) => `${order.id}`),
      ]"
      ref="tabGroup"
      class="order-tabs"
    >
      <template #0>
        <div class="item transparent">
          <p>No order</p>
          <!-- sum of points related to this order -->
          <p>
            {{
              awardedPointsByColorAndOrder(team, 0)
                .map((awardedPoints) => awardedPoints.points)
                .reduce((acc, cur) => acc + cur, 0)
            }}
          </p>
        </div></template
      >
      <template
        #[`${order.id}`]
        v-for="order in ordersDeliveredByTeam(teamName)"
      >
        <div>
          <img
            :src="`/products/${
              orderStore.productByOrder(order)?.['product-img-url']
            }`"
          />
          <!-- sum of points related to this order -->
          <p>
            {{
              awardedPointsByColorAndOrder(team, order.id)
                .map((awardedPoints) => awardedPoints.points)
                .reduce((acc, cur) => acc + cur, 0)
            }}
          </p>
        </div>
      </template>
    </TabGroup>

    <!-- AWARDED POINTS LIST FOR SELECTED ORDER -->
    <template v-if="tabGroup">
      <div
        class="horizontal-flex"
        v-show="
          tabGroup &&
          tabGroup.active != 0 &&
          orderById(parseInt(tabGroup.active))
        "
      >
        <span>
          Awarded points for order {{ tabGroup.active }}
          {{ orderById(tabGroup.active) }}</span
        >
        <PopupWrapper popup-position="bottom">
          <template #reference>
            <font-awesome-icon
              class="clickable"
              icon="fa-solid fa-info-circle"
            />
          </template>
          <OrderPopup
            :order="<Order>orderById(parseInt(tabGroup.active))"
          ></OrderPopup>
        </PopupWrapper>
      </div>
      <p v-show="tabGroup.active == 0">
        Awarded points not associated with an order
      </p>
    </template>
    <div class="awarded-points-list">
      <template
        v-for="awardedPoints in awardedPointsByColorAndOrder(
          team,
          tabGroup?.active
        )"
      >
        <div class="awarded-points-points">
          {{ awardedPoints.points }}
        </div>
        <div class="awarded-points-time">
          <div>{{ formatTime(awardedPoints.game_time, true) }}</div>
        </div>
        <div class="awarded-points-reason">
          <div>{{ awardedPoints.reason }}</div>
        </div>
      </template>
    </div>
  </Popup>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { ref, type PropType, type Ref } from 'vue'
import Popup from '@/components/shared/ui/Popup.vue'
import formatTime from '@/utils/formatTime'
import TabGroup from '@/components/shared/ui/TabGroup.vue'
import { storeToRefs } from 'pinia'
import { useOrderStore } from '@/store/orderStore'
import { useGameStore } from '@/store/gameStore'
import PopupWrapper from '@/components/shared/ui/PopupWrapper.vue'
import OrderPopup from '@/components/spectator/popups/OrderPopup.vue'
import Order from '@/types/Order'
import Color from '@/types/Color'

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
defineProps({
  team: {
    type: String as PropType<Color>,
    required: true,
  },
  teamName: {
    type: String as PropType<string>,
    required: true,
  },
  color: String,
})

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const gameStore = useGameStore()
const { awardedPointsByColorAndOrder } = storeToRefs(gameStore)
const orderStore = useOrderStore()
const { ordersDeliveredByTeam, orderById } = storeToRefs(orderStore)

// active tab  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const tabGroup: Ref<typeof TabGroup | undefined> = ref()
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
.order-tabs {
  img {
    height: 80px;
    aspect-ratio: 1;
  }
}

.awarded-points-list {
  display: grid;
  grid-template-columns: 35px 60px 1fr;
  gap: 10px;

  > * {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    height: fit-content;
    padding: 5px;

    &.awarded-points-points {
      border-radius: 100%;
      text-align: center;
      color: black;
      background-color: v-bind('color');
    }
  }
}
</style>
