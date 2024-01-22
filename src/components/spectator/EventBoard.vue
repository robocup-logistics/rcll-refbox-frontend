// TEMPLATE --------------------------------------------------------------------
<template>
  <Accordion horizontal title="Events" expanded-default id="eventBoard">
    <div class="vertical-flex">
      <div class="events-header flex-item transparent">
        <TabGroup
          :tabs="['all', 'game', 'cyan', 'magenta']"
          v-model:active="filter"
        >
          <template #all>
            <div class="horizontal-flex" title="Show all events">
              <font-awesome-icon icon="fa-list" />
            </div>
          </template>
          <template #game>
            <div class="horizontal-flex" title="Show game-related events">
              <font-awesome-icon icon="fa-dice" />
            </div>
          </template>
          <template #cyan>
            <div
              class="horizontal-flex"
              :title="`Show ${teamNameByColor('CYAN')} events`"
            >
              <font-awesome-icon icon="fa-people-group" class="CYAN-text" />
            </div>
          </template>
          <template #magenta>
            <div
              class="horizontal-flex"
              :title="`Show ${teamNameByColor('MAGENTA')} events`"
            >
              <font-awesome-icon icon="fa-people-group" class="MAGENTA-text" />
            </div>
          </template>
        </TabGroup>
      </div>
      <AutoScrollContainer
        v-if="filteredGameEvents(filter).length"
        :watch-data="gameEvents"
        class="flex-item transparent events"
        style="border-radius: 0"
        ref="eventsLog"
      >
        <div class="vertical-flex">
          <template v-for="gameEvent in filteredGameEvents(filter)">
            <div class="event flex-item">
              <div class="top">
                {{ formatTime(cont_time - gameEvent.cont_time, true) }} ago
              </div>
              <div
                :class="[
                  'left-bg',
                  gameEvent.team ? `${gameEvent.team}-bg` : '',
                ]"
              ></div>
              <font-awesome-icon
                class="icon"
                :icon="gameEvent.icon"
                size="lg"
              />
              {{ gameEvent.msg }}
            </div>
          </template>
        </div>
      </AutoScrollContainer>
      <div v-else class="flex-item transparent">
        <template v-if="filter == null">No events yet</template>
        <template v-else>No events in selected category yet</template>
      </div>
    </div>
  </Accordion>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import TabGroup from '@/components/shared/ui/TabGroup.vue'
import { useEventStore } from '@/store/eventStore'
import { storeToRefs } from 'pinia'
import AutoScrollContainer from '@/components/shared/ui/AutoScrollContainer.vue'
import { type Ref, ref, watch } from 'vue'
import { useGameStore } from '@/store/gameStore'
import formatTime from '@/utils/formatTime'
import Accordion from '@/components/shared/ui/Accordion.vue'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const gameStore = useGameStore()
const { cont_time, teamNameByColor } = storeToRefs(gameStore)
const eventStore = useEventStore()
const { gameEvents, filteredGameEvents } = storeToRefs(eventStore)

// fitler events by type - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const filter: Ref<string> = ref('all')

// scroll to bottom on filter change - - - - - - - - - - - - - - - - - - - - - -
const eventsLog: Ref<typeof AutoScrollContainer | undefined> = ref()
watch(
  () => filter.value,
  () => {
    if (eventsLog.value) {
      eventsLog.value.scrollToEnd()
    }
  }
)
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

#eventBoard {
  flex-shrink: 0;
  height: 100%;
  max-width: global.$sideBarWidth;
  position: relative;
  .events-header {
    flex-grow: 0;
    padding: 10px;
  }
  .events {
    height: calc(100% - 80px - 10px);

    .event {
      height: 100px;
      position: relative;
      padding-left: 55px;
      padding-top: 20px;

      &.upcoming {
        opacity: 0.7;
      }

      .left-bg {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 40px;
        transform: rotate(15deg) translateX(-5px) scale(1.5);
        background-color: rgb(175, 195, 204);
      }

      .icon {
        position: absolute;
        left: 15px;
        top: 20px;
        color: global.$bgColor;
      }

      .link {
        position: absolute;
        left: -20px;
        bottom: 10px;
        background-color: global.$bgColor;
        border-radius: 8px;
        padding: 2px 4px;
        font-size: 0.8rem;
        padding-left: 30px;
      }

      .top {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        height: 20px;
        background-color: global.$lightestColor;
        padding-left: 55px;
      }
    }
  }
}
</style>
