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
    awardedPoints: [],
    gamestate: 'WAIT_START',
    // Polling rate in components
    pollRate: 1500,
    // Websocket attributes
    socket: null,
    isConnected: false,
    websocketMsgs: [],
    error: '',
    websocketURL : 'ws://localhost:1234',
  },

  getters: {

  },

  actions: {
    // establish websocket connection 
    connectToWebsocket({commit}) {
      commit('setSocketUrl')
      commit('SOCKET_ONOPEN')
      commit('SOCKET_ONCLOSE')
      commit('SOCKET_ONMESSAGE')  
      commit('SOCKET_ONERROR')    
    },
    SOCKET_DISCONNECT({commit}) {
      commit('SOCKET_DISCONNECT')
    },
    SOCKET_SEND({commit}, msg) {
      commit('SOCKET_SEND', msg)
    },
    // Fetch data from Endpoint http://localhost:8088/api/clips/game-state
    async fetchGameState({commit, state}) {
      try {
        const response = await get('/game-state');
        const data = await response.data;
        // Check if cyan teamname ist set in Api and set the store name so
        // On refresh it directly applies it, toggles the formbutton and gets
        // back to current state of the game 
        const teamname = data[0].teams[0]
        if(state.nameTeamCyan !== teamname && teamname !== ''){
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
        });
      } catch (error) {
        console.log(error);
      }
    },
    // Fetch data from Endpoint http://localhost:8088/api/clips/points
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
      const msg = {
        "command" : "set_gamephase",
        "phase" : ''
      }
      if(state.nameTeamCyan || state.nameTeamMagenta){
        if (state.phase === 'Pre_game') {
          msg.phase = 'SETUP'
          commit('SOCKET_SEND', msg)
          commit('nextPhase', 'Setup')
        } else if(state.phase === 'Setup') {
          msg.phase = 'EXPLORATION'
          commit('SOCKET_SEND', msg)
          commit('nextPhase', 'Exploration');
        } else if(state.phase === 'Exploration') {
          msg.phase = 'PRODUCTION'
          commit('SOCKET_SEND', msg)
          commit('nextPhase', 'Production');
        } else if(state.phase === 'Production') {
          msg.phase = 'POST_GAME'
          commit('SOCKET_SEND', msg)
          commit('nextPhase', 'Post_game');
        }
      }else {
        alert('First Set Team Name!');
      }
  },

    setPreviousPhase({commit, state}) {
      const msg = {
        "command" : "set_gamephase",
        "phase" : ''
      }
      if (state.phase === 'Post_game') {
        msg.phase = 'PRODUCTION'
        commit('SOCKET_SEND', msg)
        commit('previousPhase', 'Production');
      } else if(state.phase === 'Production') {
        msg.phase = 'EXPLORATION'
        commit('SOCKET_SEND', msg)
        commit('previousPhase', 'Exploration');
      } else if(state.phase === 'Exploration') {
        msg.phase = 'SETUP'
        commit('SOCKET_SEND', msg)
        commit('previousPhase', 'Setup');
      } else if(state.phase === 'Setup') {
        msg.phase = 'PRE_GAME'
        commit('SOCKET_SEND', msg)
        commit('previousPhase', 'Pre_game');
    }
  },
    setGameState({commit}, gamestate) {
      const msg = {
        "command" : "set_gamestate",
        "state" : `${gamestate}`
      }
      commit('SOCKET_SEND', msg)
      commit('setGamestate', gamestate)
    }
  },
  
  mutations: {
    setSocketUrl(state) {
      state.socket = new WebSocket(state.websocketURL)
    },
    SOCKET_ONOPEN(state) {
      state.socket.onopen = (e) => {
        console.log("Connection established", e);
        state.isConnected = true;
      }
    },
    SOCKET_ONCLOSE(state){
      state.socket.onclose = (e) => {
        console.log("Connection debunked", e);
      }
    },
    SOCKET_ONMESSAGE(state) {
      state.socket.onmessage = (e) => { 
        let msgObj = JSON.parse(e.data);
        if (msgObj !== [] && msgObj.level !== 'clips' ) {
          console.log(e);
          this.commit('SOCKET_ADDMESSAGE', msgObj);
        }
      }
    },
    SOCKET_DISCONNECT(state) {
      state.socket.close()
      state.isConnected = false
    },
    SOCKET_SEND(state, msg) {
      state.socket.send(JSON.stringify(msg))
    },
    SOCKET_ADDMESSAGE(state, msg){
      state.websocketMsgs.push(msg)
    },
    SOCKET_ONERROR(state) {
      state.socket.onerror = (e) => { 
        console.log(e);
        alert('Couldnt connect to Websocket!')
      }
    },
    setCyanName(state, value) {
        state.nameTeamCyan = value
    },
    setMagentaName(state, name) {
        state.nameTeamMagenta = name
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
      state.gametime = gametime;
    },
    setAwardedPoints(state, pointsArray) {
      state.awardedPoints = pointsArray;
    },
    setGamestate(state, gamestate) {
      state.gamestate = gamestate
    }
  }
})