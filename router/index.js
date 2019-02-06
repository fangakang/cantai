import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
	import Index from '@/components/pages/index'
	import Handover from '@/components/pages/handover'
	import Reserve from '@/components/pages/reserve'
	import Order from '@/components/pages/order'
	import Checkout from '@/components/pages/checkout'
	import Bills from '@/components/pages/bills'
	import Estimate from '@/components/pages/estimate'



Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',name:'Login',component: Login
    },
    {
        path: '/',name:'Home',component: Home,
		meta: {requireAuth: true},
		redirect:'/index',
		children: [
			{ path: '/index', name:'home',component: Index, meta: { keepAlive: false,requireAuth: true}},
			{ path: '/order', name:'home',component: Order, meta: { keepAlive: false,requireAuth: true}},
			{ path: '/checkout', name:'home',component: Checkout, meta: { keepAlive: true,requireAuth: true}},
			{ path: '/handover', component: Handover, meta: { keepAlive: true,requireAuth: true} },
			{ path: '/reserve', component: Reserve, meta: { keepAlive: true,requireAuth: true} },
			{ path: '/bills', component: Bills, meta: { keepAlive: true,requireAuth: true} },
			{ path: '/estimate', component: Estimate, meta: { keepAlive: true,requireAuth: true} },
		]
    }
  ]
})

