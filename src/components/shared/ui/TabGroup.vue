// TEMPLATE --------------------------------------------------------------------
<template>
  <div class="horizontal-flex tab-group">
    <template v-for="tab in props.tabs">
      <Button :primary="tab == active" @click="select(tab)">
        <slot :name="tab"></slot>
      </Button>
    </template>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import Button from '@/components/shared/ui/Button.vue'
import { ref, type PropType, type Ref, watch } from 'vue'

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const props = defineProps({
  tabs: Array as PropType<string[]>,
})

// emits - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const emit = defineEmits<{
  (e: 'activeChanged', active: string | undefined): void
}>()

// active tab  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const active: Ref<string | undefined> = ref(props.tabs?.[0])

function select(tab: string): void {
  active.value = tab
}

watch(
  () => active.value,
  () => {
    emit('activeChanged', active.value)
  }
)

// define expose - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
defineExpose({ active })
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
.tab-group {
  align-items: stretch !important;
  padding-bottom: 5px;
  border-radius: 5px;
  background-color: global.$bgColor;
}
</style>
