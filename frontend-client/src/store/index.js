// Main Store for Vuex
import Vuex from 'vuex';
import Vue from 'vue';
// Modules Import
import machines from './modules/machines';
import orders from './modules/orders';
import robots from './modules/robots';
// Axios 
import { get } from '@/api/api' 

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
    // Gamestate
    phase: 'Pre_Game',
    gametime: 0,
    awardedPoints: []
  },

  getters: {

  },

  actions: {
    async fetchGameState({commit, state}) {
      try {
        const response = await get('/game-state');
        const data = await response.data;
        // Check if cyan teamname ist set in Api and set the store name so
        // On refresh it directly applies it, toggles the formbutton and gets
        // back to current state of the game 
        const teamname = data[0].teams[0]
        if(state.nameTeamCyan !== teamname){
          commit('toggleShowFormCyan')
          commit('setCyanName', teamname)
        }
        data.forEach(gamestate => {
          // Check if cyan teamname ist set in Api and set the store name so
          // On refresh it directly applies it, toggles the formbutton and gets
          // back to current state of the game 
          commit('setCurrentPhase', gamestate.phase);
          commit('setCurrentCyanScore', gamestate.points[0]);
          commit('setGametime', gamestate ["game-time"]);
          //console.log(gamestate["'game-time'"]);
        });
      } catch (error) {
        console.log(error);
      }
    },
    
    async fetchAwardedPoints({commit}) {
      try {
        const response = await get('/points');
        const data = response.data;
        commit('setAwardedPoints', data)
      } catch (error) {
        console.log(error);
      }
    },

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
        if (state.phase === 'Pre_game') {
          commit('nextPhase', 'Setup');
        } else if(state.phase === 'Setup') {
          commit('nextPhase', 'Exploration');
        } else if(state.phase === 'Exploration') {
          commit('nextPhase', 'Production');
        } else if(state.phase === 'Production') {
          commit('nextPhase', 'Post_game');
        }
      }else {
        alert('First Set Team Name!');
      }
  },

    setPreviousPhase({commit, state}) {
      if (state.phase === 'Post_game') {
        commit('previousPhase', 'Production');
      } else if(state.phase === 'Production') {
        commit('previousPhase', 'Exploration');
      } else if(state.phase === 'Exploration') {
        commit('previousPhase', 'Setup');
      } else if(state.phase === 'Setup') {
        commit('previousPhase', 'Pre_game');
    }
  },
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
    },
    setCurrentPhase(state, phase) {
      // So it's in format Production instead of PRODUCTION
      phase = phase.charAt(0).toUpperCase() + phase.slice(1).toLowerCase();
      state.phase = phase;
    },
    setCurrentCyanScore(state, score) {
      state.scoreCyan = score;
    },
    setGametime(state, gametime) {
      // console.log(gametime);
      state.gametime = gametime;
    },
    setAwardedPoints(state, pointsArray) {
      state.awardedPoints = pointsArray;
    }
  }
})