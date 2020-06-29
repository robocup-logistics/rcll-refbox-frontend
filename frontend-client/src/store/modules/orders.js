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
    setProducts(state, products) {
      state.products = products;      
    },
    togglePopulated(state) {
      state.populated = true;
    },
    setOrdersArray(state, payload) {
      state.allOrders = payload
      state.ordersFlag = true
    },
    addOrder(state, payload) {
      if (payload.index === -1) {
        state.allOrders.push(payload.payload)
      } else {
        state.allOrders.splice(payload.index, 1, payload.payload)
      }
    }
  },

  actions: {
    SetOrdersAtReconnect({commit, dispatch, state}, payload) {
      if(!state.ordersFlag) {
        commit("setOrdersArray", payload)
        dispatch("populateProducts")
      }
    },
    setOrderInfos({commit, dispatch, state}, payload) {
      if (state.allOrders.length < 9) {
        // check if there is already that order in the 
        // array so it doesn"t duplicate it
        const index = state.allOrders.findIndex(order => order.id === payload.id)
        if (index === -1) { 
          commit("addOrder", {payload, index})
        }
      } else {
        const index = state.allOrders.findIndex(order => order.id === payload.id)
        if (index !== -1) {
          console.log('commit addOrder');
          
          commit("addOrder", {payload, index})
        }
      }
      if (state.allOrders.length === 9) {
        dispatch("sortById", state.allOrders)

        dispatch("populateProducts")
      }
    },
    populateProducts({commit,state, dispatch}) {
      if (state.allOrders && !state.populated) {
        // Calls populateProductsArray function 
        dispatch(`populateProductsArray`, state.allOrders)
        // commits a mutation set state's populated
        commit('togglePopulated')
      }
    },
    sortById(context, payload){
      payload.sort((order1, order2) => {
        let id = order1.id
        let id2 = order2.id
        if (id < id2) {
          return -1;
        } 
        if (id > id2) {
          return 1;
        }
        // names must be equal
        return 0;
      })
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
        
        products.push(product);    
        product = {}    
      });
      commit('setProducts', products);
    },

  }
}