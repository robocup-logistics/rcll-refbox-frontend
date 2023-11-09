<template>
  <div class="item robots">
    <div
      v-if="robotsByColor(color).length"
      v-for="(robot, index) in robotsByColor(color)"
      :key="robot.number"
      class="horizontal-flex robot"
    >
      <font-awesome-icon
        v-if="robot.warning_sent"
        icon="fa-unlink"
        title="DISCONNECTED"
        class="text-danger"
      />
      <!-- ROBOT NUMBER -->
      <span :class="`${color}-text`">{{ robot.number }}</span>
      <!-- ROBOT NAME -->
      <span :class="`${color}-text`">
        <strong>{{ robot.name }}</strong>
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
        {{ robot['maintenance_cylces'] }}
      </span>
      <template v-if="!robot.warning_sent">
        <Button
          v-if="robot.state === 'ACTIVE'"
          icon="fa-robot"
          class="clickable"
          title="Start maintenance"
          @click="setRobotMaintenanceStatus(robot, true)"
          >Start</Button
        >

        <Button
          v-else-if="robot.state === 'MAINTENANCE'"
          icon="fa-robot"
          class="clickable"
          title="End maintenance"
          @click="setRobotMaintenanceStatus(robot, false)"
          >End</Button
        >
      </template>
    </div>
    <span v-else>No robots conneted</span>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/store/gameStore'
import { useSocketStore } from '@/store/socketStore'
import { useRobotStore } from '@/store/robotStore'
import type Robot from '@/types/Robot'
import { useRuleStore } from '@/store/ruleStore'
import Color from '@/types/Color'
import Button from '@/components/shared/ui/Button.vue'

defineProps({
  color: {
    type: String as PropType<Color>,
    required: true,
  },
})

const gameStore = useGameStore()
const { gametime } = storeToRefs(gameStore)
const robotStore = useRobotStore()
const ruleStore = useRuleStore()
const socketStore = useSocketStore()
const { robotsByColor } = storeToRefs(robotStore)
const { MAINTENANCE_DURATION } = storeToRefs(ruleStore)

// -> get the remaining maintenance time
function getMaintenanceLeft(robot: Robot) {
  let res =
    robot['maintenance_start-time'] +
    MAINTENANCE_DURATION.value -
    gametime.value
  if (res <= 0) {
    return '0s'
  } else {
    return `${res.toString().split('.')[0]}s`
  }
}

// -> send the refbox the current maintenance status
function setRobotMaintenanceStatus(robot: Robot, maintenance: boolean) {
  socketStore.setRobotMaintenanceStatus(robot, maintenance)
}
</script>

<style scoped lang="scss">
@use '@/assets/global.scss';
.robots {
  padding: 10px !important;

  .robot {
    padding: 5px;
  }
}

.icon-robots-yellow-active:hover {
  color: yellow !important;
}

.icon-robots-green-maintenance:hover {
  color: green !important;
}
</style>
