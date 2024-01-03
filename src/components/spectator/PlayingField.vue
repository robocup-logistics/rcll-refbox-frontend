// TEMPLATE --------------------------------------------------------------------
<template>
  <div id="playingFieldWrapper">
    <div id="playingField" ref="playingField">
      <template v-for="vIndex in verticalFieldSize">
        <!-- negative x coordinates only if field is mirrored -->
        <template v-if="isFieldMirrored">
          <template v-for="hIndex in horizontalFieldSize">
            <PlayingFieldSquare
              :zone="
                getZoneNameFor(
                  -(horizontalFieldSize - hIndex + 1),
                  verticalFieldSize - vIndex + 1
                )
              "
              :with-dot="vIndex != 1 && hIndex != 1"
            />
          </template>
        </template>
        <!-- positive x coordinates -->
        <template v-for="hIndex in horizontalFieldSize">
          <PlayingFieldSquare
            :zone="getZoneNameFor(hIndex, verticalFieldSize - vIndex + 1)"
            :with-dot="vIndex != 1"
          />
        </template>
      </template>
    </div>
    <template v-for="robot in robots">
      <AgentTaskMoveEntity :robot="robot" waypoint="C-BS"></AgentTaskMoveEntity>
      <RobotEntity :robot="robot"></RobotEntity>
    </template>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/store/gameStore'
import { useViewStore } from '@/store/viewStore'
import PlayingFieldSquare from '@/components/spectator/PlayingFieldSquare.vue'
import { useRobotStore } from '@/store/robotStore'
import RobotEntity from '@/components/spectator/entities/RobotEntity.vue'
import type { Ref } from 'vue'
import { ref, watch } from 'vue'
import AgentTaskMoveEntity from '@/components/spectator/entities/AgentTaskMoveEntity.vue'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const gameStore = useGameStore()
const {} = storeToRefs(gameStore)

const viewStore = useViewStore()
const {
  isFieldMirrored,
  horizontalFieldSize,
  verticalFieldSize,
  fullHorizontalFieldSize,
  fieldWidthPixels,
  fieldHeightPixels,
} = storeToRefs(viewStore)

const robotStore = useRobotStore()
const { robots } = storeToRefs(robotStore)

// zones - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function getZoneNameFor(x: number, y: number): string {
  let zone = ''
  if (isFieldMirrored.value) {
    if (x < 0) {
      zone += 'M_'
    } else if (x > 0) {
      zone += 'C_'
    } else {
      throw new Error('x coordinate of a field can not be zero')
    }
  } else {
    zone += 'C_'
  }
  zone += 'Z'
  zone += Math.abs(x).toString()
  zone += y.toString()

  return zone
}

// observe and update size in store  - - - - - - - - - - - - - - - - - - - - - -
const playingField: Ref<HTMLDivElement | null> = ref(null)
const resizeObserver = new ResizeObserver(() => {
  if (playingField.value) {
    fieldWidthPixels.value = playingField.value.offsetWidth
    fieldHeightPixels.value = playingField.value.offsetHeight
  }
})
watch(playingField, (newPlayingField, _) => {
  if (newPlayingField) resizeObserver.observe(newPlayingField)
})
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

#playingFieldWrapper {
  height: fit-content;
  width: fit-content;
  position: relative;

  #playingField {
    $square-gap: 10px;
    $square-size: min(
      calc(
        (100vh - global.$scoreBoardHeight - 40px) / v-bind('verticalFieldSize')
      ),
      calc((100vw - 40px) / v-bind('fullHorizontalFieldSize'))
    );

    display: grid;
    grid-template-columns: repeat(
      v-bind('fullHorizontalFieldSize'),
      $square-size
    );

    max-width: 100%;
    max-height: 100%;

    border-radius: 5px;
    background-color: global.$bgColorLighter;
  }
}
</style>
