<template>
  <div class="modal">
      <div class="fullBg"></div>
      <div class="mian">
          <i class="fa fa-close" @click="closeLogin"></i>
          <div class="wrap">
              <div class="hd">安全退出提示</div>
              <div class="bd">
                <p>确定安全退出？</p>
              </div>
              <div class="ft clearfix">
                  <span class="fr sure" @click="overHandDuty()">是</span>
                  <span class="fl cancel" @click="cancel()">去交班</span>
              </div>
          </div>

      </div>
  </div>
</template>
<script>
  import publicFun from '@/js/public'
  import http from '@/js/http.js'
  import store from '@/store'
  export default {
    props: ['modal'],
    data () {
      return {
        msg: 'Welcome to Your Vue.js App',
      }
    },

    beforecreate:function(){
      
    }, 
    created:function(argument) {
        var that=this;
        that.cid=publicFun.fetch('cid');
    },
    mounted:function(){

    },
    methods:{
      cancel:function(){
        var that=this;
        store.commit('updateLogoutmodal', {isShow:false});
        that.$router.replace(`/handover`);

      },
      closeLogin(){
        store.commit('updateLogoutmodal', {isShow:false});
      },
      overHandDuty(){

        var that=this;
        var url="index.php?g=Home&m=repastPcApi&a=overHandDuty";
        var etime=that.setFormatDate(Date.parse(new Date())/1000);
        var params={
          cid:that.cid,
          etime:etime
        }
        clearInterval(publicFun.setInterval);
        http.get(url,params,'overHandDutyCallBack',that)
      },
      overHandDutyCallBack(res){
        var that=this;
        store.commit('updateLogoutmodal', {isShow:false})
        publicFun.showToast({
          isShow:true,
          type:4,
          mask:false,
          txt:res.msg,
          dur:1500
        })
        setTimeout(function(){
          publicFun.remove('isLogIn');
          that.$router.go(0)
        },1500)
      },
        setFormatDate(date){
          return publicFun.setDate(date);
        },

    },





    beforeDestroy () {

    },
    watch: {

    },
    computed: {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .modal{}
  .modal .fullBg{background-color: #000;left: 0;right: 0;bottom: 0;opacity: 0.5;position: fixed;top: 0;filter: alpha(opacity=50);-moz-opacity: 0.5;-khtml-opacity: 0.5;z-index: 20;width: 100%;}
  .modal .mian{position: fixed;top: 30%;left: 50%;margin-left: -250px;width: 500px;background-color:#fff;z-index: 21;text-align: center;border-radius: 8px}
  .modal .mian .wrap{padding: 0 28px}

  .modal .mian .hd{font-size: 24px;color: #333;border-bottom: 1px solid #eee;padding: 10px 0;margin-bottom: 10px}
  .modal .mian .bd{height:140px;}
  .modal .mian .bd p{line-height: 4;font-size: 35px}
  .modal .mian .ft{padding: 20px 0}
  .modal .mian .ft span{width: 200px;height: 40px;color: #fff;line-height: 40px;font-size: 18px;cursor: pointer;}
  .modal .mian .ft span.cancel{background: #CBCBCB;color: #fff}
  .modal .mian .ft span.sure{background: #ED881D;color: #fff}
  .modal .fa-close{position: absolute;right: 12px;top: 8px;font-size: 22px;cursor:pointer}
</style>
