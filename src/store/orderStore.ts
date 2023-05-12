import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'

export const useOrderStore = defineStore('orderStore', () => {
  
  const allOrders: Ref<any[]> = ref([])
  const products: Ref<any[]> = ref([])
  const populated: Ref<boolean> = ref(false)
  const ordersFlag: Ref<boolean> = ref(false)
  const orderCount: Ref<number> = ref(9)

  // orders for index
  const ordersForIndex = computed(() => {
    return (index) => {
      return allOrders.value[index]
    }
  })

  // set products
  function setProducts(newProducts) {
    products.value = newProducts
  }

  // toggle Populated
  function togglePopulated() {
    populated.value = true
  }

  // set orders array
  function setOrdersArray(payload) {

    allOrders.value = payload
    ordersFlag.value = true
  }

  // add order
  function addOrder({payload, index}) {

    if (payload.index === -1) {
      allOrders.value.push(payload)
    } else {
      allOrders.value.splice(index, 1, payload)
    }
  }

  // set orders at reconnect
  function setOrdersAtReconnect(payload) {

    setOrdersArray(payload)
    populateProducts()
  }

  // set order infos
  function setOrderInfos(payload) {

    if (allOrders.value.length < orderCount.value) {

      // check if there is already that order in the array so it doesn"t duplicate it
      const index = allOrders.value.findIndex(order => order.id === payload.id)
      if (index === -1) { 
        addOrder({payload, index})
      }

    } else {

      const index = allOrders.value.findIndex(order => order.id === payload.id)
      if (index !== -1) {
        addOrder({payload, index})
      }

    }
    if (allOrders.value.length === orderCount.value) {

      sortById(allOrders.value)
      populateProducts()
    }
  }

  // set order count
  function setOrderCount(orderCount){
    console.log(orderCount);
    setOrderCount(orderCount)
  }

  // populate products
  function populateProducts() {

    if (allOrders.value && !populated.value) {
      populateProductsArray(allOrders.value)
      togglePopulated()
    }
  }

  /*
    Populates the products array with the svg url
    to the corresponding order to match the name of the svg in assets.
    Format: products[{
      "id": order.id
      "product-img-url": 'c0_black_blue-orange_gray.svg' (name of the svg)
    },]
  */  
  function populateProductsArray(orders){

    // iterate through all orders
    const newProducts = []
    let newProduct = {}

    orders.forEach(order => {
      const complexity = order.complexity.toLowerCase()
      // fetched Information Format: base-color: "BASE_RED"
      // split the string to extract: 'red, grey...'
      let baseColor = order['base_color'].split('_')[1].toLowerCase()
      // grey in fetched data / Gray in name of SVGs
      if (baseColor === 'grey') {
        baseColor = 'gray'
      }
      let capColor = order['cap_color'].split('_')[1].toLowerCase()
      if (capColor === 'grey') {
        capColor = 'gray'
      }
      let ringColors = '';
      if(order['ring_colors'] !== [ ]){
        order['ring_colors'].forEach(color => {
          ringColors += color.split('_')[1].toLowerCase() + '-'
        });
      }
      newProduct['id'] = order.id;
      // format: 'c0_black_blue-orange_gray.svg'
      newProduct['product-img-url'] = `${complexity}_${baseColor}_${ringColors.substring(0,ringColors.length-1)}_${capColor}.svg`
      
      newProducts.push(newProduct)
      newProduct = {}    
    })
    setProducts(products)
  }

  // sort by id
  function sortById(payload){
    payload.sort((order1, order2) => {
      let id = order1.id
      let id2 = order2.id
      if (id < id2) {
        return -1
      } 
      if (id > id2) {
        return 1
      }
      // names must be equal
      return 0
    })
  }

  return {allOrders, products, populated, ordersFlag, orderCount, ordersForIndex, setProducts, togglePopulated, setOrdersArray, addOrder, setOrdersAtReconnect, setOrderInfos, setOrderCount, populateProducts, populateProductsArray, sortById}
  
})