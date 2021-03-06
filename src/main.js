import Vue from 'vue'
import App from './App.vue'
import router from './router'

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

import Vuex from 'vuex'
import VueSocketIO from 'vue-socket.io'


Vue.config.productionTip = false

Vue.use(VueMaterial)
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})

const url = process.env.VUE_APP_URL

Vue.use(new VueSocketIO({
  debug: true,
  connection: `${url}`,
  vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_'
  },
  // options: { path: "/" } //Optional options
}))

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
