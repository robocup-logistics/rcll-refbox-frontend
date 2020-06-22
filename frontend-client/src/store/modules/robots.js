export default{
  state: {
    robotsCyan: [],
    robotsMagenta: [],
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
  },
  actions: {
    SetRobotInformation({commit,state, dispatch}, payload) {
      if (payload['team_color'] === 'CYAN') {
        if(state.robotsCyan.length < 3) {
          // populate and make sure that there arent any duplicates
          const index = state.robotsCyan.findIndex(robot => robot.name === payload.name)
          if (index === -1) {
            commit("setCyanRobots", {payload, index})
            dispatch("sortAlpabetically", state.robotsCyan)
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