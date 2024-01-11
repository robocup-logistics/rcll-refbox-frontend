// TEMPLATE --------------------------------------------------------------------
<template>
  <PopupWrapper style="display: inline-block">
    <template #reference>
      <span class="explainable clickable">
        <font-awesome-icon v-if="icon" :icon="icon" />
        <span class="term">{{ term }}</span>
        <font-awesome-icon icon="fa-info-circle" />
      </span>
    </template>
    <Popup :title="term">
      <slot></slot>
    </Popup>
  </PopupWrapper>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// import  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import Popup from '@/components/shared/ui/Popup.vue'
import PopupWrapper from '@/components/shared/ui/PopupWrapper.vue'

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
defineProps({
  icon: {
    type: String,
    required: false,
  },
  term: {
    type: String,
    required: true,
  },
})
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

.explainable {
  border-radius: 8px;
  padding: 0 5px;
  background-image: linear-gradient(
    global.$accentColor 0%,
    global.$accentColorDarker 100%
  );

  display: inline-flex;
  gap: 10px;
  align-items: center;

  .term {
    font-style: italic;
  }
}
</style>
