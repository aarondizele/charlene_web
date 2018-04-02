<template>
  <div>
    <div v-if="!userIsAuthenticated">
      <!-- <div class="mb-2 p-3 d-flex flex-row align-items-center justify-content-between border" @click="onSignupWithFacebook">
        <div class="d-flex flex-row align-items-center">
          <div class="social-round social-facebook mr-3"><i class="fa fa-facebook-official text-primary" aria-label="true"></i></div>S'inscrire avec Facebook</div>
        <button class="btn btn-primary btn-sm pointer d-none d-md-block">S'inscrire</button>
      </div> -->
      <div class="mb-2 p-3 d-flex flex-row align-items-center justify-content-between border" @click="onSignupWithGoogle">
        <div class="d-flex flex-row align-items-center">
          <div class="social-round social-google mr-3"><i class="fa fa-google text-danger" aria-label="true"></i></div>S'inscrire avec Google</div>
        <button class="btn btn-danger btn-sm pointer d-none d-md-block">S'inscrire</button>
      </div>
      <div class="text-center my-3">ou</div>
      <form @submit.prevent="onSignup" novalidate>
        <div class="form-group mb-2">
          <input type="email" class="form-control" id="email" v-model.trim="email" placeholder="Email" required>
        </div>
        <div class="form-group mb-2">
          <input type="password" class="form-control" id="password" v-model.trim="password" placeholder="Mot de passe" required>
        </div>
        <div class="form-group mb-2">
          <input type="password" class="form-control" id="confirmPassword" v-model.trim="confirmPassword" placeholder="Répéter le mot de passe" required>
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
          <span v-if="!loading">S'inscrire</span>
        </button>
      </form>
    </div>
    <!-- Set Profile -->
    <div v-if="userIsAuthenticated && !setProfileDone">
      <form @submit.prevent="updateUserData" novalidate>
        <input type="file"
          style="display: none;"
          name="fileInput"
          ref="fileInput"
          accept="image/*"
          @change="onFilePicked">

        <div class="mx-auto mb-2 pointer text-muted picker" @click="onPickFile" v-if="!imageURL">
          <i class="material-icons" aria-label="true" style="font-size: 42px !important">photo</i>
        </div>

        <div class="editImage photo mx-auto" v-if="imageURL">
          <img :src="imageURL" class="rounded-circle" alt="avatar" style="height: 60px; width: 60px">
          <span @click="removePhoto" class="pointer editable-click position-absolute">
            <i class="material-icons" aria-label="true" style="font-size: 28px !important;">delete</i>
          </span>
        </div>

        <div class="form-group my-2">
          <label for="username">Nom d'utilisateur</label>
          <input type="text" class="form-control" id="username" v-model.trim="username" placeholder="Nom d'utilisateur">
        </div>

        <button type="submit" class="btn btn-block btn-violet pointer mt-3 mb-5 mx-auto d-flex flex-row align-items-center justify-content-center" :disabled="loading">
          <i class="fa fa-spinner fa-pulse fa-3x fa-fw"
              v-if="loading"
              style="font-size: 16px;"></i>
          <span v-if="!loading">Enregistrer</span>
        </button>
      </form>
    </div>
    <!-- All Done -->
    <div v-if="setProfileDone">
      <div class="text-center mt-3">
        <div class="d-flex flex-row align-items-center font-weight-light mx-auto h3">
          <i class="material-icons text-dark mr-2" aria-label="true" style="font-size: 26px;">assignment_ind</i>
          Votre compte a été créé.
        </div>
        <router-link to="/" tag="button" class="my-4 btn btn-block justify-content-center btn-violet pointer mx-auto">Retour à l'accueil</router-link>
      </div>
    </div>
  </div>    
</template>

<script>
import firebase from 'firebase'
import { db } from '../../main'
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    userIsAuthenticated: false,
    setProfileDone: false,
    email: '',
    password: '',
    username: '',
    confirmPassword: '',
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
    imageURL: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'
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
        this.userIsAuthenticated = true;
        this.imageURL = this.user.avatar;
        this.username = this.user.username;
        this.$store.dispatch('clearError')
      }
    }
  },
  methods: {
    removePhoto () {
      this.imageURL.splice(0, 1)
    },
    onPickFile () {
      this.$refs.fileInput.click()
    },
    onFilePicked (e) {
      const files = e.target.files
      let filename = files[0].name

      if (filename.lastIndexOf('.') <= 0) {
        return this.error = 'Image invalide. Veuillez réessayez avec une autre image.'
      }
      const fileReader = new FileReader()
        fileReader.readAsDataURL(files[0])
        fileReader.addEventListener('load', () => {
          this.imageURL = fileReader.result
        })
        this.image = files[0]
    },
    async onSignup () {
      try {
        if (!this.emailAndPasswordCheck()) return

        await this.$store.dispatch('signupWithEmail', {email: this.email, password: this.password})

      } catch (error) {
        console.log(error)
        this.errorCode(error)
      }
    },
    async onSignupWithFacebook () {
      try {
        this.$store.dispatch('setLoading', true)
        const provider = new firebase.auth.FacebookAuthProvider();
        await firebase.auth().signInWithPopup(provider)
          .then(user => {
            const user$ = {
              id: user.uid,
              avatar: user.photoURL,
              email: user.email,
              username: user.displayName
            }
            this.$store.dispatch('setUser', user$)
            this.$store.dispatch('setLoading', false)
          })

      } catch (error) {
        this.$store.dispatch('setLoading', false)
        this.errorCode(error)
        console.log(error)        
      }
    },
    async onSignupWithGoogle () {
      try {
        this.$store.dispatch('setLoading', true)
        const provider = new firebase.auth.GoogleAuthProvider();
        await firebase.auth().signInWithPopup(provider)
          .then(user => {
            const user$ = {
              id: user.uid,
              avatar: user.photoURL,
              email: user.email,
              username: user.displayName
            }
            this.$store.dispatch('setUser', user$)
            this.$store.dispatch('setLoading', false)
          })
      } catch (error) {
        this.$store.dispatch('setLoading', false)
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
    async updateUserData () {
      try {
        const user = {
          username: this.username,
          image: this.image,
          email: this.user.email ? this.user.email : ''
        }
        await this.$store.dispatch('updateUserProfile', user)
        this.setProfileDone = true
      } catch (error) {
        console.error(error)
      }
    },
    // async updateUserData () { // For Signup with Google and Facebook
    //   try {
    //     this.$store.dispatch('setLoading', true)
    //     const userRef = db.doc(`users/${this.user.id}`)
    //     const data = {
    //         id: this.user.id,
    //         email: this.user.email,
    //         avatar: this.user.avatar,
    //         username: this.username
    //     }
    //     // Update Avatar
    //     const result = await userRef.set(data, {merge: true})
    //       .then(() => { // to be modified
    //           const filename = this.image.name;
    //           const ext = filename.slice(filename.lastIndexOf('.'));
    //           return firebase.storage().ref(`users/${this.user.id}.${ext}`).put(this.image);
    //       })
    //       .then(fileData => {
    //           const avatar = fileData.metadata.downloadURLs[0];
    //           return userRef.update({ avatar: avatar });
    //       })
    //       .then(() => {
    //         this.$store.dispatch('setLoading', false)
    //         this.setProfileDone = true          
    //       })

    //   } catch (error) {
    //     this.$store.dispatch('setLoading', false)
    //     console.log(error)
    //   }
    // },
    emailAndPasswordCheck () {
      if (this.email.length > 0 && this.password.length >= 6) {
        return true
      } else if (this.password !== this.confirmPassword) {
        this.error = "Le mot de passe ne correspont pas. Veuillez réessayer."
        return false
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
.border, .form-control {
  border-radius: 0 !important;
  border: 1px solid rgba(0,0,0,.048) !important
}
.btn {
  border-radius: 20px !important
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
img {
  object-fit: cover;
  -webkit-object-fit: cover;
  -o-object-fit: cover;
}
.picker {
  width: 70px;
  height: 70px;
  border: 2px dashed #888;
  border-radius: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  transition: .2s ease-in-out;
}
.picker:hover {
  color: #007bff!important;
  border: 2px dashed #007bff!important;
}
.editable-click {
  top: 0;
  right: 0;
  cursor: pointer;
  color: #dc3545!important;
}
.editImage {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  position: relative;
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>