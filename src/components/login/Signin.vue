<template>
  <div>
    <!-- <div class="mb-2 p-3 d-flex flex-row align-items-center justify-content-between border" @click="onSigninWithFacebook">
      <div class="d-flex flex-row align-items-center">
        <div class="social-round social-facebook mr-3"><i class="fa fa-facebook-official text-primary" aria-label="true"></i></div> Se connecter avec Facebook
      </div>
      <button class="btn btn-primary btn-sm pointer d-none d-md-block">Se connecter</button>
    </div> -->
    <div class="mb-2 p-3 d-flex flex-row align-items-center justify-content-between border" @click="onSigninWithGoogle">
      <div class="d-flex flex-row align-items-center">
        <div class="social-round social-google mr-3"><i class="fa fa-google text-danger" aria-label="true"></i></div> Se connecter avec Google
      </div>
      <button class="btn btn-danger btn-sm pointer d-none d-md-block">Se connecter</button>
    </div>
    <div class="text-center my-3">ou</div>
    <form @submit.prevent="onSignin" novalidate>
      <div class="form-group mb-2">
        <input type="email" class="form-control" id="email" v-model.trim="email" placeholder="Email" required>
      </div>
      <div class="form-group mb-2">
        <input type="password" class="form-control" id="password" v-model.trim="password" placeholder="Mot de passe" required>
      </div>
      <!-- Alert -->
      <div class="alert alert-danger alert-dismissible fade show" role="alert" v-if="error">
        {{error}}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <!--  -->
      <button type="submit" class="btn btn-violet btn-block pointer mt-3 mb-5 mx-auto d-flex flex-row align-items-center justify-content-center" :disabled="!formIsValide || loading">
        <i class="fa fa-spinner fa-pulse fa-3x fa-fw"
            v-if="loading"
            style="font-size: 16px;"></i>
        <span v-if="!loading">Se connecter</span>
      </button>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    email: '',
    password: ''
  }),
  computed: {
    ...mapGetters(['user', 'loading', 'error']),
    formIsValide () {
      if (!this.emailAndPasswordCheck() && this.error) {
        return false
      }
      return true
    }
  },
  watch: {
    user (value) {
      if (value !== null && value !== undefined) {
        this.$router.push('/')
      }
    }
  },
  methods: {
    async onSignin () {
      try {
        if (!this.emailAndPasswordCheck()) return
        await this.$store.dispatch('loginWithEmail', {email: this.email, password: this.password})
        this.password = ''
        this.email = ''
      } catch (error) {
        this.errorCode(error)
        console.log(error)
      }
    },
    async onSigninWithFacebook () {
      try {
        await this.$store.dispatch('loginWithFacebook')
      } catch (error) {
        this.errorCode(error)
        console.log(error)        
      }
    },
    async onSigninWithGoogle () {
      try {
        await this.$store.dispatch('loginWithGoogle')
      } catch (error) {
        this.errorCode(error)
        console.log(error)
      }
    },
    errorCode (error) {
      let errorCode = ''
        switch (error.code) {
            case 'auth/weak-password':
                errorCode = 'Le mot de passe doit avoir au-moins 6 charactères.'
                break;
            case 'auth/email-already-in-use':
                errorCode = 'L\'adresse email existe déjà sur un autre compte.'
                break;
            case 'auth/invalid-email':
                errorCode = 'L\'adresse email n\'est pas valide.'
                break;
            case 'auth/network-request-failed':
                errorCode = 'Vérifiez votre connexion internet.'
            default:
                errorCode = error.code
        }
        this.$store.dispatch('setError', errorCode)
    },
    emailAndPasswordCheck () {
      if (this.email.length > 0 && this.password.length >= 6) {
        return true
      }
      return false
    }
  },
  mounted () {
    this.$store.dispatch('clearError')
  }
}
</script>

<style scoped>
.btn {
  border-radius: 20px !important
}
.border, .form-control {
  border-radius: 0 !important;
  border: 1px solid rgba(0,0,0,.048) !important
}
.fa {
  font-size: 18px !important;
}
.social-round {
  width: 50px;
  height: 50px;
  border-radius: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.social-facebook {
  border: 2px solid #007bff!important;
}
.social-google {
  border: 2px solid #dc3545!important;
}
</style>