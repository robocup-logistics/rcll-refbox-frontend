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
    // Gamestate
    phase: 'PRE_GAME',
    gametime: 0,
    awardedPoints: [],
    cyanAwardedPoints: [],
    magentaAwardedPoints:[],
    gamestate: 'WAIT_START',
    // Polling rate in components
    pollRate: 1500,
    // Websocket attributes
    socket: null,
    isConnected: false,
    websocketMsgs: [],
    error: '',
    websocketURL : 'ws://localhost:1234',
    pointsCyanFlag: false,
    showPhaseSubmenus: false,
    addIpAndPort: false,
    knownTeams: [],
    teamMenuTriggeredCyan: false,
    teamMenuTriggeredMagenta: false,
    reconnectTimerId: 0
  },

  getters: {
    getPhaseSubmenusStatus(state) {
      return state.showPhaseSubmenus
    },
    getTeamMenuCyanTriggerStatus(state){
      return state.teamMenuTriggeredCyan
    },
    getCyanTeamName(state){
      return state.nameTeamCyan
    }
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
      console.log(msg, 'blaber');
      commit('SOCKET_SEND', msg)
      
    },
    SOCKET_ONOPEN({commit, state}) {
      clearInterval(state.timerId);
      commit("SOCKET_ONOPEN")
    },
    SOCKET_ONCLOSE({state,commit, dispatch}){
      const onClose = (e) => { 
        console.log(e);
        if (e.code === 1006) {
          alert('There is no Connection!')
          state.isConnected = false
          dispatch('toggleAddIpAndPort')
        }
        state.socket.close();
        state.socket = null; // prevent memory leak
        state.reconnectTimerId = setInterval(() => {
                dispatch('connectToWebsocket');
            }, 5000);
      }
      commit("SOCKET_ONCLOSE", onClose)
    },
    SOCKET_ONMESSAGE({commit, dispatch}) {
      const onMessage = (e) => { 
        let msgObj = JSON.parse(e.data);
        
        if (msgObj !== [] && msgObj.length !== 0 ) {
          // Messages for the Logger are Objects not an Array such as machine 
          // infos at connect
          if(msgObj.level !== 'clips' && !(Array.isArray(msgObj))) {
            commit('SOCKET_ADDMESSAGE', msgObj)
          } 
          else if(msgObj.type === "gamestate") {
            dispatch("SetGamestateInfomation", msgObj)
          } 
          else if(msgObj.type === 'robot-info') {
            dispatch("SetRobotInformation", msgObj)
          } 
          else if(msgObj.type === 'machine-info' && msgObj.team === 'CYAN') {
            dispatch("SetCyanMachinesInfo",msgObj)  
          } 
          else if(msgObj.type === 'machine-info' && msgObj.team === 'MAGENTA') {
            dispatch("SetMagentaMachinesInfo",msgObj)  
          } 
          else if(msgObj.type === 'ring-spec'){
            dispatch('setRingSpecs', msgObj)
          }
          else if(msgObj.type === 'order-info'){
            console.log(msgObj, 'The new order!');
            
            dispatch("setOrderInfos", msgObj)
          } 
          else if(msgObj.type === 'points') {
            const cyanPoints = msgObj.filter(point => point.team === 'CYAN')
            const magentaPoints = msgObj.filter(point => point.team === 'Magenta')
            dispatch("SetPointsCyan", cyanPoints)
            dispatch("SetPointsMagenta", magentaPoints)
          }
          else if(msgObj.type === 'order-count') {
            dispatch('setOrderCount', msgObj.count)
          }
          // Websocket sends an array of objects with all of the information
          // Check if that"s the case
          else if(typeof msgObj[0] !== 'undefined'){
            if (msgObj[0].type === 'machine-info') {
              const cyanMachines = msgObj.filter( machine => machine.team === 'CYAN')
              const magentaMachines = msgObj.filter( machine => machine.team === 'MAGENTA')
              dispatch("SetCyanMachinesInfoAtReconnect", cyanMachines)
              dispatch("SetMagentaMachinesInfoAtReconnect", magentaMachines)  
            } else if(msgObj[0].type === 'robot-info') {
              const cyanRobots = msgObj.filter(robot => robot['team_color'] === "CYAN")
              const magentaRobots = msgObj.filter(robot => robot['team_color'] === "Magenta")
              dispatch("SetCyanRobotsInfoAtReconnect", cyanRobots)     
              dispatch("SetMagentaRobotsInfoAtReconnect",magentaRobots )         
            } else if(msgObj[0].type === 'ring-spec'){
              dispatch("SetRingspecs", msgObj)
            } else if(msgObj[0].type === 'order-info') {
              console.log(msgObj);
              dispatch("SetOrdersAtReconnect", msgObj)
            } else if(msgObj[0].type === 'points') {
              const cyanPoints = msgObj.filter(point => point.team === 'CYAN')
              const magentaPoints = msgObj.filter(point => point.team === 'MAGENTA')
              dispatch("SetPointsCyan", cyanPoints)
              dispatch("SetPointsMagenta", magentaPoints)

            }
            if(msgObj[0].type === 'known-teams') {
              dispatch('setKnownTeams', msgObj[0]["known_teams"])
            }  
          } 
        }          
      }
      commit("SOCKET_ONMESSAGE", onMessage)
    },
    SOCKET_ONERROR({commit}) {
      const onError = (e) => { 
        console.log(e);
        // alert('Couldnt connect to Websocket!')
        console.log("ON ERROR!");
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
        commit("setCurrentMagentaScore", payload['points_magenta'])
      }
      commit("setGametime", payload['game_time'])
    },
    
    SetPointsCyan({commit}, payload) {
        commit("setCyanPoints", payload)
    },
    SetPointsMagenta({commit}, payload) {
      commit("setMagentaPoints", payload)
    },


    setNameCyan({commit, state}) {
      commit('setCyanName', state.nameTeamCyan);
      commit('toggleShowFormCyan');
    },

    setNameMagenta({commit, state}) {
      commit('setMagentaName', state.nameTeamMagenta);
      commit('toggleShowFormMagenta');
    },
    setCurrentPhase({commit}, phase){
      const msg = {
        "command" : "set_gamephase",
        "phase" : `${phase}`
      }
      commit('SOCKET_SEND', msg)
      commit('setCurrentPhase', phase)
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
    },

    setKnownTeams({commit}, teams){
      commit('setKnownTeams', teams)
    },

    sendAddPointsTeam({commit}, msg){
      commit('SOCKET_SEND', msg)
    },
    randomizeField({commit}) {
      const msg = { "command" : "randomize_field"}
      commit('SOCKET_SEND', msg)
    },
    scrollToEndOfCyanPointsDiv(){
      let container = document.querySelector('.awarded-points-container-cyan');
     container.scrollTop =container.scrollHeight;
    },
    scrollToEndOfMagentaPointsDiv(){
      let container = document.querySelector('.awarded-points-container-magenta');
     container.scrollTop =container.scrollHeight;
    },
    scrollToBottomOfLog() {
      const refLog = document.querySelector('.bodyRefboxLogCmp');
      const msgs = document.querySelector('.msg-holder')
      refLog.scrollTop = refLog.scrollHeight - refLog.clientHeight;
      msgs.scrollTop = msgs.scrollHeight - msgs.clientHeight;
      
    },
    togglePhaseSubmenus({commit}){
      commit('togglePhaseSubmenus')
    },
    closePhaseSubmenus({commit}) {
      commit('closePhaseSubmenus')
    },
    toggleTeamMenuCyan({commit}){
      commit('toggleTeamMenuCyan')
    },
    closeTeamMenuCyan({commit}){
      commit('closeTeamMenuCyan')
    },
    openTeamMenuCyan({commit}) {
      commit('openTeamMenuCyan')
    },
    toggleTeamMenuMagenta({commit}){
      commit('toggleTeamMenuMagenta')
    },
    closeTeamMenuMagenta({commit}){
      commit('closeTeamMenuMagenta')
    },
    openTeamMenuMagenta({commit}) {
      commit('openTeamMenuMagenta')
    },
    setWebsocketURL({commit}, URL) {
      commit('setWebsocketURL', URL)
    },
    toggleAddIpAndPort({state}) {
      state.addIpAndPort = !state.addIpAndPort
    },
  },
  
  mutations: {
    setSocketUrl(state) {
      state.socket = new WebSocket(state.websocketURL)
      console.log(state.socket);
      
    },
    SOCKET_ONOPEN(state) {
      state.socket.onopen = (e) => {
        console.log("Connection established", e);
        state.isConnected = true;
      }
    },
    SOCKET_ONCLOSE(state, onClose){
      state.socket.onclose = onClose
    },
    SOCKET_ONMESSAGE(state, onMessageFnc) {
      state.socket.onmessage = onMessageFnc
    },
    SOCKET_DISCONNECT(state) {
      state.socket.close()
      console.log('Disconnect');
    },
    SOCKET_SEND(state, msg) {
      console.log('Sending', msg);
      
      state.socket.send(JSON.stringify(msg))
    },
    SOCKET_ADDMESSAGE(state, msg){
      state.websocketMsgs.push(msg)
      // this.dispatch("scrollToBottomOfLog")
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
      state.phase = phase;
    },
    setCurrentCyanScore(state, score) {
      state.scoreCyan = score;
    },
    setCurrentMagentaScore(state,score){
      state.scoreMagenta = score;
    },
    setGametime(state, gametime) {
      state.gametime = gametime;
    },
    setGamestate(state, gamestate) {
      state.gamestate = gamestate
    },
    setCyanPoints(state, payload){
      state.cyanAwardedPoints = payload
    },
    setMagentaPoints(state, payload){
      state.magentaAwardedPoints = payload
    },
    togglePhaseSubmenus(state) {
      state.showPhaseSubmenus = !state.showPhaseSubmenus
    },
    closePhaseSubmenus(state) {
      state.showPhaseSubmenus = false
    },
    setWebsocketURL(state, URL) {
      state.websocketURL = URL
    },
    setKnownTeams(state, teams) {
      state.knownTeams = teams
    },
    toggleTeamMenuCyan(state){
      state.teamMenuTriggeredCyan = !state.teamMenuTriggeredCyan
    },
    closeTeamMenuCyan(state) {
      state.teamMenuTriggeredCyan = false
    },
    openTeamMenuCyan(state){
      state.teamMenuTriggeredCyan = true
    },
    toggleTeamMenuMagenta(state){
      state.teamMenuTriggeredMagenta = !state.teamMenuTriggeredMagenta
    },
    closeTeamMenuMagenta(state) {
      state.teamMenuTriggeredMagenta = false
    },
    openTeamMenuMagenta(state){
      state.teamMenuTriggeredMagenta = true
    }
  }
})
