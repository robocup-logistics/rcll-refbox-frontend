import { computed, ref } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import { defineStore } from 'pinia'
import type Order from '@/types/Order'
import type Product from '@/types/Product'
import { useGameStore } from '@/store/gameStore'
import { useRuleStore } from '@/store/ruleStore'

export const useOrderStore = defineStore('orderStore', () => {
  // USE OTHER STORES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const gameStore = useGameStore()
  const ruleStore = useRuleStore()

  // REFS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const orders: Ref<Order[]> = ref([])
  const products: Ref<Product[]> = ref([])
  const orderCount: Ref<number> = ref(11)

  // COMPUTED  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const openOrders: ComputedRef<Order[]> = computed(() =>
    orders.value.filter(
      (order) =>
        gameStore.gametime >= parseInt(order.delivery_period[0]) - 1 &&
        gameStore.gametime < parseInt(order.delivery_period[1]) + 1 &&
        gameStore.phase == 'PRODUCTION'
    )
  )

  const upcomingOrders: ComputedRef<Order[]> = computed(() =>
    orders.value.filter(
      (order) =>
        (['PRE_GAME', 'SETUP', 'EXPLORATION'].includes(gameStore.phase) ||
          gameStore.gametime < parseInt(order.delivery_period[0])) &&
        parseInt(order.delivery_period[0]) < ruleStore.PRODUCTION_DURATION
    )
  )

  const expiredOrders: ComputedRef<Order[]> = computed(() =>
    orders.value.filter(
      (order) =>
        (gameStore.phase == 'POST_GAME' || gameStore.phase == 'PRODUCTION') &&
        gameStore.gametime >= parseInt(order.delivery_period[1])
    )
  )

  const overtimeOrder: ComputedRef<Order | undefined> = computed(() =>
    orders.value.find(
      (order) =>
        parseInt(order.delivery_period[0]) == ruleStore.PRODUCTION_DURATION
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
          (order) => parseInt(order.quantity_delivered[index]) >= 1
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
       "product-img-url": 'c0_black_blue-orange_gray.svg'
     },] 
  */
  function populateProducts(): void {
    const newProducts: Product[] = []

    // iterate through all orders
    orders.value.forEach((order) => {
      const complexity = order.complexity.toLowerCase()
      // fetched Information Format: base-color: "BASE_RED"
      // split the string to extract: 'red, grey...'
      let baseColor = order['base_color'].split('_')[1].toLowerCase()
      // grey in fetched data / Gray in name of SVGs
      if (baseColor === 'grey') {
        baseColor = 'gray'
      }
      let capColor = order['cap_color'].split('_')[1].toLowerCase()
      if (capColor === 'grey') {
        capColor = 'gray'
      }
      let ringColors = ''
      order['ring_colors'].forEach((color: string) => {
        ringColors += color.split('_')[1].toLowerCase() + '-'
      })

      const newProduct: {
        id: number
        'product-img-url': string
      } = {
        id: order.id,
        'product-img-url': `${complexity}_${baseColor}_${ringColors.substring(
          0,
          ringColors.length - 1
        )}_${capColor}.svg`,
      }

      newProducts.push(newProduct)
    })

    products.value = newProducts
  }

  function reset() {
    orders.value = []
    products.value = []
    orderCount.value = 11
  }

  // EXPORTS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  return {
    orders,
    products,
    orderCount,
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
    reset,
  }
})
