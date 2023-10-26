// TEMPLATE --------------------------------------------------------------------
<template>
  <div id="ordersBoard" class="horizontal-flex">
    <!-- OPEN ORDERS -->
    <div class="section open-orders-section" v-if="openOrders.length">
      <div class="item">
        <div class="order-list">
          <template v-for="order in openOrders" :key="order.id">
            <div
              v-if="order != overtimeOrder || overtime"
              :class="[
                gametime <= parseInt(order.delivery_period[0]) ? 'appear' : '',

                gametime >= parseInt(order.delivery_period[1])
                  ? 'disappear'
                  : '',
                'order',
              ]"
            >
              <OrderEntity :order="order"></OrderEntity>
              <div
                class="horizontal-flex"
                v-if="
                  parseInt(order.delivery_period[1]) - gametime >= 0 &&
                  parseInt(order.delivery_period[0]) - gametime <= 0
                "
              >
                <font-awesome-icon
                  v-show="parseInt(order.delivery_period[1]) - gametime <= 60"
                  icon="fa-solid fa-hourglass"
                  shake
                  style="--fa-animation-duration: 5s"
                />
                <p>
                  {{
                    formatTime(parseInt(order.delivery_period[1]) - gametime)
                  }}
                </p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <!-- ADDITIONAL ORDERS -->
    <div class="section">
      <!-- UPCOMING ORDERS -->
      <div class="item">
        <p>{{ upcomingOrders.length }} orders</p>
        <p class="horizontal-flex">
          upcoming
          <PopupWrapper popup-position="bottom" v-if="upcomingOrders.length">
            <template #reference>
              <font-awesome-icon
                class="clickable"
                icon="fa-solid fa-info-circle"
              />
            </template>
            <UpcomingOrdersPopup></UpcomingOrdersPopup>
          </PopupWrapper>
        </p>
      </div>
      <!-- EXPIRED ORDERS -->
      <div class="item" ref="expiredSection">
        <p>{{ expiredOrders.length }} orders</p>
        <p class="horizontal-flex">
          expired
          <PopupWrapper popup-position="bottom" v-if="expiredOrders.length">
            <template #reference>
              <font-awesome-icon
                class="clickable"
                icon="fa-solid fa-info-circle"
              />
            </template>
            <ExpiredOrdersPopup></ExpiredOrdersPopup>
          </PopupWrapper>
        </p>
      </div>
    </div>
  </div>
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

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const gameStore = useGameStore()
const { gametime, overtime } = storeToRefs(gameStore)
const orderStore = useOrderStore()
const { openOrders, upcomingOrders, expiredOrders, overtimeOrder } =
  storeToRefs(orderStore)

const expiredSection: Ref<HTMLElement | null> = ref(null)
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

#ordersBoard {
  height: 100%;

  .open-orders-section {
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

        &.appear {
          animation: moveFromUpcomingSection 1s 1;
        }

        &.disappear {
          animation: moveIntoExpiredSection 1s 1;
        }

        @keyframes moveFromUpcomingSection {
          0% {
            width: 0;
            transform: scale(0.5) translateX(250px) translateY(-50px);
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
            transform: scale(0.5) translateX(250px) translateY(50px);
            opacity: 0;
          }
        }
      }
    }
  }
}
</style>
