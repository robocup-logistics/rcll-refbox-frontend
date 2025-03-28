s// TEMPLATE
--------------------------------------------------------------------
<template>
  <div id="playingFieldWrapper" ref="playingFieldWrapper">
    <div
      id="playingFieldContent"
      :class="{ mirroredX: isMirroredX, mirroredY: isMirroredY }"
    >
      <!-- FIELD SQUARES WITH MACHINES ON THEM -->
      <div id="playingField" ref="playingField">
        <template v-for="vIndex in computedVIndices">
          <!-- negative x coordinates only if field is mirrored -->
          <template v-for="hIndex in computedHIndices" v-if="!isMirroredY">
            <PlayingFieldSquare
              :zone="
                getZoneNameFor(
                  -(horizontalFieldSize - hIndex + 1),
                  verticalFieldSize - vIndex + 1,
                )
              "
              :with-dot="vIndex != 1 && hIndex != 1"
              :class="{ mirroredX: isMirroredX, mirroredY: isMirroredY }"
              :isSelected="
                selectedSquare?.zone ===
                getZoneNameFor(
                  -(horizontalFieldSize - hIndex + 1),
                  verticalFieldSize - vIndex + 1,
                )
              "
              :isTargeted="
                targetSquare?.zone ===
                getZoneNameFor(
                  -(horizontalFieldSize - hIndex + 1),
                  verticalFieldSize - vIndex + 1,
                )
              "
              @square-selected="handleSquareSelected"
              @square-targeted="handleSquareTargeted"
            />
          </template>
          <!-- positive x coordinates -->
          <template v-for="hIndex in computedHIndices">
            <PlayingFieldSquare
              :zone="getZoneNameFor(hIndex, verticalFieldSize - vIndex + 1)"
              :with-dot="vIndex != 1 && hIndex != 1"
              :class="{ mirroredX: isMirroredX, mirroredY: isMirroredY }"
              :isSelected="
                selectedSquare?.zone ===
                getZoneNameFor(hIndex, verticalFieldSize - vIndex + 1)
              "
              :isTargeted="
                targetSquare?.zone ===
                getZoneNameFor(hIndex, verticalFieldSize - vIndex + 1)
              "
              @square-selected="handleSquareSelected"
              @square-targeted="handleSquareTargeted"
            />
          </template>

          <template v-for="hIndex in computedHIndices" v-if="isMirroredY">
            <PlayingFieldSquare
              :zone="
                getZoneNameFor(
                  -(horizontalFieldSize - hIndex + 1),
                  verticalFieldSize - vIndex + 1,
                )
              "
              :with-dot="vIndex != 1 && hIndex != 1"
              :class="{ mirroredX: isMirroredX, mirroredY: isMirroredY }"
              :isSelected="
                selectedSquare?.zone ===
                getZoneNameFor(
                  -(horizontalFieldSize - hIndex + 1),
                  verticalFieldSize - vIndex + 1,
                )
              "
              :isTargeted="
                targetSquare?.zone ===
                getZoneNameFor(
                  -(horizontalFieldSize - hIndex + 1),
                  verticalFieldSize - vIndex + 1,
                )
              "
              @square-selected="handleSquareSelected"
              @square-targeted="handleSquareTargeted"
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
              agentTask.robot_id,
            ) != null
          "
          :task="agentTask"
          :robot="
            robotStore.robotByColorAndId(
              agentTask.team_color,
              agentTask.robot_id,
            ) as Robot
          "
        />
      </template>

      <!-- ROBOTS -->
      <RobotEntity
        v-for="robot in robots"
        :robot="robot"
        :class="{ mirroredX: isMirroredX, mirroredY: isMirroredY }"
      />
    </div>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/appStore'
import { useFieldStore } from '@/store/fieldStore'
import PlayingFieldSquare from '@/components/spectator/PlayingFieldSquare.vue'
import { useRobotStore } from '@/store/robotStore'
import RobotEntity from '@/components/spectator/entities/RobotEntity.vue'
import type { Ref } from 'vue'
import { ref, watch, computed } from 'vue'
import AgentTaskEntity from '@/components/spectator/entities/AgentTaskEntity.vue'

import Modal from '@/components/shared/ui/Modal.vue'
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
  isMirroredX,
  isMirroredY,
  inEditMode,
} = storeToRefs(fieldStore)
const robotStore = useRobotStore()
const { robots, agentTasks } = storeToRefs(robotStore)
const appStore = useAppStore()
const { advancedOptions, currentView } = storeToRefs(appStore)

const computedVIndices = computed(() => {
  const indices = Array.from(
    { length: verticalFieldSize.value },
    (_, i) => i + 1,
  )
  return isMirroredX.value ? indices.reverse() : indices
})

const computedHIndices = computed(() => {
  const indices = Array.from(
    { length: horizontalFieldSize.value },
    (_, i) => i + 1,
  )
  return isMirroredY.value ? indices.reverse() : indices
})

// zones - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function getZoneNameFor(x: number, y: number): string {
  let zone = ''
  if (x < 0) {
    zone += 'M_'
  } else if (x > 0) {
    zone += 'C_'
  } else {
    throw new Error('x coordinate of a field can not be zero')
  }
  zone += 'Z'
  zone += Math.abs(x).toString()
  zone += y.toString()

  return zone
}

// Reactive references for selected and targeted squares
const selectedSquare: Ref<PlayingFieldSquare | null> = ref(null)
const targetSquare: Ref<PlayingFieldSquare | null> = ref(null)

// Handle square selection
const handleSquareSelected = (square: PlayingFieldSquare) => {
  if (!inEditMode.value) {
    return
  }
  if (advancedOptions.value) {
    selectedSquare.value = square
    selectedSquare.value.isSelected = true
  }
}

// Handle square targeting and finalize selection
const handleSquareTargeted = (square: PlayingFieldSquare) => {
  if (!inEditMode.value) {
    return
  }
  if (advancedOptions.value) {
    targetSquare.value = square
    targetSquare.value.isSelected = false
    targetSquare.value.isTargeted = true
    if (selectedSquare.value && targetSquare.value) {
      onSquaresSelected(selectedSquare.value, targetSquare.value)
      // Reset selection after handling
      selectedSquare.value = null
      targetSquare.value = null
    }
  }
}

// Handle logic after squares are selected
function onSquaresSelected(start: PlayingFieldSquare, end: PlayingFieldSquare) {
  start.isSelected = false
  start.isTargeted = false
  end.isSelected = false
  end.isTargeted = false
  if (advancedOptions.value) {
    if (inEditMode.value) {
      fieldStore.sendSetMachinePose(start.zone, end.zone)
    }
  }
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
