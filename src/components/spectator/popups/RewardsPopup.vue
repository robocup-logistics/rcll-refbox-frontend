// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup
    :title="`Rewards of <span class='${team}-text'>${teamName}</span>`"
    icon="fa-trophy"
  >
    <template v-if="scoreByColor(team) == 0">
      <p>{{ teamName }} has not scored any points yet.</p>
    </template>
    <template v-else>
      <!-- ORDER TABS -->
      <TabGroup
        :tabs="[0, ...ordersDeliveredByTeam(teamName).map((order) => order.id)]"
        v-model:active="activeOrder"
        ref="tabGroup"
        class="order-tabs"
      >
        <template #[0]>
          <div class="flex-item transparent">
            <p>No order</p>
            <!-- sum of points related to this order -->
            <p>
              {{
                rewardsByColorAndOrder(team, 0)
                  .map((reward) => reward.points)
                  .reduce((acc, cur) => acc + cur, 0)
              }}
            </p>
          </div></template
        >
        <template #[order.id] v-for="order in ordersDeliveredByTeam(teamName)">
          <div>
            <img
              :src="`/workpieces/${orderStore.fileNameByWorkpiece(order)}`"
              draggable="false"
            />
            <!-- sum of points related to this order -->
            <p>
              {{
                rewardsByColorAndOrder(team, order.id)
                  .map((reward) => reward.points)
                  .reduce((acc, cur) => acc + cur, 0)
              }}
            </p>
          </div>
        </template>
      </TabGroup>

      <!-- AWARDED POINTS LIST FOR SELECTED ORDER -->

      <p v-if="activeOrder == 0">
        Awarded points not associated with an order:
      </p>
      <div
        class="horizontal-flex"
        v-else-if="activeOrder != 0 && orderById(activeOrder)"
      >
        <span>Awarded points for</span>
        <PopupWrapper
          popup-position="bottom"
          style="width: max-content !important"
        >
          <template #reference>
            <div class="flex-item lighter horizontal-flex">
              <div class="horizontal-flex">
                <span> Order {{ activeOrder }} </span>
                <font-awesome-icon class="clickable" icon="fa-info-circle" />
              </div>
            </div>
          </template>
          <OrderPopup :order="<Order>orderById(activeOrder)"></OrderPopup>
        </PopupWrapper>
        <span>:</span>
      </div>

      <div class="rewards-list">
        <template v-for="reward in rewardsByColorAndOrder(team, activeOrder)">
          <div :class="['reward-points', `${team}-bg`]">
            {{ reward.points }}
          </div>
          <div>
            {{ formatTime(reward.game_time) }}
          </div>
          <div>
            {{ reward.reason }}
          </div>
        </template>
      </div>
    </template>
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
})

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const gameStore = useGameStore()
const { scoreByColor, rewardsByColorAndOrder } = storeToRefs(gameStore)
const orderStore = useOrderStore()
const { ordersDeliveredByTeam, orderById } = storeToRefs(orderStore)

// active tab  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const activeOrder: Ref<number> = ref(0)
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
.order-tabs {
  position: sticky;
  top: 0;
  background-color: global.$surfaceColor;

  img {
    height: 80px;
    aspect-ratio: 1;
  }
}

.rewards-list {
  display: grid;
  grid-template-columns: 35px 60px 1fr;
  gap: 10px;

  > * {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    height: fit-content;
    padding: 5px;

    &.reward-points {
      border-radius: 100%;
      text-align: center;
      color: black;
    }
  }
}
</style>
