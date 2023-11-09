<template>
  <div class="item team">
    <!-- TEAM NAME / ADD TEAM NAME -->
    <div :class="['item transparent team team-name', color]">
      <h4 v-if="teamName">
        {{ teamName }}
      </h4>
      <PopupWrapper v-else>
        <template #reference>
          <Button v-shortkey.once="['f5']" icon="fa-plus">
            Add Team {{ color }}
          </Button>
        </template>
        <AddTeamNamePopup :color="color"></AddTeamNamePopup>
      </PopupWrapper>
    </div>
    <!-- MACHINES/ROBOTS/SCORE -->
    <div
      v-if="phase != 'PRE_GAME'"
      :class="['team-assets', color == 'MAGENTA' ? 'rtl' : '']"
    >
      <TeamMachines :color="color" />
      <div class="section">
        <TeamScore :color="color" />
        <TeamRobots :color="color" />
      </div>
    </div>
    <!-- / END UPPER BODY -->
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import Color from '@/types/Color'
import Button from '@/components/shared/ui/Button.vue'
import PopupWrapper from '@/components/shared/ui/PopupWrapper.vue'
import AddTeamNamePopup from '@/components/referee/popups/AddTeamNamePopup.vue'
import { useGameStore } from '@/store/gameStore'
import { storeToRefs } from 'pinia'
import TeamMachines from '@/components/referee/TeamMachines.vue'
import TeamScore from '@/components/referee/TeamScore.vue'
import TeamRobots from '@/components/referee/TeamRobots.vue'

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

<style scoped lang="scss">
@use '@/assets/global.scss';

.team {
  height: 100% !important;
  padding: 10px !important;
  .team-name {
    padding: 5px;
    color: black;
    flex-grow: none;
  }
  .team-assets {
    padding-top: 10px;
    width: 100%;
    display: grid;
    gap: 10px;
    grid-template-columns: 200px 1fr;

    &.rtl {
      direction: rtl;

      * {
        direction: ltr;
      }
    }
  }
}
</style>
