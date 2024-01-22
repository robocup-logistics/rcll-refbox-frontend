// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup
    :title="`Set <span class='${color}-text'>${color}</span> team name`"
    icon="fa-pen-nib"
  >
    <div class="horizontal-flex known-teams">
      <template v-for="knownTeam in knownTeams">
        <Button
          v-if="
            !teamNameByColor(oppositeColor(color)) ||
            teamNameByColor(oppositeColor(color)) != knownTeam
          "
          @click.prevent="setTeamName(knownTeam)"
        >
          {{ knownTeam }}
        </Button>
      </template>
    </div>
    <div class="horizontal-flex">
      <Input ref="input" placeholder="Custom team name" v-model="teamName" />
      <Button
        icon="fa-check"
        primary
        @click="setTeamName(teamName)"
        v-shortkey.once="(shortcuts.get('confirmPopup') as Shortcut).keys"
        @shortkey="setTeamName(teamName)"
        >Confirm</Button
      >
    </div>
  </Popup>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import Popup from '@/components/shared/ui/Popup.vue'
import { ref, inject, onMounted, nextTick } from 'vue'
import type { Ref, PropType } from 'vue'
import { useGameStore } from '@/store/gameStore'
import Color from '@/types/Color'
import Input from '@/components/shared/ui/Input.vue'
import Button from '@/components/shared/ui/Button.vue'
import { storeToRefs } from 'pinia'
import { useKeyboardStore } from '@/store/keyboardStore'
import Shortcut from '@/types/Shortcut'

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const props = defineProps({
  color: {
    type: String as PropType<Color>,
    required: true,
  },
})

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const gameStore = useGameStore()
const { knownTeams, oppositeColor, teamNameByColor } = storeToRefs(gameStore)
const keyboardStore = useKeyboardStore()
const { shortcuts } = storeToRefs(keyboardStore)

// set team name - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const input: Ref<typeof Input | null> = ref(null)
const teamName: Ref<string> = ref('')

function setTeamName(name: string) {
  gameStore.sendSetTeamName({ color: props.color, name })
  togglePopup()
}

// focus input on open - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
onMounted(() => {
  nextTick(() => {
    if (input.value) input.value.focus()
  })
})

// popup - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// -> close
const togglePopup = inject('togglePopup') as Function
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
</style>
