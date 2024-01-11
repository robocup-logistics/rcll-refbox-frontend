import { computed, ref } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import { defineStore } from 'pinia'
import type Order from '@/types/Order'
import type Product from '@/types/Product'
import { useGameStore } from '@/store/gameStore'
import { useRuleStore } from '@/store/ruleStore'
import type Workpiece from '@/types/Workpiece'

export const useOrderStore = defineStore('orderStore', () => {
  // USE OTHER STORES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const gameStore = useGameStore()
  const ruleStore = useRuleStore()

  // REFS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const orders: Ref<Order[]> = ref([])
  const products: Ref<Product[]> = ref([])
  const orderCount: Ref<number> = ref(11)
  const workpieces: Ref<Workpiece[]> = ref([])

  // COMPUTED  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const openOrders: ComputedRef<Order[]> = computed(() =>
    orders.value.filter(
      (order) =>
        gameStore.game_time >= order.delivery_period[0] - 1 &&
        gameStore.game_time < order.delivery_period[1] + 1 &&
        gameStore.phase == 'PRODUCTION'
    )
  )

  const upcomingOrders: ComputedRef<Order[]> = computed(() =>
    orders.value.filter(
      (order) =>
        (['PRE_GAME', 'SETUP', 'EXPLORATION'].includes(gameStore.phase) ||
          gameStore.game_time < order.delivery_period[0]) &&
        order.delivery_period[0] < ruleStore.PRODUCTION_DURATION
    )
  )

  const expiredOrders: ComputedRef<Order[]> = computed(() =>
    orders.value.filter(
      (order) =>
        (gameStore.phase == 'POST_GAME' || gameStore.phase == 'PRODUCTION') &&
        gameStore.game_time >= order.delivery_period[1]
    )
  )

  const overtimeOrder: ComputedRef<Order | undefined> = computed(() =>
    orders.value.find(
      (order) => order.delivery_period[0] == ruleStore.PRODUCTION_DURATION
    )
  )

  const unconfirmedOrders: ComputedRef<Order[]> = computed(() =>
    orders.value.filter((order) => order['unconfirmed_deliveries'].length > 0)
  )

  const productByOrder: ComputedRef<(order: Order) => Product | undefined> =
    computed(() => {
      return (order: Order) => products.value.find(({ id }) => id === order.id)
    })

  const ordersDeliveredByTeam: ComputedRef<(teamName: string) => Order[]> =
    computed(() => {
      return (teamName: String) => {
        let index: number
        if (teamName == gameStore.teamNameByColor('CYAN')) {
          index = 0
        } else if (teamName == gameStore.teamNameByColor('MAGENTA')) {
          index = 1
        } else {
          return []
        }
        return orders.value.filter(
          (order) => order.quantity_delivered[index] >= 1
        )
      }
    })

  const orderById: ComputedRef<(orderId: number) => Order | undefined> =
    computed(() => {
      return (orderId: number) => orders.value.find(({ id }) => id === orderId)
    })

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // set all orders
  function setOrders(newOrders: Order[]): void {
    orders.value = newOrders
    populateProducts()
  }

  // set one order
  function setOrder(orderArg: Order): void {
    const index = orders.value.findIndex((order) => order.id === orderArg.id)
    // add the order to the array if it does not exist yet
    if (index === -1 && orders.value.length < orderCount.value) {
      orders.value.push(orderArg)
      // if we have received all orders, sort them and populate products array if
      // this has not been already done
      if (orders.value.length === orderCount.value) {
        sortOrdersById()
        if (!products.value.length) {
          populateProducts()
        }
      }
    }
    // if the order already exists, replace it
    if (index !== -1) {
      orders.value.splice(index, 1, orderArg)
    }
  }

  // sort orders by id
  function sortOrdersById(): void {
    orders.value.sort((order1, order2) => {
      if (order1.id < order2.id) {
        return -1
      }
      if (order1.id > order2.id) {
        return 1
      }
      // names must be equal
      return 0
    })
  }

  // Populates the products array with the svg url to the corresponding order to
  // match the name of the svg in assets.
  /* Format: products[{ 
       "id": order.id
       "workpiece_url": e.g. 'BASE_RED_RING_ORANGE_CAP_BLACK.svg'
     },] 
  */
  function populateProducts(): void {
    const newProducts: Product[] = []

    // iterate through all orders
    orders.value.forEach((order) => {
      const items = []
      if (order.base_color) items.push(order.base_color)
      for (const ringColor of order.ring_colors) {
        items.push(ringColor)
      }
      if (order.cap_color) items.push(order.cap_color)

      const newProduct: {
        id: number
        workpiece_url: string
      } = {
        id: order.id,
        workpiece_url: `${items.join('-')}.svg`,
      }

      newProducts.push(newProduct)
    })

    products.value = newProducts
  }

  function setWorkpiece(workpiece: Workpiece) {
    const index = workpieces.value.indexOf(workpiece)
    if (index === -1) {
      workpieces.value.push(workpiece)
    } else {
      workpieces.value[index] = workpiece
    }
  }

  function reset() {
    orders.value = []
    products.value = []
    orderCount.value = 11
    workpieces.value = []
  }

  // EXPORTS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  return {
    orders,
    products,
    orderCount,
    workpieces,
    openOrders,
    upcomingOrders,
    expiredOrders,
    overtimeOrder,
    unconfirmedOrders,
    productByOrder,
    ordersDeliveredByTeam,
    orderById,
    setOrders,
    setOrder,
    setWorkpiece,
    reset,
  }
})
