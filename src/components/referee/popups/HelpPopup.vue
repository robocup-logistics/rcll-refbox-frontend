// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup title="Help" icon="fa-question">
    <TabGroup :tabs="tabs" v-model:active="activeTab" class="sticky">
      <template #[tab] v-for="(tab, i) in tabs">
        <div class="horizontal-flex">
          <font-awesome-icon :icon="tabIcons[i]" />
          <p>{{ tab }}</p>
        </div>
      </template>
    </TabGroup>
    <template v-if="activeTab == 'Q&A'">
      <Accordion title="How do I control a game?" class="accordion content-box">
        You can control the game using the game bar at the top in the center.
        Click on the Play/Pause icons for the corresponding actions or click on
        a phase to manually switch the phase.
      </Accordion>
      <Accordion
        title="How are orders displayed?"
        class="accordion content-box"
      >
        If orders are dark and barely readable, they are not active yet. A box
        surrounding an order indicates an active delivery period.
      </Accordion>
      <Accordion title="How do I confirm orders?" class="accordion content-box">
        If the game needs manual confirmation of orders, as soon as an order is
        claimed to be deliverd, a modal will spawn asking for confirmation.
      </Accordion>
      <Accordion
        title="Is there any authorization?"
        class="accordion content-box"
      >
        There is currently no authorization required to write to the refbox. It
        is planned in the long term.
      </Accordion>
    </template>
    <template v-else-if="activeTab == 'Keyboard'">
      <h2>Keyboard shortcuts</h2>
      <div
        class="content-box vertical-flex"
        v-for="shortcut in shortcuts.values()"
      >
        <div class="horizontal-flex">
          <div v-for="key in shortcut.keys" class="key-item">
            <kbd>{{ key }}</kbd>
          </div>
        </div>
        <div>{{ shortcut.description }}</div>
      </div>
    </template>
    <template v-else-if="activeTab == 'Issues'">
      <h2>
        Have you encountered an issue or have suggestions for improvement?
      </h2>
      <A
        href="https://github.com/robocup-logistics/rcll-refbox-frontend/issues"
        icon="fa-arrow-right"
        >Leave Feedback on GitHub</A
      >
    </template>
  </Popup>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import Popup from '@/components/shared/ui/Popup.vue'
import TabGroup from '@/components/shared/ui/TabGroup.vue'
import { type Ref, ref } from 'vue'
import A from '@/components/shared/ui/A.vue'
import { storeToRefs } from 'pinia'
import { useKeyboardStore } from '@/store/keyboardStore'
import Accordion from '@/components/shared/ui/Accordion.vue'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const keyboardStore = useKeyboardStore()
const { shortcuts } = storeToRefs(keyboardStore)

// tabs  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const tabs: string[] = ['Q&A', 'Keyboard', 'Issues']
const tabIcons: string[] = ['fa-list', 'fa-keyboard', 'fa-bug']
const activeTab: Ref<string> = ref('Q&A')
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

.accordion {
  padding: 0;
}
</style>
