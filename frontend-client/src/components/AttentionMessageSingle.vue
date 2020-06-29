<template>
  <div>
    <h6 v-show="elementVisible" 
        class="attention-msg-text ">
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
   setTimeout(() => this.elementVisible = false, 4000)
 }
}
</script>

<style>
.attention-msg-text {
  color:red;
  font-size: 20px !important;
}
</style>