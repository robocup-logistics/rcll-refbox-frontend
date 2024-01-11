// TEMPLATE --------------------------------------------------------------------
<template>
  <div class="accordion horizontal-flex" :class="[expanded ? 'expanded' : '']">
    <div class="header clickable horizontal-flex" @click="toggleExpand">
      <p>{{ title }}</p>
      <div class="divider"></div>
      <font-awesome-icon v-if="expanded" icon="chevron-right" />
      <font-awesome-icon v-else icon="chevron-left" />
    </div>
    <transition name="expand">
      <slot v-if="expanded"></slot>
    </transition>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
import { type Ref, ref } from 'vue'

// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
defineProps({
  title: String,
})

// fold out and fold up  - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const expanded: Ref<boolean> = ref(true)

function toggleExpand() {
  expanded.value = !expanded.value
}
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

.accordion {
  opacity: 1;
  overflow-y: hidden;

  border-radius: 8px;
  background-color: global.$surfaceColor;
  box-shadow: 0 0 6px 1px rgba(global.$bgColor, 0.8);
  padding: 5px;
  color: white;

  .header {
    height: 100%;
    width: fit-content;

    padding: 5px 0;
    flex-shrink: 0;
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    margin-left: 5px;
    text-transform: uppercase;
    justify-content: space-between;
    position: relative;
    overflow: hidden;

    * {
      flex-shrink: 0;
    }

    .divider {
      flex-shrink: 1;
      height: 100%;
      width: 1px;
      background-color: global.$lighterColor;
    }
  }
}

.expand-enter-active,
.expand-leave-active {
  transition: opacity 400ms;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
}
</style>
