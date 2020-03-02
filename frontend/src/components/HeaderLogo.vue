<template>
  <div class="justify-content-center border bg-dark">
    <img :src=logoUrl alt="Refbox Logo">
  </div>
</template>

<script>
export default {
  name: 'HeaderLogo',
  data() {
    // eslint-disable-next-line no-unused-labels
    return {
      // Placeholder for logo
      logoUrl: 'http://via.placeholder.com/150x30'
    }
  }
}
</script>

<style>

</style>