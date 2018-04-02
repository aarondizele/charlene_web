<template>
    <div>
        <div class="embed-responsive embed-responsive-16by9" v-if="post.youtubeLink.length">
            <iframe class="embed-responsive-item" :src="post.youtubeLink" frameborder="0"></iframe>
        </div>
        <div class="video-player-box" v-else>
            <div @mouseenter.stop="active = true" @mouseleave.stop="active = false" style="z-index: 0;">
                <video ref="videoPlayer" width="100%" height="320px" class="" @click="onPlay" @timeupdate="onTimeUpdate" v-if="post.video">
                    <source :src="post.video">
                </video>
            </div>
            <div @click="onPlay && onViewCounter" class="pointer controller" :class="{'active-controller': active}">
                <i class="material-icons" aria-label="true" style="font-size: 42px; color: rgba(255,255,255,.75);">{{playerState = 'Play' ? 'play_arrow': 'pause'}}</i>
            <!-- <div @click="onPlay" class="pointer controller" :class="{'active-controller': active}">
                <i class="material-icons" :class="{'fa fa-play': playerState == 'Play', 'fa fa-pause': playerState == 'Pause'}" aria-label="true" style="font-size: 42px; color: rgba(255,255,255,.8);"></i> -->
            </div>
            <div class="seek-bar" :class="{'active-controller': active}">
                <input type="range" min="0" max="100" @change="onSeekVideo" v-model="slider" ref="seekSlider" style="width: 80%;">
                <div class="text-white ml-2 opacity-min small" style="width: 20%;">{{currentTimeText}} / {{durationTimeText}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { db } from '../main'

export default {
    props: ['post'],
    data: () => ({
        playerState: 'Play',
        active: false,
        slider: 0,
        currentTimeText: 0,
        durationTimeText: 0
    }),
    methods: {
        async onViewCounter () {
            try {
                let videoViewCount = this.post.videoViewCount + 1;
                const result = await db.doc(`posts/${this.post.id}`)
                    .update({videoViewCount: videoViewCount})
            } catch (error) {
                console.log(error)
            }
        },
        onPlay () {
            let vid = this.$refs.videoPlayer;
            if (vid.paused) {
                vid.play()
                this.playerState = 'Pause'
            } else {
                vid.pause()
                this.playerState = 'Play'
            }            
        },
        onTimeUpdate () {
            let vid = this.$refs.videoPlayer;
            let nt = vid.currentTime * (100 / vid.duration)
            this.slider = nt;

            var curmins = Math.floor(vid.currentTime / 60)
            var cursecs = Math.floor(vid.currentTime - curmins * 60)
            var durmins = Math.floor(vid.duration / 60)
            var dursecs = Math.floor(vid.duration - durmins * 60)

            if (cursecs < 10) cursecs = "0"+cursecs;
            if (dursecs < 10) dursecs = "0"+dursecs;
            if (curmins < 10) curmins = "0"+curmins;
            if (durmins < 10) durmins = "0"+durmins;

            this.currentTimeText = curmins+":"+cursecs
            this.durationTimeText = durmins+":"+dursecs
        },
        onSeekVideo () {
            let vid = this.$refs.videoPlayer;
            let seekto = vid.duration * (this.slider / 100)
            vid.currentTime = seekto
        }
    }
}
</script>

<style scoped>
.video-player-box {
    position: relative;
    width: 100% !important;
    height: 320px !important;
    background: rgba(0, 0, 0, .8);
    color: #FFFFFF;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
}
.controller {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: none;
    transition: .2s ease;
    z-index: 2
}
.seek-bar {
    width: 100%;
    position: absolute;
    bottom: 20px;
    padding: 0 25px;
    display: none;
    transition: .2s ease;
    z-index: 2
}
.active-controller {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
input[type='range'] {
    -webkit-appearance: none !important;
    background: #666;
    opacity: .8;
    height: 4px;
    border-radius: 2.5px;
}
input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none !important;
    background: #FFF;
    height: 15px;
    width: 15px;
    border-radius: 100%;
    cursor: pointer;
}
</style>


