<template>
  <div id="app" ref="root">
    <div class="container-fluid">
      <Header />
      <Body />
      <Footer />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import Header from '@/components/Header.vue'
import Body from '@/components/Body.vue'
import Footer from '@/components/Footer.vue'
import { useMainStore } from '@/store/mainStore'

const root: Ref<HTMLElement | null> = ref(null)

const mainStore = useMainStore()
const { showPhaseSubmenus } = storeToRefs(mainStore)

watch(showPhaseSubmenus, (newShowPhaseSubmenus) => {

  if (root.value) {
    if (newShowPhaseSubmenus === true) {
      root.value.addEventListener('click', closeSubmenusForPhases)
    } else {
      root.value.removeEventListener('click', closeSubmenusForPhases)
    }
  }
})

function closeSubmenusForPhases(e) {

  // check if anything other than the phase is clicked and close the submenu 
  if (!(e.target.classList.contains('current-phase-anchor')) ) {
    mainStore.closePhaseSubmenus()
  }
}
defineExpose({root})
</script>

<style>
#app {
  /* Css Primary color Variables */
  --main-cyan-color: #0FF;
  --main-magenta-color: #F0F;
  
  font-family:   'DejaVu Sans Mono', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
