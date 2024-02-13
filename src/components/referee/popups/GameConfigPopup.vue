// TEMPLATE --------------------------------------------------------------------
<template>
  <Popup
    title="Game Config"
    icon="fa-screwdriver-wrench"
    class="config-popup"
    ref="popup"
  >
    <p>You will be able to edit the config right here in a future release.</p>
    <!-- FILTER -->
    <div class="sticky">
      <Input v-model="filter" placeholder="filter by path" clearable />
    </div>
    <template v-for="[path, value] in filteredGameConfigValues">
      <Accordion :title="path" class="content-box"> {{ value }}</Accordion>
    </template>
  </Popup>
</template>

// SCRIPT ----------------------------------------------------------------------
<script setup lang="ts">
// import  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
import Popup from '@/components/shared/ui/Popup.vue'
import { useConfigStore } from '@/store/configStore'
import { storeToRefs } from 'pinia'
import Accordion from '@/components/shared/ui/Accordion.vue'
import Input from '@/components/shared/ui/Input.vue'
import { type Ref, ref, type ComputedRef, computed, watch } from 'vue'

// use stores  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const configStore = useConfigStore()
const { gameConfig } = storeToRefs(configStore)

// filter config paths - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const filter: Ref<string> = ref('')
const filteredGameConfigValues: ComputedRef<[string, any][]> = computed(() =>
  [...gameConfig.value].filter(([path, _]) => path.includes(filter.value))
)

const popup: Ref<typeof Popup | undefined> = ref()
watch(
  () => filter.value,
  () => {
    if (popup.value) {
      popup.value.scrollToTop()
    }
  }
)
</script>

// STYLE -----------------------------------------------------------------------
<style scoped lang="scss">
@use '@/assets/global.scss';

.config-popup {
  .accordion {
    padding: 0;
  }
}
</style>
