// TEMPLATE --------------------------------------------------------------------
<template>
  <Accordion horizontal id="ordersBoard" expanded-default title="Orders">
    <!-- OPEN ORDERS -->
    <div v-if="openOrders.length" class="content-box open-orders">
      <div class="order-list horizontal-flex">
        <template v-for="order in openOrders" :key="order.id">
          <div
            v-if="order != overtimeOrder || overtime"
            :class="[
              game_time <= order.delivery_period[0] ? 'appear' : '',

              game_time >= order.delivery_period[1] ? 'disappear' : '',
              'order',
              'vertical-flex',
            ]"
          >
            <div class="order-entity">
              <OrderEntity :order="order"></OrderEntity>
            </div>

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

    <!-- ADDITIONAL ORDERS -->
    <div class="vertical-flex additional-orders">
      <!-- UPCOMING ORDERS -->
      <PopupWrapper popup-position="bottom" v-if="upcomingOrders.length">
        <template #reference>
          <div class="flex-item lighter orders-teaser">
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
          <div class="flex-item lighter orders-teaser">
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
  </Accordion>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

#ordersBoard {
  .open-orders {
    width: fit-content;
    flex-shrink: 0;
    flex-grow: 1;
    overflow: hidden;
    .order-list {
      height: 100%;
      transition: all 1s ease-in-out;
      min-width: min-content !important;

      .order {
        height: 100%;
        align-items: center;
        justify-content: space-between;
        gap: 0;

        .order-entity {
          margin-top: 5px;
        }

        .desc {
          flex-shrink: 0;

          padding: 2px 4px;

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

  .additional-orders {
    height: 100%;
    justify-content: space-between;

    .orders-teaser {
      flex-grow: 1;
      height: 100%;
    }
  }
}
</style>
