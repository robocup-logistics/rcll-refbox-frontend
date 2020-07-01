<template>
  <div class="container-fluid">
    <div v-if="websocketMsgs !== []" class="row">
          <AttentionMessageSingle 
            v-for="(msg,index) in attentionMessages"
            :key=index class="col-md-6"
              :msg='msg' :index='index'
          />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AttentionMessageSingle from './AttentionMessageSingle'

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