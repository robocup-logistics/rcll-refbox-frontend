<template>
  <select v-model="currentOption" class="select">
    <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
  </select>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, PropType } from 'vue'

const props = defineProps({
  options: {
    type: Array as PropType<string[]>,
    required: true,
  },
  defaultSelected: {
    type: String as PropType<string>,
    required: false,
  },
})

const emit = defineEmits<{
  (e: 'optionSelected', option: string): void
}>()

const currentOption = ref<string | undefined>(props.defaultSelected)

currentOption.value = props.defaultSelected
</script>

<style scoped lang="scss">
@use '@/assets/global.scss';

.select {
  padding: 5px;
  border-radius: 8px;
  background-color: global.$surfaceColor;
  box-shadow: 0 0 6px 1px rgba(global.$bgColor, 0.8);
  color: white;
  flex: 1;

  option {
    background-color: global.$surfaceColor; /* Match background color */
    color: white; /* Match text color */
  }
}
</style>
