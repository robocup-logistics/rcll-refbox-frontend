// eslint-disable-next-line no-unused-vars
import { get, post } from '@/api/api'

export default{
  state: {
    machinesCyan: [],
    machinesMagenta: []
  },
  getters: {

  },
  mutations: {
    setMachinesCyan(state,data) {
      state.machinesCyan = data;
    }
  },
  actions: {
    // eslint-disable-next-line no-unused-vars
    // Get params: 1: url, 2:params, 3:timeout, 4:data
    async fetchMachinesCyan({commit}) {
      try {
        const response = await get('/machines', {team:'CYAN'});
        let data = response.data;
        // Sort machines alphabetically
        data = data.sort((machineA, machineB) => {
          let nameA = machineA.name
          let nameB = machineB.name
          if (nameA < nameB) {
            return -1;
          } 
          if (nameA > nameB) {
            return 1;
          }
          // names must be equal
          return 0;
        })
        commit('setMachinesCyan', data);
      } catch(error){
        console.log(error);
      }
    }
  }
   
}