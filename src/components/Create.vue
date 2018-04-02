<template>
  <div class="container _top-100">
    <div class="row">
      <div class="col-sm-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
        <div class="card">
          <!-- Options -->
          <div class="card-header d-flex flex-row align-items-center justify-content-center bg-white text-muted">
            <div :class="{'text-violet': option.photo}" class="d-flex flex-row align-items-center px-3 pointer mb-0" @click="onSwitchTab('is-photo')"><i class="material-icons icon-option" aria-label="true">photo</i> <span class="d-none d-md-block">Photo</span></div>
            <div :class="{'text-violet': option.video}" class="d-flex flex-row align-items-center px-3 pointer mb-0" @click="onSwitchTab('is-video')"><i class="material-icons icon-option" aria-label="true">videocam</i><span class="d-none d-md-block">Video</span></div>
            <div :class="{'text-violet': option.event}" class="d-flex flex-row align-items-center px-3 pointer mb-0" @click="onSwitchTab('is-event')"><i class="material-icons icon-option" aria-label="true">today</i> <span class="d-none d-md-block">Event</span></div>
            <div :class="{'text-violet': option.note}" class="d-flex flex-row align-items-center px-3 pointer mb-0" @click="onSwitchTab('is-note')"><i class="material-icons icon-option" aria-label="true">note</i> <span class="d-none d-md-block">Note</span></div>
          </div>
          <div class="card-body pb-0">
            <!-- Photo -->
            <div v-if="option.photo">

              <form @submit.prevent="onCreatePhoto">
                <input type="file"
                  style="display: none;"
                  ref="photoInput"
                  accept="image/*"
                  @change="onPhotoPicked"
                  multiple
                  required>

                <div class="mx-auto mb-2 pointer text-muted picker" @click="onPickPhoto">
                  <i class="material-icons" aria-label="true" style="font-size: 42px !important">photo</i>
                </div>

                <div class="d-flex flex-row flex-wrap align-items-center my-3">

                  <div class="single-image position-relative" v-if="photo.imageURL">

                    <img :src="photo.imageURL" alt="photo" class="rounded" style="width: 100%; height: 100%">

                    <span @click="removePhoto" class="pointer editable-click position-absolute">
                      <i class="material-icons" aria-label="true" style="font-size: 28px !important;">delete_forever</i>
                    </span>

                  </div>
                </div>

                <input class="form-control mb-2" type="text" v-model.trim="photo.description" placeholder="Description (Facultatif)">

                <button type="submit" class="btn btn-block btn-violet pointer my-3 float-right d-flex flex-row align-items-center justify-content-center">
                  <i class="fa fa-spinner fa-pulse fa-3x fa-fw"
                      v-if="loading"
                      style="font-size: 16px;"></i>
                  <span v-if="!loading">Publier</span>
                </button>

              </form>
            </div>
            <!-- Video -->
            <div v-if="option.video">

              <form @submit.prevent="onCreateVideo">

                <input type="file"
                  style="display: none;"
                  ref="videoInput"
                  accept="video/*"
                  @change="onVideoPicked"
                  required>

                <div class="mx-auto mb-3 pointer text-muted picker" @click="onPickVideo" v-if="!video.youtubeLink.length">
                  <i class="material-icons" aria-label="true" style="font-size: 42px !important">videocam</i>
                </div>

                <div class="single-video mx-auto position-relative" v-if="video.videoURL">
                  <video controls class="rounded" autoplay height="300px" width="100%">
                    <source :src="video.videoURL" type="">
                  </video>
                </div>

                <div class="form-group mt-3">
                  <input type="text" id="youtube" class="form-control" placeholder="https://www.youtube.com/" v-model.trim="video.youtubeLink">
                </div>

                <input class="form-control mt-2 mb-3" type="text" v-model.trim="video.description" placeholder="Description (Facultatif)">

                <button type="submit" class="btn btn-block btn-violet pointer my-3 float-right d-flex flex-row align-items-center justify-content-center">
                  <i class="fa fa-spinner fa-pulse fa-3x fa-fw"
                      v-if="loading"
                      style="font-size: 16px;"></i>
                  <span v-if="!loading">Publier</span>
                </button>

              </form>
            </div>
            <!-- Event -->
            <div v-if="option.event">

              <form @submit.prevent="onCreateEvent">

                <div class="row no-gutters mb-2">
                  <div class="col-2 mr-2">
                    <input class="form-control" type="number" v-model.number="events.day" placeholder="01">
                  </div>
                  <div class="col-2 mr-2">
                    <input class="form-control" type="number" v-model.number="events.month" placeholder="01">
                  </div>
                  <div class="col-3">
                    <input class="form-control" type="number" v-model.number="events.year" placeholder="2018">
                  </div>
                </div>

                <input class="form-control mb-2" type="text" v-model.trim="events.title" placeholder="Title">

                <input class="form-control mb-3" type="text" v-model.trim="events.place" placeholder="Lieu">

                <!-- Pick images -->
                <input type="file"
                  style="display:none"
                  ref="eventInput"
                  accept="image/*"
                  @change="onEventPicked"
                  multiple>

                <div class="mx-auto mb-2 pointer text-muted picker" @click="onPickEvent">
                  <i class="material-icons" aria-label="true" style="font-size: 42px !important">photo</i>
                </div>

                <div class="d-flex flex-row flex-wrap align-items-center my-3">
                  <div class="single-image position-relative" v-if="events.imageURL">

                    <img :src="events.imageURL" alt="photo" class="rounded" style="width: 100%; height: 100%">

                    <span @click="removableEvent" class="pointer editable-click position-absolute">
                      <i class="material-icons" aria-label="true" style="font-size: 28px !important;">delete_forever</i>
                    </span>

                  </div>
                </div>

                <button type="submit" class="btn btn-block btn-violet pointer my-3 float-right d-flex flex-row align-items-center justify-content-center">
                  <i class="fa fa-spinner fa-pulse fa-3x fa-fw"
                      v-if="loading"
                      style="font-size: 16px;"></i>
                  <span v-if="!loading">Publier</span>
                </button>

              </form>
            </div>
            <!-- Note -->
            <div v-if="option.note">
              <form @submit.prevent="onCreateNote">

                <textarea class="form-control mb-2" v-model.trim="note.content" placeholder="Quoi de neuf?" cols="30" rows="4" style="resize: none;"></textarea>

                <button type="submit" class="btn btn-block btn-violet pointer my-3 float-right d-flex flex-row align-items-center justify-content-center">
                  <i class="fa fa-spinner fa-pulse fa-3x fa-fw"
                      v-if="loading"
                      style="font-size: 16px;"></i>
                  <span v-if="!loading">Publier</span>
                </button>

              </form>
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
    option: {
      photo: true,
      video: false,
      event: false,
      note: false,
    },
    note: {
      content: ''
    },
    events: {
      day: '',
      month: '',
      year: '',
      title: '',
      place: '',
      image: null,
      imageURL: ''
    },
    photo: {
      imageURL: '',
      image: null,
      description: ''
    },
    video: {
      videoURL: '',
      video: null,
      description: '',
      youtubeLink: ''
    }
  }),
  computed: {
    ...mapGetters(['loading', 'error'])
  },
  methods: {
    onSwitchTab (value) {
      switch (value) {
        case 'is-note':
          this.option.note = true
          this.option.photo = false
          this.option.video = false
          this.option.event = false
          break;
        case 'is-photo':
          this.option.note = false
          this.option.photo = true
          this.option.video = false
          this.option.event = false
          break;
        case 'is-video':
          this.option.note = false
          this.option.photo = false
          this.option.video = true
          this.option.event = false
          break;
        case 'is-event':
          this.option.note = false
          this.option.photo = false
          this.option.video = false
          this.option.event = true
          break;
        default:
          this.option.note = false
          this.option.photo = true
          this.option.video = false
          this.option.event = false
          break;
      }
    },
    async onCreateNote () {
      try {
        if (!this.note.content.length) return

        await this.$store.dispatch('postNote', {note: this.note.content})
        this.$router.push('/')

      } catch (error) {
        console.error(error)
      }
    },
    async onCreatePhoto () {
      if (!this.photo.image) return

      const photo = {
        image: this.photo.image,
        description: this.photo.description
      }

      await this.$store.dispatch('postPhoto', photo)
      this.$router.push('/')

    },
    async onCreateVideo () {
      try {
        if (!this.video.video || !this.video.youtubeLink.length) return

        const video = {
          video: this.video.video,
          description: this.video.description,
          youtubeLink: this.video.youtubeLink
        }

        await this.$store.dispatch('postVideo', video)
        this.$router.push('/')

      } catch (error) {
        console.error(error)
      }
    },
    async onCreateEvent () {
      try {
        const events = {
          image: this.events.image,
          title: this.events.title,
          place: this.events.place,
          day: this.events.day,
          month: this.events.month,
          year: this.events.year,
        }

        await this.$store.dispatch('postEvent', events)
        this.$router.push('/')

      } catch (error) {
        console.error(error)
      }
    },
    removePhoto () {
      return this.photo.imageURLs.splice(0, 1)
    },
    removeVideo () {
      return this.video.videoURL.splice(0, 1)
    },
    removableEvent () {
      return this.events.imageURLs.splice(0, 1)
    },
    onPickPhoto () {
      this.$refs.photoInput.click()
    },
    onPickVideo () {
      this.$refs.videoInput.click()
    },
    onPickEvent () {
      this.$refs.eventInput.click()
    },
    onPhotoPicked (e) {
      const files = e.target.files
      let filename = files[0].name

      if (filename.lastIndexOf('.') <= 0) {
        return this.error = 'Photo invalide. Veuillez réessayez avec une autre photo.'
      }

      const fileReader = new FileReader()
      fileReader.readAsDataURL(files[0])
      fileReader.addEventListener('load', () => {
        this.photo.imageURL = fileReader.result
      })

      this.photo.image = files[0]
    },
    onEventPicked (e) {
      const files = e.target.files
      let filename = files[0].name

      if (filename.lastIndexOf('.') <= 0) {
        return this.error = 'Photo invalide. Veuillez réessayez avec une autre photo.'
      }

      const fileReader = new FileReader()
      fileReader.readAsDataURL(files[0])
      fileReader.addEventListener('load', () => {
        this.events.imageURL = fileReader.result
      })

      this.events.image = files[0]
    },
    onVideoPicked (e) {
      const files = e.target.files
      let filename = files[0].name

      if (filename.lastIndexOf('.') <= 0) return this.error = 'Vidéo invalide. Veuillez réessayez avec une autre vidéo.';

      const fileReader = new FileReader()
      fileReader.readAsDataURL(files[0])
      fileReader.addEventListener('load', () => {
        this.video.videoURL = fileReader.result
      })

      this.video.video = files[0]
     },
  },
  mounted () {
    this.$store.dispatch('clearError')
  },
}
</script>

<style scoped>
.btn {
  border-radius: 20px !important
}
img {
  object-fit: contain;
  -o-object-fit: contain;
  -webkit-object-fit: contain;
}
.editable-click {
  top: 5px;
  right: 5px;
  cursor: pointer;
  color: #dc3545!important;
}
.single-video {
  width: 300px;
  height: 300px;
  margin-top: -40px !important;
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
.icon-option {
  font-size: 24px !important;
  margin-right: 4px;
}
.publish-icon {
  font-size: 15px !important;
}
.border, .form-control {
  border-radius: 0 !important;
  border: 1px solid rgba(0,0,0,.048) !important
}
.single-image {
  max-width: 120px !important;
  height: 120px !important;
  border-radius: 6px !important;
  position: relative;
  margin-right: 10px;
  margin-bottom: 10px;
}
.single-image:last-child {
  margin-right: 0;
}
.card {
  border: .5px solid rgba(0,0,0,.048) !important;
  box-shadow: rgba(0, 0, 0, 0.048) 0px 2px 6px, rgba(0, 0, 0, 0.048) 0px 1px 2px;
  transition: box-shadow 0.3s ease;
  background-repeat: no-repeat;
  border-radius: 18px;
}
@media only screen and (max-width: 767px) {
  .icon-option {
    font-size: 32px !important
  }
}
</style>
