import firebase from 'firebase'
import { db } from '../../main'

const state = {
    user: null,
    admin: null
}

const getters = {
    user: state => state.user,
    admin: state => state.admin,
}

const mutations = {
    SET_USER (state, payload) {
        return state.user = payload
    },
    SET_ADMIN (state, payload) {
        return state.admin = payload
    },
}

const actions = {
    setUser({ commit}, payload) {
        commit('SET_USER', payload)
    },
    getAdminData: ({commit}) => {
        db.doc('admin/14bVC3OftsSxwoLV1ymledKMX2P2')
            .onSnapshot(doc => {
                const admin = {
                    id: doc.id,
                    profile: doc.data().profile,
                    background: doc.data().background,
                    username: doc.data().username,
                    quote: doc.data().quote,
                    location: doc.data().location
                }
                commit('SET_ADMIN', admin)
            }, (error) => {
                console.log(error)
            })
    },
    autoSignIn({ commit }, payload) {
        commit('SET_USER', {
            id: payload.uid
        })
    },
    fetchUserData ({commit, getters}) {
        const userId = getters.user.id
        db.doc(`users/${userId}`)
            .onSnapshot(doc => {
                if (doc && doc.exists) {
                    const data = doc.data()
                    const user = {
                        id: doc.id,
                        username: data.username,
                        email: data.email,
                        avatar: data.avatar,
                        admin: data.admin
                    }
                    commit('SET_USER', user)
                }
            }, (error) => {
                console.log(error)
            })
    },
    editUserProfile({ commit, getters }, payload) {
        commit('SET_LOADING', true)
        const userId = getters.user.id
        db.doc(`users/${userId}`)
            .update({
                username: payload.username,
            })
            .then(_ => {
                const filename = payload.image.name;
                const ext = filename.slice(filename.lastIndexOf('.'));
                return firebase.storage().ref(`users/${userId}.${ext}`).put(payload.image);
            })
            .then(fileData => {
                const avatar = fileData.metadata.downloadURLs[0];
                return db.doc(`users/${userId}`)
                    .update({ avatar: avatar });
            })
            .then(_ => {
                commit('SET_LOADING', false);
            })
            .catch(err => {
                commit('SET_LOADIND', false);
                console.error(err);
            })
    },
    updateUserProfile({ commit, getters }, payload) {
        commit('SET_LOADING', true)
        commit('CLEAR_ERROR')
        const userId = getters.user.id
        let avatar;
        db.doc(`users/${userId}`)
            .set({
                username: payload.username,
                email: payload.email
            }, {merge: true})
            .then(_ => {
                const filename = payload.image.name;
                const ext = filename.slice(filename.lastIndexOf('.'));
                return firebase.storage().ref(`users/${userId}.${ext}`).put(payload.image);
            })
            .then(fileData => {
                avatar = fileData.metadata.downloadURLs[0];
                return db.collection('users').doc(userId).update({ avatar: avatar });
            })
            .then(_ => {
                commit('SET_LOADING', false);
            })
            .catch(err => {
                commit('SET_LOADIND', false);
                console.error(err);
            })
    },
    signupWithEmail({ commit }, payload) {
        commit('SET_LOADING', true)
        commit('CLEAR_ERROR')
        firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
            .then(user => {
                const user$ = {
                    id: user.uid,
                    email: payload.email
                }
                commit('SET_USER', user$)
                commit('SET_LOADING', false)
            })
            .catch(error => {
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
                commit('SET_ERROR', errorCode)
                commit('SET_LOADING', false)
            })
    },
    loginWithEmail({ commit }, payload) {
        commit('SET_LOADING', true)
        commit('CLEAR_ERROR')
        firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
            .then(user => {
                commit('SET_LOADING', false)
                const user$ = {
                    id: user.uid,
                    email: user.email
                }
                commit('SET_USER', user$)
            })
            .catch(error => {
                let errorCode = ''
                switch (error.code) {
                    case 'auth/user-not-found':
                        errorCode = "Il n'y a pas d'utilisateur correspondant à cette adresse email."
                        break;
                    case 'auth/wrong-password':
                        errorCode = "Le mot de passe est invalide pour cette addresse email"
                        break;
                    case 'auth/invalid-email':
                        errorCode = "L'adresse email n'est pas valide."
                        break;
                    case 'auth/network-request-failed':
                        errorCode = 'Vérifiez votre connexion internet.'
                    default:
                        errorCode = error.code
                }
                commit('SET_LOADING', false)
                commit('SET_ERROR', errorCode)
            })
    },
    loginWithGoogle: ({ commit }) => {
        commit('SET_LOADING', true)
        let provider = new firebase.auth.GoogleAuthProvider()
        firebase.auth().signInWithPopup(provider)
            .then(user => {
                const user$ = {
                    id: user.uid,
                    email: user.email,
                    avatar: user.photoURL,
                    username: user.displayName
                }
                commit('SET_USER', user$)
                commit('SET_LOADING', false)
            })
    },
    loginWithFacebook: ({ commit }) => {
        commit('SET_LOADING', true)
        let provider = new firebase.auth.FacebookAuthProvider()
        firebase.auth().signInWithPopup(provider)
            .then(user => {
                const user$ = {
                    id: user.uid,
                    email: user.email,
                    avatar: user.photoURL,
                    username: user.displayName
                }
                commit('SET_USER', user$)
                commit('SET_LOADING', false)
            })
    },
    logout({ commit }) { // TO KEEP
        firebase.auth().signOut()
        commit('SET_USER', null)
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}
