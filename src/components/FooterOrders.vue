<template>
  <div>
    <div>
      <FootersOrdersGenerator 
        v-if="(phase === 'PRODUCTION' || phase === 'POST_GAME')"
        class="d-flex justify-content-around align-items-center px-4 py-2"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store/mainStore'
import FootersOrdersGenerator from '@/components/FooterOrdersGenerator.vue'

const mainStore = useMainStore()
const { phase } = storeToRefs(mainStore)

defineExpose({ phase })
</script>

<style>

</style>