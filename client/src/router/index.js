import Vue from 'vue'
import Router from 'vue-router'
import 'babel-polyfill'

const routerOptions = [
  { path: '/', component: 'Journal' },
  { path: '/register', component: 'Register' },
  { path: '/login', component: 'Login' },
  { path: '/search', component: 'Search' },
  { path: '/searchItem', component: 'SearchItem' },
  { path: '/predict', component: 'Predict' },
  { path: '/predictItem', component: 'PredictItem' },
  { path: '/stats', component: 'Stats' },
  // { path: '/config', component: 'Config' },
  { path: '/configPrivate', component: 'ConfigPrivate' },
  { path: '/configLand', component: 'ConfigLand' },
  { path: '/workTime', component: 'WorkTime' },
  { path: '/environment', component: 'Environment' },
  { path: '/qtest', component: 'QueryTest' },
  { path: '/suStep1', component: 'SignUpStep1' },
  { path: '/suStep2', component: 'SignUpStep2' },
  { path: '/suStep3', name: 'nameSuStep3', component: 'SignUpStep3' },
  { path: '/changePw', component: 'ChangePassword' },
  { path: '/changePhoneNo', component: 'ChangePhoneNo' }
]

const routes = routerOptions.map(route => {
  return {
    ...route,
    component: () => import(`@/components/${route.component}.vue`)
  }
})

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes
})
