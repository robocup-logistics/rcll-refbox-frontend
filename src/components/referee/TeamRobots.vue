// TEMPLATE --------------------------------------------------------------------
<template>
  <div class="flex-item robots">
    <div
      v-if="robotsByColor(color).length"
      v-for="robot in robotsByColor(color)"
      :key="robot.number"
      class="horizontal-flex robot"
    >
      <font-awesome-icon
        v-if="robot.warning_sent"
        icon="fa-unlink"
        title="DISCONNECTED"
        class="text-danger"
      />
      <!-- ROBOT NAME -->
      <span :class="`${color}-text`">
        <strong>{{ nameByRobot(robot) }}</strong>
      </span>
      <!-- ROBOT HOST -->
      <span class="robot-host-ip">
        {{ robot.host }}
      </span>
      <!-- ROBOT STATE -->
      <span v-if="robot.state === 'ACTIVE'" class="text-success">
        {{ robot.state }}
      </span>
      <span v-else-if="robot.state === 'MAINTENANCE'" class="text-warning">
        {{ robot.state }}
        {{ getMaintenanceLeft(robot) }}
      </span>
      <span v-else-if="robot.state === 'DISQUALIFIED'" class="text-danger">
        {{ robot.state }}!
      </span>
      <span class="robot-maintenance-cycles">
        {{ robot.maintenance_cycles }}
      </span>
      <template v-if="!robot.warning_sent">
        <Button
          v-if="robot.state === 'ACTIVE'"
          icon="fa-robot"
          title="Start maintenance"
          @click="setRobotMaintenanceStatus(robot, true)"
        ></Button>

        <Button
          v-else-if="robot.state === 'MAINTENANCE'"
          icon="fa-robot"
          title="End maintenance"
          @click="setRobotMaintenanceStatus(robot, false)"
        ></Button>
      </template>
    </div>
    <span v-else>No robots conneted</span>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import type { PropType } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/store/gameStore'
import { useRobotStore } from '@/store/robotStore'
import type Robot from '@/types/Robot'
import Color from '@/types/Color'
import Button from '@/components/shared/ui/Button.vue'

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
defineProps({
  color: {
    type: String as PropType<Color>,
    required: true,
  },
})

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const gameStore = useGameStore()
const { game_time } = storeToRefs(gameStore)
const robotStore = useRobotStore()
const { MAINTENANCE_DURATION, nameByRobot, robotsByColor } =
  storeToRefs(robotStore)

// maintenance - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// -> get the remaining maintenance time
function getMaintenanceLeft(robot: Robot) {
  let res =
    robot.maintenance_start_time + MAINTENANCE_DURATION.value - game_time.value
  if (res <= 0) {
    return '0s'
  } else {
    return `${res.toString().split('.')[0]}s`
  }
}

// -> send the refbox the current maintenance status
function setRobotMaintenanceStatus(robot: Robot, maintenance: boolean) {
  robotStore.sendSetMaintenanceStatus(robot, maintenance)
}
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
.robots {
  flex-shrink: 0;
  padding: 10px !important;

  .robot {
    padding: 1px;
  }
}
</style>
