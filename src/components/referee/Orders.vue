// TEMPLATE --------------------------------------------------------------------
<template>
  <div class="orders">
    <div
      v-for="order in orders"
      :key="order.id"
      :class="[
        'order-wrapper',
        'flex-item',
        activeDeliveryPeriod(order) ? '' : 'transparent',
      ]"
    >
      <div
        :class="[
          'horizontal-flex',
          'order',

          game_time >= order.activate_at ? 'active' : '',
        ]"
      >
        <!-- PRODUCT IMAGE -->
        <img :src="`/workpieces/${fileNameByWorkpiece(order)}`" alt="img" />

        <!-- ORDER INFO -->
        <div class="order-infos" style="text-align: left">
          <!-- ID, DELIVERY STATUS AND COMPETITIVE INDICATOR -->
          <div class="horizontal-flex" style="gap: 0 !important">
            <!-- id -->
            <span>
              {{ order.id }}
            </span>
            <!-- delivery status -->
            <div
              :class="[
                'form-check-input',
                'CYAN',
                order.quantity_delivered[0] == 1 ? 'checked' : '',
              ]"
            ></div>
            <div
              :class="[
                'form-check-input',
                'MAGENTA',
                order.quantity_delivered[1] == 1 ? 'checked' : '',
              ]"
            ></div>
            <!-- competitive indicator -->
            <span v-if="order.competitive" class="text-warning"> C </span>
          </div>
          <!-- TIME -->
          <div>
            <span>
              {{ formatTime(order.delivery_period[0]) }}-{{
                formatTime(order.delivery_period[1])
              }}
            </span>
          </div>
          <!-- COMPLEXITY -->
          <span class="order-complexity">
            {{ order.complexity }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { storeToRefs } from 'pinia'
import formatTime from '@/utils/formatTime'
import { useGameStore } from '@/store/gameStore'
import { useOrderStore } from '@/store/orderStore'
import Order from '@/types/Order'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const gameStore = useGameStore()
const orderStore = useOrderStore()
const { game_time } = storeToRefs(gameStore)
const { orders, fileNameByWorkpiece } = storeToRefs(orderStore)

// check if current time is inside delivery period of order  - - - - - - - - - -
function activeDeliveryPeriod(order: Order): boolean {
  return (
    order.delivery_period[0] <= game_time.value &&
    order.delivery_period[1] >= game_time.value
  )
}
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
/* for years now, a major flaw in flexbox prevents flex containers to increase
in their width when flex-direction is vertical and wrap is set to true. To solve
this, we use flex-direction row which is supported and misuse writing-mode */
.orders {
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  writing-mode: vertical-lr;
  gap: 10px;
  align-items: stretch;

  .order-wrapper {
    flex-grow: 1;
    width: fit-content;
    max-width: 300px;
    writing-mode: horizontal-tb;
    .order {
      width: fit-content;
      height: 100%;
      opacity: 0.2;
      transition: opacity 1s ease-in-out;

      &.active {
        opacity: unset;
      }

      img {
        height: 80px;
        aspect-ratio: 1;
      }
      .order-infos {
        font-size: 13px;
        .order-complexity {
          font-size: 0.8rem;
        }
      }
    }
  }
}

.form-check-input {
  width: 1rem;
  height: 1rem;
  margin: 5px;
  border: 1px solid;
  border-radius: 50%;
  color: #fff;
  background-color: #2b3e50;
  &.CYAN {
    border-color: global.$cyanColor;

    &.checked {
      background-color: global.$cyanColor;
    }
  }
  &.MAGENTA {
    border-color: global.$magentaColor;
    &.checked {
      background-color: global.$magentaColor;
    }
  }
  &.checked {
    background-image: url('@/assets/checkedMark.png') !important;
  }
}
</style>
