<template>
  <div class="container-fluid">
    <div 
      v-if="attentionMessages.length"
      class="d-flex flex-column text-left"
    >
      <AttentionMessageSingle 
        v-for="(msg,index) in attentionMessages"
        :key="index"
        :msg="msg"
        class="pl-1" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMainStore } from '@/store/mainStore'
import AttentionMessageSingle from '@/components/AttentionMessageSingle.vue'

const mainStore = useMainStore()

const attentionMessages = computed(() => {
  return mainStore.websocketMsgs.filter(msg => msg.level === 'attention')
})

defineExpose({attentionMessages})
</script>

<style scoped>
.attention-message-text{
  color:red
}
</style>