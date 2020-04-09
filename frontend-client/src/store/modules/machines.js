// eslint-disable-next-line no-unused-vars
import { get, post } from '@/api/api'

export default{
  state: {
    machinesCyan: [],
    machinesMagenta: [],
    ringspecs: []
  },

  getters: {
  },

  mutations: {
    setMachinesCyan(state,data) {
      state.machinesCyan = data;
    },
    setRingSpecs(state,data){
      state.ringspecs = data
    }
  },
  
  actions: {
    // eslint-disable-next-line no-unused-vars
    // Get params: 1: url, 2:params, 3:timeout, 4:data

    // Function that fetches data from Endpoint http://localhost:8088/api/clips/machines
    async fetchMachinesCyan({commit}) {
      try {
        const response = await get('/machines', {team:'CYAN'});
        let data = response.data;
        // Sort machines alphabetically
        data = data.sort((machineA, machineB) => {
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
        commit('setMachinesCyan', data);
      } catch(error){
        console.log(error);
      }
    },
    // Function that fetches data from Endpoint http://localhost:8088/api/clips/ring-spec
    async fetchRingSpec({commit}) {
      try {
        const response = await get('/ring-spec');
        const data = response.data;
        commit('setRingSpecs', data);
      } catch (error) {
        console.log(error);
      }
    }
  }
   
}