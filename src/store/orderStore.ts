import { computed, ref } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import { defineStore } from 'pinia'
import type Order from '@/types/Order'
import { useGameStore } from '@/store/gameStore'
import { useConfigStore } from '@/store/configStore'
import type Workpiece from '@/types/Workpiece'
import type ConfirmDeliveryOutMsg from '@/types/messages/outgoing/ConfirmDeliveryOutMsg'
import type Color from '@/types/Color'
import { useSocketStore } from '@/store/socketStore'

// ORDER STORE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// the order store is used to store the orders and related information and
// provide utility function related to orders. Currently it also serves the same
// functionality for workpieces - it might make sense to source workpiece
// relation information and functionality out into its own store at a later
// date.
export const useOrderStore = defineStore('orderStore', () => {
  // USE OTHER STORES  - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const gameStore = useGameStore()
  const configStore = useConfigStore()
  const socketStore = useSocketStore()

  // REFS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const orders: Ref<Order[]> = ref([])
  const workpieces: Ref<Workpiece[]> = ref([])

  // COMPUTED  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> config
  const MAX_NUMBER_OF_ORDERS: ComputedRef<number> = computed(
    () =>
      <number>configStore.gameConfig.get('/llsfrb/globals/number-of-orders'),
  )

  // -> open orders
  const openOrders: ComputedRef<Order[]> = computed(() =>
    orders.value.filter(
      (order) =>
        gameStore.game_time >= order.delivery_period[0] - 1 &&
        gameStore.game_time < order.delivery_period[1] + 1 &&
        gameStore.phase == 'PRODUCTION',
    ),
  )

  // -> upcoming orders
  const upcomingOrders: ComputedRef<Order[]> = computed(() =>
    orders.value.filter(
      (order) =>
        (['PRE_GAME', 'SETUP', 'EXPLORATION'].includes(gameStore.phase) ||
          (gameStore.phase == 'PRODUCTION' &&
            gameStore.game_time < order.delivery_period[0])) &&
        order.delivery_period[0] < gameStore.PRODUCTION_DURATION,
    ),
  )

  // -> upcoming acivated orders
  const upcomingActivatedOrders: ComputedRef<Order[]> = computed(() =>
    upcomingOrders.value.filter(
      (order) => gameStore.game_time >= order.activate_at,
    ),
  )

  // -> upcoming not yet activated orders
  const upcomingNonActivatedOrders: ComputedRef<Order[]> = computed(() =>
    upcomingOrders.value.filter(
      (order) => gameStore.game_time < order.activate_at,
    ),
  )

  // -> expired orders
  const expiredOrders: ComputedRef<Order[]> = computed(() =>
    orders.value.filter(
      (order) =>
        gameStore.phase == 'POST_GAME' ||
        (gameStore.phase == 'PRODUCTION' &&
          gameStore.game_time >= order.delivery_period[1]),
    ),
  )

  // -> overtime order
  const overtimeOrder: ComputedRef<Order | undefined> = computed(() =>
    orders.value.find(
      (order) => order.delivery_period[0] == gameStore.PRODUCTION_DURATION,
    ),
  )

  // -> unconfirmed orders
  const unconfirmedOrders: ComputedRef<Order[]> = computed(() =>
    orders.value.filter((order) => order.unconfirmed_deliveries.length > 0),
  )

  // -> orders delivered by team
  const ordersDeliveredByTeam: ComputedRef<(teamName: string) => Order[]> =
    computed(() => {
      return (teamName: String) => {
        let index: number
        if (teamName == gameStore.teamNameByColor('CYAN')) {
          index = 0
        } else if (teamName == gameStore.teamNameByColor('MAGENTA')) {
          index = 1
        } else {
          throw new Error('team name not found')
        }
        return orders.value.filter(
          (order) => order.quantity_delivered[index] >= 1,
        )
      }
    })

  // -> order by id
  const orderById: ComputedRef<(orderId: number) => Order | undefined> =
    computed(() => {
      return (orderId: number) => orders.value.find(({ id }) => id === orderId)
    })

  // -> file name by workpiece
  // note that the argument is not of type workpiece, other argument types (like
  // order) are also okay as long as they have the three mentioned properties
  const fileNameByWorkpiece: ComputedRef<
    (workpiece: {
      base_color: string | null
      ring_colors: string[] | null
      cap_color: string | null
    }) => string
  > = computed(() => {
    return (workpiece: {
      base_color: string | null
      ring_colors: string[] | null
      cap_color: string | null
    }) => {
      if (!workpiece.base_color && (!workpiece.ring_colors || workpiece.ring_colors.length === 0) && !workpiece.cap_color) {
        return "BASE_ANY.svg"
      }

      const parts = []
      if (workpiece.base_color) parts.push(workpiece.base_color)
      if (workpiece.ring_colors) parts.push(...workpiece.ring_colors)
      if (workpiece.cap_color) parts.push(workpiece.cap_color)

      return `${parts.join('-')}.svg`
    }
  })

  // -> color string by workpiece color
  // get the color of a workpiece color (e.g. RING_BLUE -> blue)
  const colorStringByWorkpieceColor: ComputedRef<
    (workpieceColor: string) => string
  > = computed(() => {
    return (workpieceColor: string) => {
      const colorString = workpieceColor.split('_')[1]
      if (colorString) {
        return colorString.toLowerCase()
      } else {
        console.error('Malformed workpiece color string: ' + workpieceColor)
        return ''
      }
    }
  })

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> set one order
  function setOrder(orderArg: Order): void {
    const index = orders.value.findIndex((order) => order.id === orderArg.id)
    // add the order to the array if it does not exist yet
    if (index === -1 && orders.value.length < MAX_NUMBER_OF_ORDERS.value) {
      orders.value.push(orderArg)
      // if we have received all orders, sort them
      if (orders.value.length === MAX_NUMBER_OF_ORDERS.value) {
        sortOrdersById()
      }
    }
    // if the order already exists, replace it
    if (index !== -1) {
      orders.value[index] = orderArg
    }
  }

  // -> sort orders by id
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

  // -> set workpiece
  function setWorkpiece(workpieceArg: Workpiece) {
    // try to find a workpiece with the same name
    const index = workpieces.value.findIndex(
      (workpieceFi) => workpieceFi.name == workpieceArg.name,
    )
    // if we have not found such a workpiece, add it as a new one
    if (index === -1) {
      workpieces.value.push(workpieceArg)
    }
    // else, replace the old workpiece with the same name
    else {
      workpieces.value[index] = workpieceArg
    }
  }

  // -> send confirm delivery message
  function sendConfirmDelivery({
    color,
    correctness,
    delivery_id,
    order_id,
  }: {
    color: Color
    correctness: boolean
    delivery_id: number
    order_id: number
  }) {
    const msg: ConfirmDeliveryOutMsg = {
      command: 'confirm_delivery',
      color,
      correctness,
      delivery_id,
      order_id,
    }
    socketStore.sendMessage(msg)
  }

  // -> reset
  function reset() {
    orders.value = []
    workpieces.value = []
  }

  // EXPORTS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  return {
    orders,
    workpieces,
    openOrders,
    upcomingOrders,
    upcomingActivatedOrders,
    upcomingNonActivatedOrders,
    expiredOrders,
    overtimeOrder,
    unconfirmedOrders,
    ordersDeliveredByTeam,
    orderById,
    fileNameByWorkpiece,
    colorStringByWorkpieceColor,
    setOrder,
    setWorkpiece,
    sendConfirmDelivery,
    reset,
  }
})
