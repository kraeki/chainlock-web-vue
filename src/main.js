// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import 'material-design-icons/iconfont/material-icons.css'
import Toasted from 'vue-toasted'

// load more icons like qrcode scan
import 'mdi/css/materialdesignicons.css'

import VueResource from 'vue-resource'

import App from './App'
import router from './router'
import {store} from './store'

Vue.use(VueMaterial)
Vue.use(VueResource)
Vue.use(Toasted, {
  position: 'top-center',
  duration: 5000
})

Vue.config.productionTip = false
Vue.http.headers.common['Access-Control-Allow-Origin'] = 'http://127.0.0.1:8545'

// Filters
import moment from 'moment'
Vue.filter('formatUnixTimeStamp', function (value) {
  if (value) {
    return moment.unix(value).format('MM/DD/YYYY hh:mm')
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
