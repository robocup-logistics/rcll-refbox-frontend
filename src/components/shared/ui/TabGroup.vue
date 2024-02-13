// TEMPLATE --------------------------------------------------------------------
<template>
  <div class="horizontal-flex tab-group">
    <template v-for="tab in tabs">
      <Button :primary="tab == active" @click="select(tab)">
        <slot :name="tab"></slot>
      </Button>
    </template>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts" generic="T extends (string | number | boolean)">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import Button from '@/components/shared/ui/Button.vue'
import { watch, type PropType, type Ref, onMounted } from 'vue'

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const props = defineProps({
  tabs: {
    type: Array as PropType<T[]>,
    required: true,
  },
  defaultActive: {
    type: [String, Number, Boolean] as PropType<T>,
    required: false,
  },
})

// emits - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const emit = defineEmits<{
  (e: 'activeChanged', active: T): void
}>()

// active tab  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// -> the intended way to use this component is through v-model:active
const active: Ref<T | undefined> = defineModel<T>('active')

onMounted(() => {
  if (props.defaultActive) {
    active.value = props.defaultActive
  }
})

function select(tab: T): void {
  active.value = tab
}

// -> alternatively, we can just listen to changes in the active value
watch(
  () => active.value,
  () => {
    if (active.value) {
      emit('activeChanged', active.value)
    }
  }
)
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
.tab-group {
  align-items: stretch !important;
  padding-bottom: 5px;
}
</style>
