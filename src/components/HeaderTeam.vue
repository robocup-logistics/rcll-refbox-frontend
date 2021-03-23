<template>
  <div  v-if="color==='cyan'" class="col-md-5 border d-flex justify-content-center align-items-center"
  >
    <div v-show="showFormCyan">
      <div class="row justify-content-center">
        <div class="col-md-12 my-2 add-team-container">
          <button 
          class="btn  btn-add-team btn-cyan-header"
          @click="toggleFormAndTeams()"
          v-shortkey.once="['f4']" @shortkey="toggleFormAndTeams()"
          >Add Team Cyan</button>
        </div>
        <div class="mb-2" v-show="isClicked">
          <form @submit.prevent="setName(color)"
                class="form-cyan d-flex"
          >
            <input type="text" 
            placeholder="add teamname"
            class="input-cyan "
            required
            ref="cyanInputBox"
            v-model="cyanName"
            >
            <button type="submit" class="submit-btn" v-show="cyanName.length >= 1">
               <font-awesome-icon :icon="['fa','arrow-right']" class="fa-1x" 
                                  
              />
            </button>
            <div class="dropdown show">
              <a class=" btn dropdown-toggle SelectArrow " 
                 data-toggle="dropdown" href="#" role="button" 
                 aria-haspopup="true" aria-expanded="false" 
                 @click.prevent="toggleTeamMenuCyan()">
              </a>
              <div class="dropdown-menu cyanDropdown" 
                   :style="teamMenuTriggeredCyan ? 'display:block' : 'display:none'"
              >
                <a href="#" class="dropdown-item" @click.prevent="fillCyanNameInput(knownTeam)"
                   v-for="(knownTeam,index) in knownTeams" :key="index"  >
                   {{knownTeam}}
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div v-show="!showFormCyan" class="cyan-name-container ">
      <h4 class="cyan-name-header ">{{getCyanName}}</h4>
    </div>
  </div>

  <div  v-else-if="color==='magenta'" class="col-md-5 border
    d-flex justify-content-center align-items-center"
    >
    <div v-show="showFormMagenta">
      <div class="row justify-content-center">
        <div class="col-md-12 my-2 add-team-container">
          <button class="btn  btn-add-team btn-magenta-header"
          @click="toggleFormAndTeams()"
          v-shortkey.once="['f5']" @shortkey="toggleFormAndTeams()"
          >Add Team Magenta</button>
        </div>
        <div class="mb-2" v-show="isClicked">
          <form @submit.prevent="setName(color)"
                class="form-magenta d-flex"
          >
              <input type="text" 
              placeholder="add teamname"
              class="input-magenta"
              required  
              ref="magentaInputBox"
              v-model="magentaName"
              >
              <button type="submit" class="submit-btn"  v-show="magentaName.length >= 1">
                <font-awesome-icon :icon="['fa','arrow-right']" class="fa-1x " />
              </button>
              <div class="dropdown show">
              <a class=" btn dropdown-toggle SelectArrow " 
                 data-toggle="dropdown" href="#" role="button" 
                 aria-haspopup="true" aria-expanded="false" 
                 @click.prevent="toggleTeamMenuMagenta()">
              </a>
              <div class="dropdown-menu magentaDropdown" 
                   :style="teamMenuTriggeredMagenta ? 'display:block' : 'display:none'"
              >
                <a href="#" class="dropdown-item" @click.prevent="fillMagentaNameInput(knownTeam)"
                   v-for="(knownTeam,index) in knownTeams" :key="index"  >
                   {{knownTeam}}
                </a>
              </div>
            </div>
            </form>
        </div>
      </div>
    </div>
    <div v-show="!showFormMagenta" class="teamname-header-magenta">
      <h4 class="magenta-name-header">{{getMagentaName}}</h4>
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
      isClicked: false,
    }
  },
  computed: {
    ...mapState({
      showFormCyan: state => state.showFormCyan,
      showFormMagenta: state => state.showFormMagenta,
      getCyanName: state => state.nameTeamCyan,
      getMagentaName: state => state.nameTeamMagenta,
      knownTeams: state => state.knownTeams,
      teamMenuTriggeredCyan: state => state.teamMenuTriggeredCyan,
      teamMenuTriggeredMagenta: state => state.teamMenuTriggeredMagenta
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
    ...mapActions(['setNameCyan', 'setNameMagenta', 'SOCKET_SEND', 'toggleTeamMenuCyan', 'openTeamMenuCyan', 'toggleTeamMenuMagenta', 'openTeamMenuMagenta']),
    setName(color) {
      color = color.toUpperCase()
      const msg = {
          "command" : "set_teamname",
          "color" : `${color}`,
          "name" : `${color === "CYAN" ? this.getCyanName : this.getMagentaName}`
        }
        this.SOCKET_SEND(msg)
        color === 'CYAN' ? this.setNameCyan() : this.setNameMagenta()
    },
    toggleForm() {
      this.isClicked = !this.isClicked
      if (this.color === 'cyan') {
        this.$nextTick(function () {
          this.$refs.cyanInputBox.focus()
        })
      } else {
        this.$nextTick(function () {
          this.$refs.magentaInputBox.focus()
        })
      }
    },
    toggleFormAndTeams(){
      this.toggleForm()
      if (this.color === 'magenta') {
        this.openTeamMenuCyan()
      } else {
        this.openTeamMenuMagenta()
      }
    },
    fillCyanNameInput(name){
      this.cyanName = name
      this.$nextTick(function () {
          this.$refs.cyanInputBox.focus()
        })
      this.toggleTeamMenuCyan()
    },
    fillMagentaNameInput(name){
      this.magentaName = name
      this.$nextTick(function () {
          this.$refs.magentaInputBox.focus()
        })
      this.toggleTeamMenuMagenta()
    },
    
    
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
.SelectArrow{
  padding: 0 0.4em !important;
  
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
