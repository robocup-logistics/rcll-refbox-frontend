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
    // Fetches data from Endpoint http://localhost:8088/api/clips/orders,
    // And populates the order's corresponding svg's path
    async fetchAllOrders({commit,state, dispatch}) {      
      try{
        // Fetch all orders from api
        const response = await get('/orders')
        const data = response.data    
        // Populate products svg's with their url
        if (data && !state.populated) {
          // Calls populateProductsArray function 
          dispatch(`populateProductsArray`, data)
          // commits a mutation set state's populated
          commit('togglePopulated')
        }
        // Commits mutation to change allOrders array
        commit('setAllOrders', data);
      } catch (error) {
        console.log(error);
      }
    },
    /*
    Populates the products array with the svg url
    to the corresponding order to match the name of the svg in assets.
    Format: products[{
      "id": order.id
      "product-img-url": 'c0_black_blue-orange_gray.svg' (name of the svg)
    },]
    */  
    populateProductsArray({commit}, orders){
      // Iterate through all orders
      const products = [];
      let product = {};
      orders.forEach(order => {
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
        // Format: 'c0_black_blue-orange_gray.svg'
        product['product-img-url'] = `${complexity}_${baseColor}_${ringColors.substring(0,ringColors.length-1)}_${capColor}.svg`;
        products.push(product);    
        product = {}    
      });
      commit('setProducts', products);
    },

  }
}