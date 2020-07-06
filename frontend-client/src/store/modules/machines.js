// eslint-disable-next-line no-unused-vars
export default{
  state: {
    machinesCyan: [],
    machinesMagenta: [],
    ringspecs: [],
    cyanMachinesFlag: false,
    machinesRingspecsFlag: false,
  },

  getters: {
  },

  mutations: {
    addMachinesCyan(state, payloadWithIndex) {
      // state.machinesCyan
      if (payloadWithIndex.index === -1) {
        state.machinesCyan.push(payloadWithIndex.payload)
      } else {
        state.machinesCyan.splice(payloadWithIndex.index, 1, payloadWithIndex.payload)
      }
    },
    setCyanMachines(state, payload) {
      state.machinesCyan = payload
      state.cyanMachinesFlag = true
    },
    addringspecs(state, payload) {
      if (payload.index === -1) {
        state.ringspecs.push(payload.payload)
      } else {
        state.ringspecs.splice(payload.index, 1, payload.payload)
      }
    },
    setMachinesRingspecs(state, payload) {
      state.ringspecs = payload
    }
  },
  
  actions: {
    SetCyanMachinesInfo({commit, state, dispatch}, payload) {
      // If there wasn't information at connect populate in setup
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

    SetCyanMachinesInfoAtReconnect({commit, dispatch, state}, payload) {
      if (!state.cyanMachinesFlag) {
        commit("setCyanMachines", payload)
        dispatch("sortAlpabetically", state.machinesCyan)
      }
    },

    SetRingspecs({commit}, payload) {
      commit("setMachinesRingspecs", payload)
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