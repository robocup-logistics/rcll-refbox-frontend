// RINGSPEC  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// an object of type RingSpec contains information about a ring color and how
// much bases need to be spent to mount a ring. This information is stored
// seperately from the ring stations because one station provide multiple ring
// colors
export default interface RingSpec {
  color: string // ring color
  req_bases: number // number of bases for payment
}
