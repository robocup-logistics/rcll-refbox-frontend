// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup
    title="Instruct Machines"
    icon="fa-walkie-talkie"
    class="config-popup"
    ref="popup"
  >
    <p>Send instructions to machines.</p>

    <div class="row">
      <div class="column">
        <p>Machine</p>
        <Select
          class="selector-field"
          :options="machineOptions"
          v-model="selection['machine']"
        />
      </div>
      <Button class="apply-button" primary @click="instruct()">Instruct</Button>
    </div>
    <div class="row">
      <div class="column" v-if="selectedMachineType === 'CS'">
        <p>Operation</p>
        <Select
          class="selector-field"
          :options="['RETRIEVE_CAP', 'MOUNT_CAP']"
          v-model="selection['cs-op']"
        />
      </div>
      <div class="column" v-if="selectedMachineType === 'RS'">
        <p>Ring Color</p>
        <Select
          class="selector-field"
          :options="ringColors"
          v-model="selection['ring-color']"
        />
      </div>
      <div class="column" v-if="selectedMachineType === 'DS'">
        <p>Order</p>
        <Input
          class="form row"
          v-model="selection['order']"
          type="number"
          min="0"
          :placeholder="0"
        />
      </div>
      <div class="column" v-if="selectedMachineType === 'BS'">
        <p>Side</p>
        <Select
          class="selector-field"
          :options="['INPUT', 'OUTPUT']"
          v-model="selection['side']"
        />
      </div>
      <div class="column" v-if="selectedMachineType === 'BS'">
        <p>Base Color</p>
        <Select
          class="selector-field"
          :options="['BASE_RED', 'BASE_BLACK', 'BASE_SILVER']"
          v-model="selection['base-color']"
        />
      </div>
      <!-- Operation, Shelf, and Slot Selection (for SS) -->
      <div class="column" v-if="selectedMachineType === 'SS'">
        <p>Operation</p>
        <Select
          class="selector-field"
          :options="['STORE', 'RETRIEVE']"
          v-model="selection['ss-op']"
        />
      </div>
      <div class="column" v-if="selectedMachineType === 'SS'">
        <p>Shelf</p>
        <Select
          class="selector-field"
          :options="[0, 1, 2, 3, 4, 5]"
          v-model="selection['shelf']"
        />
      </div>
      <div class="column" v-if="selectedMachineType === 'SS'">
        <p>Slot</p>
        <Select
          class="selector-field"
          :options="[0, 1, 2, 3, 4, 5, 6, 7]"
          v-model="selection['slot']"
        />
      </div>
    </div>
  </Popup>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// import  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import Popup from '@/components/shared/ui/Popup.vue'
import Select from '@/components/shared/ui/Select.vue'
import { storeToRefs } from 'pinia'
import type Machine from '@/types/Machine'
import MachineEntity from './entities/MachineEntity.vue'
import Input from '@/components/shared/ui/Input.vue'
import Button from '@/components/shared/ui/Button.vue'
import { useKeyboardStore } from '@/store/keyboardStore'
import { useMachineStore } from '@/store/machineStore'
import { useGameStore } from '@/store/gameStore'
import { type Ref, ref, type ComputedRef, computed, watch } from 'vue'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const machineStore = useMachineStore()
const { machines, ringSpecs } = storeToRefs(machineStore)
const gameStore = useGameStore()
const { phase, nameTeamCyan, nameTeamMagenta, teamNameByColor } =
  storeToRefs(gameStore)
const machineOptions = computed(() =>
  machines.value.map((machine) => machine.name),
)

const ringColors = computed(() => {
  const selectedMachine = machines.value.find(
    (machine) => machine.name === selection.value.machine,
  )
  return selectedMachine ? selectedMachine.available_colors : []
})
// const selection = ref<{ [key: string]: string }>({
// 	"machine": ""
// });
const selection = ref({
  machine: '',
  'cs-op': 'RETRIEVE_CAP',
  'base-color': 'BASE_RED',
  side: 'INPUT',
  'ring-color': 'RING_NONE',
  'ss-op': 'STORE',
  shelf: 0,
  slot: 0,
  order: 0,
})
const selectedMachineType = computed(() => {
  const selectedMachine = machines.value.find(
    (machine) => machine.name === selection.value.machine,
  )
  return selectedMachine ? selectedMachine.mtype : null
})

// filter config paths - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const filter: Ref<string> = ref('')
const editedValues = ref({})

function instruct() {
  console.log('instruct:', editedValues)
  const currMachine = machines.value.find(
    (machine) => machine.name === selection.value.machine,
  )
  console.log('Team', currMachine.team)
  var team_name = nameTeamCyan
  if (currMachine.team === 'MAGENTA') {
    team_name = nameTeamMagenta
  }
  console.log('team name', team_name.value)
  console.log('type', selectedMachineType)
  if (selectedMachineType.value === 'CS') {
    machineStore.sendInstructCS({
      team_name: team_name.value,
      machine: selection.value['machine'],
      operation: selection.value['cs-op'],
    })
    console.log(
      'let us send',
      team_name.value,
      selection.value['machine'],
      selection.value['cs-op'],
    )
  }
  if (selectedMachineType.value === 'RS') {
    machineStore.sendInstructRS({
      team_name: team_name.value,
      machine: selection.value['machine'],
      ring_color: selection.value['ring-color'],
    })
    console.log(
      'let us send',
      team_name.value,
      selection.value['machine'],
      selection.value['ring-color'],
    )
  }
  if (selectedMachineType.value === 'BS') {
    machineStore.sendInstructBS({
      team_name: team_name.value,
      machine: selection.value['machine'],
      side: selection.value['side'],
      base_color: selection.value['base-color'],
    })
  }
  if (selectedMachineType.value === 'DS') {
    machineStore.sendInstructDS({
      team_name: team_name.value,
      machine: selection.value['machine'],
      order: selection.value['order'],
    })
  }
  if (selectedMachineType.value === 'SS') {
    machineStore.sendInstructSS({
      team_name: team_name.value,
      machine: selection.value['machine'],
      operation: selection.value['ss-op'],
      shelf: selection.value['shelf'],
      slot: selection.value['slot'],
    })
  }
}

const popup: Ref<typeof Popup | undefined> = ref()
watch(
  () => filter.value,
  () => {
    if (popup.value) {
      popup.value.scrollToTop()
    }
  },
)
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

.config-popup {
  .accordion {
    padding: 0;
  }
}
.config-row {
  display: flex;
  align-items: center;
}

.edit-field {
  flex: 1;
  margin-right: 10px; // Adjust as needed
}

.apply-button {
  margin-left: auto; // Align to the right
}
.row {
  display: flex;
  margin-bottom: 10px;
}

.column {
  flex: 1;
  margin-right: 10px;
}
</style>
