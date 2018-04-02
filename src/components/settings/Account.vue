<template>
  <div class="container _top-90">
    <div class="row">
      <div class="col-md-8 offset-md-2 col-lg-6 offset-lg-3">
        <div class="d-flex flex-row flex-wrap justify-content-between align-items-center">
          <div class="h5 font-weight-light"><strong>Mon compte</strong></div>
          <div class="d-flex flex-row align-items-center" v-if="!editProfile">
            <button class="btn btn-sm btn-violet pointer" @click="editProfile = true">Modifier</button>
            <i class="ml-2 material-icons text-violet" aria-label="true">settings</i>
          </div>
          <div class="d-flex flex-row align-items-center" v-if="editProfile">
            <button class="btn btn-sm btn-violet pointer" @click="onUpdateProfile">Enregistrer</button>
            <i class="ml-2 material-icons text-violet" aria-label="true">save</i>
          </div>
        </div>
        <hr class="mt-2 mb-4">
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
        <div class="row no-gutters align-items-center" v-if="!editProfile">
          <div class="col-sm-12 col-md-3 text-center">
            <img :src="user.avatar" class="rounded-circle" style="width: 60px!important; height: 60px!important;" alt="avatar" v-if="user.avatar">
          </div>
          <div class="col-sm-12 col-md-9 text-center text-md-left">
            <div class="h4 font-weight-light">{{user.username}}</div>
          </div>
        </div>
        <div class="row align-items-center no-gutters" v-else>
          <div class="col-sm-12 col-md-3 text-center photo">
              <div class="mx-auto mb-2 pointer text-muted picker" @click="onPickFile" v-if="!imageURL"><i class="material-icons" aria-label="true" style="font-size: 42px !important">photo</i></div>
              <input type="file"
                style="display: none;"
                ref="fileInput"
                accept="image/*"
                @change="onFilePicked">
              <div class="editImage photo mx-auto" v-if="imageURL">
                <img :src="imageURL" class="rounded-circle" alt="avatar">
                <span @click="removePhoto" class="pointer editable-click position-absolute"><i class="material-icons" aria-label="true" style="font-size: 28px !important;">delete</i></span>
              </div>
          </div>
          <div class="col-sm-12 col-md-9">
            <div class="row text-center text-md-left">
              <div class="col-md-8">
                <div class="form-group">
                  <input type="text" v-model.trim="username" class="form-control" id="username" placeholder="Nom d'utilisateur">
                </div>
              </div>
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
    imageURL: '',
    image: null,
    username: ''
  }),
  computed: {
    ...mapGetters(['user', 'loading', 'error'])
  },
  methods: {
    removePhoto () {
      _.slice(this.imageURL, 0)
      _.slice(this.image, 0)
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
    onUpdateProfile () {
      if (!this.username.length || !this.image) return
      const profile = {
        username: this.username,
        image: this.image
      }
      this.$store.dispatch('editUserProfile', profile)
      this.editProfile = true
    }
  },
  mounted () {
    this.$store.dispatch('clearError')
  },
  created () {
    this.imageURL = this.user.avatar
    this.username = this.user.username
    // Homepage
    this.$store.dispatch('setHomepage', false)
  }
}
</script>

<style scoped>
hr {
  width: 100% !important
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
  top: 0;
  right: 0;
  cursor: pointer;
  color: #dc3545!important;
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
  width: 100%;
  height: 100%;
}
.photo {
  width: 60px;
  height: 60px;
}
@media only screen and (max-width: 767px) {
  .photo {
    margin-bottom: 20px !important;
  }
}
</style>

