import firebase from 'firebase'

const state = {
    loading: false,
    error: null
}

const getters = {
    loading: state => state.loading,
    error: state => state.error
}

const mutations = {
    SET_LOADING (state, payload) {
        return state.loading = payload
    },
    SET_ERROR (state, payload) {
        return state.error = payload
    },
    CLEAR_ERROR (state, payload) {
        return state.error = null
    }
}

const actions = {
    setError({ commit }, payload) {
        commit('SET_ERROR', payload)
    },
    clearError: ({ commit }) => {
        commit('CLEAR_ERROR')
    },
    setLoading ({commit}, payload) {
        commit('SET_LOADING', payload)
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}
