<template>
  <nav class="navbar navbar-expand-md">
    <router-link to="/" tag="div" class="navbar-brand pointer">
     <img src="../../assets/logo.png" alt="" width="30px">
    </router-link>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <i class="fa fa-navicon text-white" aria-label="true"></i>
    </button>
    <!--  -->
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav d-flex flex-row align-items-center justify-content-center ml-auto">
        <router-link to="/create" tag="li" class="nav-item" activeClass="active" v-if="userIsAdmin">
          <a class="nav-link font-weight-light"><strong>Publier</strong></a>
        </router-link>

        <router-link to="/account" tag="li" class="nav-item ml-3" activeClass="active" v-if="userIsAuthenticated">
          <a class="nav-link font-weight-light"><strong>Compte</strong></a>
        </router-link>

        <router-link to="/settings" tag="li" class="nav-item ml-3" activeClass="active" v-if="userIsAdmin">
          <a class="nav-link font-weight-light"><strong>Paramètre</strong></a>
        </router-link>

        <router-link to="/login" tag="li" class="nav-item ml-3" activeClass="active" v-if="!userIsAuthenticated">
          <a class="font-weight-light btn btn-light font-size-15 text-dark"><strong>Connexion</strong></a>
        </router-link>

        <li class="nav-item pointer ml-3" @click="onDisconnect" activeClass="active" v-if="userIsAuthenticated" >
          <a class="font-weight-light btn btn-light font-size-15 text-dark"><strong>Déconnexion</strong></a>
        </li>

      </ul>
    </div>
  </nav>   
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    userIsAdmin: false
  }),
  watch: {
    user (value) {
      if (value !== null && value !== undefined) {
        if (value.admin === true) {
          this.userIsAdmin = true
        } else {
          this.userIsAdmin = false
        }
      } else {
        this.userIsAdmin = false
      }
    }
  },
  computed: {
    ...mapGetters(['user']),
    userIsAuthenticated () {
      return this.user !== null && this.user !== undefined
    },
    // userIsAdmin () {
    //   if (this.user !== null && this.user !== undefined) {
    //     if (this.isAdmin) {
    //       return true
    //     }
    //   }
    //   return false
    // }
  },
  methods: {
    onScroll () {
      // if (this.isHomepage) {
      //   $(window).scroll(function() {
      //     let scrollPos = $(this).scrollTop()
      //     if (scrollPos > 60) {
      //       $('.navbar').addClass('scrollable')
      //       $('.navbar').addClass('navbar-light')
      //       $('.nav-link').addClass('text-dark')
      //     } else {
      //       $('.navbar').removeClass('scrollable')
      //       $('.navbar').removeClass('navbar-light')
      //       $('.nav-link').removeClass('text-dark')
      //     }
      //   })
      // } else {
      //   $('.navbar').removeClass('scrollable')
      //   $('.navbar').removeClass('navbar-light')
      //   $('.nav-link').removeClass('text-dark')
      // }
    },
    onDisconnect () {
      return this.$store.dispatch('logout')
    }
  },
  created () {
    // this.onScroll()
  }
}
</script>

<style scoped>
.navbar {
  background: rgba(0, 0, 0, .2) !important
}
.navbar, .nav-link {
  color: white;
  font-size: 15px !important
}
.nav-item {
  font-size: 15px !important
}
.btn-light {
  background: white !important;
  padding: 4px 12px !important;
  border-radius: 16px !important
}
/* .btn {
  box-shadow: rgba(0, 0, 0, 0.08) 0px 1px 3px, rgba(0, 0, 0, 0.12) 0px 2px 4px !important;
} */
/* .scrollable {
  background: white !important;
  border-bottom: 2px solid rgba(0, 0, 0, .048);
  transition: background .2s ease-in-out
} */
/* .ligne {
  border-bottom: 2px solid rgba(0, 0, 0, .048)
} */
</style>