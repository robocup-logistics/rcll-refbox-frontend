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
    setRingSpecs(state,data){
      state.ringspecs = data
    },
    addMachinesCyan(state, payloadWithIndex) {
      // state.machinesCyan
      if (payloadWithIndex.index === -1) {
        state.machinesCyan.push(payloadWithIndex.payload)
      } else {
        state.machinesCyan.splice(payloadWithIndex.index, 1, payloadWithIndex.payload)
      }
      
    }
  },
  
  actions: {
    SetCyanMachinesInfo({commit, state, dispatch}, payload) {
      if (state.machinesCyan.length < 7) {
        // check if there is already that machine in the 
        // array so it doesn"t dupliocate it
        const index = state.machinesCyan.findIndex(machine => machine.name === payload.name)
        if (index === -1) {
          commit("addMachinesCyan", {payload, index})
          dispatch("sortAlpabetically", state.machinesCyan)
        }
      } else {
        const index = state.machinesCyan.findIndex(machine => machine.name === payload.name)
        if (index !== -1) {
          commit("addMachinesCyan", {payload, index})
        }
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