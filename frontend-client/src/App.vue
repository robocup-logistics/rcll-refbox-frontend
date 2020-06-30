<template>
  <div id="app" >
    <div class="container-fluid"  >
      <Header />
      <Body />
      <Footer />
    </div>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Body from './components/Body.vue'
import Footer from './components/Footer.vue'
import { mapActions, mapState } from 'vuex';

export default {
  name: 'App',
  components: {
    Header,
    Body,
    Footer
  },
  computed: {
    ...mapState(['showPhaseSubmenus']),
    phaseSubmenus () {
      return this.$store.getters.getPhaseSubmenusStatus
    }
  },
  watch: {
    phaseSubmenus(){
      if (this.$store.getters.getPhaseSubmenusStatus === true) {
        this.$el.addEventListener('click', this.closeSubmenusForPhases)
        console.log('yes');
        
      } else {
        this.$el.removeEventListener('click', this.closeSubmenusForPhases)
      }
    }
  },
  methods: {
    ...mapActions(['closePhaseSubmenus']),
    closeSubmenusForPhases(e) {
      // check if anything other than the phase is clicked and close the submenu 
      if (!(e.target.classList.contains('current-phase-anchor')) ) {
        this.closePhaseSubmenus()
      }
    }
  }
}
</script>

<style>
#app {
  /* Css Primary color Variables */
  --main-cyan-color: #0FF;
  --main-magenta-color: #F0F;
  
  font-family:   'DejaVu Sans Mono', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
