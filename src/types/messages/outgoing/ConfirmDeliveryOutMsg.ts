import type Color from '@/types/Color'

// CONFIRMDELIVERYOUTMSG - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// we send this message if we want to confirm a delivery
export default interface ConfirmDeliveryOutMsg {
  command: 'confirm_delivery'
  correctness: boolean
  delivery_id: number | null
  order_id: number
  color: Color
}
