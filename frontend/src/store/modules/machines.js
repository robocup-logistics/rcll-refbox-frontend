// eslint-disable-next-line no-unused-vars
import { get, post } from '@/api/api'

export default{
  state: {
    machines: []
  },
  getters: {

  },
  mutations: {

  },
  actions: {
    // eslint-disable-next-line no-unused-vars
    fetchAllMachines({commit}) {
      //commit('setMachines', api.get('/machines'));
      get('/machines', {team:'CYAN'}, 2000).then(res => console.log(res.data));
    }
  }
}