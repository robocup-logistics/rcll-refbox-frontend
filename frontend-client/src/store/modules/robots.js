export default{
  state: {
    robotsCyan: [],
    robotsMagenta: [],
  },
  getters: {

  },
  mutations: {
    setCyanRobots(state, payload) {      
     if(state.robotsCyan.length < 3) {
        // populate and make sure that there arent any duplicates
        if (!(state.robotsCyan.filter(robot => robot.name  === payload.name).length > 0)) {
          state.robotsCyan.splice(payload.number-1, 0, payload)
        }
      } else {
        // Replace the information of the corresponding robot object in the  
        // array with the payload coming from the websocket
        state.robotsCyan.forEach(robot => {
          if (robot.name === payload.name) {
            state.robotsCyan.splice(payload.number-1, 1, payload)
          } 
        });

      }
    },
  },
  actions: {
    // Fetch payload from Endpoint http://localhost:8088/api/clips/robots
    SetRobotInformation({commit},payload) {
      if (payload['team_color'] === 'CYAN') {
        console.log(payload, "drinen");
        commit('setCyanRobots', payload)
      }else {
        console.log('magenta');
        
      }
    }
  }
}