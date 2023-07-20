<template>
  <div>
    <div>
      <div class="points-container">
        <div class="d-flex align-content-center justify-content-center">
          <h4 v-if="phase !== 'PRE_GAME'" class="current-points m-0 me-2">
            Points: {{ selectPointsArray(color) }}
          </h4>
          <img
            src="@/assets/plus.png"
            alt="plus icon"
            class="img-fluid plus-png"
            data-toggle="tooltip"
            data-placement="bottom"
            title="Add points manually"
            @click="toggleShowAddPoints()"
          />
        </div>
        <AddPointsManually
          v-if="showAddPoints === true"
          :color="color"
          @toggle-show-add-points="toggleShowAddPoints()"
        />
      </div>
      <div
        v-for="(robot, index) in selectRobotsArray(color)"
        :key="robot.number"
      >
        <div class="robot-info d-flex align-items-center">
          <div class="robot-col ps-2">
            <span class="robot-number me-2">{{ robot.number }}</span>
            <span class="robot-name me-3">
              <strong>{{ robot.name }}</strong>
            </span>
          </div>
          <div class="robot-host">
            <span class="robot-host-ip">
              {{ robot.host }}
            </span>
          </div>
          <div class="robot-state display-flex align-items-center">
            <span
              v-if="robotState(index) === 'active'"
              class="robot-current-state me-2 text-success"
            >
              {{ setMaintenanceToFalse(index) }}
              {{ robotState(index) }}
            </span>
            <span
              v-else-if="robotState(index) === 'maintenance'"
              class="text-warning me-2"
            >
              <span>{{ saveMaintenanceStart(gametime, index) }}</span>
              {{ robotState(index) }}
              {{
                getMaintenanceLeft(
                  robot['maintenance-start-time'],
                  gametime,
                  index
                )
              }}
            </span>
            <span
              v-else-if="robotState(index) === 'disqualified'"
              class="text-danger me-2"
            >
              {{ setMaintenanceToFalse(index) }}
              {{ robotState(index) }}!
            </span>
            <span class="robot-maintenance-cycles">
              {{ robot['maintenance_cylces'] }}
            </span>
            <a
              v-if="robotState(index) === 'active'"
              class="ms-2 btn"
              data-toggle="tooltip"
              title="Robot maintenance"
              @click="setRobotMaintenanceStatus({ robot, bool: true })"
            >
              <font-awesome-icon
                :icon="['fa', 'robot']"
                class="fa-1x icon-robots-yellow-active"
                style="color: green"
              />
            </a>
            <a
              v-else-if="robotState(index) === 'maintenance'"
              class="ms-2 btn"
              data-toggle="tooltip"
              title="reset maintenance"
              @click="setRobotMaintenanceStatus({ robot, bool: false })"
            >
              <font-awesome-icon
                :icon="['fa', 'robot']"
                class="fa-1x icon-robots icon-robots-green-maintenance"
                style="color: yellow"
              />
            </a>
            <a
              v-else-if="robotState(index) === 'disqualified'"
              class="ms-2 btn"
              style="pointer-events: none"
              data-toggle="tooltip"
              title="Robot disqualified"
            >
              <font-awesome-icon
                :icon="['fa', 'robot']"
                class="fa-1x icon-robots"
                style="color: red"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store/mainStore'
import { useRobotStore } from '@/store/robotStore'
import AddPointsManually from '@/components/referee/AddPointsManually.vue'

const props = defineProps({
  color: {
    type: String,
    required: true,
  },
})

const mainStore = useMainStore()
const robotStore = useRobotStore()
const { phase, gametime, scoreCyan, scoreMagenta } = storeToRefs(mainStore)
const { robotsCyan, robotsMagenta } = storeToRefs(robotStore)

const maintenanceStartTime: Ref<number[]> = ref([])
const isInMaintenance: Ref<boolean[]> = ref([false, false, false])
const showAddPoints: Ref<boolean> = ref(false)

function selectRobotsArray(color: string) {
  if (color === 'cyan') {
    return robotsCyan.value
  } else {
    return robotsMagenta.value
  }
}

function selectPointsArray(teamColor: string) {
  if (teamColor === 'cyan') {
    return scoreCyan.value
  } else {
    return scoreMagenta.value
  }
}

function robotState(index: number) {
  if (props.color === 'cyan') {
    return robotsCyan.value[index].state.toLowerCase()
  } else {
    return robotsMagenta.value[index].state.toLowerCase()
  }
}

// returns the remaining maintenance time
function getMaintenanceLeft(mntStart: number, gametime: number, index) {
  let res = maintenanceStartTime.value[index] + 120 - gametime
  return `${res.toString().split('.')[0]}s`
}

// sets the maintenance start
function saveMaintenanceStart(mntStart: number, index) {
  if (isInMaintenance.value[index] === false) {
    isInMaintenance.value[index] = true
    maintenanceStartTime.value[index] = mntStart
  }
}

// robots is no longer in maintenance
function setMaintenanceToFalse(index) {
  if (robotState(index) !== 'maintenance') {
    isInMaintenance.value[index] = false
  }
}

function setRobotMaintenanceStatus(payload) {
  robotStore.setRobotMaintenanceStatus(payload)
}

function toggleShowAddPoints() {
  showAddPoints.value = !showAddPoints.value
}

defineExpose({
  phase,
  gametime,
  showAddPoints,
  selectRobotsArray,
  selectPointsArray,
  robotState,
  getMaintenanceLeft,
  saveMaintenanceStart,
  setMaintenanceToFalse,
  setRobotMaintenanceStatus,
  toggleShowAddPoints,
})
</script>

<style scoped lang="scss">
@use '@/assets/global.scss';

.icon-robots-yellow-active:hover {
  color: yellow !important;
}

.icon-robots-green-maintenance:hover {
  color: green !important;
}

.robot-number,
.robot-team,
.robot-name {
  color: global.$main-cyan-color !important;
}

.points-container {
  border-bottom: 1px #dee2e6 solid !important;
}

.robot-info > * {
  flex: 1 !important;
}

.robot-host-ip {
  text-align: center !important;
  margin: 0 !important;
}

.robot-info > div {
  display: flex !important;
  justify-content: space-around;
}

.robot-col {
  justify-content: flex-start !important;
}

.plus-png {
  width: 25px;
  height: 25px;
}

.plus-png:hover {
  cursor: pointer;
  opacity: 0.5;
}
</style>
