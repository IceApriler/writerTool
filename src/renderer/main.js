import Vue from 'vue'
import axios from 'axios'
import db from '@/modules/db'
import shortid from 'shortid'

import App from './App'
import router from './router'
import store from './store'
import Menu from '@/modules/menu.js'
import iView from 'iview'
import 'iview/dist/styles/iview.css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.prototype.$db = db
Vue.prototype.$sid = shortid

Vue.use(iView)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

Menu.ready()
