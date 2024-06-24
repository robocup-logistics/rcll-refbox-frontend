// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup title="Presets" icon="fa-gears">
    <TabGroup :tabs="tabs" v-model:active="activeTab" class="sticky">
      <template #[tab] v-for="(tab, i) in tabs">
        <div class="horizontal-flex">
          <font-awesome-icon :icon="tabIcons[i]" />
          <p>{{ tab }}</p>
        </div>
      </template>
    </TabGroup>
    <template v-if="activeTab == 'challenges'">
      <h2>Challange Presets</h2>
      <Accordion title="Navigation Challenge" class="accordion content-box">
        <div class="selector-row">
          <!-- Input field for editing -->
          <Select
            class="selector-field"
            :options="['easy', 'medium', 'hard']"
            v-model="selection['navigation']"
          />
          <!-- Button to apply changes -->
          <Button
            class="apply-button"
            primary
            @click="applyChanges('navigation')"
            >Apply</Button
          >
        </div>
      </Accordion>
      <Accordion title="Exploration Challenge" class="accordion content-box">
        <div class="selector-row">
          <Select
            class="selector-field"
            :options="['easy', 'medium', 'hard']"
            v-model="selection['exploration']"
          />
          <Button
            class="apply-button"
            primary
            @click="applyChanges('exploration')"
            >Apply</Button
          >
        </div>
      </Accordion>
      <Accordion title="Grasping Challenge" class="accordion content-box">
        <div class="selector-row">
          <Button class="apply-button" primary @click="applyChanges('grasping')"
            >Apply</Button
          >
        </div>
      </Accordion>
      <Accordion title="Production Challenge" class="accordion content-box">
        <div class="selector-row">
          <Select
            class="selector-field"
            :options="['c0', 'c1', 'c2', 'c3']"
            v-model="selection['production']"
          />
          <Select
            class="selector-field"
            :options="['ground truth', 'no ground truth']"
            v-model="groundTruthValues['production']"
          />
          <Button
            class="apply-button"
            primary
            @click="applyChanges('production')"
            >Apply</Button
          >
        </div>
      </Accordion>
    </template>
    <template v-for="(tab, index) in tabs">
      <template v-if="activeTab === tab && activeTab !== 'challenges'">
        <h2>{{ capitalizeFirstLetter(tab) }} Presets</h2>
        <div class="selector-row">
          <Select
            class="selector-field"
            :options="getPresetOptions(tab)"
            v-model="selection[tab]"
          />
          <Button class="apply-button" primary @click="applyChanges(tab)"
            >Apply</Button
          >
        </div>
      </template>
    </template>
  </Popup>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// import  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import Popup from '@/components/shared/ui/Popup.vue'
import TabGroup from '@/components/shared/ui/TabGroup.vue'
import { usePresetStore } from '@/store/presetStore'
import A from '@/components/shared/ui/A.vue'
import { storeToRefs } from 'pinia'
import Accordion from '@/components/shared/ui/Accordion.vue'
import Select from '@/components/shared/ui/Select.vue'
import Input from '@/components/shared/ui/Input.vue'
import Button from '@/components/shared/ui/Button.vue'
import { useKeyboardStore } from '@/store/keyboardStore'
import { type Ref, ref, type ComputedRef, watch } from 'vue'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const presetStore = usePresetStore()
const { configPresets } = storeToRefs(presetStore)

// filter config paths - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const filter: Ref<string> = ref('')

const selection = ref<{ [key: string]: string }>({
  exploration: 'hard',
  navigation: 'hard',
  production: 'c3',
})
const groundTruthValues = ref<{ [key: string]: string }>({})
// Define a method to capitalize the first letter of a string
const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Define a method to get preset options based on the category
const getPresetOptions = (category: string) => {
  // Filter configPresets to find presets belonging to the specified category
  const presetsInCategory = Array.from(configPresets.value).filter(
    (preset) => preset.category === category,
  )

  // Extract unique preset values from the filtered presets
  const uniquePresets = [
    ...new Set(presetsInCategory.map((preset) => preset.preset)),
  ]

  // Return the unique preset values as options
  return uniquePresets
}
function applyChanges(category) {
  const currSelection = selection._rawValue[category]
  if (category === 'grasping') {
    presetStore.sendSetConfigPreset({
      category: 'challenges/grasping',
      preset: 'grasping',
    })
    presetStore.sendSetConfigPreset({
      category: 'challenges/grasping',
      preset: 'grasping_game',
    })
    return
  }
  if (currSelection === undefined) {
    console.log('Ignoring due to undefined selection')
  } else if (category === 'exploration') {
    const currPreset = `exploration_${currSelection}`
    presetStore.sendSetConfigPreset({
      category: 'challenges/exp',
      preset: currPreset,
    })
  } else if (category === 'navigation') {
    const currPreset = `nav_${currSelection}`
    presetStore.sendSetConfigPreset({
      category: 'challenges/nav',
      preset: currPreset,
    })
  } else if (category === 'production') {
    const currGroundTruth = groundTruthValues._rawValue[category]
    if (currGroundTruth === undefined) {
      console.log('Ignoring due to undefined selection of ground truth option')
    } else if (currGroundTruth === 'ground truth') {
      presetStore.sendSetConfigPreset({
        category: 'challenges/prod',
        preset: currSelection,
      })
    } else if (currGroundTruth === 'no ground truth') {
      presetStore.sendSetConfigPreset({
        category: 'challenges/prod',
        preset: currSelection,
      })
    } else {
      console.log(
        'Ignoring due to unknown ground truth selection',
        currGroundTruth,
      )
    }
  } else {
    presetStore.sendSetConfigPreset({
      category: category,
      preset: currSelection,
    })
  }
}

// tabs  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const iconLookupMap = {
  challenges: 'fa-medal',
  mps: 'fa-industry',
  mongodb: 'fa-database',
  main: 'fa-house',
  game: 'fa-gamepad',
  comm: 'fa-walkie-talkie',
  team: 'fa-people-group',
  simulation: 'fa-atom',
}
const defaultIcon = 'fa-khanda'
//const tabs = Array.from(new Set(Array.from(configPresets._rawValue).map(preset => preset.category)));
const tabs = Array.from(
  new Set(
    Array.from(configPresets._rawValue)
      .filter((preset) => preset.category !== '') // Exclude entries where category is empty
      .map((preset) => {
        const category = preset.category.startsWith('challenges/')
          ? 'challenges'
          : preset.category
        return category
      }),
  ),
)
//const tabs: string[] = ['challenges','machines', 'mongodb']
const tabIcons = tabs.map((tab) => iconLookupMap[tab] || defaultIcon)
const activeTab: Ref<string> = ref('challenges')
const tab = undefined
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

.key-item {
  kbd {
    display: inline-block;
    border-radius: 4px;
    padding: 0.3em 0.7em;
    border-bottom: 2px solid global.$lighterColor;
    box-shadow:
      0 1px 0px global.$bgColor,
      0 0 0 2px global.$lightestColor inset;
    background-color: global.$surfaceColor;
    text-transform: capitalize;
  }
  & + .key-item {
    &:before {
      content: '+ ';
    }
  }
}

.tab-group {
  align-items: stretch !important;
  padding-bottom: 20px;
}

.accordion {
  padding: 0;
  align-items: stretch !important;
}
.selector-row {
  display: flex;
}

.selector-field {
  flex: 1;
  margin-right: 10px; // Adjust as needed
}

.apply-button {
  margin-left: auto; // Align to the right
}
</style>
