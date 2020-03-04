// Main Store for Vuex
import Vuex from 'vuex';
import Vue from 'vue';
// Modules Import
import machines from './modules/machines';
import orders from './modules/orders';
import robots from './modules/robots';

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    machines,
    orders,
    robots
  },

  state: {
    // Teamnames
    nameTeamCyan: '',
    nameTeamMagenta: '',
    // Togglers on header
    showFormCyan: true,
    showFormMagenta: true,
    //Points
    scoreCyan: 0,
    scoreMagenta: 0,

    // Gamephase
    phase: 'Pre-Game'
  },

  getters: {

  },

  actions: {
    setNameCyan({commit, state}) {
      commit('setCyanName', state.nameTeamCyan);
      commit('toggleShowFormCyan');
    },
    setNameMagenta({commit, state}) {
      commit('setMagentaName', state.nameTeamMagenta);
      commit('toggleShowFormMagenta');
    },
    setNextPhase({commit, state}) {
      if(state.nameTeamCyan || state.nameTeamMagenta){
        if (state.phase === 'Pre-Game') {
          commit('nextPhase', 'Setup');
        } else if(state.phase === 'Setup') {
          commit('nextPhase', 'Exploration');
        } else if(state.phase === 'Exploration') {
          commit('nextPhase', 'Production');
        } else if(state.phase === 'Production') {
          commit('nextPhase', 'Post-Game');
        }
      }else {
        alert('First Set Team Name!');
      }
  },
    setPreviousPhase({commit, state}) {
      if (state.phase === 'Post-Game') {
        commit('previousPhase', 'Production');
      } else if(state.phase === 'Production') {
        commit('previousPhase', 'Exploration');
      } else if(state.phase === 'Exploration') {
        commit('previousPhase', 'Setup');
      } else if(state.phase === 'Setup') {
        commit('previousPhase', 'Pre-Game');
    }
    }
  },
  
  mutations: {
    setCyanName(state, value) {
      state.nameTeamCyan = value;
    },
    setMagentaName(state, name) {
      state.nameTeamMagenta = name;
    },
    toggleShowFormCyan(state) {
      state.showFormCyan = !state.showFormCyan;
    },
    toggleShowFormMagenta(state) {
      state.showFormMagenta = !state.showFormMagenta;
    },
    previousPhase(state, phase) {
      state.phase = phase;
    },
    nextPhase(state, phase) {
      state.phase = phase;
    }
  }
})