import Vue from 'vue'
import App from './App.vue'


// Bootstrap imports
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

// Import Vuex Store to have global access in every Component
import store from '@/store/index'

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
