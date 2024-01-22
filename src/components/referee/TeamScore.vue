// TEMPLATE --------------------------------------------------------------------
<template>
  <div class="vertical-flex">
    <!-- SCORE + ADD REWARD SECTION -->
    <div class="flex-item" style="height: 60px; padding: 10px; flex-grow: 0">
      <div class="horizontal-flex">
        <h4 v-if="phase !== 'PRE_GAME'">Score: {{ scoreByColor(color) }}</h4>
        <PopupWrapper v-if="phase == 'PRODUCTION'">
          <template #reference>
            <Button primary title="Add reward" icon="fa-plus"> </Button>
          </template>
          <AddRewardPopup :color="color" />
        </PopupWrapper>
      </div>
    </div>

    <!-- REWARDS LIST -->
    <AutoScrollContainer
      :watch-data="rewardsByColor(props.color)"
      class="flex-item"
      style="height: 100px"
    >
      <div class="rewards-grid">
        <h6
          v-for="(award, index) in rewardsByColor(color)"
          :key="index"
          class="reward"
        >
          {{ index + 1 }}. [{{ formatTime(award.game_time) }}]
          {{ award.phase.substring(0, 3) }}
          <span class="text-light">{{ award.points }}</span> point(s)
          <br />
          <span :style="{ 'font-weight': 300, color: accentColor }">
            {{ award.reason }}
          </span>
        </h6>
      </div>
    </AutoScrollContainer>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
import type { PropType } from 'vue'
import { storeToRefs } from 'pinia'
import formatTime from '@/utils/formatTime'
import { useGameStore } from '@/store/gameStore'
import AddRewardPopup from '@/components/referee/popups/AddRewardPopup.vue'
import Color from '@/types/Color'
import AutoScrollContainer from '@/components/shared/ui/AutoScrollContainer.vue'
import PopupWrapper from '@/components/shared/ui/PopupWrapper.vue'
import { accentColor } from '@/assets/exports.module.scss'
import Button from '@/components/shared/ui/Button.vue'

const props = defineProps({
  color: {
    type: String as PropType<Color>,
    required: true,
  },
})

const gameStore = useGameStore()
const { phase, rewardsByColor, scoreByColor } = storeToRefs(gameStore)
</script>

// STYLE -----------------------------------------------------------------------
<style scoped>
.rewards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 10px;

  .reward {
    font-size: 13px;
    text-align: left;
  }
}
</style>
