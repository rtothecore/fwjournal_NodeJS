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
import SearchAddressModal from './components/SearchAddressModal.vue'
import VeeValidate from 'vee-validate'
import VueSweetalert2 from 'vue-sweetalert2'
// https://alligator.io/vuejs/vue-media-queries/
import VueMq from 'vue-mq'
// import axios from 'axios'

Vue.component('journalModal', JournalModal)
Vue.component('journalModalForEdit', JournalModalForEdit)
Vue.component('addWorkTypeModal', AddWorkTypeModal)
Vue.component('searchAddressModal', SearchAddressModal)

Vue.use(Vuetify)
Vue.use(FullCalendar)
Vue.use(VeeValidate)
Vue.use(VueSweetalert2)
Vue.use(VueMq, {
  breakpoints: {
    mobile: 450,
    tablet: 900,
    laptop: 1250,
    desktop: Infinity
  }
})
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
