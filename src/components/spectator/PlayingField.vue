<template>
  <div id="playingFieldWrapper">
    <div id="playingField">
      <template v-for="hIndex in horizontalSize" :key="hIndex">
        <template v-for="vIndex in verticalSize" :key="vIndex">
          <PlayingFieldSquare />
        </template>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store/mainStore'
import { useFieldStore } from '@/store/fieldStore'

import PlayingFieldSquare from '@/components/spectator/PlayingFieldSquare.vue'

const mainStore = useMainStore()
const {} = storeToRefs(mainStore)

const fieldStore = useFieldStore()
const { horizontalSize, verticalSize } = storeToRefs(fieldStore)

defineExpose({ horizontalSize, verticalSize })
</script>

<style scoped lang="scss">
#playingFieldWrapper {
  padding: 10px;

  #playingField {
    $square-gap: 5px;

    display: grid;
    grid-template-columns: repeat(v-bind('horizontalSize'), 1fr);

    grid-gap: $square-gap;
  }
}
</style>
