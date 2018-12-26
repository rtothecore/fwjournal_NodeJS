import Vue from 'vue'
import Router from 'vue-router'
import 'babel-polyfill'

const routerOptions = [
  { path: '/', component: 'UserManager' },
  { path: '/register', component: 'Register' },
  { path: '/login', component: 'Login' },
  { path: '/parkingManager', component: 'ParkingManager' },
  { path: '/parkingMap', component: 'ParkingManagerMap' },
  { path: '/reportManager', component: 'ReportManager' },
  { path: '/notice', component: 'NoticeManager' },
  { path: '/stats', component: 'Stats' },
  { path: '/config', component: 'Config' },
  { path: '/workTime', component: 'WorkTime' },
  { path: '/environment', component: 'Environment' },
  { path: '/qtest', component: 'QueryTest' },
  { path: '/suStep1', component: 'SignUpStep1' },
  { path: '/suStep2', component: 'SignUpStep2' },
  { path: '/suStep3', name: 'nameSuStep3', component: 'SignUpStep3' },
  { path: '/changePw', component: 'ChangePassword' }
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
