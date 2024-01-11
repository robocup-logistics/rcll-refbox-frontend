// TEMPLATE --------------------------------------------------------------------
<template>
  <Accordion title="Events" id="eventBoard">
    <div class="vertical-flex">
      <div class="events-header item transparent">
        <TabGroup
          :tabs="['all', 'game', 'robots', 'machines']"
          @active-changed="(active: string) => updateFilter(active)"
        >
          <template #all>
            <div class="horizontal-flex" title="Show all events">
              <font-awesome-icon icon="fa-list" />
            </div>
          </template>
          <template #game
            ><div class="horizontal-flex" title="Show game-related events">
              <font-awesome-icon icon="fa-dice" />
            </div>
          </template>
          <template #robots
            ><div class="horizontal-flex" title="Show robot events">
              <font-awesome-icon icon="fa-robot" />
            </div>
          </template>
          <template #machines
            ><div class="horizontal-flex" title="Show machine events">
              <font-awesome-icon icon="fa-gears" />
            </div>
          </template>
        </TabGroup>
      </div>
      <AutoScrollContainer
        :watch-data="gameEvents"
        class="item transparent events"
        v-if="gameEventsFilteredBy(filter).length"
      >
        <div class="vertical-flex">
          <template v-for="gameEvent in gameEventsFilteredBy(filter)">
            <div class="event item clickable">
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
              <div class="link" v-if="gameEvent.linkedEl">
                <font-awesome-icon icon="eye" />
              </div>
              {{ gameEvent.msg }}
            </div>
          </template>
        </div>
      </AutoScrollContainer>
      <div v-else class="item transparent">
        <template v-if="filter == null">No events</template>
        <template v-else>No events in category '{{ filter }}'</template>
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
import { type Ref, ref } from 'vue'
import { useGameStore } from '@/store/gameStore'
import formatTime from '@/utils/formatTime'
import Accordion from '@/components/shared/ui/Accordion.vue'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const gameStore = useGameStore()
const { cont_time } = storeToRefs(gameStore)
const eventStore = useEventStore()
const { gameEvents, gameEventsFilteredBy } = storeToRefs(eventStore)

// fitler events by type - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const filter: Ref<null | string> = ref(null)
function updateFilter(newFilter: string) {
  if (newFilter == 'all') {
    filter.value = null
  } else {
    filter.value = newFilter
  }
}
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
