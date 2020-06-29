<template>
  <div class="d-flex justify-content-between border">
    <img  alt="Refbox Logo">
    <a @click.prevent='toggleConfirmationDialogFieldRnd' class="btn btn-primary">
      <font-awesome-icon :icon="['fa','random']" style="font-size: 12px;" />
    </a>
    <ConfirmRandomizeFieldModal v-if="toggle" />
  </div>
</template>

<script>
import ConfirmRandomizeFieldModal from './ConfirmRandomizeFieldModal'
export default {
  name: 'HeaderLogo',
  components: {
    ConfirmRandomizeFieldModal
  },
  data() {
    return {
      toggle: false
    }
  },
  methods: {
    toggleConfirmationDialogFieldRnd() {
      this.toggle = !this.toggle      
    },
  }
}
</script>

<style>

</style>