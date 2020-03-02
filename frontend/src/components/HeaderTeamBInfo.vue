<template>
  <div class="col-md-5 border">
    <div class="row justify-content-center">
      <div class="col-md-12 my-2 add-team-container">
        <button 
        class="btn btn-outline-info btn-add-team"
        @click.prevent="isClicked=!isClicked"
        >Add team</button>
      </div>
      <div class="mb-2" v-if="isClicked">
        <form >
          <input type="text" 
          placeholder="add teamname"
          class="bg-light" required
          >
          <button type="submit" 
          class="btn btn-sm btn-success"
          @click.prevent=""
          >Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeaderTeamBInfo',
  data() {
    return {
      isClicked: false
    }
  }
}
</script>

<style>

</style>