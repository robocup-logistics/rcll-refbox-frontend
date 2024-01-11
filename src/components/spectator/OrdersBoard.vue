// TEMPLATE --------------------------------------------------------------------
<template>
  <Accordion id="ordersBoard" title="Orders">
    <div class="horizontal-flex">
      <!-- OPEN ORDERS -->
      <div
        class="vertical-flex open-orders-vertical-flex"
        v-if="openOrders.length"
      >
        <div class="item lighter">
          <div class="order-list">
            <template v-for="order in openOrders" :key="order.id">
              <div
                v-if="order != overtimeOrder || overtime"
                :class="[
                  game_time <= order.delivery_period[0] ? 'appear' : '',

                  game_time >= order.delivery_period[1] ? 'disappear' : '',
                  'order',
                ]"
              >
                <OrderEntity :order="order"></OrderEntity>
                <div
                  class="horizontal-flex desc"
                  v-if="
                    order.delivery_period[1] - game_time >= 0 &&
                    order.delivery_period[0] - game_time <= 0
                  "
                >
                  <font-awesome-icon
                    v-show="order.delivery_period[1] - game_time <= 60"
                    icon="fa-hourglass"
                    shake
                    style="--fa-animation-duration: 5s"
                  />
                  <p>
                    {{ formatTime(order.delivery_period[1] - game_time) }}
                  </p>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <!-- ADDITIONAL ORDERS -->
      <div class="vertical-flex">
        <!-- UPCOMING ORDERS -->
        <PopupWrapper popup-position="bottom" v-if="upcomingOrders.length">
          <template #reference>
            <div class="item lighter">
              <p>{{ upcomingOrders.length }} orders</p>
              <p class="horizontal-flex">
                upcoming
                <font-awesome-icon icon="fa-info-circle" />
              </p>
            </div>
          </template>
          <UpcomingOrdersPopup></UpcomingOrdersPopup>
        </PopupWrapper>

        <!-- EXPIRED ORDERS -->
        <PopupWrapper popup-position="bottom" v-if="expiredOrders.length">
          <template #reference>
            <div class="item lighter" ref="expiredSection">
              <p>{{ expiredOrders.length }} orders</p>
              <p class="horizontal-flex">
                expired
                <font-awesome-icon icon="fa-info-circle" />
              </p>
            </div>
          </template>
          <ExpiredOrdersPopup></ExpiredOrdersPopup>
        </PopupWrapper>
      </div>
    </div>
  </Accordion>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { ref } from 'vue'
import type { Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/store/gameStore'
import { useOrderStore } from '@/store/orderStore'
import PopupWrapper from '@/components/shared/ui/PopupWrapper.vue'
import formatTime from '@/utils/formatTime'
import OrderEntity from '@/components/spectator/entities/OrderEntity.vue'
import ExpiredOrdersPopup from '@/components/spectator/popups/ExpiredOrdersPopup.vue'
import UpcomingOrdersPopup from '@/components/spectator/popups/UpcomingOrdersPopup.vue'
import Accordion from '@/components/shared/ui/Accordion.vue'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const gameStore = useGameStore()
const { game_time, overtime } = storeToRefs(gameStore)
const orderStore = useOrderStore()
const { openOrders, upcomingOrders, expiredOrders, overtimeOrder } =
  storeToRefs(orderStore)

const expiredSection: Ref<HTMLElement | null> = ref(null)
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

#ordersBoard {
  .open-orders-vertical-flex {
    .order-list {
      display: flex;
      gap: 10px;
      padding: 10px 0 0 0;

      transition: all 1s ease-in-out;

      .order {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;

        .desc {
          background-color: global.$surfaceColor;
          border-radius: 8px 8px 0 0;
          padding: 2px 4px;
          margin-bottom: 0px;
          z-index: 2;
        }

        &.appear {
          animation: moveFromUpcomingSection 1s 1;
        }

        &.disappear {
          animation: moveIntoExpiredSection 1s 1;
        }

        @keyframes moveFromUpcomingSection {
          0% {
            width: 0;
            transform: scale(0.5) translateX(250px);
            opacity: 0;
          }

          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes moveIntoExpiredSection {
          0% {
            transform: scale(1);
            opacity: 1;
          }

          100% {
            width: 0;
            transform: scale(0.5) translateX(250px);
            opacity: 0;
          }
        }
      }
    }
  }
}
</style>
