import Vue from 'vue'
import App from './App.vue'

// FontAwesome imports 
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlayCircle, faPauseCircle, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Bootswatch import
import "bootswatch/dist/darkly/bootstrap.min.css"; 


// Import Vuex Store to have global access in every Component
import store from '@/store/index'

// Used Fontawesome icons
library.add(faPauseCircle, faChevronLeft, faChevronRight, faPlayCircle)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false
Vue.mixin({
  methods: {
    formatSeconds: function formatSeconds(seconds){
    // 328 seconds => 5:28
    seconds = parseInt(seconds);
    let minutes = parseInt(seconds / 60);
    if(minutes < 10) {
      minutes = `0${minutes}`;
    }
    let _seconds = parseInt(seconds % 60);
    if(_seconds < 10) {
      _seconds = `0${_seconds}`;
    }
    const result = `${minutes}:${_seconds}`;
    return result;
    }
  }
})

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
