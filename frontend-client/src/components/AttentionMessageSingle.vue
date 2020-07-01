<template>
  <div v-if="elementVisible" >
    <h6 
        class="attention-msg-text text-center">
        <font-awesome-icon :icon="['fas','exclamation-triangle']" class="fa-1x" />
        {{msg.text}}
    </h6>
  </div>
</template>

<script>
export default {
  name: 'AttentionMessageSingle',
  props: ['msg', 'index'],
 data() {
   return {
     elementVisible: true
   }
 },
 mounted() {
   setTimeout(() => this.elementVisible = false, 6000)
 }
}
</script>

<style>
.attention-msg-text {
  color:red;
  font-size: 20px !important;
}
</style>