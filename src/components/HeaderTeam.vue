<template>
  <div
    v-if="color==='cyan'"
    class="col-md-5 border d-flex justify-content-center align-items-center"
  >
    <div v-show="showFormCyan">
      <div class="row justify-content-center">
        <div class="col-md-12 my-2 add-team-container">
          <button 
            v-shortkey.once="['f4']"
            class="btn btn-add-team btn-cyan-header"
            @click="toggleFormAndTeams()" 
            @shortkey="toggleFormAndTeams()"
          >
            Add Team Cyan
          </button>
        </div>
        <div
          v-show="isClicked"
          class="mb-2"
        >
          <form
            class="form-cyan d-flex"
            @submit.prevent="setName(color)"
          >
            <input
              ref="cyanInputBox" 
              v-model="nameTeamCyan"
              type="text"
              placeholder="add teamname"
              class="input-cyan "
              required
            >
            <button
              v-show="nameTeamCyan.length >= 1"
              type="submit"
              class="submit-btn"
            >
              <font-awesome-icon
                :icon="['fa','arrow-right']"
                class="fa-1x"
              />
            </button>
            <div class="dropdown show">
              <a
                class=" btn dropdown-toggle SelectArrow " 
                data-toggle="dropdown"
                href="#"
                role="button" 
                aria-haspopup="true"
                aria-expanded="false" 
                @click.prevent="toggleTeamMenuCyan()"
              />
              <div
                class="dropdown-menu cyanDropdown" 
                :style="teamMenuTriggeredCyan ? 'display:block' : 'display:none'"
              >
                <a
                  v-for="(knownTeam,index) in knownTeams"
                  :key="index"
                  href="#"
                  class="dropdown-item"
                  @click.prevent="fillCyanNameInput(knownTeam)"
                >
                  {{ knownTeam }}
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div
      v-show="!showFormCyan"
      class="cyan-name-container "
    >
      <h4 class="cyan-name-header ">
        {{ nameTeamCyan }}
      </h4>
    </div>
  </div>

  <div
    v-else-if="color==='magenta'"
    class="col-md-5 border
    d-flex justify-content-center align-items-center"
  >
    <div v-show="showFormMagenta">
      <div class="row justify-content-center">
        <div class="col-md-12 my-2 add-team-container">
          <button
            v-shortkey.once="['f5']"
            class="btn  btn-add-team btn-magenta-header"
            @click="toggleFormAndTeams()"
            @shortkey="toggleFormAndTeams()"
          >
            Add Team Magenta
          </button>
        </div>
        <div
          v-show="isClicked"
          class="mb-2"
        >
          <form
            class="form-magenta d-flex"
            @submit.prevent="setName(color)"
          >
            <input
              ref="magentaInputBox" 
              v-model="nameTeamMagenta"
              type="text"
              placeholder="add teamname"  
              class="input-magenta"
              required
            >
            <button
              v-show="nameTeamMagenta.length >= 1"
              type="submit"
              class="submit-btn"
            >
              <font-awesome-icon
                :icon="['fa','arrow-right']"
                class="fa-1x "
              />
            </button>
            <div class="dropdown show">
              <a
                class=" btn dropdown-toggle SelectArrow " 
                data-toggle="dropdown"
                href="#"
                role="button" 
                aria-haspopup="true"
                aria-expanded="false" 
                @click.prevent="toggleTeamMenuMagenta()"
              />
              <div
                class="dropdown-menu magentaDropdown" 
                :style="teamMenuTriggeredMagenta ? 'display:block' : 'display:none'"
              >
                <a
                  v-for="(knownTeam,index) in knownTeams"
                  :key="index"
                  href="#"
                  class="dropdown-item"
                  @click.prevent="fillMagentaNameInput(knownTeam)"
                >
                  {{ knownTeam }}
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div
      v-show="!showFormMagenta"
      class="teamname-header-magenta"
    >
      <h4 class="magenta-name-header">
        {{ nameTeamMagenta }}
      </h4>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store/mainStore'

const props = defineProps({
  color: {
    type: String,
    required: true
  }
})

const mainStore = useMainStore()
const { showFormCyan, showFormMagenta, nameTeamCyan, nameTeamMagenta, knownTeams, teamMenuTriggeredCyan, teamMenuTriggeredMagenta } = storeToRefs(mainStore)

const isClicked: Ref<boolean> = ref(false)
const cyanInputBox: Ref<HTMLInputElement | null> = ref(null)
const magentaInputBox: Ref<HTMLInputElement | null> = ref(null)

function setName(color: string) {
  color = color.toUpperCase()
  const msg = {
    "command" : "set_teamname",
    "color" : `${color}`,
    "name" : `${color === "CYAN" ? nameTeamCyan.value : nameTeamMagenta.value}`
  }
  mainStore.SOCKET_SEND(msg)
  color === 'CYAN' ? mainStore.toggleShowFormCyan() : mainStore.toggleShowFormMagenta()
}

function toggleForm() {
  isClicked.value = !isClicked.value
  if (props.color === 'cyan') {
    nextTick(() => {
      if(cyanInputBox.value) cyanInputBox.value.focus()
    })
  } else {
    nextTick(() => {
      if(magentaInputBox.value) magentaInputBox.value.focus()
    })
  }
}

function toggleFormAndTeams(){
  toggleForm()
  if (props.color === 'magenta') {
    mainStore.openTeamMenuCyan()
  } else {
    mainStore.openTeamMenuMagenta()
  }
}

function fillCyanNameInput(name: string){
  nameTeamCyan.value = name
  nextTick(() => {
    if(cyanInputBox.value) cyanInputBox.value.focus()
  })
  toggleTeamMenuCyan()
}

function fillMagentaNameInput(name: string){
  nameTeamMagenta.value = name
  nextTick(() => {
    if(magentaInputBox.value) magentaInputBox.value.focus()
  })
  toggleTeamMenuMagenta()
}

function toggleTeamMenuCyan() {
  mainStore.toggleTeamMenuCyan()
}

function toggleTeamMenuMagenta() {
  mainStore.toggleTeamMenuMagenta()
}

defineExpose({ showFormCyan, showFormMagenta, nameTeamCyan, nameTeamMagenta, knownTeams, teamMenuTriggeredCyan, teamMenuTriggeredMagenta, isClicked, cyanInputBox, magentaInputBox, toggleFormAndTeams, fillCyanNameInput, fillMagentaNameInput, toggleTeamMenuCyan, toggleTeamMenuMagenta })
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
