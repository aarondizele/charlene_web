<template>
    <div>
        <div class="card">
            <div class="card-img-top" v-if="post.imageURL">
                <img :src="post.imageURL" alt="" class="w-100">
            </div>
            <div class="card-body" @click="onToast">
                <div class="row no-gutters justify-content-center align-items-center">
                    <div class="col-4 text-center text-danger">
                        <h4 class="font-weight-light"><strong>{{shortMonth}}</strong></h4>
                        <h4 class="font-weight-light">{{post.day}}</h4>
                    </div>
                    <div class="col-8">
                        <h5 class="card-title">{{post.title}}</h5>
                        <div class="text-muted card-subtitle">{{post.place}}</div>
                        <div>{{counter}} personne{{counter > 0? 's': ''}} Interessé{{counter > 0? 's': ''}}</div>
                    </div>                    
                </div>
                <hr class="my-3">
                <div class="px-3 d-flex flex-row align-items-center justify-content-end">
                    <button class="btn pointer d-flex flex-row align-items-center" :class="{'btn-violet': !interested, 'btn-danger': interested}" @click.stop="onToggleInterest">
                        {{interested === true ? 'Non interessé': 'Interessé'}}
                    </button>
                </div>
            </div>
        </div>
        <!-- Snackbar -->
        <!-- <Snackbar /> -->
        <!--  -->
    </div>
</template>

<script>
import { db } from '../../main'
import { mapGetters } from 'vuex'

export default {
    props: ['post'],
    computed: {
        ...mapGetters(['user', 'interested']),
        shortMonth () {
            return _.upperCase(this.month.slice(0,3))
        },
        counter () {
            return this.post.insterestedCount
        },
        userIsAuthenticated () {
            return this.user !== null && this.user !== undefined
        },
        month () {
            switch (this.post.month) {
                case 1:
                    return 'Janvier'
                    break;            
                case 2:
                    return 'Février'
                    break;            
                case 3:
                    return 'Mars'
                    break;            
                case 4:
                    return 'Avril'
                    break;            
                case 5:
                    return 'Mai'
                    break;            
                case 6:
                    return 'Juin'
                    break;            
                case 7:
                    return 'Juillet'
                    break;            
                case 8:
                    return 'Août'
                    break;            
                case 9:
                    return 'Septembre'
                    break;            
                case 10:
                    return 'Octobre'
                    break;            
                case 11:
                    return 'Novembre'
                    break;            
                case 12:
                    return 'Décembre'
                    break;
            }
        }
    },
    methods: {
        async interestedPost () {
            try {                
                const result = await db.collection('interested').doc(`${this.user.id}_${this.post.id}`).set({
                    postId: this.post.id,
                    userId: this.user.id
                })
            } catch (error) {
                console.error(error)                
            }
        },
        async uninterestedPost () {
            try {                
                const result = await db.collection('interested').doc(`${this.user.id}_${this.post.id}`).delete()
            } catch (error) {
                console.error(error)                
            }
        },
        onToast () {
            if (!this.userIsAuthenticated) {
                return this.$emit('showToast')
            }
        },
        onToggleInterest () {
            if (!this.userIsAuthenticated) return this.$emit('showToast')

            if (this.interested === true) {
                this.uninterestedPost(this.post.id)
            } else {
                this.interestedPost(this.post.id)
            }
        }
    },
    created () {
        this.$store.dispatch('postInterested', this.post.id)
    }
}
</script>

<style scoped>
h4 {
    margin: 0 !important;
}
img {
    border-top-left-radius: 8px !important;
    border-top-right-radius: 8px !important
}
.btn {
    border-radius: 6px !important
}
.card {
    border: 0 !important;
    border: .05px solid rgba(0,0,0,.084) !important;
    -webkit-box-shadow: 0 2px 10px 0 rgba(0,0,0,.084) !important;
    box-shadow: 0 2px 10px .5px rgba(0,0,0,.084) !important;
    border-radius: 8px !important
}
</style>

