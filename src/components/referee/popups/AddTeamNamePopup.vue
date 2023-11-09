// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup :title="`Add ${color} team name`">
    <div class="horizontal-flex known-teams">
      <Button
        v-for="knownTeam in knownTeams"
        @click.prevent="setTeamName(knownTeam)"
      >
        {{ knownTeam }}
      </Button>
    </div>
    <form
      class="horizontal-flex"
      style="align-items: stretch"
      @submit.prevent="setTeamName(input?.getValue())"
    >
      <Input ref="input" placeholder="Custom team name" :value="teamName" />
      <Button icon="fa-paper-plane" primary submit>Confirm</Button>
    </form>
  </Popup>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import Popup from '@/components/shared/ui/Popup.vue'
import { ref, inject, onMounted, nextTick } from 'vue'
import type { Ref, PropType } from 'vue'
import { useGameStore } from '@/store/gameStore'
import { useSocketStore } from '@/store/socketStore'
import Color from '@/types/Color'
import Input from '@/components/shared/ui/Input.vue'
import Button from '@/components/shared/ui/Button.vue'
import { storeToRefs } from 'pinia'
import SetTeamNameOutMsg from '@/types/messages/outgoing/SetTeamNameOutMsg'

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const props = defineProps({
  color: {
    type: String as PropType<Color>,
    required: true,
  },
})

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const gameStore = useGameStore()
const { knownTeams } = storeToRefs(gameStore)
const socketStore = useSocketStore()

// set team name - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const input: Ref<typeof Input | null> = ref(null)
const teamName: Ref<string> = ref('')

function setTeamName(name: string) {
  const msg: SetTeamNameOutMsg = {
    command: 'set_teamname',
    color: props.color,
    name,
  }
  socketStore.SOCKET_SEND(msg)
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
