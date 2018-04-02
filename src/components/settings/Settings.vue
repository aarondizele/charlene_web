<template>
  <div class="container _top-90">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <div class="d-flex flex-row flex-wrap justify-content-between align-items-center">
          <div class="h5 font-weight-light"><strong>Paramètre</strong></div>
          <div class="d-flex flex-row align-items-center" v-if="!editProfile">
            <button class="btn btn-sm btn-violet pointer" @click="editProfile = true">Modifier</button>
            <i class="ml-2 material-icons text-violet" aria-label="true">settings</i>
          </div>
          <div class="d-flex flex-row align-items-center" v-if="editProfile">
            <button class="btn btn-sm btn-violet pointer" @click="onUpdateAdminData">Enregistrer</button>
            <i class="ml-2 material-icons text-violet" aria-label="true">save</i>
          </div>
        </div>
        <hr class="mt-2 mb-4">
      </div>
    </div>
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <div class="row no-gutters align-items-start" v-if="!editProfile">
          <div class="col-sm-12 col-md-3 text-center photo">
            <img :src="admin.profile" class="rounded-circle" alt="avatar" v-if="admin.profile">
          </div>
          <div class="col-sm-12 col-md-9 text-center text-md-left">
            <div class="h4 font-weight-light mb-2">{{admin.username}}</div>
            <div class="d-flex flex-row align-items-center h6 mb-2">
              <i class="fa fa-check-circle mr-2 text-muted" aria-label="true"></i>{{admin.quote}}
            </div>
            <div class="d-flex flex-row align-items-center mb-2">
              <i class="fa fa-location-arrow mr-2 text-muted" aria-label="true"></i>{{admin.location}}
            </div>
            <div class="d-flex flex-column mx-auto mx-md-0">
              <small class="text-muted mt-2 mb-1">Image Background</small>
              <img :src="admin.background" class="rounded mt-2 mb-5" alt="avatar" v-if="admin.background" style="width: auto;max-width: 200px !important;height:auto; max-height: 200px !important;oject-fit: cover !important;-webkit-object-fit:cover !important;">
            </div>
          </div>      
        </div>
        <div class="row align-items-start no-gutters" v-else>
          <div class="col-sm-12 col-md-3 photo">
            <div class="mx-auto mb-2 pointer text-muted picker" @click="onPickProfile" v-if="!imageProfileURL"><i class="material-icons" aria-label="true" style="font-size: 42px !important">photo</i></div>
            <input type="file"
              style="display: none;"
              ref="profileInput"
              accept="image/*"
              @change="onProfilePicked">
            <div class="editImage mx-auto" v-if="imageProfileURL" style="width: 60px!important; height: 60px!important;">
              <img :src="imageProfileURL" class="rounded-circle" alt="avatar" style="width: 100%!important; height: 100%!important;">
              <span @click="removeProfile" class="pointer editable-click editable-profile position-absolute"><i class="material-icons" aria-label="true" style="font-size: 28px !important;">delete</i></span>
            </div>
          </div>
          <div class="col-sm-12 col-md-9">
              <div class="form-group mb-2">
                <input type="text" v-model.trim="username" id="username" class="form-control" placeholder="Nom de l'administrateur">
              </div>
              <div class="form-group mb-2">
                  <textarea cols="10" rows="2" v-model.trim="quote" id="quote" class="form-control" placeholder="Citation"></textarea>
              </div>
              <div class="form-group mb-3">
                <input type="text" v-model.trim="location" id="location" class="form-control" placeholder="Géolocation">
              </div>
              <div>
                <input type="file"
                  style="display: none;"
                  ref="backgroundInput"
                  accept="image/*"
                  @change="onBackgroundPicked">
                <div class="position-relative" style="width: 200px!important; height: 200px!important;" v-if="imageBackgroundURL">
                  <img :src="imageBackgroundURL" class="rounded" style="width: 100%!important; height: 100%!important;" alt="avatar">
                  <span @click="removeBackground" class="pointer editable-click editable-background  position-absolute"><i class="material-icons" aria-label="true" style="font-size: 28px !important;">delete</i></span>
                </div>
                <div class="pointer text-muted picker" @click="onPickBackground" v-if="!imageBackgroundURL"><i class="material-icons" aria-label="true" style="font-size: 42px !important">photo</i></div>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>    
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    editProfile: false,
    username: '',
    quote: '',
    location: '',
    imageProfileURL: '',
    imageProfile: null,
    imageBackgroundURL: '',
    imageBackground: null
  }),
  computed: {
    ...mapGetters(['admin', 'loading', 'error'])
  },
  methods: {
    removeBackground () {

    },
    removeProfile () {

    },
    onPickProfile () {
      this.$refs.profileInput.click()
    },
    onPickBackground () {
      this.$refs.backgroundInput.click()
    },
    onProfilePicked (e) {
      const files = e.target.files
      let filename = files[0].name
      if (filename.lastIndexOf('.') <= 0) {
        return this.error = 'Image invalide. Veuillez réessayez avec une autre image.'
      }
      const fileReader = new FileReader()
      fileReader.readAsDataURL(files[0])
      fileReader.addEventListener('load', () => {
        this.imageProfileURL = fileReader.result
      })
      this.imageProfile = files[0]
    },
    onBackgroundPicked (e) {
      const files = e.target.files
      let filename = files[0].name
      if (filename.lastIndexOf('.') <= 0) {
        return this.error = 'Image invalide. Veuillez réessayez avec une autre image.'
      }
      const fileReader = new FileReader()
      fileReader.readAsDataURL(files[0])
      fileReader.addEventListener('load', () => {
        this.imageBackgroundURL = fileReader.result
      })
      this.imageBackground = files[0]
    },
    onUpdateAdminData () {
      const data = {
        profile: this.imageProfile,
        background: this.imageBackground,
        username: this.username,
        location: this.location,
        quote: this.quote
      }
      this.$store.dispatch('updateAdminData', data)
      this.editProfile = true
    }
  },
  mounted () {
    this.$store.dispatch('clearError')
  },
  created () {
    this.imageProfileURL = this.admin.profile
    this.imageBackgroundURL = this.admin.background
    this.username = this.admin.username
    this.quote = this.admin.quote
    this.location = this.admin.location
  }
}
</script>

<style scoped>
hr {
  width: 100% !important
}
textarea {
  resize: none;
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
.border, .form-control {
  border-radius: 0 !important;
  border: 1px solid rgba(0,0,0,.048) !important
}
.editable-click {
  cursor: pointer;
  color: #dc3545!important;
}
.editable-profile {
  top: 0!important;
  right: 0!important;
}
.editable-background {
  top: 5%;
  right: 5%;
}
.editImage {
  max-width: 160px !important;
  border-radius: 6px !important;
  position: relative;
  margin-right: 10px;
  margin-bottom: 10px;
}
img {
  object-fit: cover;
  -webkit-object-fit: cover;
  width: 60px;
  height: 60px;
}
@media only screen and (max-width: 767px) {
  .photo {
    margin-bottom: 20px !important;
  }
}
</style>

