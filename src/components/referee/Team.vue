// TEMPLATE --------------------------------------------------------------------
<template>
  <div class="flex-item team">
    <!-- TEAM NAME / ADD TEAM NAME -->
    <div :class="['flex-item transparent team-name', color]">
      <h4 v-if="teamName">
        {{ teamName }}
      </h4>
      <PopupWrapper v-else style="width: fit-content">
        <template #reference>
          <Button v-shortkey.once="['f5']" icon="fa-pen-nib">
            Set <span :class="`${color}-text`">{{ color }}</span> team name
          </Button>
        </template>
        <SetTeamNamePopup :color="color"></SetTeamNamePopup>
      </PopupWrapper>
    </div>
    <!-- MACHINES/ROBOTS/SCORE -->
    <div
      v-if="phase != 'PRE_GAME'"
      :class="['team-assets', color == 'CYAN' ? 'rtl' : '']"
    >
      <TeamMachines :color="color" />
      <div class="vertical-flex">
        <TeamScore :color="color" />
        <TeamRobots :color="color" />
      </div>
    </div>
    <!-- / END UPPER BODY -->
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import type { PropType } from 'vue'
import Color from '@/types/Color'
import Button from '@/components/shared/ui/Button.vue'
import PopupWrapper from '@/components/shared/ui/PopupWrapper.vue'
import SetTeamNamePopup from '@/components/referee/popups/SetTeamNamePopup.vue'
import { useGameStore } from '@/store/gameStore'
import { storeToRefs } from 'pinia'
import TeamMachines from '@/components/referee/TeamMachines.vue'
import TeamScore from '@/components/referee/TeamScore.vue'
import TeamRobots from '@/components/referee/TeamRobots.vue'

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
defineProps({
  color: {
    type: String as PropType<Color>,
    required: true,
  },
  teamName: {
    type: String as PropType<string>,
    required: false,
  },
})

const gameStore = useGameStore()
const { phase } = storeToRefs(gameStore)
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

.team {
  height: 100% !important;
  padding: 10px !important;
  .team-name {
    padding: 10px !important;
    color: black;
    flex-grow: 0 !important;
  }
  .team-assets {
    padding-top: 10px;
    width: 100%;
    display: grid;
    gap: 10px;
    grid-template-columns: 250px 1fr;

    &.rtl {
      direction: rtl;

      * {
        direction: ltr;
      }
    }
  }
}
</style>
