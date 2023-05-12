import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlayCircle, faPauseCircle, faChevronLeft, faArrowRight, faChevronRight, 
         faRobot,  faExclamationTriangle, faRandom, faGlobe, faLink, faUnlink 
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Bootswatch import
import "bootswatch/dist/darkly/bootstrap.min.css"; 

// used fontawesome icons
library.add(faPauseCircle, faChevronLeft, faChevronRight, faArrowRight, faPlayCircle, 
  faRobot, faExclamationTriangle, faRandom, faGlobe,faLink, faUnlink )

// create the app
const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia())
app.mount('#app')