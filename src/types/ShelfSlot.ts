// SHELFSLOT - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// the ShelfSlot type is used to describe a single slot in the shelf of a
// storage station
type ShelfSlot = {
  name: string // machine name
  shelf: number
  slot: number
  is_filled: boolean

  // as of January 2024, these properties do not exist yet but support for them
  // has already been implemented on the Frontend.
  base_color: string
  ring_colors: string[]
  cap_color: string
}
export default ShelfSlot
