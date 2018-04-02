<template>
    <div class="container _top-90">
      <div class="row">
        <div class="col-sm-12 col-md-8 col-lg-6 offset-md-2 offset-lg-3">
          <div class="row justify-content-center mb-5">
            <div class="d-flex flex-row text-muted">
                <div class="_tab mx-3 pb-2 d-flex flex-row align-items-center pointer" :class="{active: signinTab, 'text-violet': signinTab}" @click="onSwitchTab('is-signin')">
                  <!-- <i class="material-icons mr-2" aria-label="true">person_outline</i> -->
                  Connexion              
                </div>             
                <div class="_tab mx-3 pb-2 d-flex flex-row align-items-center pointer" :class="{active: signupTab, 'text-violet': signupTab}" @click="onSwitchTab('is-signup')">
                  <!-- <i class="material-icons mr-2" aria-label="true">person_add</i> -->
                  Inscription              
                </div>                
              </div> 
          </div>
          <component :is="currentComponent"></component>
        </div>
      </div>
    </div>    
</template>

<script>
import Signin from './Signin'
import Signup from './Signup'

export default {
  data: () => ({
    currentComponent: 'Signin',
    signinTab: true,
    signupTab: false,
  }),
  methods: {
    onSwitchTab (value) {
      switch (value) {
        case 'is-signin':
          this.currentComponent = 'Signin'
          this.signinTab = true
          this.signupTab = false
          break;
        case 'is-signup':
          this.currentComponent = 'Signup'
          this.signupTab = true
          this.signinTab = false
          break;
        default:
          this.currentComponent = 'Signin'
          this.signinTab = true
          this.signupTab = false
          break;
      }
    }
  },
  components: {
    Signin,
    Signup
  }
}
</script>

<style scoped>
.active {
  border-bottom: 2px solid #650075!important
}
</style>