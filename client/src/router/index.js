import Vue from 'vue'
import Router from 'vue-router'

const routerOptions = [
  { path: '/', component: 'Journal' },
  { path: '/register', component: 'Register' },
  { path: '/login', component: 'Login' },
  { path: '/search', component: 'Search' },
  { path: '/predict', component: 'Predict' },
  { path: '/stats', component: 'Stats' },
  { path: '/config', component: 'Config' }
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
