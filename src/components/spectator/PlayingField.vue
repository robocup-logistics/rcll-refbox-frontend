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
            />
          </template>
        </template>
        <!-- positive x coordinates -->
        <template v-for="hIndex in horizontalFieldSize">
          <PlayingFieldSquare
            :zone="getZoneNameFor(hIndex, verticalFieldSize - vIndex + 1)"
          />
        </template>
      </template>
      <template
        v-for="robot in robots"
        :key="robot.team + '-' + robot.number.toString()"
      >
        <RobotEntity :robot="robot"></RobotEntity>
      </template>
    </div>
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
import RobotEntity from './entities/RobotEntity.vue'
import type { Ref } from 'vue'
import { ref, watch } from 'vue'

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
  padding: 10px;
  height: fit-content;
  width: fit-content;

  #playingField {
    position: relative;

    $square-gap: 10px;
    $square-size: min(
      calc(
        (
            100vh - global.$scoreBoardHeight - 40px - $square-gap *
              (v-bind('verticalFieldSize') - 1)
          ) / v-bind('verticalFieldSize')
      ),
      calc(
        (100vw - 40px - $square-gap * (v-bind('fullHorizontalFieldSize') - 1)) /
          v-bind('fullHorizontalFieldSize')
      )
    );

    display: grid;
    grid-template-columns: repeat(
      v-bind('fullHorizontalFieldSize'),
      $square-size
    );

    grid-gap: $square-gap;

    max-width: 100%;
    max-height: 100%;
  }
}
</style>
