export default{
  state: {
    robotsCyan: [],
    robotsMagenta: [],
    cyanRobotsFlag: false,
  },
  getters: {

  },
  mutations: {
    setCyanRobots(state, payload) {   
     if(payload.index === -1) {
        state.robotsCyan.push(payload.payload)
      } else {
        // Replace the information of the corresponding robot object in the  
        // array with the payload coming from the websocket
        state.robotsCyan.splice(payload.index, 1, payload.payload)
        console.log('update');
        
      }
    },
    setCyanRobotsAtReconnect(state, payload) {
      state.robotsCyan = payload
      state.cyanRobotsFlag = true
    }
  },
  actions: {
    SetRobotInformation({commit,state, dispatch}, payload) {
      if (payload['team_color'] === 'CYAN') {
        if(state.robotsCyan.length < 3) {
          console.log(payload, 'asdas');
          
          // populate and make sure that there arent any duplicates
          const index = state.robotsCyan.findIndex(robot => robot.name === payload.name)
          if (index === -1) {
            commit("setCyanRobots", {payload, index})
            dispatch("sortAlpabetically", state.robotsCyan)
          }
          if ((state.phase !== 'PRE_GAME' || state.phase !== 'SETUP') && index !== -1 ) {
            commit("setCyanRobots", {payload, index})
          }
        } else {
          const index = state.robotsCyan.findIndex(robot => robot.name === payload.name)
          if (index !== -1) {
            commit("setCyanRobots", {payload, index})
          }
        } 
      }else {
        console.log('magenta robot');
      }
    },
    SetCyanRobotsInfoAtReconnect({commit, state, dispatch}, payload) {
      if(!state.cyanRobotsFlag) {
        commit("setCyanRobotsAtReconnect", payload)
        dispatch("sortAlpabetically", state.robotsCyan)
      }
    },
    SetRobotMaintenanceStatus({commit}, payload) {
      const msg = {
        "command" : "set_robot_maintenance",
        "robot_number" : payload.robot.number,
        "team_color" : payload.robot['team_color'],
        "maintenance" : payload.bool
    }
    console.log(msg);
      commit('SOCKET_SEND', msg)
    },
    sortAlpabetically(context, payload) {
      payload.sort((machineA, machineB) => {
        let nameA = machineA.name;
        let nameB = machineB.name;
        if (nameA < nameB) {
          return -1;
        } 
        if (nameA > nameB) {
          return 1;
        }
        // names must be equal
        return 0;
      })
    },
  }
}