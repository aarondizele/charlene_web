import Vue from 'vue'
import Router from 'vue-router'
import AuthGuard from './auth-guard'
import AdminGuard from './admin-guard' 

Vue.use(Router)

const Create = resolve => {
  require.ensure(['@/components/Create.vue'], () => {
    resolve(require('@/components/Create.vue'))
  }, 'create')
}
const Settings = resolve => {
  require.ensure(['@/components/settings/Settings.vue'], () => {
    resolve(require('@/components/settings/Settings.vue'))
  }, 'settings')
}
const Account = resolve => {
  require.ensure(['@/components/settings/Account.vue'], () => {
    resolve(require('@/components/settings/Account.vue'))
  }, 'account')
}
const Login = resolve => {
  require.ensure(['@/components/login/Login.vue'], () => {
    resolve(require('@/components/login/Login.vue'))
  }, 'login')
}

export default new Router({
  routes: [
    {
      path: '/',
      component: require('@/components/Home').default
    },
    {
      path: '/create',
      component: Create,
      beforeEnter: AdminGuard
    },
    {
      path: '/settings',
      component: Settings,
      beforeEnter: AdminGuard
    },
    {
      path: '/account',
      component: Account,
      beforeEnter: AuthGuard
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '**',
      redirect: '/'
    }
  ],
  mode: 'history'
})
