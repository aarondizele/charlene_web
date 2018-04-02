import Vue from 'vue'
import App from './App'
require('babel-polyfill')
import router from './router'
import store from './store'
import VueFire from 'vuefire'
import firebase from 'firebase/app'
import 'firebase/firestore'

// Shared Components
import Snackbar from '@/components/statics/Snackbar'
import Loading from '@/components/statics/Loading'
import EventCard from '@/components/home/EventCard'
import NoteCard from '@/components/home/NoteCard'
import PhotoCard from '@/components/home/PhotoCard'
import VideoCard from '@/components/home/VideoCard'

// Vue Components
Vue.component('Snackbar', Snackbar)
Vue.component('Loading', Loading)
Vue.component('EventCard', EventCard)
Vue.component('NoteCard', NoteCard)
Vue.component('PhotoCard', PhotoCard)
Vue.component('VideoCard', VideoCard)

// 
import VideoPlayer from '@/components/VideoPlayer'
Vue.component('video-player', VideoPlayer)

// Filters
import Float from './filters/float'
import DateFilter from './filters/date'

Vue.filter('float', Float)
Vue.filter('date', DateFilter)
// Lodash
import * as _ from 'lodash'
window._ = _

Vue.use(VueFire)
Vue.config.productionTip = true

firebase.initializeApp({
  apiKey: "AIzaSyBS2l4USr9o21IkBSGJt72RHHwrZsFnspg",
  authDomain: "charlene-musanji.firebaseapp.com",
  databaseURL: "https://charlene-musanji.firebaseio.com",
  projectId: "charlene-musanji",
  storageBucket: "charlene-musanji.appspot.com",
  messagingSenderId: "487813014070"
})

export const db = firebase.firestore()
db.enablePersistence()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  store,
  created () {
    // Auth State
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('autoSignIn', user)
        this.$store.dispatch('fetchUserData')
      }
    })
    // Other Data
    this.$store.dispatch('loadPosts')
    this.$store.dispatch('getAdminData')
  }
})
