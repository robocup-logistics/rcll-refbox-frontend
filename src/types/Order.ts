import Color from '@/types/Color'

// ORDER - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// the Order type is used to describe an order. Currently, an order consists of
// a single product, which is why there is no extra product type. With a future
// rulebook rewrite, orders may consist of multiple products and an extra type
// will be needed
export default interface Order {
  id: number

  activate_at: number // game time at which the order gets officially announced
  competitive: boolean
  complexity: string // e.g. "C1" - number = number of rings
  delivery_period: [number, number] // game time
  quantity_delivered: [number, number] // first cyan, then magenta
  quantity_requested: number // e.g. 1
  unconfirmed_deliveries: Array<{
    delivery_id?: number
    game_time: number
    team: Color
  }>

  base_color: string // e.g. "BASE_RED"
  ring_colors: string[] // e.g. ["RING_ORANGE"]
  cap_color: string // e.g. "CAP_BLACK"
}
