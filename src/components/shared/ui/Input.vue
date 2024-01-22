// TEMPLATE --------------------------------------------------------------------
<template>
  <div class="input">
    <input v-bind="$attrs" ref="input" v-model="value" />
    <span class="underline"></span>
    <div
      v-if="clearable && value && value.length"
      class="clear clickable"
      @click="clearInput"
    >
      <font-awesome-icon icon="fa-xmark" />
    </div>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// import  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import { ref, type Ref } from 'vue'

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
defineProps({
  clearable: {
    type: Boolean,
    default: false,
  },
})

// v-model input - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const value: Ref<string | undefined> = defineModel()
function clearInput() {
  value.value = ''
}

// -> focus input when focus is called - - - - - - - - - - - - - - - - - - - - -
const input: Ref<HTMLInputElement | null> = ref(null)
function focus() {
  if (input.value) input.value.focus()
}

// expose  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
defineExpose({ focus })
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

.input {
  position: relative;

  input {
    border-radius: 12px;
    padding: 10px;
    border: none;
    outline: none;
    width: 100%;
    height: 100%;
    background-color: global.$lighterColor;
    color: white;
    filter: drop-shadow(0px 1px 3px rgba(global.$bgColor, 0.8));

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

  .clear {
    position: absolute;
    right: 10px;
    top: 0;
    bottom: 0;
    margin: -10px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>
