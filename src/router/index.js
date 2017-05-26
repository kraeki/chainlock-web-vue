import Vue from 'vue'
import Router from 'vue-router'
import Root from '@/components/Root'
import Scanner from '@/components/Scanner'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Root',
      component: Root
    },
    {
      path: '/scanner',
      name: 'Scanner',
      component: Scanner
    }
  ]
})
