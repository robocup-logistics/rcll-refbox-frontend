// TEMPLATE --------------------------------------------------------------------
<template>
  <div id="playingFieldWrapper" ref="playingFieldWrapper">
    <div id="playingFieldContent">
      <!-- FIELD SQUARES WITH MACHINES ON THEM -->
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
              :with-dot="vIndex != 1 && (isFieldMirrored || hIndex != 1)"
            />
          </template>
        </template>
      </div>

      <!-- AGENT TASKS -->
      <template v-for="agentTask in agentTasks">
        <AgentTaskEntity
          v-if="
            robotStore.robotByColorAndId(
              agentTask.team_color,
              agentTask.robot_id
            ) != null
          "
          :task="agentTask"
          :robot="
            robotStore.robotByColorAndId(
              agentTask.team_color,
              agentTask.robot_id
            ) as Robot
          "
        />
      </template>

      <!-- ROBOTS -->
      <RobotEntity v-for="robot in robots" :robot="robot" />
    </div>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { storeToRefs } from 'pinia'
import { useFieldStore } from '@/store/fieldStore'
import PlayingFieldSquare from '@/components/spectator/PlayingFieldSquare.vue'
import { useRobotStore } from '@/store/robotStore'
import RobotEntity from '@/components/spectator/entities/RobotEntity.vue'
import type { Ref } from 'vue'
import { ref, watch } from 'vue'
import AgentTaskEntity from '@/components/spectator/entities/AgentTaskEntity.vue'
import type Robot from '@/types/Robot'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const fieldStore = useFieldStore()
const {
  isFieldMirrored,
  horizontalFieldSize,
  verticalFieldSize,
  fullHorizontalFieldSize,
  fieldWrapperWidthPixels,
  fieldWrapperHeightPixels,
  fieldWidthPixels,
  fieldHeightPixels,
} = storeToRefs(fieldStore)
const robotStore = useRobotStore()
const { robots, agentTasks } = storeToRefs(robotStore)

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
const playingFieldWrapper: Ref<HTMLDivElement | null> = ref(null)
const wrapperResizeObserver = new ResizeObserver(() => {
  if (playingFieldWrapper.value) {
    fieldWrapperWidthPixels.value = playingFieldWrapper.value.offsetWidth
    fieldWrapperHeightPixels.value = playingFieldWrapper.value.offsetHeight
  }
})
watch(playingFieldWrapper, (newPlayingFieldWrapper, _) => {
  if (newPlayingFieldWrapper)
    wrapperResizeObserver.observe(newPlayingFieldWrapper)
})

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
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  overflow: hidden;

  #playingFieldContent {
    position: relative;
    max-width: fit-content;

    #playingField {
      $square-gap: 10px;
      $square-size: min(
        calc(
          (v-bind('fieldWrapperHeightPixels') * 1px) /
            v-bind('verticalFieldSize')
        ),
        calc(
          (v-bind('fieldWrapperWidthPixels') * 1px) /
            v-bind('fullHorizontalFieldSize')
        )
      );

      display: grid;
      grid-template-columns: repeat(
        v-bind('fullHorizontalFieldSize'),
        $square-size
      );

      max-width: 100%;
      max-height: 100%;

      border-radius: 8px;
      background-color: global.$lighterColor;
      box-shadow: 0 0 6px 1px rgba(global.$lighterColor, 0.8);
    }
  }
}
</style>
