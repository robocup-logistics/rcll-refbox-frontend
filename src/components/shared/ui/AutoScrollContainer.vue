// TEMPLATE --------------------------------------------------------------------
<template>
  <div class="wrapper">
    <div
      class="autoscroll-container"
      ref="container"
      @scroll="updateScrolledState"
    >
      <div>
        <slot></slot>
      </div>
    </div>
    <Button
      v-if="!isScrolledToEnd"
      class="scroll-button"
      @click="scrollToEnd"
      icon="fa-arrow-down"
      >Scroll to end</Button
    >
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { ref, type Ref, watch, onMounted } from 'vue'
import Button from '@/components/shared/ui/Button.vue'

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const props = defineProps(['watchData'])

// scroll  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// the container
const container: Ref<HTMLDivElement | null> = ref(null)

// we normally want to scroll automatically but not if the user has
// intentionally scrolled up before
const autoscroll: Ref<boolean> = ref(true)

// have we scrolled to the end (updated manually via function on certain events
// - implementing as computed currently not better since it does not respond to
// scroll events)
const isScrolledToEnd: Ref<boolean> = ref(true)

function updateScrolledState() {
  isScrolledToEnd.value = container.value
    ? container.value.scrollTop >=
      container.value.scrollHeight - container.value.clientHeight - 2
    : false
  if (isScrolledToEnd.value) {
    autoscroll.value = true
  } else {
    autoscroll.value = false
  }
}

// function to scroll to the end of the container
function scrollToEnd() {
  if (container.value) {
    container.value.scrollTop =
      container.value.scrollHeight - container.value.clientHeight
  }
}

// scroll to the end of the container whenever data changes
watch(
  props.watchData,
  () => {
    if (autoscroll.value) {
      setTimeout(scrollToEnd, 500)
    }
  },
  { deep: true, immediate: true }
)
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

.wrapper {
  position: relative;
  padding: 10px !important;

  .autoscroll-container {
    overflow: auto;
    height: 100%;
    width: 100%;
    scroll-behavior: smooth;
  }

  &:hover {
    .scroll-button {
      display: flex;
    }
  }

  .scroll-button {
    display: none;
    position: absolute;
    left: 10px;
    right: 10px;
    margin: 0 auto;
    bottom: 10px;
    max-width: fit-content;
  }
}
</style>
