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
import HeaderLogo from './HeaderLogo'
import HeaderTeam from './HeaderTeam'
import HeaderCentralInformation from './HeaderCentralInformation'

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