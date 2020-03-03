// Main Store for Vuex
import Vuex from 'vuex'
import Vue from 'vue'

import machines from './modules/machines'
import orders from './modules/orders'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    machines,
    orders
  },
  state: {
    nameTeamCyan: '',
    showFormCyan: true,

    nameTeamMagenta: '',
    showFormMagenta: true
  },

  getters: {

  },

  actions: {
    setNameCyan({commit, state}) {
      commit('setCyanName', state.nameTeamCyan);
      commit('toggleShowFormCyan');
    },
    setNameMagenta({commit, state}) {
      commit('setMagentaName', state.nameTeamMagenta);
      commit('toggleShowFormMagenta');
    }
  },
  
  mutations: {
    setCyanName(state, value) {
      state.nameTeamCyan = value;
    },
    setMagentaName(state, name) {
      state.nameTeamMagenta = name;
    },
    toggleShowFormCyan(state) {
      state.showFormCyan = !state.showFormCyan;
    },
    toggleShowFormMagenta(state) {
      state.showFormMagenta = !state.showFormMagenta;
    }
  }
})