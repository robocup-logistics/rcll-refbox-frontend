<template>
  <div >
    <div v-if="websocketMsgs !== []" class="row">
        <div v-for="(msg,index) in websocketMsgs" 
            :key=index class="col-md-6" >
          <AttentionMessageSingle v-if="msg.level === 'attention'"
              :msg='msg' :index='index'
          />
        </div>
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
    ...mapState(['websocketMsgs', 'socket'])
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