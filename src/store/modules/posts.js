import firebase from 'firebase'
import { db } from '../../main'

const state = {
    posts: [],
    interested: false
}

const getters = {
    posts: state => state.posts,
    interested: state => state.interested
}

const mutations = {
    'LOAD_POSTS': (state, payload) => {
        return state.posts = payload
    },
    'EVENT_INTERESTED': (state, payload) => {
        return state.interested = payload
    }
}

const actions = {
    loadPosts: ({commit}) => {
        commit('SET_LOADING', true)
        db.collection('posts').orderBy('createdAt', 'desc')
            .onSnapshot((snapshot) => {
                let posts = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    posts.push({
                        id: doc.id,
                        category: data.category,
                        createdAt: data.createdAt,
                        likesCount: data.likesCount,
                        description: data.description,
                        place: data.place,
                        imageURL: data.imageURL,
                        imageURLs: data.imageURLs,
                        videoURL: data.videoURL,
                        youtubeLink: data.youtubeLink,
                        videoViewCount: data.videoViewCount,
                        title: data.title,
                        place: data.place,
                        day: data.day,
                        month: data.month,
                        year: data.year,
                        insterestedCount: data.insterestedCount,
                        note: data.note,
                        commentsCount: data.commentsCount
                    });
                })
                commit('SET_LOADING', false)
                commit('LOAD_POSTS', posts)
            }, (error) => {
                console.error(error)
                commit('SET_LOADING', false)
            })
    },
    postPhoto ({ commit }, payload) {
        commit('SET_LOADING', true)
        commit('CLEAR_ERROR')
        let key;
        db.collection('posts')
            .add({
                createdAt: Date.now(),
                description: payload.description,
                likesCount: 0,
                category: 'photo',
                commentsCount: 0
            })
            .then(doc => {
                key = doc.id
                return key
            })
            .then(key => { // to be modified
                const filename = payload.image.name;
                const ext = filename.slice(filename.lastIndexOf('.'));
                return firebase.storage().ref(`posts/${key}.${ext}`).put(payload.image);
            })
            .then(fileData => {
                const imageURL = fileData.metadata.downloadURLs[0];
                return db.collection('posts').doc(key)
                    .update({imageURL: imageURL});
            })
            .then(_ => {
                commit('SET_LOADING', false);
            })
            .catch(err => {
                commit('SET_LOADING', false);
                console.error(err);
            })
    },
    postVideo({ commit }, payload) {
        commit('SET_LOADING', true)
        commit('CLEAR_ERROR')
        let key;
        db.collection('posts')
            .add({
                createdAt: Date.now(),
                description: payload.description,
                likesCount: 0,
                videoViewCount: 0,
                category: 'video',
                youtubeLink: payload.youtubeLink,
                commentsCount: 0
            })
            .then(doc => {
                key = doc.id
                return key
            })
            .then(key => { // to be modified
                const filename = payload.video.name;
                const ext = filename.slice(filename.lastIndexOf('.'));
                return firebase.storage().ref(`posts/${key}.${ext}`).put(payload.video);
            })
            .then(fileData => {
                const videoURL = fileData.metadata.downloadURLs[0];
                return db.collection('posts').doc(key)
                    .update({videoURL: videoURL});
            })
            .then(_ => {
                commit('SET_LOADING', false);
            })
            .catch(err => {
                commit('SET_LOADING', false);
                console.error(err);
            })
    },
    postNote({ commit }, payload) {
        commit('SET_LOADING', true)
        commit('CLEAR_ERROR')
        db.collection('posts')
            .add({
                createdAt: Date.now(),
                note: payload.note,
                likesCount: 0,
                commentsCount: 0,
                category: 'note'
            })
            .then(_ => {
                commit('SET_LOADING', false);
            })
            .catch(err => {
                commit('SET_LOADING', false);
                console.error(err);
            })
    },
    postEvent({ commit }, payload) {
        commit('SET_LOADING', true)
        commit('CLEAR_ERROR')
        let key;
        db.collection('posts')
            .add({
                createdAt: Date.now(),
                title: payload.title,
                place: payload.place,
                day: payload.day,
                month: payload.month,
                year: payload.year,
                insterestedCount: 0,
                category: 'event',
                likesCount: 0,
            })
            .then(doc => {
                key = doc.id
                return key
            })
            .then(key => { // to be modified
                const filename = payload.image.name;
                const ext = filename.slice(filename.lastIndexOf('.'));
                return firebase.storage().ref(`posts/${key}.${ext}`).put(payload.image);
            })
            .then(fileData => {
                const imageURL = fileData.metadata.downloadURLs[0];
                return db.collection('posts').doc(key)
                    .update({imageURL: imageURL});
            })
            .then(_ => {
                commit('SET_LOADING', false);
            })
            .catch(error => console.log(error))
    },
    likePost({ commit, getters }, payload) { // payload == postId
        const userId = getters.user.id
        db.collection('hearts').doc(`${userId}_${payload}`)
            .set({
                postId: payload,
                userId: userId
            }, {merge: true})
            .catch(error => console.error(error))
    },
    dislikePost({ commit, getters }, payload) { // payload == postId
        const userId = getters.user.id
        db.collection('hearts').doc(`${userId}_${payload}`)
            .delete()
            .catch(error => console.error(error))
    },
    postInterested({ commit, getters }, payload) { // payload == postId
        const userId = getters.user.id
        db.collection('interested').doc(`${userId}_${payload}`)
            .get()
            .then(doc => {
                if (doc && doc.exists) {
                    commit('EVENT_INTERESTED', true)
                } else {
                    commit('EVENT_INTERESTED', false)
                }
            })
            .catch(error => console.error(error))
    },
}

export default {
    state,
    getters,
    mutations,
    actions
}
