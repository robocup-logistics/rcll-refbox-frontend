<template>
  <div  v-if="color==='cyan'" class="col-md-5 border d-flex justify-content-center align-items-center"
  >
    <div v-if="showFormCyan">
      <div class="row justify-content-center">
        <div class="col-md-12 my-2 add-team-container">
          <button 
          class="btn  btn-add-team btn-cyan-header"
          @click="isClicked=!isClicked"
          >Add Team Cyan</button>
        </div>
        <div class="mb-2" v-if="isClicked">
          <form @submit.prevent="setNameCyan"
                class="form-cyan"
          >
            <input type="text" 
            placeholder="add teamname"
            class="input-cyan"
            required
            autofocus
            v-model="cyanName"
            >
            <button type="submit" class="submit-btn">
              <i class="fas fa-arrow-right"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
    <div v-if="!showFormCyan" class="cyan-name-container ">
      <h3 class="cyan-name-header ">{{getCyanName}}</h3>
    </div>
  </div>

  <div  v-else-if="color==='magenta'" class="col-md-5 border
    d-flex justify-content-center align-items-center"
    >
    <div v-if="showFormMagenta">
      <div class="row justify-content-center">
        <div class="col-md-12 my-2 add-team-container">
          <button class="btn  btn-add-team btn-magenta-header"
          @click="isClicked=!isClicked"
          >Add Team Magenta</button>
        </div>
        <div class="mb-2" v-if="isClicked">
          <form @submit.prevent="setNameMagenta"
                class="form-magenta"
          >
              <input type="text" 
              placeholder="add teamname"
              class="input-magenta"
              required  
              v-model="magentaName"
              >
              <button type="submit" class="submit-btn">
                <i class="fas fa-arrow-right"></i>
              </button>
            </form>
        </div>
      </div>
    </div>
    <div v-if="!showFormMagenta" class="teamname-header-magenta">
      <h3 class="magenta-name-header">{{getMagentaName}}</h3>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

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
  },
  computed: {
    ...mapState({
      showFormCyan: state => state.showFormCyan,
      showFormMagenta: state => state.showFormMagenta,
      getCyanName: state => state.nameTeamCyan,
      getMagentaName: state => state.nameTeamMagenta
    }),
    cyanName: {
      get() {
        return this.getCyanName;
      },
      set(value) {
        this.$store.commit('setCyanName',value)
      }
    },
    magentaName: {
      get() {
        return this.getMagentaName
      },
      set(value) {
        this.$store.commit('setMagentaName',value)
      }
    }
  },
  methods: {
    ...mapActions(['setNameCyan', 'setNameMagenta'])
  }
  
}
</script>

<style scoped>
.btn-add-team {
  min-width: 200px !important;
}
.btn-magenta-header {
  color: var(--main-magenta-color) !important;
  border-color: var(--main-magenta-color) !important;
  transition-duration: 0.2s !important
}

.btn-magenta-header:hover {
  box-shadow: 0 3px 12px 0 var(--main-magenta-color) ,0 17px 50px 0 rgba(0,0,0,0.80) !important;
}

.btn-cyan-header {
  color:  var(--main-cyan-color) !important;
  border-color: var(--main-cyan-color) !important;
  transition-duration: 0.2s !important
}

.btn-cyan-header:hover {
  box-shadow: 0 3px 12px 0 var(--main-cyan-color),0 17px 50px 0 rgba(0,0,0,0.80) !important;
}

.cyan-name-header  {
  color: var(--main-cyan-color) !important;
}

.magenta-name-header {
  color: var(--main-magenta-color) !important;
}

.submit-btn {
  padding: 0 !important; 
  background: none !important; 
  border: none !important; 
  outline: none !important;
  color: rgb(105, 109, 112) !important;
}

.input-cyan {
  border-left: 0 !important;
  border-right: 0 !important;
  border-top: 0 !important;
  border-bottom: 0 !important;
  border-color: var(--main-cyan-color) !important;
  border-radius: 2px !important;
  outline: 0 !important;
  background-color: #2B3E50 !important;
  color: var(--main-cyan-color) !important;
  text-align: center !important;
}

.form-cyan {
  border-left: 0 !important;
  border-right: 0 !important;
  border-top: 0 !important;
  border-bottom: 1px solid !important;
  border-color: var(--main-cyan-color) !important;
  border-radius: 2px !important;
  outline: 0 !important;
  background-color: #2B3E50 !important;
}

.input-magenta {
  border-left: 0 !important;
  border-right: 0 !important;
  border-top: 0 !important;
  border-bottom: 0 !important;
  border-color: var(--main-magenta-color) !important;
  border-radius: 2px !important;
  outline: 0 !important;
  background-color: #2B3E50 !important;
  color: var(--main-magenta-color) !important;
  text-align: center !important;
}

.form-magenta {
  border-left: 0 !important;
  border-right: 0 !important;
  border-top: 0 !important;
  border-bottom: 1px solid !important;
  border-color: var(--main-magenta-color) !important;
  border-radius: 2px !important;
  outline: 0 !important;
  background-color: #2B3E50 !important;
}

</style>
