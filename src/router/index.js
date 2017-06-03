import Vue from 'vue'
import Router from 'vue-router'
import Root from '@/components/Root'
import Scanner from '@/components/Scanner'
import RentableDetails from '@/components/RentableDetails'
import Accounts from '@/components/Accounts'
import Network from '@/components/Network'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Rentables',
      component: Root,
      meta: {
        title: 'Rentables'
      }
    },
    {
      path: '/scanner',
      name: 'Scanner',
      component: Scanner,
      meta: {
        title: 'Scanning Rentable'
      }
    },
    {
      path: '/rentable/:address',
      name: 'RentableDetails',
      component: RentableDetails,
      meta: {
        title: 'Detail of Rentable'
      }
    },
    {
      path: '/network',
      name: 'Network',
      component: Network,
      meta: {
        title: 'Network Information'
      }
    },
    {
      path: '/accounts',
      name: 'Accounts',
      component: Accounts,
      meta: {
        title: 'Accounts'
      }
    }
  ]
})
