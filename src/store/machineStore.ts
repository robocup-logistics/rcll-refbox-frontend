import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'

export const useMachineStore = defineStore('machineStore', () => {
  
  const machinesCyan: Ref<any[]> = ref([])
  const machinesMagenta: Ref<any[]> = ref([])
  const ringspecs: Ref<any[]> = ref([])
  const cyanMachinesFlag: Ref<boolean> = ref(false)
  const magentaMachinesFlag: Ref<boolean> = ref(false)
  const machinesRingspecsFlag: Ref<boolean> = ref(false)

  // add machines cyan
  function addMachinesCyan({payload, index}) {
    // state.machinesCyan
    if (index === -1) {
      machinesCyan.value.push(payload)
    } else {
      machinesCyan.value.splice(index, 1, payload)
    }
  }

  // add machines magents
  function addMachinesMagenta(payloadWithIndex) {
    // state.machinesMagenta
    if (payloadWithIndex.index === -1) {
      machinesMagenta.value.push(payloadWithIndex.payload)
    } else {
      machinesMagenta.value.splice(payloadWithIndex.index, 1, payloadWithIndex.payload)
    }
  }

  // set cyan machines
  function setCyanMachines(payload) {
    machinesCyan.value = payload
    cyanMachinesFlag.value = true
  }

  // set magente machines
  function setMagentaMachines(payload) {
    machinesMagenta.value = payload
    magentaMachinesFlag.value = true
  }

  // add ring specs
  function addRingspecs(payload) {
    if (payload.index === -1) {
      ringspecs.value.push(payload.payload)
    } else {
      ringspecs.value.splice(payload.index, 1, payload.payload)
    }
  }

  // set machines ring specs
  function setMachinesRingspecs(payload) {
    ringspecs.value = payload
  }

  // set cyan machines info
  function setCyanMachinesInfo(payload) {

    // if there wasn't information at connect populate in setup
    if (machinesCyan.value.length < 7) {

      // check if there is already that machine in the array so it doesn"t duplicate it
      const index = machinesCyan.value.findIndex(machine => machine.name === payload.name)

      if (index === -1) { 
        addMachinesCyan({payload, index})
        sortAlphabetically(machinesCyan.value)
      }

    } else {

      const index = machinesCyan.value.findIndex(machine => machine.name === payload.name)

      if (index !== -1) {
        addMachinesCyan({payload, index})
      }
    }
  }

  // set magenta machines info
  function setMagentaMachinesInfo(payload) {

    // if there wasn't information at connect populate in setup
    if (machinesMagenta.value.length < 7) {

      // check if there is already that machine in the array so it doesn"t duplicate it
      const index = machinesMagenta.value.findIndex(machine => machine.name === payload.name)

      if (index === -1) { 
        addMachinesMagenta({payload, index})
        sortAlphabetically(machinesMagenta.value)
      }

    } else {

      const index = machinesMagenta.value.findIndex(machine => machine.name === payload.name)

      if (index !== -1) {
        addMachinesMagenta({payload, index})
      }
    }
  }

  // set cyan machines info at reconnect
  function setCyanMachinesInfoAtReconnect(payload) {

    if (!cyanMachinesFlag.value) {
      setCyanMachines(payload)
      sortAlphabetically(machinesCyan.value)
    }
  }

  // set magenta machines info at reconnect
  function setMagentaMachinesInfoAtReconnect(payload) {

    if (!magentaMachinesFlag.value) {
      setMagentaMachines(payload)
      sortAlphabetically(machinesMagenta.value)
    }
  }

  // set ringspecs
  function setRingspecs(payload) {
    setMachinesRingspecs(payload)
  }

  // sort alphabetically
  function sortAlphabetically(payload) {

    payload.sort((machineA, machineB) => {
      let nameA = machineA.name;
      let nameB = machineB.name;
      if (nameA < nameB) {
        return -1;
      } 
      if (nameA > nameB) {
        return 1;
      }
      // names must be equal
      return 0;
    })
  }

  return {machinesCyan, machinesMagenta, ringspecs, cyanMachinesFlag, magentaMachinesFlag, machinesRingspecsFlag, addMachinesCyan, addMachinesMagenta, setCyanMachines, setMagentaMachines, addRingspecs, setMachinesRingspecs, setCyanMachinesInfo, setMagentaMachinesInfo, setCyanMachinesInfoAtReconnect, setMagentaMachinesInfoAtReconnect, setRingspecs, sortAlphabetically}
})