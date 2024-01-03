export default interface Order {
  activate_at: number
  base_color: string // e.g. "BASE_RED"
  cap_color: string // e.g. "CAP_BLACK"
  competitive: boolean
  complexity: string // e.g. "C1" (seems to be C0 to C3)
  delivery_gate: number // ? e.g. 3
  delivery_period: [number, number] // e.g. ["0", "1280"] (seconds)
  id: number // e.g. 1
  quantity_delivered: [number, number] // e.g. ["0", "1"] (first cyan, then magenta)
  quantity_requested: number // e.g. 1
  ring_colors: string[] // e.g. ["RING_ORANGE"]
  unconfirmed_deliveries: any[] // TODO, e.g. []
}
