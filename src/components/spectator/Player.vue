<template>
  <div id="player">
    {{ color }}
  </div>
</template>

<script setup lang="ts">
defineProps({
  color: {
    type: String,
    required: true,
  },
})
</script>

<style scoped lang="scss">
#player {
  background-color: v-bind('color');
}
</style>
