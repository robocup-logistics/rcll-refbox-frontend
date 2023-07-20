<template>
  <div>
    <HeaderLogo />
    <div class="container-fluid">
      <div class="general-info row">
        <HeaderTeam color="cyan" :teamName="nameTeamCyan" />
        <HeaderCentralInformation />
        <HeaderTeam color="magenta" :teamName="nameTeamMagenta" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store/mainStore'
import HeaderLogo from '@/components/referee/HeaderLogo.vue'
import HeaderTeam from '@/components/referee/HeaderTeam.vue'
import HeaderCentralInformation from '@/components/referee/HeaderCentralInformation.vue'

const mainStore = useMainStore()
const { nameTeamCyan, nameTeamMagenta } = storeToRefs(mainStore)
</script>

<style scoped></style>
