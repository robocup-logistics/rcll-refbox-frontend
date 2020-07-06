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
          // populate and make sure that there arent any duplicates
          const index = state.robotsCyan.findIndex(robot => robot.name === payload.name)
          if (index === -1) {
            commit("setCyanRobots", {payload, index})
            dispatch("sortByRobotsNumber", state.robotsCyan)
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
        dispatch("sortByRobotsNumber", state.robotsCyan)
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
    sortByRobotsNumber(context, payload) {
      payload.sort((robot1, robot2) => {
        let number1 = robot1.number;
        let number2 = robot2.number;
        if (number1 < number2) {
          return -1;
        } 
        if (number1 > number2) {
          return 1;
        }
        // names must be equal
        return 0;
      })
    },
  }
}