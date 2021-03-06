import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import HMI from '@/views/HMI'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/hmi',
      component: HMI
    },
    {
      path: '/todos',
      component: () => import('../views/Todos.vue')
    }
  ]
})