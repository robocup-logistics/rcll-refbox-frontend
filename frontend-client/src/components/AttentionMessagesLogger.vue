<template>
  <div >
    <div v-if="websocketMsgs !== []" class="d-flex flex-column">
        <div v-for="(msg,index) in websocketMsgs" 
            :key=index  >
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
  name: 'BodyRefboxLog',
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