<template>
  <div  v-if="color==='cyan'" class="col-md-5 border">
    <div class="row justify-content-center">
      <div class="col-md-12 my-2 add-team-container">
        <button 
        class="btn btn-outline-info btn-add-team btn-cyan-header"
        @click="isClicked=!isClicked"
        >Add Team Cyan</button>
      </div>
      <div class="mb-2" v-if="isClicked">
        <form >
          <input type="text" 
          placeholder="add teamname"
          class="bg-light" required
          >
          <button type="submit" 
          class="btn btn-sm btn-success"
          >Submit</button>
          </form>
      </div>
    </div>
  </div>

  <div  v-else-if="color==='magenta'" class="col-md-5 border">
    <div class="row justify-content-center">
      <div class="col-md-12 my-2 add-team-container">
        <button class="btn btn-outline-info btn-add-team btn-magenta-header"
        @click="isClicked=!isClicked"
        >Add Team Magenta</button>
      </div>
      <div class="mb-2" v-if="isClicked">
        <form >
          <input type="text" 
          placeholder="add teamname"
          class="bg-light" required
          >
          <button type="submit" 
          class="btn btn-sm btn-success"
          >Submit</button>
          </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeaderTeamAInfo',
  props: {
    color: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isClicked: false
    }
  }
  
}
</script>

<style >
.btn-add-team {
  min-width: 200px;
}

.btn-magenta-header:hover{
  background-color: #FF00FF;
  color: black;
}

.btn-cyan-header:hover {
  background-color: #00FFFF;
  color: black;
}
</style>
