// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup
    title="Game Config"
    icon="fa-screwdriver-wrench"
    class="config-popup"
    ref="popup"
  >
    <p>You will be able to edit the config right here in a future release.</p>
    <!-- FILTER -->
    <div class="sticky">
      <Input v-model="filter" placeholder="filter by path" clearable />
    </div>
    <template v-for="[path, value] in filteredGameConfigValues">
      <Accordion :title="`${path}: ${value}`" class="content-box">
        <div class="config-row">
          <!-- Input field for editing -->
          <Input
            class="edit-field"
            type="text"
            v-model="editedValues[path]"
            placeholder="New Value"
            clearable
          />
          <!-- Button to apply changes -->
          <Button class="apply-button" primary @click="applyChanges(path)"
            >Apply</Button
          >
        </div>
      </Accordion>
    </template>
  </Popup>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// import  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import Popup from '@/components/shared/ui/Popup.vue'
import { useConfigStore } from '@/store/configStore'
import { storeToRefs } from 'pinia'
import Accordion from '@/components/shared/ui/Accordion.vue'
import Input from '@/components/shared/ui/Input.vue'
import Button from '@/components/shared/ui/Button.vue'
import { useKeyboardStore } from '@/store/keyboardStore'
import fuzzysort from 'fuzzysort'
import { type Ref, ref, type ComputedRef, computed, watch } from 'vue'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const configStore = useConfigStore()
const { gameConfig } = storeToRefs(configStore)

// filter config paths - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const filter: Ref<string> = ref('')
const editedValues = ref({})

function applyChanges(path) {
  console.log('editedValues:', editedValues)
  const newValue = editedValues._rawValue[path]
  console.log('Applying changes for', path, 'with value:', newValue)
  configStore.sendSetConfigValue({ path: path, value: newValue })
}

const filteredGameConfigValues = computed(() => {
  // Ensure there is a filter value; otherwise, return all entries
  if (!filter.value.trim()) return [...gameConfig.value]

  // Use fuzzysort to find matches, flatten results, and map them back to the original [key, value] format
  return fuzzysort
    .go(filter.value, [...gameConfig.value], { key: (pair) => pair[0] })
    .map((result) => result.obj)
})

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
</style>
