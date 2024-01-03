// TEMPLATE --------------------------------------------------------------------
<template>
  <span class="explainable">
    <span class="term">{{ term }}</span>
    <PopupWrapper>
      <template #reference>
        <font-awesome-icon class="clickable" icon="fa-info-circle" />
      </template>
      <Popup :title="term">
        <slot></slot>
      </Popup>
    </PopupWrapper>
  </span>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// import  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import Popup from '@/components/shared/ui/Popup.vue'
import PopupWrapper from '@/components/shared/ui/PopupWrapper.vue'

// props - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
defineProps({
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
  border-radius: 5px;
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
