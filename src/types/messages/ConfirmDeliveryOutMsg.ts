import Color from '@/types/Color'

export default interface ConfirmDeliveryOutMsg {
  command: 'confirm_delivery'
  correctness: boolean
  delivery_id: number | null
  order_id: number
  color: Color
}
