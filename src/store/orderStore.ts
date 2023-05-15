import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'

export const useOrderStore = defineStore('orderStore', () => {
  
  const allOrders: Ref<any[]> = ref([])
  const products: Ref<any[]> = ref([])
  const populated: Ref<boolean> = ref(false)
  const ordersFlag: Ref<boolean> = ref(false)
  const orderCount: Ref<number> = ref(9)

  // set orders array
  function setOrdersArray(payload): void {

    console.log("set orders array")
    console.log(payload)
    allOrders.value = payload
    ordersFlag.value = true
  }

  // add order
  function addOrder({payload, index}): void {

    if (payload.index === -1) {
      allOrders.value.push(payload)
    } else {
      allOrders.value.splice(index, 1, payload)
    }
  }

  // set orders at reconnect
  function setOrdersAtReconnect(payload): void {

    setOrdersArray(payload)
    populateProducts()
  }

  // set order infos
  function setOrderInfos(payload): void {

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

  // populate products
  function populateProducts(): void {

    if (allOrders.value && !populated.value) {
      populateProductsArray(allOrders.value)
      populated.value = true
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
  function populateProductsArray(orders): void {

    console.log("populating producst array")
    console.log(orders)

    // iterate through all orders
    const newProducts: {
      "id": number,
      "product-img-url": string
    }[] = []

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
      order['ring_colors'].forEach((color: string) => {
        ringColors += color.split('_')[1].toLowerCase() + '-'
      });

      const newProduct: {
        "id": number,
        "product-img-url": string
      } = {
        "id": order.id,
        "product-img-url": `${complexity}_${baseColor}_${ringColors.substring(0,ringColors.length-1)}_${capColor}.svg` // format: 'c0_black_blue-orange_gray.svg'
      }
      
      newProducts.push(newProduct) 
    })

    products.value = newProducts
  }

  // sort by id
  function sortById(orders): void {
    orders.sort((order1, order2) => {
      if (order1.id < order2.id) {
        return -1
      } 
      if (order1.id > order2.id) {
        return 1
      }
      // names must be equal
      return 0
    })
  }

  return {allOrders, products, populated, ordersFlag, orderCount, setOrdersArray, addOrder, setOrdersAtReconnect, setOrderInfos, populateProducts, populateProductsArray, sortById}
  
})