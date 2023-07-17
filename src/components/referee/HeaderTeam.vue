<template>
  <div class="col-md-5 border d-flex justify-content-center align-items-center">
    <div v-show="!teamName">
      <div class="d-flex flex-column justify-content-center align-items-center">
        <div class="my-2 add-team-container">
          <button
            v-shortkey.once="['f5']"
            class="btn btn-add-team add-team-button"
            :class="color"
            @click="toggleForm()"
            @shortkey="toggleForm()"
          >
            Add Team
            <span style="text-transform: capitalize !important">{{
              color
            }}</span>
          </button>
        </div>
        <div v-show="showForm" class="mb-2">
          <form
            class="add-team-form d-inline-flex"
            :class="color"
            @submit.prevent="setName(color)"
          >
            <input
              ref="inputBox"
              v-model="inputTeamName"
              type="text"
              placeholder="add teamname"
              class="input-box"
              :class="color"
              required
            />
            <button
              v-show="inputTeamName.length >= 1"
              type="submit"
              class="submit-button"
            >
              <font-awesome-icon :icon="['fa', 'arrow-right']" class="fa-1x" />
            </button>
            <div class="dropdown show">
              <a
                class="btn dropdown-toggle"
                data-toggle="dropdown"
                href="#"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
                @click.prevent="toggleKnownTeams()"
              />
              <div
                class="dropdown-menu"
                :style="showKnownTeams ? 'display:block' : 'display:none'"
              >
                <a
                  v-for="(knownTeam, index) in knownTeams"
                  :key="index"
                  href="#"
                  class="dropdown-item"
                  @click.prevent="fillInput(knownTeam)"
                >
                  {{ knownTeam }}
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div v-show="teamName">
      <h4 class="team-name" :class="color">
        {{ teamName }}
      </h4>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store/mainStore'

defineProps({
  color: {
    type: String,
    required: true,
  },
  teamName: {
    type: String,
    required: false,
  },
})

const mainStore = useMainStore()
const { knownTeams } = storeToRefs(mainStore)

const showForm: Ref<boolean> = ref(false)
const showKnownTeams: Ref<boolean> = ref(false)
const inputBox: Ref<HTMLInputElement | null> = ref(null)
const inputTeamName: Ref<string> = ref('')

function setName(color: string) {
  const msg = {
    command: 'set_teamname',
    color: color.toUpperCase(),
    name: inputTeamName.value,
  }
  mainStore.SOCKET_SEND(msg)
}

function toggleForm() {
  showForm.value = !showForm.value
  nextTick(() => {
    if (inputBox.value) inputBox.value.focus()
  })
  showKnownTeams.value = false
}

function fillInput(name: string) {
  inputTeamName.value = name
  nextTick(() => {
    if (inputBox.value) inputBox.value.focus()
  })
  showKnownTeams.value = false
}

function toggleKnownTeams() {
  showKnownTeams.value = !showKnownTeams.value
}

defineExpose({
  knownTeams,
  showKnownTeams,
  showForm,
  inputBox,
  inputTeamName,
  toggleForm,
  fillInput,
  toggleKnownTeams,
})
</script>

<style scoped lang="scss">
@use '@/assets/global.scss';

.add-team-button {
  min-width: 200px !important;
  transition-duration: 0.2s !important;
  &.cyan {
    color: global.$main-cyan-color !important;
    border-color: global.$main-cyan-color !important;
    &:hover {
      box-shadow: 0 3px 12px 0 global.$main-cyan-color,
        0 17px 50px 0 rgba(0, 0, 0, 0.8) !important;
    }
  }
  &.magenta {
    color: global.$main-magenta-color !important;
    border-color: global.$main-magenta-color !important;
    &:hover {
      box-shadow: 0 3px 12px 0 global.$main-magenta-color,
        0 17px 50px 0 rgba(0, 0, 0, 0.8) !important;
    }
  }
}

.add-team-form {
  border-left: 0 !important;
  border-right: 0 !important;
  border-top: 0 !important;
  border-bottom: 1px solid !important;

  border-radius: 2px !important;
  outline: 0 !important;
  background-color: #2b3e50 !important;
  &.cyan {
    border-color: global.$main-cyan-color !important;
  }
  &.magenta {
    border-color: global.$main-magenta-color !important;
  }

  .input-box {
    border-left: 0 !important;
    border-right: 0 !important;
    border-top: 0 !important;
    border-bottom: 0 !important;
    border-radius: 2px !important;
    outline: 0 !important;
    background-color: #2b3e50 !important;
    text-align: center !important;
    &.cyan {
      color: global.$main-cyan-color !important;
      border-color: global.$main-cyan-color !important;
    }
    &.magenta {
      color: global.$main-magenta-color !important;
      border-color: global.$main-magenta-color !important;
    }
  }

  .submit-button {
    padding: 0 !important;
    background: none !important;
    border: none !important;
    outline: none !important;
    color: rgb(105, 109, 112) !important;
  }

  .dropdown-toggle {
    padding: 0 0.4em !important;
  }
}

.team-name {
  &.cyan {
    color: global.$main-cyan-color !important;
  }
  &.magenta {
    color: global.$main-magenta-color !important;
  }
}
</style>
