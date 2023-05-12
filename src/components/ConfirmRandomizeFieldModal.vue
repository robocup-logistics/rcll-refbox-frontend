<template>
  <div>
    <div class="modal" style="display:block">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              Confirm Field Randomization?
            </h5>
            <button type="button" class="close" @click.prevent="closeModal()" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary"
              @click.prevent="confirmedRandomize()"
              v-shortkey.once="['enter']" @shortkey="confirmedRandomize()"
            >
            Yes
            </button>
            <button type="button" class="btn btn-secondary" @click.prevent="closeModal()" 
              v-shortkey.once="['esc']" @shortkey="closeModal()"
              data-dismiss="modal"
            >
            No
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMainStore } from '@/store/mainStore'

const emit = defineEmits<{
  (e: 'toggleConfirmationDialogFieldRandomize'): void
}>()

const mainStore = useMainStore()

function closeModal() {
  emit('toggleConfirmationDialogFieldRandomize')
}

function confirmedRandomize() {
  mainStore.randomizeField()
  closeModal()
}

defineExpose({ closeModal, confirmedRandomize })
</script>

<style>

</style>