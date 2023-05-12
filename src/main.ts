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
app.mixin({
  methods: {
    formatSeconds(secondsArg: string): string{
      // 328 seconds => 5:28
      const minutes: number = Math.floor(parseInt(secondsArg) / 60)
      const seconds: number = parseInt(secondsArg) % 60
      let minutesString
      if(minutes < 10) {
        minutesString = `0${minutes}`
      } else {
        minutesString = `${minutes}`
      }
      let secondsString
      if(seconds < 10) {
        secondsString = `0${seconds}`;
      } else {
        secondsString = `${seconds}`;
      }
      const result: string = `${minutesString}:${secondsString}`;
      return result;
    }
  }
})
app.mount('#app')