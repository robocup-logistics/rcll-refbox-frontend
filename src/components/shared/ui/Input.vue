// TEMPLATE --------------------------------------------------------------------
<template>
  <div class="input">
    <input
      v-model="inputModel"
      :type="type"
      :placeholder="placeholder"
      ref="input"
    />
    <span class="underline"></span>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// import  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { ref, computed, type Ref } from 'vue'

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const props = defineProps({
  value: String,
  placeholder: String,
  type: String,
})

// emits - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const emit = defineEmits(['input'])

// v-model input - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const input: Ref<HTMLInputElement | null> = ref(null)
const inputModel = computed({
  get() {
    return props.value
  },
  set(newValue) {
    emit('input', newValue)
  },
})
function getValue() {
  return input.value?.value
}

// -> focus input when focus is called - - - - - - - - - - - - - - - - - - - - -
function focus() {
  if (input.value) input.value.focus()
}

// expose  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
defineExpose({ getValue, focus })
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

.input {
  position: relative;

  input {
    border-radius: 8px;
    padding: 10px;
    border: none;
    outline: none;
    width: 100%;
    height: 100%;
    background-color: global.$lighterColor;
    color: white;

    &:focus + .underline {
      width: calc(100% - 10px);
    }

    &::placeholder {
      color: #909090;
    }
  }

  .underline {
    transition: all 0.2s;
    display: inline-block;
    bottom: 5px;
    left: 5px;
    position: absolute;
    width: 0;
    height: 2px;
    background-color: global.$accentColor;
  }
}
</style>
