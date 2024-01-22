import { defineStore } from 'pinia'
import type Shortcut from '@/types/Shortcut'
import { type Ref, ref } from 'vue'

// KEYBOARD STORE  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// the keyboardStore provides the components with the different keyboard
// shortcuts. Since this store is not subject to change, it does not need a
// reset option. One might wonder why implement it as a store then - the thought
// was just to keep it similar with the other central information the components
// retrieve
export const useKeyboardStore = defineStore('keyboardStore', () => {
  // CONSTS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> default shortcuts
  const defaultShortcuts: Array<[string, Shortcut]> = [
    [
      'dismissPopup',
      {
        keys: ['esc'],
        description: 'Dismiss open popup',
      },
    ],
    [
      'confirmPopup',
      {
        keys: ['enter'],
        description:
          'Confirm the primary action of the current popup or modal (if there is one)',
      },
    ],
    [
      'toggleAdvancedOptions',
      {
        keys: ['ctrl', 'alt', 'o'],
        description: 'Toggle advanced options',
      },
    ],
  ]
  // REFS  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // -> shortcuts
  const shortcuts: Ref<Map<string, Shortcut>> = ref(new Map(defaultShortcuts))

  // EXPORTS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  return {
    shortcuts,
  }
})
