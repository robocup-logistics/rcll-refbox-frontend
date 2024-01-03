import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import { defineStore } from 'pinia'
import type Machine from '@/types/Machine'
import type RingSpec from '@/types/Ringspec'
import Color from '@/types/Color'
import MachineCS from '@/types/MachineCS'

export const useMachineStore = defineStore('machineStore', () => {
  // REFS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const machines: Ref<Machine[]> = ref([])
  const ringspecs: Ref<RingSpec[]> = ref([])

  // COMPUTED  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // machines by color
  const machinesByColor: ComputedRef<(color: Color) => Machine[]> = computed(
    () => {
      return (color: Color) =>
        machines.value.filter((machine) => machine.team == color)
    }
  )

  // METHODS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // add machine
  function addMachine(newMachine: Machine, index: number = -1): void {
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
    if (index === -1) {
      machines.value.push(newMachine)
    } else {
      machines.value.splice(index, 1, newMachine)
    }
  }

  // set machines ring specs
  function setRingSpecs(newRingspecs: RingSpec[]): void {
    ringspecs.value = newRingspecs
  }

  // set machine info: if there wasn't information at connect populate in setup
  function setMachineInfo(newMachine: Machine): void {
    const relMachines =
      newMachine.team == 'CYAN'
        ? machinesByColor.value('CYAN')
        : machinesByColor.value('MAGENTA')
    if (relMachines.length < 7) {
      // check if there is already that machine in the array so it doesn"t duplicate it
      const index = machines.value.findIndex(
        (machine) => machine.name === newMachine.name
      )

      if (index === -1) {
        addMachine(newMachine)
        sortMachinesAlphabetically()
      }
    } else {
      const index = machines.value.findIndex(
        (machine) => machine.name === newMachine.name
      )

      if (index !== -1) {
        addMachine(newMachine, index)
      }
    }
  }

  // set cyan machines info at reconnect
  function setMachineInfosAtReconnect(newMachines: Machine[]): void {
    for (const machine of newMachines) {
      addMachine(machine)
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
    ringspecs.value = []
  }

  // EXPORTS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  return {
    machines,
    ringspecs,
    machinesByColor,
    addMachine,
    setRingSpecs,
    setMachineInfo,
    setMachineInfosAtReconnect,
    reset,
  }
})
