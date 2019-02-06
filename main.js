// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import FastClick from 'fastclick'
import store from './store'
import publicFun from '@/js/public'
require('./css/base.css')
require('./css/font-awesome.min.css')
require('./css/style.css')

var infiniteScroll =  require('vue-infinite-scroll');
Vue.use(infiniteScroll)
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
        if (publicFun.fetch('isLogIn')) {
            next();
        }
        else {
            next({
                path: '/login',
                query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
        }
    }
    else {
        next();
    }
})


    Element.prototype.hasClass = function(className){
      var i,len,temp = this.className.split(" ");
      for(i = 0,len = temp.length; i < len; i++){
          if(className == temp[i]){
              return true;
          }
      }
      return false;
    }

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
