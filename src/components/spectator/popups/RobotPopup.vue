// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup :title="robot.team + ' ' + robot.name">
    <div class="horizontal-flex" style="justify-content: space-between">
      <!-- maintenance cycles -->
      <div
        class="horizontal-flex"
        :style="{
          color:
            robot.maintenance_cylces > robotStore.MAX_MAINTENANCE_CYCLES
              ? 'red '
              : 'unset',
        }"
      >
        <font-awesome-icon icon="fa-screwdriver-wrench" />
        <span>{{ robot.maintenance_cylces }}/2</span>
      </div>

      <!-- state -->
      <div
        class="horizontal-flex"
        :style="{ color: color, 'padding-left': '5px' }"
      >
        <font-awesome-icon
          v-if="robot.warning_sent"
          icon="fa-triangle-exclamation"
        />
        <font-awesome-icon
          v-else-if="robot.state == 'ACTIVE'"
          icon="fa-circle"
          beat
          style="--fa-animation-duration: 2s"
        />
        <font-awesome-icon
          v-else-if="robot.state == 'MAINTENANCE'"
          icon="fa-screwdriver-wrench"
          shake
          style="--fa-animation-duration: 5s"
        />
        <span>{{ robot.warning_sent ? 'DISCONNECTED' : robot.state }}</span>
        <PopupWrapper
          v-if="robot.state == 'DISQUALIFIED'"
          popup-position="bottom"
        >
          <template #reference>
            <font-awesome-icon class="clickable" icon="fa-info-circle" />
          </template>
          <Popup title="Reason">
            <p
              v-if="
                robot.maintenance_cylces > robotStore.MAX_MAINTENANCE_CYCLES
              "
            >
              The robot exceeded the maximum number of allowed maintenance
              phases ({{ robot.maintenance_cylces }}/{{
                robotStore.MAX_MAINTENANCE_CYCLES
              }})
            </p>
            <p v-else>
              The last maintenance phase lasted longer than two minutes
              {{ robotStore.MAX_MAINTENANCE_CYCLES }}
            </p>
          </Popup>
        </PopupWrapper>
      </div>
    </div>

    <!-- agent task -->
    <div v-if="robotAgentTask" class="horizontal-flex content-box">
      <template v-if="robotAgentTask.task_type == 'MOVE'">
        <span
          >I am <b>MOVING</b> to {{ robotAgentTask.task_parameters[1] }}</span
        >
      </template>
      <template v-else-if="robotAgentTask.task_type == 'RETRIEVE'">
        <span
          >I am <b>RETRIEVING</b> at
          {{ robotAgentTask.task_parameters[1] }}</span
        >
      </template>
      <template v-else-if="robotAgentTask.task_type == 'DELIVER'">
        <span
          >I am <b>DELIVERING</b> at
          {{ robotAgentTask.task_parameters[1] }}</span
        >
      </template>
    </div>
  </Popup>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { computed, watch, ref, type Ref } from 'vue'
import type { PropType, ComputedRef } from 'vue'
import type Robot from '@/types/Robot'
import { useRobotStore } from '@/store/robotStore'
import Popup from '@/components/shared/ui/Popup.vue'
import PopupWrapper from '@/components/shared/ui/PopupWrapper.vue'
import { storeToRefs } from 'pinia'
import type AgentTask from '@/types/AgentTask'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const robotStore = useRobotStore()
const { agentTasks } = storeToRefs(robotStore)

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const props = defineProps({
  robot: {
    type: Object as PropType<Robot>,
    required: true,
  },
})

// watch agent tasks - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const robotAgentTask: Ref<AgentTask | undefined> = ref(undefined)
watch(
  () => agentTasks.value,
  (newAgentTasks, _) => {
    robotAgentTask.value = newAgentTasks.find(
      (agentTask) => agentTask.robot_id == props.robot.number
    )
  },
  { immediate: true }
)

// state styling - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const color: ComputedRef<string> = computed(() => {
  if (props.robot.warning_sent) {
    return 'red'
  }
  switch (props.robot.state) {
    case 'ACTIVE':
      return 'green'
    case 'MAINTENANCE':
      return 'yellow'
    case 'DISQUALIFIED':
      return 'red'
  }
  return 'unset'
})
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
</style>
