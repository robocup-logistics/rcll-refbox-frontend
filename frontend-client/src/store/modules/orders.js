import { get } from '@/api/api'

export default{
  state: {
    allOrders: [],
    products: [],
    populated: false,
    ordersFlag: false
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
    },
    setOrdersArray(state, payload) {
      state.allOrders = payload
      console.log(payload);
      state.ordersFlag = true
    }
  },

  actions: {
    SetOrdersAtReconnect({commit, dispatch, state}, payload) {
      if(!state.ordersFlag) {
        commit("setOrdersArray", payload)
        dispatch("isProductsPopulated")
      }
    },
    isProductsPopulated({commit,state, dispatch}) {
      if (state.allOrders && !state.populated) {
        // Calls populateProductsArray function 
        dispatch(`populateProductsArray`, state.allOrders)
        // commits a mutation set state's populated
        commit('togglePopulated')
      }
    },
    // eslint-disable-next-line no-unused-vars
    // Fetches data from Endpoint http://localhost:8088/api/clips/orders,
    // And populates the order's corresponding svg's path
    async fetchAllOrders() {      
      try{
        // Fetch all orders from api
        const response = await get('/orders')
        const data = response.data 
        console.log(data, "asdasd");
           
        // // Populate products svg's with their url
        // if (state.allOrders && !state.populated) {
        //   // Calls populateProductsArray function 
        //   dispatch(`populateProductsArray`, state.allOrders)
        //   // commits a mutation set state's populated
        //   commit('togglePopulated')
        // }
        // Commits mutation to change allOrders array
        // commit('setAllOrders', data);
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
        let baseColor = order['base_color'].split('_')[1].toLowerCase();
        // Grey in fetched data / Gray in name of SVGs
        if (baseColor === 'grey') {
          baseColor = 'gray'
        }
        let capColor = order['cap_color'].split('_')[1].toLowerCase();
        if (capColor === 'grey') {
          capColor = 'gray'
        }
        let ringColors = '';
        if(order['ring_colors'] !== [ ]){
          order['ring_colors'].forEach(color => {
            ringColors += color.split('_')[1].toLowerCase() + '-';
          });
        }
        product.id = order.id;
        // Format: 'c0_black_blue-orange_gray.svg'
        product['product-img-url'] = `${complexity}_${baseColor}_${ringColors.substring(0,ringColors.length-1)}_${capColor}.svg`;
        console.log(product);
        
        products.push(product);    
        product = {}    
      });
      commit('setProducts', products);
    },

  }
}