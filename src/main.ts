import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faArrowDown,
  faArrowRight,
  faCheck,
  faChevronLeft,
  faChevronRight,
  faCircle,
  faClock,
  faCoins,
  faExclamationTriangle,
  faEye,
  faFlagCheckered,
  faFolderOpen,
  faGlobe,
  faHourglass,
  faInfoCircle,
  faLink,
  faPlay,
  faPlus,
  faPaperPlane,
  faPause,
  faPauseCircle,
  faPlayCircle,
  faQuestion,
  faRandom,
  faRobot,
  faUnlink,
  faScrewdriverWrench,
  faSpinner,
  faTrophy,
  faTruck,
  faUserTie,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import * as vueshortkey from 'vue3-shortkey'

// use fontawesome icons
library.add(
  faArrowDown,
  faArrowRight,
  faCheck,
  faChevronLeft,
  faChevronRight,
  faCircle,
  faClock,
  faCoins,
  faExclamationTriangle,
  faEye,
  faFlagCheckered,
  faFolderOpen,
  faGlobe,
  faHourglass,
  faInfoCircle,
  faLink,
  faPlay,
  faPlus,
  faPaperPlane,
  faPause,
  faPauseCircle,
  faPlayCircle,
  faQuestion,
  faRandom,
  faRobot,
  faUnlink,
  faScrewdriverWrench,
  faSpinner,
  faTrophy,
  faTruck,
  faUserTie,
  faXmark
)

// create the app
const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia())
app.use(vueshortkey)
app.mount('#app')
