<template>
  <div>
    <div class="modal" style="display:block">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Confirm Field Randomization?</h5>
                <button type="button" class="close" @click.prevent="closeModal()" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary"
                        @click.prevent="confirmedRandomize()">Yes</button>
                <button type="button" class="btn btn-secondary" @click.prevent="closeModal()" data-dismiss="modal">No</button>
              </div>
            </div>
          </div>
        </div>
  </div>
  
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'ConfirmRandomizeFieldModal',
  methods: {
    ...mapActions(['randomizeField']),
    closeModal() {
      this.$parent.toggleConfirmationDialogFieldRnd()
    },
    confirmedRandomize() {
      this.randomizeField()
      this.closeModal()
    }
  }
}
</script>

<style>

</style>