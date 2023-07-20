<template>
  <div v-if="elementVisible">
    <span class="attention-msg-text text-center">
      <font-awesome-icon
        :icon="['fas', 'exclamation-triangle']"
        class="fa-1x"
      />
      {{ msg.text }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

defineProps({
  msg: {
    type: Object,
    required: true,
  },
})

const elementVisible = ref(true)

onMounted(() => {
  setTimeout(() => {
    elementVisible.value = false
  }, 6000)
})

defineExpose(elementVisible)
</script>

<style scoped>
.attention-msg-text {
  color: red;
  font-size: 18px !important;
}
</style>
