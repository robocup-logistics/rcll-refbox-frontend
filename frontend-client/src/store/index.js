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
    phase: 'PRE_GAME',
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
    connectToWebsocket({commit, dispatch}) {
      commit('setSocketUrl')
      dispatch('SOCKET_ONOPEN')
      dispatch('SOCKET_ONCLOSE')
      dispatch('SOCKET_ONMESSAGE')  
      dispatch('SOCKET_ONERROR')    
    },
    SOCKET_DISCONNECT({commit}) {
      commit('SOCKET_DISCONNECT')
    },
    SOCKET_SEND({commit}, msg) {
      commit('SOCKET_SEND', msg)
    },
    SOCKET_ONOPEN({commit}) {
      commit("SOCKET_ONOPEN")
    },
    SOCKET_ONCLOSE({commit}){
      commit("SOCKET_ONCLOSE")
    },
    SOCKET_ONMESSAGE({commit, dispatch}) {
      const onMessage = (e) => { 
        let msgObj = JSON.parse(e.data);
        if (msgObj !== [] && msgObj.length !== 0 ) {
          // Messages for the Logger are Objects not an Array such as machine 
          // infos at connect
          if (msgObj.level !== 'clips' && !(Array.isArray(msgObj))) {
            console.log(e);
            commit('SOCKET_ADDMESSAGE', msgObj);
          } 
          else if (msgObj.type === "gamestate") {
            dispatch("SetGamestateInfomation", msgObj)
          } 
          else if(msgObj.type === 'robot-info') {
            dispatch("SetRobotInformation", msgObj)
          } 
          else if (msgObj.type === 'machine-info' && msgObj.team === 'CYAN') {
            console.log(msgObj);
            dispatch("SetCyanMachinesInfo",msgObj)  
            
          } 
          else if(msgObj.type === 'ring-spec'){
            dispatch('setRingSpecs', msgObj)
          }
          else if(msgObj.type === "order-info"){
            dispatch("setOrderInfos", msgObj)
          }
          // Websocket sends an array of objects with all of the information
          // Check if that"s the case
          else if(typeof msgObj[0] !== 'undefined'){
            if (msgObj[0].type === 'machine-info') {
              console.log(msgObj)
              const cyanMachines = msgObj.filter( machine => machine.team === 'CYAN')
              // const magentaMachines = msgObj.filter( machine => machine.team === 'MAGENTA')
              dispatch("SetCyanMachinesInfoAtReconnect", cyanMachines)  
            } else if(msgObj[0].type === 'robot-info') {
              const cyanRobots = msgObj.filter(robot => robot['team_color'] === "CYAN")
              // const magentaRobots = msgObj.filter(robot => robot['team_color'] === "Magenta")
              dispatch("SetCyanRobotsInfoAtReconnect", cyanRobots)              
            } else if(msgObj[0].type === 'ring-spec'){
              dispatch("SetRingspecsAtReconnect", msgObj)
            } else if(msgObj[0].type === 'order-info') {
              dispatch("SetOrdersAtReconnect", msgObj)
            } 
          } 
        }          
      }
      commit("SOCKET_ONMESSAGE", onMessage)
    },
    SOCKET_ONERROR({commit}) {
      const onError = (e) => { 
        console.log(e);
        alert('Couldnt connect to Websocket!')
      }
      commit("SOCKET_ONERROR",onError)
    },
    SetGamestateInfomation({commit,state}, payload) {
      if (state.gamestate !== payload.state) {
        commit("setGamestate", payload.state)
      }
      if (state.phase !== payload.phase) {
        commit("setCurrentPhase", payload.phase)
      }
      if (payload.cyan !== "") {
        if (state.nameTeamCyan !== payload.cyan) {
          commit('toggleShowFormCyan')
          commit("setCyanName", payload.cyan)
        }
      }
      if (payload.magenta !== "" ) {
        if (state.nameTeamMagenta !== payload.magenta) {
          commit('toggleShowFormMagenta')
          commit("setMagentaName", payload.magenta)
        }
      }
      if (state.scoreCyan !== payload['points_cyan']) {
        commit("setCurrentCyanScore", payload['points_cyan'])        
      }
      if (state.scoreMagenta !== payload['points_magenta']) {
        // commit("setCurrentMagentaScore", payload['points_magenta'])
      }
      commit("setGametime", payload['game_time'])
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
      const msg = {
        "command" : "set_gamephase",
        "phase" : ''
      }
      if(state.nameTeamCyan || state.nameTeamMagenta){
        if (state.phase === 'PRE_GAME') {
          msg.phase = 'SETUP'
          commit('SOCKET_SEND', msg)
          commit('nextPhase', 'SETUP')
        } else if(state.phase === 'SETUP') {
          msg.phase = 'EXPLORATION'
          commit('SOCKET_SEND', msg)
          commit('nextPhase', 'EXPLORATION');
        } else if(state.phase === 'EXPLORATION') {
          msg.phase = 'PRODUCTION'
          commit('SOCKET_SEND', msg)
          commit('nextPhase', 'PRODUCTION');
        } else if(state.phase === 'PRODUCTION') {
          msg.phase = 'POST_GAME'
          commit('SOCKET_SEND', msg)
          commit('nextPhase', 'POST_GAME');
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
      if (state.phase === 'POST_GAME') {
        msg.phase = 'PRODUCTION'
        commit('SOCKET_SEND', msg)
        commit('previousPhase', 'PRODUCTION');
      } else if(state.phase === 'PRODUCTION') {
        msg.phase = 'EXPLORATION'
        commit('SOCKET_SEND', msg)
        commit('previousPhase', 'EXPLORATION');
      } else if(state.phase === 'EXPLORATION') {
        msg.phase = 'SETUP'
        commit('SOCKET_SEND', msg)
        commit('previousPhase', 'SETUP');
      } else if(state.phase === 'SETUP') {
        msg.phase = 'PRE_GAME'
        commit('SOCKET_SEND', msg)
        commit('previousPhase', 'PRE_GAME');
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
    SOCKET_ONMESSAGE(state, onMessageFnc) {
      state.socket.onmessage = onMessageFnc
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
    SOCKET_ONERROR(state,onErrorFnc) {
      state.socket.onerror = onErrorFnc
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
      // phase = phase.charAt(0).toUpperCase() + phase.slice(1).toLowerCase();
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