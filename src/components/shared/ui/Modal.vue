// TEMPLATE --------------------------------------------------------------------
<template>
  <div v-show="visible">
    <div class="modal-bg" v-show="visible"></div>
    <div class="modal" v-show="visible">
      <Popup :title="title" :icon="icon" permanent>
        <slot></slot>
      </Popup>
    </div>
  </div>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// imports - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import Popup from '@/components/shared/ui/Popup.vue'
import { type Ref, ref } from 'vue'

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: false,
  },
})

// is visible? - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const visible: Ref<boolean> = ref(true)
function close() {
  visible.value = false
}
defineExpose({ close })
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

.modal-bg {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: black;
  opacity: 0.7;
  z-index: 999;
}
.modal {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}
</style>
