import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import Machine from '@/types/machine'
import RingSpec from '@/types/machine'

export const useMachineStore = defineStore('machineStore', () => {
  
  const machinesCyan: Ref<Machine[]> = ref([])
  const machinesMagenta: Ref<Machine[]> = ref([])
  const ringspecs: Ref<RingSpec[]> = ref([])
  const cyanMachinesFlag: Ref<boolean> = ref(false)
  const magentaMachinesFlag: Ref<boolean> = ref(false)

  // add machines cyan
  function addMachinesCyan({newMachine, index}: {newMachine: Machine, index: number}): void {
    if (index === -1) {
      machinesCyan.value.push(newMachine)
    } else {
      machinesCyan.value.splice(index, 1, newMachine)
    }
  }

  // add machines magents
  function addMachinesMagenta({newMachine, index}: {newMachine: Machine, index: number}): void {
    if (index === -1) {
      machinesMagenta.value.push(newMachine)
    } else {
      machinesMagenta.value.splice(index, 1, newMachine)
    }
  }

  // set cyan machines
  function setCyanMachines(newMachines: Machine[]): void {
    machinesCyan.value = newMachines
    cyanMachinesFlag.value = true
  }

  // set magente machines
  function setMagentaMachines(newMachines: Machine[]): void {
    machinesMagenta.value = newMachines
    magentaMachinesFlag.value = true
  }

  // add ring specs
  function addRingspecs({newRingspec, index}: {newRingspec: RingSpec, index: number}): void {
    if (index === -1) {
      ringspecs.value.push(newRingspec)
    } else {
      ringspecs.value.splice(index, 1, newRingspec)
    }
  }

  // set machines ring specs
  function setRingSpecs(newRingspecs: RingSpec[]): void {
    ringspecs.value = newRingspecs
  }

  // set cyan machines info
  function setCyanMachinesInfo(newMachine: Machine): void {

    // if there wasn't information at connect populate in setup
    if (machinesCyan.value.length < 7) {

      // check if there is already that machine in the array so it doesn"t duplicate it
      const index = machinesCyan.value.findIndex(machine => machine.name === newMachine.name)

      if (index === -1) { 
        addMachinesCyan({newMachine, index})
        sortAlphabetically(machinesCyan.value)
      }

    } else {

      const index = machinesCyan.value.findIndex(machine => machine.name === newMachine.name)

      if (index !== -1) {
        addMachinesCyan({newMachine, index})
      }
    }
  }

  // set magenta machines info
  function setMagentaMachinesInfo(newMachine: Machine): void {

    // if there wasn't information at connect populate in setup
    if (machinesMagenta.value.length < 7) {

      // check if there is already that machine in the array so it doesn"t duplicate it
      const index = machinesMagenta.value.findIndex(machine => machine.name === newMachine.name)

      if (index === -1) { 
        addMachinesMagenta({newMachine, index})
        sortAlphabetically(machinesMagenta.value)
      }

    } else {

      const index = machinesMagenta.value.findIndex(machine => machine.name === newMachine.name)

      if (index !== -1) {
        addMachinesMagenta({newMachine, index})
      }
    }
  }

  // set cyan machines info at reconnect
  function setCyanMachinesInfoAtReconnect(machines: Machine[]): void {

    if (!cyanMachinesFlag.value) {
      setCyanMachines(machines)
      sortAlphabetically(machinesCyan.value)
    }
  }

  // set magenta machines info at reconnect
  function setMagentaMachinesInfoAtReconnect(machines: Machine[]): void {

    if (!magentaMachinesFlag.value) {
      setMagentaMachines(machines)
      sortAlphabetically(machinesMagenta.value)
    }
  }

  // sort alphabetically
  function sortAlphabetically(machines: Machine[]): void {

    machines.sort((machineA, machineB) => {
      if (machineA.name < machineB.name) {
        return -1;
      } 
      if (machineA.name > machineB.name) {
        return 1;
      }
      // names must be equal
      return 0;
    })
  }

  return {machinesCyan, machinesMagenta, ringspecs, cyanMachinesFlag, magentaMachinesFlag, addMachinesCyan, addMachinesMagenta, setCyanMachines, setMagentaMachines, addRingspecs, setCyanMachinesInfo, setMagentaMachinesInfo, setCyanMachinesInfoAtReconnect, setMagentaMachinesInfoAtReconnect, setRingSpecs, sortAlphabetically}
})