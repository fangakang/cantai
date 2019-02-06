<template>
  <div class="modal">
      <div class="fullBg" v-if="modal.mask" ></div>
      <div class="mian">
          <div class="wrap">
              <div class="hd">提示</div>
              <div class="bd">
                <p>{{modal.txt}}</p>
              </div>
              <div class="ft clearfix">
                  <span class="fr sure" @click="modal.confirm()">确定</span>
                  <span class="fl cancel" @click="modal.cancel()" v-if="modal.cancel!=''">取消</span>
                  <span class="fl cancel" @click="cancel()" v-else>取消</span>
              </div>
          </div>

      </div>
  </div>
</template>
<script>
  import publicFun from '@/js/public'
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

    },
    mounted:function(){

    },
    methods:{
      cancel:function(){
        var that=this;
        publicFun.hideModal();
      }
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
  .modal .mian{position: fixed;top: 20%;left: 50%;margin-left: -250px;width: 500px;background-color:#fff;z-index: 21;text-align: center;border-radius: 8px}
  .modal .mian .wrap{padding: 0 28px}

  .modal .mian .hd{font-size: 24px;color: #333;border-bottom: 1px solid #eee;padding: 10px 0;margin-bottom: 10px}
  .modal .mian .bd p{line-height: 1.5;font-size: 18px;height:110px;padding-top: 40px;}
  .modal .mian .ft{padding: 20px 0}
  .modal .mian .ft span{width: 200px;height: 40px;color: #fff;line-height: 40px;font-size: 18px;cursor: pointer;}
  .modal .mian .ft span.cancel{background: #CBCBCB;color: #fff}
  .modal .mian .ft span.sure{background: #ED881D;color: #fff}

</style>
