// TEMPLATE --------------------------------------------------------------------
<template>
  <component
    :is="asPopup ? Popup : Modal"
    :title="`Hotfix ${name}`"
    ref="modal"
    v-bind="$attrs"
  >
    <!--
    <!--- <Modal :title="`Change Machine ${name} Work Status`" ref="modal"> --->
    <div class="horizontal-flex" style="width: 100%">
      <div>
        <table class="status-table">
          <thead>
            <tr
              v-if="
                machine &&
                machine.broken_reason &&
                machine.broken_reason.trim() !== ''
              "
            >
              <th colspan="3" class="broken-reason-header">
                <font-awesome-icon icon="fa-triangle-exclamation" />
                {{ machine.broken_reason }}
                <font-awesome-icon icon="fa-triangle-exclamation" />
              </th>
            </tr>
            <tr>
              <th>Status</th>
              <th>Current</th>
              <th>New Value</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="machine">
              <td>Busy</td>
              <td>{{ machine.mps_busy }}</td>
              <td>
                <Select
                  class="selector-field"
                  :options="['true', 'false']"
                  v-model="busy"
                  :defaultSelected="'false'"
                />
              </td>
            </tr>
            <tr v-if="machine">
              <td>Ready</td>
              <td>{{ machine.mps_ready }}</td>
              <td>
                <Select
                  class="selector-field"
                  :options="['true', 'false']"
                  v-model="ready"
                  :defaultSelected="'false'"
                />
              </td>
            </tr>
            <tr
              v-if="gameConfig.has(`/llsfrb/mps/stations/${name}/connection`)"
            >
              <td>Conn</td>
              <td>
                {{ gameConfig.get(`/llsfrb/mps/stations/${name}/connection`) }}
              </td>
              <td>
                <Select
                  class="selector-field"
                  :options="['plc', 'mockup']"
                  v-model="mode"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div>state: {{ machine.state }}</div>

        <div class="button-row">
          <Button
            v-if="!asPopup"
            icon="fa-square-plus"
            primary
            :style="{ backgroundColor: 'grey' }"
            @click="toggleModal()"
            >Abort</Button
          >
          <Button icon="fa-square-plus" primary @click="applyWorkStatus()"
            >Apply</Button
          >
          <Button
            icon="fa-square-plus"
            primary
            :style="{ backgroundColor: 'red' }"
            @click="breakMachine()"
            >Break</Button
          >
        </div>
      </div>
    </div>
  </component>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import Modal from '@/components/shared/ui/Modal.vue'
import Popup from '@/components/shared/ui/Popup.vue'
import Select from '@/components/shared/ui/Select.vue'
import { ref, onMounted, nextTick } from 'vue'
import type { Ref, PropType } from 'vue'
import { useMachineStore } from '@/store/machineStore'
import { useConfigStore } from '@/store/configStore'
import Color from '@/types/Color'
import Input from '@/components/shared/ui/Input.vue'
import Button from '@/components/shared/ui/Button.vue'
import Shortcut from '@/types/Shortcut'
import { storeToRefs } from 'pinia'
import { useKeyboardStore } from '@/store/keyboardStore'
import { computed } from 'vue'
import { inject } from 'vue'

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  asPopup: {
    type: Boolean,
    required: true,
  },
})
const modal = ref(null)
//const modal: Ref<typeof Modal | null> = ref(null)

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const configStore = useConfigStore()
const machineStore = useMachineStore()
const { machines } = storeToRefs(machineStore)
const keyboardStore = useKeyboardStore()
const { shortcuts } = storeToRefs(keyboardStore)
const { gameConfig } = storeToRefs(configStore)

// add points  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const busy: Ref<String | undefined> = ref('false')
const ready: Ref<String | undefined> = ref('true')
const mode: Ref<String | undefined> = ref(null)

const machine = computed(() =>
  machines.value.find((m) => m.name === props.name),
)

function applyWorkStatus() {
  if (busy.value && ready.value) {
    machineStore.setMachineWorkStatus({
      name: props.name,
      busy: busy.value === 'true',
      ready: ready.value === 'true',
    })
  } else {
    throw new Error('tried to set a work state without busy or ready set.')
  }
  if (mode.value !== undefined && mode.value !== null) {
    configStore.sendSetConfigValue({
      path: `/llsfrb/mps/stations/${props.name}/connection`,
      value: mode.value,
    })
  }
}

function breakMachine() {
  machineStore.sendBreakMachine({
    machine: props.name,
  })
}

function toggleModal() {
  if (modal.value) modal.value.close()
}
const togglePopup = inject('togglePopup') as Function

// popup - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// -> close
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
.status-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
}

.status-table th,
.status-table td {
  border: 1px solid #ddd;
  background-color: black;
  padding: 8px;
  text-align: center;
}

.status-table th {
  background-color: black;
  font-weight: bold;
}

.button-row {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 10px;
}
</style>
