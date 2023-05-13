<template>
  <div
    class="machines-container h-100 w-100"
    :class="color === 'cyan' ? 'text-left' : 'text-right'"
  >
    <div 
      v-if="phase !== 'PRE_GAME'"
      class="w-100 h-100"
    >
      <BodyMachinesGenerator
        class="h-100 w-100"
        :color="color"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store/mainStore'
import BodyMachinesGenerator from '@/components/BodyMachinesGenerator.vue';

defineProps({
  color: {
    type: String,
    required: true
  }
})

const mainStore = useMainStore()
const { phase } = storeToRefs(mainStore)

defineExpose({phase})
</script>

<style scoped>
.machines-container {
  min-height: 40vh !important;
}
</style>