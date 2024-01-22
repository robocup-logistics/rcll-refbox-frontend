// TEMPLATE --------------------------------------------------------------------
<template>
  <div
    :class="[
      'accordion',
      { horizontal: horizontal },
      { 'horizontal-flex': horizontal },
      { 'vertical-flex': !horizontal },
      { expanded: expanded },
    ]"
  >
    <div class="header clickable horizontal-flex" @click="toggleExpand">
      <p class="title" :title="title">{{ title }}</p>
      <div class="divider"></div>
      <font-awesome-icon
        v-if="horizontal"
        icon="chevron-left"
        class="collapse-icon"
      />
      <font-awesome-icon v-else icon="chevron-down" class="collapse-icon" />
    </div>
    <transition name="expand">
      <div class="content horizontal-flex" v-if="expanded" ref="accordion">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { type Ref, ref, onMounted } from 'vue'

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const props = defineProps({
  title: String,
  horizontal: {
    type: Boolean,
    default: false,
  },
  expandedDefault: {
    type: Boolean,
    default: false,
  },
})

// fold out and fold up  - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const expanded: Ref<boolean> = ref(false)
onMounted(() => {
  if (props.expandedDefault) {
    expanded.value = true
  }
})

function toggleExpand() {
  expanded.value = !expanded.value
  // workaround for firefox wrongly calculating vertical-rl elements
  if (accordion.value) accordion.value.style.minWidth = 'unset'
}

// workaround for firefox wrongly calculating vertical-rl elements
const accordion: Ref<HTMLDivElement | undefined> = ref()
onMounted(() => {
  const interval = setInterval(() => {
    if (
      accordion.value &&
      accordion.value.scrollWidth &&
      accordion.value.scrollWidth != accordion.value.offsetWidth
    ) {
      accordion.value.style.minWidth = `${accordion.value.scrollWidth}px`
      clearInterval(interval)
    }
  }, 100)
})
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
// workaround for firefox wrongly calculating vertical-rl elements
@-moz-document url-prefix() {
  .content {
    padding: 0;
  }
}

.accordion {
  $padding: 10px;
  border-radius: 8px;
  background-color: global.$surfaceColor;
  box-shadow: 0 0 6px 1px rgba(global.$bgColor, 0.8);
  color: white;
  gap: 0px !important;

  .header {
    width: 100%;
    max-width: 100%;
    height: fit-content;
    padding: $padding + 5px $padding;
    flex-shrink: 0;

    text-transform: uppercase;
    justify-content: space-between;
    position: relative;
    overflow: hidden;

    * {
      flex-shrink: 0;
    }

    p {
      max-width: calc(100% - 40px);
    }

    .divider {
      flex-shrink: 1;
      height: 1px;
      width: 100%;
      background-color: global.$lighterColor;
    }

    .collapse-icon {
      transition: all 500ms;
      transform-origin: center center;
      transform: rotateX(0);
    }
  }

  .content {
    width: fit-content;
    height: 100%;
    padding: $padding;
  }

  &.horizontal {
    > .header {
      height: 100%;
      max-height: 100%;
      width: fit-content;
      transform: rotate(180deg);
      writing-mode: vertical-rl;

      p {
        max-width: initial;
        max-height: calc(100% - 40px);
      }

      .divider {
        height: 100%;
        width: 1px;
      }
    }
  }

  &.expanded {
    .collapse-icon {
      transform: rotateX(180deg);
    }

    &.horizontal {
      .collapse-icon {
        transform: rotateY(180deg);
      }
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
