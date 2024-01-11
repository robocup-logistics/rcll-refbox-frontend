import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import { Store, _UnwrapAll, defineStore } from 'pinia'
import type Machine from '@/types/Machine'
import type RingSpec from '@/types/RingSpec'
import Color from '@/types/Color'
import MachineCS from '@/types/MachineCS'

export const useMachineStore = defineStore('machineStore', () => {
  // REFS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const machines: Ref<Machine[]> = ref([])
  const ringSpecs: Ref<RingSpec[]> = ref([])

  // COMPUTED  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // machines by color
  const machinesByColor: ComputedRef<(color: Color) => Machine[]> = computed(
    () => {
      return (color: Color) =>
        machines.value.filter((machine) => machine.team == color)
    }
  )

  // payment by ring
  const paymentByRing: ComputedRef<(ring: string) => number | undefined> =
    computed(() => {
      return (ring: string) => {
        const ringSpec = ringSpecs.value.find(
          (ringSpec) => ringSpec.color == ring
        )
        if (ringSpec) {
          return ringSpec.req_bases
        } else {
          return undefined
        }
      }
    })

  // color string by workpiece item
  const colorByWorkpieceItem: ComputedRef<(workpieceItem: string) => string> =
    computed(() => {
      return (workpieceItem: string) =>
        workpieceItem.split('_')[1].toLowerCase()
    })

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // prepare machine by adding information to it that is not yet communicated via the websocket
  function prepareMachine(newMachine: Machine): Machine {
    // as of 2023, the color information is not available. This will change with
    // the new rules but for now, this has to be set manually
    if (newMachine.mtype == 'CS') {
      const machine = <MachineCS>newMachine
      if (newMachine.name.includes('CS1')) {
        machine.cs_color = 'CAP_GREY'
      } else if (newMachine.name.includes('CS2')) {
        machine.cs_color = 'CAP_BLACK'
      }
    }
    return newMachine
  }

  // set machines ring specs
  function setringSpecs(newringSpecs: RingSpec[]): void {
    ringSpecs.value = newringSpecs
  }

  // sets a machine (either adds a new one or replaces a existing one if it
  // already exists)
  function setMachine(machineArg: Machine): void {
    // try to find the machine
    const index = machines.value.findIndex(
      (machine) => machine.name === machineArg.name
    )

    // if we have found a machine, replace it
    if (index !== -1) {
      machines.value.splice(index, 1, prepareMachine(machineArg))
    }
    // else, we have a new machine and add it to our list of machines
    else {
      machines.value.push(prepareMachine(machineArg))
      sortMachinesAlphabetically()
    }
  }

  // set cyan machines info at reconnect
  function setMachinesAtReconnect(newMachines: Machine[]): void {
    for (const machine of newMachines) {
      machines.value.push(prepareMachine(machine))
    }
    sortMachinesAlphabetically()
  }

  // sort alphabetically
  function sortMachinesAlphabetically(): void {
    machines.value.sort((machineA, machineB) => {
      if (machineA.name < machineB.name) {
        return -1
      }
      if (machineA.name > machineB.name) {
        return 1
      }
      // names must be equal
      return 0
    })
  }

  function reset() {
    machines.value = []
    ringSpecs.value = []
  }

  // EXPORTS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  return {
    machines,
    ringSpecs,
    machinesByColor,
    paymentByRing,
    colorByWorkpieceItem,
    setringSpecs,
    setMachine,
    setMachinesAtReconnect,
    reset,
  }
})
function storeToRefs(
  ruleStore: Store<
    'ruleStore',
    _UnwrapAll<
      Pick<
        {
          SETUP_DURATION: Ref<number>
          PRODUCTION_DURATION: Ref<number>
          OVERTIME_DURATION: Ref<number>
          MAINTENANCE_DURATION: Ref<number>
          MAX_NUMBER_OF_ROBOTS: Ref<number>
          MAX_NUMBER_OF_MACHINES: Ref<number>
        },
        | 'SETUP_DURATION'
        | 'PRODUCTION_DURATION'
        | 'OVERTIME_DURATION'
        | 'MAINTENANCE_DURATION'
        | 'MAX_NUMBER_OF_ROBOTS'
        | 'MAX_NUMBER_OF_MACHINES'
      >
    >,
    Pick<
      {
        SETUP_DURATION: Ref<number>
        PRODUCTION_DURATION: Ref<number>
        OVERTIME_DURATION: Ref<number>
        MAINTENANCE_DURATION: Ref<number>
        MAX_NUMBER_OF_ROBOTS: Ref<number>
        MAX_NUMBER_OF_MACHINES: Ref<number>
      },
      never
    >,
    Pick<
      {
        SETUP_DURATION: Ref<number>
        PRODUCTION_DURATION: Ref<number>
        OVERTIME_DURATION: Ref<number>
        MAINTENANCE_DURATION: Ref<number>
        MAX_NUMBER_OF_ROBOTS: Ref<number>
        MAX_NUMBER_OF_MACHINES: Ref<number>
      },
      never
    >
  >
): { MAX_NUMBER_OF_ROBOTS: any } {
  throw new Error('Function not implemented.')
}
