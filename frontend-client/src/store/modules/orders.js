import { get } from '@/api/api'

export default{
  state: {
    allOrders: [],
    products: [],
    populated: false,
  },

  getters: {

  },

  mutations: {
    setAllOrders(state, data) {
      state.allOrders = data;
    },
    setProducts(state, products) {
      state.products = products;
    },
    togglePopulated(state) {
      state.populated = true;
    }
  },

  actions: {
    // eslint-disable-next-line no-unused-vars
    async fetchAllOrders({commit,state, dispatch}) {      
      try{
        // Fetch all orders from api
        const response = await get('/orders')
        const data = response.data    
        if (data && !state.populated) {
          console.log('IN TRY');
          dispatch(`populateProductsArray`, data)
          commit('togglePopulated')
        }
        // Commit mutations to change allOrders array
        commit('setAllOrders', data);
      } catch (error) {
        console.log(error);
      }
    },

    populateProductsArray({commit}, orders){
      // Iterate through all orders
      const products = [];
      let product = {};
      orders.forEach(order => {
        console.log('we in there!');
        console.log(order.id);
        
        const complexity = order.complexity.toLowerCase();
        // Fetched Information Format: base-color: "BASE_RED"
        // Split the string to extract: 'red, grey...'
        let baseColor = order['base-color'].split('_')[1].toLowerCase();
        // Grey in fetched data / Gray in name of SVGs
        if (baseColor === 'grey') {
          baseColor = 'gray'
        }
        let capColor = order['cap-color'].split('_')[1].toLowerCase();
        if (capColor === 'grey') {
          capColor = 'gray'
        }
        let ringColors = '';
        if(order['ring-colors'] !== [ ]){
          order['ring-colors'].forEach(color => {
            ringColors += color.split('_')[1].toLowerCase() + '-';
          });
        }
        product.id = order.id;
        product['product-img-url'] = `${complexity}_${baseColor}_${ringColors.substring(0,ringColors.length-1)}_${capColor}.svg`;
        console.log(product['product-img-url']);
        
        products.push(product);    
        product = {}    
      });

      commit('setProducts', products);
    },

  }
}