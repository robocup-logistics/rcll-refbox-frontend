import { get } from '@/api/api'

export default{
  state: {
    allOrders: [],
  },
  getters: {

  },
  mutations: {
    setAllOrders(state, data) {
      state.allOrders = data;
    }
  },
  actions: {
    // eslint-disable-next-line no-unused-vars
    async fetchAllOrders({commit}) {
      try{
        // Fetch all orders from api
        const response = await get('/orders', {complexity: 'C0'});
        const data = response.data 
        // Commit mutations to change allOrders array
        commit('setAllOrders', data);
      } catch (error) {
        console.log(error);
      }
    }
  }
}