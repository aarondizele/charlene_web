<template>
  <div>
    <div class="pb-5">
      <!-- Headline -->
      <Headline />
      <!--  -->
      <div class="container">
        <Loading v-if="loading" class="mx-auto" />
        <div class="row card-columns" v-else>
            <div class="col-md-6 mb-2" v-for="post in posts" :key="post.id">
              <photo-card @showToast="toast" :post="post" v-if="post.category == 'photo'" />
              <video-card @showToast="toast" :post="post" v-if="post.category == 'video'" />
              <note-card @showToast="toast" :post="post" v-if="post.category == 'note'" />
              <event-card @showToast="toast" :post="post" v-if="post.category == 'event'" />
            </div>
        </div>
      </div>
    </div>
    <!-- Snackbar -->
    <Snackbar />
    <!--  -->
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import Headline from './home/Headline'

export default {
  computed: {
    ...mapGetters(['user', 'loading', 'posts']),
    userIsAuthenticated () {
      return this.user !== null && this.user !== undefined
    }
  },
  methods: {
    toast () {
      $('#snackbar').addClass('show')
			setTimeout(() => {
        $('#snackbar').removeClass('show')
      },6000);
    },
  },
  mounted () {
    if (!this.userIsAuthenticated) {
      this.toast()
    }    
  },
  beforeDestroy () {
    $('#snackbar').removeClass('show')
  },
  components: {
    Headline
  }
}
</script>