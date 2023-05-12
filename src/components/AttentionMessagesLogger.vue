<template>
  <div class="container-fluid">
    <div v-if="attentionMessages !== []" class="d-flex flex-column text-left">
      <AttentionMessageSingle class="pl-1" 
        v-for="(msg,index) in attentionMessages"
        :key=index 
        :msg='msg'
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