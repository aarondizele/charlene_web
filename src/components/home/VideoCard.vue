<template>
    <div class="card">
        <div class="card-img-top">
            <video-player :post="post" />
        </div>
        <div class="card-body">
            <div class="d-flex flex-row justify-content-between align-items-center pb-3">
                <div class="d-flex align-items-center">
                    <i class="material-icons pr-2 pointer" aria-label="true" @click.stop="onToggleLike">{{videoLiked === true? 'favorite': 'favorite_outline'}}</i>
                    <!-- <i class="material-icons pr-2 pointer text-violet" aria-label="true">whatshot</i> -->
                </div>
            </div>
            <div class="card-subtitle"><strong>{{counter}} view{{counter > 0? 's':''}}</strong></div>
            <div class="card-text font-size-15">{{post.description}}</div>
            <p class="mt-2 card-text font-size-15 text-muted pointer" @click="onGetMoreComments" v-if="comments.length > 3">Charger d'autres commentaires</p>
            <ul class="list-unstyled my-2" v-if="comments">
                <li class="list-item font-size-14" v-for="comment in comments" :key="comment.id"><strong class="mr-2">{{comment.username}}</strong>{{comment.comment}}</li>
            </ul>
            <small class="font-weight-light text-uppercase text-muted mt-1">{{post.createdAt | date}}</small>
        </div>
        <hr>
        <div class="card-footer">
            <input type="text" class="form-control border-0" v-model.trim="comment" @keyup.enter="onComment" placeholder="Ajouter un commentaire...">
        </div>
    </div>
</template>

<script>
import { db } from '../../main'
import { mapGetters } from 'vuex'

export default {
    props: ['post'],
    data: () => ({
        comment: '',
        comments: [],
        videoLiked: false
    }),
    firestore () {
        return {
            comments: db.collection('comments').where('postId', '==', this.post.id)
        }
    },
    computed: {
        ...mapGetters(['user']),
        userIsAuthenticated () {
            return this.user !== null && this.user !== undefined
        },
        counter () {
            return this.post.videoViewCount
        },
        lessComments () {
            return this.comments.slice(3)
        }
    },
    methods: {
        onGetMoreComments () {
            // Get all comments
            return this.lessComments = this.comments
        },
        onToast () {
            if (!this.userIsAuthenticated) return this.$emit('showToast')
        },
        onToggleLike () {
            if (!this.userIsAuthenticated) return this.$emit('showToast')

            if (this.videoLiked === true) {
                this.$store.dispatch('dislikePost', this.post.id)
            } else {
                this.$store.dispatch('likePost', this.post.id)
            }
        },
        async onComment () {
           try {
                if (!this.userIsAuthenticated) return this.$emit('showToast')

                if (!this.comment.length) return

                const commentary = {
                    postId: this.post.id,
                    userId: this.user.id,
                    comment: this.comment,
                    createdAt: Date.now(),
                    avatar: this.user.avatar,
                    username: this.user.username,
                }
                const result = await db.collection('comments').add(commentary)
                    .then(() => {
                        this.comment = ''
                    })
           } catch (error) {
               console.error(error)               
           }
        },
        async postIsLiked () {
            try {
                const result = await db.collection('hearts').doc(`${this.user.id}_${this.post.id}`)
                    .onSnapshot(doc => {
                        if (doc && doc.exists) {
                            this.videoLiked = true
                        } else {
                            this.videoLiked = false
                        }
                    })
            } catch (error) {
                console.log(error)
            }
        }
    },
    created () {
        this.postIsLiked()  
    }
}
</script>

<style scoped>
.card {
    border: 0 !important;
    border: .05px solid rgba(0,0,0,.084) !important;
    -webkit-box-shadow: 0 2px 10px 0 rgba(0,0,0,.084) !important;
    box-shadow: 0 2px 10px .5px rgba(0,0,0,.084) !important;
    border-radius: 8px !important
}
.form-control {
    font-size: 14px !important;
}
</style>