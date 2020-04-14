import { get } from '@/api/api'

export default{
  state: {
    robotsCyan: [],
    robotsMagenta: []
  },
  getters: {

  },
  mutations: {
    setCyanRobots(state, data) {
      state.robotsCyan = data;
    }
  },
  actions: {
    // Fetch data from Endpoint http://localhost:8088/api/clips/robots
    async fetchCyanRobots({commit, rootState}) {
      try {
        const response = await get('/robots', {team:rootState.nameTeamCyan});
        const data = response.data;
        commit('setCyanRobots', data);
      } catch(error) {
        console.log(error);
      }
    }
  }
}