<template>
    <header class="jumbotron jumbotron-fluid text-white position-relative">
        <div class="container jumb">
            <div class="row">
                <div class="col-md-2 text-center text-md-right mb-2 mb-md-0" v-if="admin.profile">
                    <img :src="admin.profile" alt="photo" class="rounded-circle photo">
                </div>
                <div class="col-md-8 text-left">
                    <div class="font-weight-light display-4 text-center text-md-left pb-2" v-if="admin.username">{{admin.username}}</div>
                    <div class="d-flex flex-row h5 font-weight-light align-items-start align-items-md-center text-xs-center text-md-left" v-if="admin.quote">
                        <i class="fa fa-check-circle mr-2" aria-label="true"></i> {{admin.quote}}
                    </div>
                    <div class="d-flex flex-row align-items-center h6 font-weight-light" v-if="admin.location">
                        <i class="fa fa-location-arrow mr-2" aria-label="true"></i> {{admin.location}}
                    </div>
                </div>
            </div>
        </div>
        <div class="position-absolute chevron-bottom pointer"><i class="fa fa-angle-double-down" aria-label="true" style="font-size: 22px;"></i></div>
    </header>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
    computed: {
        ...mapGetters(['admin'])
    }
}
</script>

<style scoped>
.display-4 {
    font-size: 3rem !important;
    line-height: 1 !important;
}
.jumbotron {
    margin-top: -100px !important
}
.jumbotron-fluid::before {
    content: '';
    display: block;
    position: absolute;
    background: radial-gradient(#650075 12.18%, rgba(85,15,100,0) 73.53%) !important;
    width: 190%;
    height: 180%;
    left: -60%;
    top: -40%;
    /* z-index: 1; */
    overflow: hidden
}
.jumbotron-fluid {
    background-position: center top;
    background-repeat: no-repeat;
    background-size: cover;
    background: -webkit-gradient(linear, left bottom, left top, from(rgba(0,7,88,0.8)), to(#080067)) !important;
    background: linear-gradient(0deg, rgba(0,7,88,0.8), #080067) !important;
    overflow: hidden;
}
.photo {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 50%;
}
.chevron-bottom {
    left: 50%;
    bottom: 5px;
}
.jumbotron {
    padding: 12rem 2rem 6rem;
}
@media (max-width: 576px) {
    .jumb {
        margin-top: 60px;
    }
    .photo {
        width: 70px;
        height: 70px;
    }
}
@media (max-width: 576px) {
    .jumbotron {
        padding: 6rem 2rem 4rem;
    }
    .display-4 {
        font-size: 2.5rem !important
    }
}
</style>
