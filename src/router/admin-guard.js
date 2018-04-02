import store from '../store'

export default (to, from, next) => {
    if (store.getters.user !== null && store.getters.user !== undefined) {
        return store.getters.user.admin === true ? next() : next('/')
    } else {
        next('/')
    }
}
