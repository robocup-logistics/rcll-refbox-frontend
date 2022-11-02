<template>
  <div class="container-fluid">
    <div v-if="websocketMsgs !== []" class="d-flex flex-column text-left">
          <AttentionMessageSingle class="pl-1" 
            v-for="(msg,index) in attentionMessages"
            :key=index 
              :msg='msg' :index='index'
          />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AttentionMessageSingle from '@/components/AttentionMessageSingle.vue'

export default {
  name: 'AttentionMessagesLogger',
  components: {
    AttentionMessageSingle
  },
  computed: {
    ...mapState(['websocketMsgs', 'socket']),
    attentionMessages() {
      return this.websocketMsgs.filter(msg => msg.level === 'attention')
    }
  },
  methods: {
    
  }
}
</script>

<style>
.attention-message-text{
  color:red
}
</style>