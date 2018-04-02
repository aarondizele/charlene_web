<template>
  <div id="app">
    <Header class="sticky-top"/>
    <main>
      <transition mode="out-in" name="slide" appear>
        <router-view></router-view>
      </transition>
    </main>
    <Footer />
  </div>
</template>

<script>
import firebase from 'firebase'
import { db } from './main'
import { mapGetters } from 'vuex'
import Header from '@/components/statics/Header'
import Footer from '@/components/statics/Footer'

export default {
  name: 'App',
  components: {
    Header,
    Footer
  }
}
</script>

<style>
html
{
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  color: #333333;
}
#app {
  min-height: 100vh !important;
  position: relative
}
.btn-violet {
  color: white;
  background: #650075 !important
}
.text-violet {
  color: #650075 !important
}
.font-size-15 {
  font-size: 15px !important
}
.font-size-14 {
  font-size: 14px !important
}
footer {
  position: absolute;
  bottom: 0 !important;
}
.card-img-top {
  border-top-left-radius: 8px !important;
  border-top-right-radius: 8px !important
}
._top-100 {
  padding-top: 10vh !important;
}
._top-90 {
  padding-top: 9vh !important;
}
._top-80 {
  padding-top: 8vh !important;
}
._top-70 {
  padding-top: 7vh !important;
}
._top-60 {
  padding-top: 6vh !important;
}
::-moz-placeholder, ::-webkit-input-placeholder, ::placeholder {
  font-weight: 300;
}
input {
  outline: none;
  font-weight: 300;
}
ul {
  margin-bottom: 0 !important;
}
hr {
  margin: 0 auto !important;
  width: 92% !important;
}
.card {
  overflow: hidden !important
}
.card-footer {
  background-color: white !important;
  border-top: 0 !important;
  padding: 10px 18px !important;
  border-bottom-left-radius: 8px !important;
  border-bottom-right-radius: 8px !important
}
.pointer {
  cursor: pointer;
}
main {
  padding-bottom: 60px !important;
}

/* Animation */
.slide-enter-active {
  animation: slide-in 150ms ease-out forwards;
}
.slide-leave-active {
  animation: slide-out 150ms ease-out forwards;
}
@keyframes slide-in {
  from {
    transform: translateY(-30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
@keyframes slide-out {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-30px);
    opacity: 0;
  }
}
</style>