import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import { defineStore } from 'pinia'
import type Machine from '@/types/Machine'
import type RingSpec from '@/types/RingSpec'
import type Color from '@/types/Color'
import type ShelfSlot from '@/types/ShelfSlot'
import { useSocketStore } from '@/store/socketStore'
import { useConfigStore } from '@/store/configStore'

import type InstructBS from '@/types/InstructBS'
import InstructBSOutMsg from '@/types/messages/outgoing/InstructBSOutMsg'
import type InstructCS from '@/types/InstructCS'
import InstructCSOutMsg from '@/types/messages/outgoing/InstructCSOutMsg'
import type InstructRS from '@/types/InstructRS'
import InstructRSOutMsg from '@/types/messages/outgoing/InstructRSOutMsg'
import type InstructDS from '@/types/InstructDS'
import InstructDSOutMsg from '@/types/messages/outgoing/InstructDSOutMsg'
import type InstructSS from '@/types/InstructSS'
import InstructSSOutMsg from '@/types/messages/outgoing/InstructSSOutMsg'
import MachineWorkStatus from '@/types/MachineWorkStatus'
import SetMachineWorkStatusOutMsg from '@/types/messages/outgoing/SetMachineWorkStatusOutmsg'
import BreakMachine from '@/types/BreakMachine'
import BreakMachineOutMsg from '@/types/messages/outgoing/BreakMachineOutMsg'
// MACHINE STORE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// the machine stores stores the machines and related information and provides
// methods to interact with them
export const useMachineStore = defineStore('machineStore', () => {
  // REFS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const machines: Ref<Machine[]> = ref([])
  const shelfSlots: Ref<ShelfSlot[]> = ref([])
  const ringSpecs: Ref<RingSpec[]> = ref([])

  const socketStore = useSocketStore()

  // COMPUTED  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> machines by color
  const machinesByColor: ComputedRef<(color: Color) => Machine[]> = computed(
    () => {
      return (color: Color) =>
        machines.value.filter((machine) => machine.team == color)
    },
  )

  // -> payment by ring
  const paymentByRing: ComputedRef<(ring: string) => number | undefined> =
    computed(() => {
      return (ring: string) => {
        const ringSpec = ringSpecs.value.find(
          (ringSpec) => ringSpec.color == ring,
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
  // -> prepare machine by adding information to it that is not yet communicated
  // via the websocket
  function prepareMachine(newMachine: Machine): Machine {
    // as of 2023, the color information is not available (the cs_color is not a
    // suitable replacement since it is not permanent and can become null). This
    // will change with the new rules but for now, this has to be set manually
    if (newMachine.mtype == 'CS') {
      const machine = newMachine
      if (newMachine.name.includes('CS1')) {
        machine.available_color = 'CAP_GREY'
      } else if (newMachine.name.includes('CS2')) {
        machine.available_color = 'CAP_BLACK'
      }
      return machine
    }
    return newMachine
  }

  // -> set one machine (either add a new one or replace a existing one if it
  // already exists)
  function setMachine(machineArg: Machine): void {
    // try to find the machine
    const index = machines.value.findIndex(
      (machine) => machine.name === machineArg.name,
    )

    // if we have found a machine, replace it
    if (index !== -1) {
      machines.value[index] = prepareMachine(machineArg)
    }
    // else, we have a new machine and add it to our list of machines
    else {
      machines.value.push(prepareMachine(machineArg))
      sortMachinesAlphabetically()
    }
  }

  // -> sort machines alphabetically
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

  // -> set one shelf slot
  function setShelfSlot(slotArg: ShelfSlot): void {
    // try to find the shelf slot
    const index = shelfSlots.value.findIndex(
      (slotFi) =>
        slotFi.name == slotArg.name &&
        slotFi.shelf == slotArg.shelf &&
        slotFi.slot == slotArg.slot,
    )

    // if we have found a shelf slot, replace it
    if (index !== -1) {
      shelfSlots.value[index] = slotArg
    }
    // else, we have a new shelf slot and add it to our list of shelf slot
    else {
      shelfSlots.value.push(slotArg)
    }
  }

  // -> set one ring spec
  function setRingSpec(ringSpecArg: RingSpec): void {
    // try to find the shelf slot
    const index = ringSpecs.value.findIndex(
      (ringSpecFi) => ringSpecFi.color == ringSpecArg.color,
    )

    // if we have found a shelf slot, replace it
    if (index !== -1) {
      ringSpecs.value[index] = ringSpecArg
    }
    // else, we have a new shelf slot and add it to our list of shelf slot
    else {
      ringSpecs.value.push(ringSpecArg)
    }
  }

  function sendInstructBS({
    team_name,
    machine,
    side,
    base_color,
  }: InstructBS) {
    const msg: InstructBSOutMsg = {
      command: 'instruct_bs',
      team_name,
      machine,
      side,
      base_color,
    }
    socketStore.sendMessage(msg)
  }

  function sendInstructCS({ team_name, machine, operation }: InstructCS) {
    const msg: InstructCSOutMsg = {
      command: 'instruct_cs',
      team_name,
      machine,
      operation,
    }
    socketStore.sendMessage(msg)
  }

  function sendInstructRS({ team_name, machine, ring_color }: InstructRS) {
    const msg: InstructRSOutMsg = {
      command: 'instruct_rs',
      team_name,
      machine,
      ring_color,
    }
    socketStore.sendMessage(msg)
  }

  function sendInstructDS({ team_name, machine, order }: InstructDS) {
    const msg: InstructDSOutMsg = {
      command: 'instruct_ds',
      team_name,
      machine,
      order,
    }
    socketStore.sendMessage(msg)
  }

  function sendInstructSS({
    team_name,
    machine,
    operation,
    shelf,
    slot,
  }: InstructSS) {
    const msg: InstructSSOutMsg = {
      command: 'instruct_ss',
      team_name,
      machine,
      operation,
      shelf,
      slot,
    }
    socketStore.sendMessage(msg)
  }

  function sendBreakMachine({ machine }: BreakMachine) {
    const msg: BreakMachineOutMsg = {
      command: 'break_machine',
      machine,
    }
    socketStore.sendMessage(msg)
  }

  // -> reset
  function reset() {
    machines.value = []
    shelfSlots.value = []
    ringSpecs.value = []
  }

  function setMachineWorkStatus({ name, busy, ready }: MachineWorkStatus) {
    const msg: SetMachineWorkStatusOutMsg = {
      command: 'set_machine_work_status',
      name,
      busy,
      ready,
    }
    socketStore.sendMessage(msg)
  }

  // EXPORTS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  return {
    machines,
    shelfSlots,
    ringSpecs,
    machinesByColor,
    paymentByRing,
    colorByWorkpieceItem,
    setMachine,
    setShelfSlot,
    setRingSpec,
    sendInstructBS,
    sendInstructRS,
    sendInstructCS,
    sendInstructDS,
    sendInstructSS,
    sendBreakMachine,
    setMachineWorkStatus,
    reset,
  }
})
