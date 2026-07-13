<template>
    <v-card elevation="2" class="pa-4 d-flex flex-column justify-center">
      <div class="d-flex align-center justify-space-between">
        <div class="text-caption text-grey">{{ title }}</div>
        <font-awesome-icon
          v-if="isPositive"
          icon="fa-arrow-up"
          class="positive-indicator"
        />
      </div>
  
      <div class="d-flex align-center justify-space-between">
        <div class="text-h4 font-weight-bold">
          {{ value }}
        </div>
  
        <v-icon v-if="icon" :icon="icon" size="32" color="primary"></v-icon>
      </div>
  
      <div v-if="percentage" class="text-caption mt-2 text-green">
        {{ percentage }}
      </div>
  
      <div v-if="average" class="text-caption mt-1 text-grey-lighten-1">
        Ø {{ average }}
      </div>
    </v-card>
  </template>
  
  <script setup>
  defineProps({
    title: String,
    value: [String, Number],
    subtitle: String,
    icon: String,
    average: [String, Number],
    isPositive: Boolean,
  })
  </script>
  
<style scoped>
.v-card {
  border-radius: 14px;
}

.positive-indicator {
  color: #4caf50;
  font-size: 1.2em;
}
</style>
  