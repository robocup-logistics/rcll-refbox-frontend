<template>
  <div>
    <HeaderLogo />
    <div class="container-fluid">
      <div class="general-info row">
        <HeaderTeam color="cyan" />
        <HeaderCentralInformation />
        <HeaderTeam color="magenta"/>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderLogo from '@/components/HeaderLogo.vue'
import HeaderTeam from '@/components/HeaderTeam.vue'
import HeaderCentralInformation from '@/components/HeaderCentralInformation.vue'

export default {
  name: 'Header',
  components: {
    HeaderLogo,
    HeaderTeam,
    HeaderCentralInformation
  }
}
</script>

<style>

</style>