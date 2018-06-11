// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import FullCalendar from 'vue-full-calendar'
import 'fullcalendar/dist/fullcalendar.min.css'
import JournalModal from './components/JournalModal.vue'
import JournalModalForEdit from './components/JournalModalForEdit.vue'
import AddWorkTypeModal from './components/AddWorkTypeModal.vue'
import VeeValidate from 'vee-validate'
import VueSweetalert2 from 'vue-sweetalert2'
// import axios from 'axios'

Vue.component('journalModal', JournalModal)
Vue.component('journalModalForEdit', JournalModalForEdit)
Vue.component('addWorkTypeModal', AddWorkTypeModal)

Vue.use(Vuetify)
Vue.use(FullCalendar)
Vue.use(VeeValidate)
Vue.use(VueSweetalert2)
// Vue.prototype.$http = axios

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

export const bus = new Vue()
