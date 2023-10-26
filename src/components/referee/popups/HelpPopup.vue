// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup title="Help">
    <h2>Orders</h2>
    <p>
      If orders are darkened, this means they are not active yet. If they are
      lightened, they have become active. Orders additionally highlighted
      through a surrounding slightly lighter box indicate an active delivery
      period.
    </p>
    <h2>More</h2>
    <p>
      Please leave some feedback on GitHub whether this information was helpful!
    </p>
  </Popup>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
import Popup from '@/components/shared/ui/Popup.vue'
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';
</style>
