<template>
  <!-- <img src="http://via.placeholder.com/45x90" alt=""> -->
  <div>
    <div v-for="order in allOrders" :key="order.id" class="max-height-6rem">
      <div class="d-flex">
        <div class="max-height-6rem pb-0 mb-0 d-flex">
          <img
            v-if="products.length === orderCount"
            :src="`/products/generated/${getProductsImg(order.id)}`"
            alt="img"
            class="max-height-6rem img-max-width img-fluid"
            :class="activeDeliveryPeriodImage(order['delivery_period'])"
          />
          <!-- c0_black__black.svg -->
        </div>
        <div
          class="order-info-container ms-2 d-flex flex-column text-start justify-content-around"
        >
          <div class="order-infos">
            <div>
              <div class="d-flex justify-items-center align-items-center">
                <div
                  pt-5
                  :class="activeDeliveryPeriod(order['delivery_period'])"
                >
                  <span>
                    {{ order.id }}
                  </span>
                </div>
                <form>
                  <!-- If requested amount is 1 -->
                  <div
                    v-if="order['quantity_requested'] === 1"
                    class="m-0 ms-2 d-flex text-primary"
                  >
                    <div class="form-check">
                      <!-- Checked only if the order was delivered -->
                      <input
                        :id="cyanCheckboxId(order.id)"
                        type="checkbox"
                        class="form-check-input cyan"
                        disabled
                        :checked="
                          isDelivered(
                            order['quantity_delivered'][0],
                            order['quantity_requested']
                          )
                        "
                      />
                      <!-- Confirm Delivery Popup modal -->
                      <div
                        v-for="unconfirmedOrder in unconfirmedOrders"
                        :key="unconfirmedOrder.id"
                      >
                        <div
                          v-if="
                            unconfirmedOrder.id === order.id &&
                            unconfirmedOrder['unconfirmed_deliveries']
                              .length === 1
                          "
                        >
                          <ConfirmDeliveryModal
                            :order="unconfirmedOrder"
                            :team="
                              getCorrespondingTeamname(
                                unconfirmedOrder['unconfirmed_deliveries'][0]
                                  .team
                              )
                            "
                            :color="
                              unconfirmedOrder['unconfirmed_deliveries'][0].team
                            "
                          />
                        </div>
                        <!-- If there are more than one unconfirmed delivery for the corresponding order loop through all -->
                        <div
                          v-else-if="
                            unconfirmedOrder.id === order.id &&
                            unconfirmedOrder['unconfirmed_deliveries'].length >
                              1
                          "
                        >
                          <ConfirmDeliveryModal
                            v-for="(
                              unconfirmedDeliveryElement, index
                            ) in unconfirmedOrder['unconfirmed_deliveries']"
                            :key="index"
                            :order="unconfirmedOrder"
                            :team="
                              getCorrespondingTeamname(
                                unconfirmedDeliveryElement.team
                              )
                            "
                            :color="unconfirmedDeliveryElement.team"
                          />
                        </div>
                      </div>
                      <!-- End of modal -->
                    </div>
                    <div class="form-check">
                      <input
                        :id="magentaCheckboxId(order.id)"
                        type="checkbox"
                        class="form-check-input magenta"
                        :checked="
                          isDelivered(
                            order['quantity_delivered'][1],
                            order['quantity_requested']
                          )
                        "
                        disabled
                      />
                    </div>
                  </div>
                  <!-- If requested amount is 2  -->
                  <div
                    v-else-if="order['quantity_requested'] === 2"
                    class="m-0 ms-2 d-flex flex-column"
                  >
                    <div>
                      <div class="d-flex">
                        <div class="form-check">
                          <!-- Checked only if the order was delivered -->
                          <input
                            id="customCheck1"
                            type="checkbox"
                            class="form-check-input cyan"
                            disabled
                            :checked="
                              isDelivered(
                                order['quantity_delivered'][0],
                                order['quantity_requested']
                              )
                            "
                          />
                        </div>
                        <div class="form-check">
                          <input
                            id="customCheck2"
                            type="checkbox"
                            class="form-check-input magenta"
                            disabled
                            :checked="
                              isDelivered(
                                order['quantity_delivered'][1],
                                order['quantity_requested']
                              )
                            "
                          />
                        </div>
                      </div>
                    </div>
                    <!-- If the first was  delivered -->
                    <div class="d-flex">
                      <div class="form-check">
                        <!-- Checked only if the order was delivered -->
                        <input
                          id="customCheck1"
                          type="checkbox"
                          class="form-check-input cyan"
                          disabled
                          :checked="
                            isDeliveredSecond(order['quantity_delivered'][0])
                          "
                        />
                      </div>
                      <div class="form-check">
                        <input
                          id="customCheck2"
                          type="checkbox"
                          class="form-check-input magenta"
                          disabled
                          :checked="
                            isDeliveredSecond(order['quantity_delivered'][1])
                          "
                        />
                      </div>
                    </div>
                    <!-- Confirm Delivery Popup modal -->
                    <div
                      v-for="unconfirmedOrder in unconfirmedOrders"
                      :key="unconfirmedOrder.id"
                    >
                      <div
                        v-if="
                          unconfirmedOrder.id === order.id &&
                          unconfirmedOrder['unconfirmed_deliveries'].length ===
                            1
                        "
                      >
                        <ConfirmDeliveryModal
                          :order="unconfirmedOrder"
                          :team="
                            getCorrespondingTeamname(
                              unconfirmedOrder['unconfirmed_deliveries'][0].team
                            )
                          "
                          :color="
                            unconfirmedOrder['unconfirmed_deliveries'][0].team
                          "
                        />
                      </div>

                      <!-- If there are more than one unconfirmed delivery for the corresponding order loop through all -->
                      <div
                        v-else-if="
                          unconfirmedOrder.id === order.id &&
                          unconfirmedOrder['unconfirmed_deliveries'].length > 1
                        "
                      >
                        <ConfirmDeliveryModal
                          v-for="(
                            unconfirmedDeliveryElement, index
                          ) in unconfirmedOrder['unconfirmed_deliveries']"
                          :key="index"
                          :order="unconfirmedOrder"
                          :team="
                            getCorrespondingTeamname(
                              unconfirmedDeliveryElement.team
                            )
                          "
                          :color="unconfirmedDeliveryElement.team"
                        />
                      </div>
                    </div>
                    <!-- End of modal -->
                  </div>
                </form>
                <div class="text-center">
                  <span v-if="order.competitive" class="text-warning"> C </span>
                </div>
              </div>
            </div>

            <div
              class="delivery-time"
              :class="activeDeliveryPeriod(order['delivery_period'])"
            >
              <span>
                {{ formatSeconds(order['delivery_period'][0]) }}-{{
                  formatSeconds(order['delivery_period'][1])
                }}
              </span>
            </div>
            <div
              class="order-complexity mt-1"
              :class="activeDeliveryPeriod(order['delivery_period'])"
            >
              <span> Complex: {{ order.complexity }} </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import formatSeconds from '@/utils/formatSeconds'
import { useMainStore } from '@/store/mainStore'
import { useOrderStore } from '@/store/orderStore'
import ConfirmDeliveryModal from '@/components/referee/ConfirmDeliveryModal.vue'

const mainStore = useMainStore()
const orderStore = useOrderStore()
const { gametime, nameTeamCyan, nameTeamMagenta } = storeToRefs(mainStore)
const { allOrders, products, orderCount } = storeToRefs(orderStore)

const unconfirmedOrders = computed(() => {
  return allOrders.value.filter(
    (order) => order['unconfirmed_deliveries'].length > 0
  )
})

// returns the img url responding to order ID
function getProductsImg(orderID) {
  return products.value.find(({ id }) => id === orderID)['product-img-url']
}

// checks if the order was delivered
function isDelivered(currDelivered, requested): boolean {
  if (parseInt(currDelivered) >= requested || parseInt(currDelivered) === 1) {
    return true
  } else {
    return false
  }
}
function isDeliveredSecond(currDelivered): boolean {
  if (parseInt(currDelivered) === 2) {
    return true
  } else {
    return false
  }
}

function cyanCheckboxId(orderId): string {
  return `cyanCheckbox-${orderId}`
}

function magentaCheckboxId(orderId): string {
  return `magentaCheckbox-${orderId}`
}

// grays out orders that are not active
function activeDeliveryPeriod(deliveryPeriod) {
  // check if it is in the delivery period
  if (
    deliveryPeriod[0] <= gametime.value &&
    deliveryPeriod[1] >= gametime.value
  ) {
    return 'text-active'
  } else {
    return 'text-muted'
  }
}

function activeDeliveryPeriodImage(deliveryPeriod) {
  // check if it is in the delivery period
  if (
    (deliveryPeriod[0] <= gametime.value &&
      deliveryPeriod[1] >= gametime.value) ||
    deliveryPeriod[0] >= gametime.value
  ) {
    return ''
  }
  // iff it's not
  else {
    return 'opacity-4'
  }
}

function getCorrespondingTeamname(color: string) {
  if (color === 'CYAN') {
    return nameTeamCyan.value
  } else {
    return nameTeamMagenta.value
  }
}

defineExpose({
  formatSeconds,
  allOrders,
  products,
  orderCount,
  unconfirmedOrders,
  getProductsImg,
  isDelivered,
  isDeliveredSecond,
  cyanCheckboxId,
  magentaCheckboxId,
  activeDeliveryPeriod,
  activeDeliveryPeriodImage,
  getCorrespondingTeamname,
})
</script>

<style scoped lang="scss">
@use '@/assets/global.scss';

.quantity-delivered-cyan {
  color: global.$main-cyan-color;
}

.quantity-delivered-magenta {
  color: global.$main-magenta-color;
}

.form-check-input {
  width: 1rem;
  height: 1rem;
  margin: 5px;
  border: 1px solid;
  border-radius: 50% !important;
  color: #fff;
  background-color: #2b3e50;
  &.cyan {
    border-color: global.$main-cyan-color;
    &:checked {
      background-color: global.$main-cyan-color;
    }
  }
  &.magenta {
    border-color: global.$main-magenta-color;
    &:checked {
      background-color: global.$main-magenta-color;
    }
  }
  &:checked {
    background-image: url('@/assets/checkedMark.png') !important;
  }
}

.max-height-6rem {
  max-height: 6rem !important;
}

.img-max-width {
  max-width: 4rem !important;
}

.order-info-container {
  font-size: 13px !important;
}

@media (max-width: 1540px) {
  .img-max-width {
    max-width: 3.3rem !important;
  }
  .order-info-container {
    font-size: 12.5px !important;
  }
}

@media (max-width: 1340px) {
  .img-max-width {
    max-width: 2.8rem !important;
  }
  .order-info-container {
    font-size: 12px !important;
  }
  .order-complexity {
    font-size: 0.8rem !important;
  }
}

@media (max-width: 1265px) {
  .img-max-width {
    max-width: 2.3rem !important;
  }
  .order-info-container {
    font-size: 10px !important;
  }
  .order-complexity {
    font-size: 0.7rem !important;
  }
}

@media (max-width: 1100px) {
  .order-complexity {
    font-size: 0.6rem !important;
  }
}

.order-complexity {
  font-size: 0.8rem;
}

.opacity-4 {
  opacity: 0.4;
}
</style>
