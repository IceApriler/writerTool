import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: require('@/pages/home').default
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: require('@/pages/dashboard').default,
      children: [
        {
          path: '',
          redirect: 'bookList'
        },
        {
          path: 'demo',
          name: 'demo',
          component: require('@/pages/demo').default
        },
        {
          path: 'leadIn',
          name: 'leadIn',
          component: require('@/pages/leadIn').default
        },
        {
          path: 'bookList',
          name: 'bookList',
          component: require('@/pages/bookList').default
        },
        {
          path: 'reader',
          name: 'reader',
          component: require('@/pages/reader').default
        },
        {
          path: 'collection',
          name: 'collection',
          component: require('@/pages/collection').default
        },
        {
          path: 'about',
          name: 'about',
          component: require('@/pages/about').default
        }
      ]
    }
  ]
})
