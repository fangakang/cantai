import axios from 'axios'
import Qs from 'qs'
import Vue from 'vue'
import App from '../App'
import store from '../store'
import publicFun from './../js/public'

// import {LoadingPlugin} from 'vux'
let pending = []; //声明一个数组用于存储每个ajax请求的取消函数和ajax标识
let cancelToken = axios.CancelToken;
let removePending = (config) => {
    for(let p in pending){
        if(pending[p].u === config.url + '&' + config.method) { //当当前请求在数组中存在时执行函数体
            pending[p].f(); //执行取消操作
            pending.splice(p, 1); //把这条记录从数组中移除
        }
    }
}

// http request 请求拦截器，有token值则配置上token值
axios.interceptors.request.use(
    config => {

      removePending(config); //在一个ajax发送前执行一下取消操作
       config.cancelToken = new cancelToken((c)=>{
          // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
          pending.push({ u: config.url + '&' + config.method, f: c });  
      });


      if(!(config.params&&config.params.refresh>0)){//小坑，处理轮询的时候不出现loding
        store.commit('updateLoadingStatus', {isShow:true,mask:true})
      }
        return config;
    },
    err => {
        return Promise.reject(err);
    });

// http response 服务器响应拦截器，这里拦截401错误，并重新跳入登页重新获取token
axios.interceptors.response.use(
    response => {
        store.commit('updateLoadingStatus', {isShow:false})
        return response;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 这里写清除token的代码
                    router.replace({
                        path: 'login',
                        query: {redirect: router.currentRoute.fullPath}//登录成功后跳入浏览的当前页面
                    })
            }
        }
        return Promise.reject(error.response.data) 
    });

function POST (url,params, cb,that) {
  let dataStr = ''
    var _router = that.$route;
    dataStr = params;
    dataStr=Qs.stringify(dataStr)
  axios.post(url,dataStr)
  .then((response) => {
    if(response.data.error==2){
      if(response.data.msg != undefined){
          publicFun.showToast({
            isShow:true,
            type:2,
            mask:true,
            txt:response.data.msg
          })
          publicFun.remove('isLogIn')
          window.setTimeout(function(){
            publicFun.hideToast();
            that.$router.go(0)
          },500)
        return false;
      }

    }else if(response.data.error==1){
      if(response.data.msg != undefined){
          publicFun.showToast({
            isShow:true,
            type:1,
            mask:true,
            txt:response.data.msg
          })
          window.setTimeout(function(){
            publicFun.hideToast()
          },500)
        return false;
      }

    }else{
      if (that!=''){
        that[cb](response.data)
      }else{
        return cb(response.data);
      };
    }
  }).catch(function(err){
    console.log(err);
  });
}
function POSTLOGIN (url,params, cb,that) {
  let dataStr = ''
    var _router = that.$route;
    dataStr = params;
    dataStr=Qs.stringify(dataStr)
    console.log(111111111)

  axios.post(url,dataStr)
  .then((response) => {
    console.log(response)
    if(response.data.error==2){
      if(response.data.msg != undefined){
          publicFun.showToast({
            isShow:true,
            type:2,
            mask:true,
            txt:response.data.msg
          })
          publicFun.remove('isLogIn')
          window.setTimeout(function(){
            publicFun.hideToast();
          },1000)
        return false;
      }

    }else if(response.data.error==1){
      if(response.data.msg != undefined){
          publicFun.showToast({
            isShow:true,
            type:1,
            mask:true,
            txt:response.data.msg
          })
          window.setTimeout(function(){
            publicFun.hideToast()
          },1000)
        return false;
      }

    }else{
      if (that!=''){
        that[cb](response.data)
      }else{
        return cb(response.data);
      };
    }
  }).catch(function(err){
    console.log(err);
  });
}
function GET (url,params,cb,that) {
    var _router = that.$route;
    var _withCredentials = false;
    if(_router.meta.requireAuth){
        // AjaxPlugin.$http.defaults.withCredentials = true
        // _withCredentials = true;
    }
  axios.get(url,{params:params})
  .then((response) => {
    if(response.data.error==2){
      if(response.data.msg != undefined){
          console.log(response)
          publicFun.showToast({
            isShow:true,
            type:2,
            mask:true,
            txt:response.data.msg
          })
          publicFun.remove('isLogIn')
          window.setTimeout(function(){
            publicFun.hideToast();
            that.$router.go(0)

          },1500)
        return false;
      }
    }else if(response.data.error==1){
        console.log(response)
      if(response.data.msg != undefined){
          publicFun.showToast({
            isShow:true,
            type:1,
            mask:true,
            txt:response.data.msg
          })
          window.setTimeout(function(){
            publicFun.hideToast()
          },1500);
          if (that!=''){
              that[cb](response.data)
          }else{
              return cb(response.data);
          };
        //return false;
      }
    }else{
      if (that!=''){
        that[cb](response.data)
      }else{
        return cb(response.data);
      };
  	}
  }).catch(function(err){
    console.log(err);
      if(!navigator.onLine){
          store.commit('updateLoadingStatus', {isShow:false,mask:false});
          publicFun.showToast({
              isShow:true,
              type:2,
              mask:false,
              txt:'网络中断，请检查网络',
              dur:1500
          });
          return
      }
  });
}

const http = {};

http.API_ROOT=window.location.protocol + '//' + window.location.host + '/';
http.API_ROOT='https://np.pigcms.com/wx/';


const localPath='/home';

// const PRE_FIX=API_ROOT+localPath;
const LOGIN='/do_login';

var pathname =  window.location.pathname;
console.log(pathname)
if(pathname.indexOf('/wx/')>=0){//判断是否有‘/wx/’
  http.API_ROOT=window.location.protocol + '//' + window.location.host + '/'+'wx/';
}else if(window.location.port){//判断是否有端口
   // http.API_ROOT='https://k.pigcms.com.cn/wx/';
   http.API_ROOT=window.location.protocol + '//' + document.domain;
  // http.API_ROOT='https://np.pigcms.com/wx/';
}else{
  http.API_ROOT=window.location.protocol + '//' + window.location.host + '/';
}







http.login = function(url,params,cb,that) {
    try {
        let wx_ticket = wx.getStorageSync('ticket');
        if (wx_ticket) {
            ticket = wx_ticket;
        }
    } catch (e) {}
    if (typeof(url) == 'undefined') {
        return false;
    }

    var postUrl = http.API_ROOT+url;
    if (!params) {
        params = {};
    }
  POSTLOGIN(postUrl,params,cb,that)

};
http.post = function(url,params,cb,that) {
    try {
        let wx_ticket = wx.getStorageSync('ticket');
        if (wx_ticket) {
            ticket = wx_ticket;
        }
    } catch (e) {}
    if (typeof(url) == 'undefined') {
        return false;
    }
    var idtoken =publicFun.fetch('idtoken'),
        token=publicFun.fetch('token')
    var postUrl = http.API_ROOT+url+'&idtoken='+idtoken+'&token='+token;
    if (!params) {
        params = {};
    }
  POST(postUrl,params,cb,that)

};
http.get = function(url,params,cb,that) {
    try {
        let wx_ticket = wx.getStorageSync('ticket');
        if (wx_ticket) {
            ticket = wx_ticket;
        }
    } catch (e) {}
    if (typeof(url) == 'undefined') {
        return false;
    }

    var idtoken =publicFun.fetch('idtoken'),
        token=publicFun.fetch('token')
    var postUrl = http.API_ROOT+url+'&idtoken='+idtoken+'&token='+token;
    if (!params) {
        params = {};
    }
	GET(postUrl,params,cb,that)

};

export default http
