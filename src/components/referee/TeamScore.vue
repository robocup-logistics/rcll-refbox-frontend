<template>
  <div class="vertical-flex">
    <!-- ADD POINTS SECTION -->
    <div class="item" style="max-height: 50px">
      <div class="horizontal-flex">
        <h4 v-if="phase !== 'PRE_GAME'">Score: {{ scoreByColor(color) }}</h4>
        <PopupWrapper>
          <template #reference>
            <Button primary title="Add Points manually" icon="fa-plus">
            </Button>
          </template>
          <AddPointsPopup :color="color" />
        </PopupWrapper>
      </div>
    </div>

    <AutoScrollContainer
      :watch-data="awardedPointsByColor(props.color)"
      class="item"
      style="height: 100px"
    >
      <div class="points-grid">
        <h6
          v-for="(award, index) in awardedPointsByColor(color)"
          :key="index"
          class="point"
        >
          {{ index + 1 }}. [{{ formatTime(award['game_time']) }}]
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

<script setup lang="ts">
import type { PropType } from 'vue'
import { storeToRefs } from 'pinia'
import formatTime from '@/utils/formatTime'
import { useGameStore } from '@/store/gameStore'
import AddPointsPopup from '@/components/referee/popups/AddPointsPopup.vue'
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
const { phase, awardedPointsByColor, scoreByColor } = storeToRefs(gameStore)
</script>

<style scoped>
.points-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 10px;

  .point {
    font-size: 13px;
    text-align: left;
  }
}
</style>
