<template>
  <div class="toast">
      <div class="fullBg" v-if="toast.mask"></div>
      <div class="mian">
          <i  v-if="toast.type!=0">
            <img :src="filterImg(toast.type)">
          </i>
          <p v-if="toast.txt!=''">{{toast.txt}}</p>
      </div>
  </div>
</template>
<script>
     import tip from '@/assets/tip.png'
     import warning from '@/assets/warning.png'
     import fail from '@/assets/fail.png'
     import success from '@/assets/success.png'

  export default {
    props: ['toast'],
    data () {
      return {
        msg: 'Welcome to Your Vue.js App',
        toastImg:{
          tip:tip,
          warning:warning,
          fail:fail,
          success:success
        }
      }
    },

    beforecreate:function(){
      
    }, 
    created:function(argument) {

    },
    mounted:function(){

      console.log(this.toast)
    },
    methods:{
      filterImg:function(type){
        let thisType;
        if(type==1){
          return this.toastImg.tip
        }
        if(type==2){
          return this.toastImg.warning
        }
        if(type==3){
          return this.toastImg.fail
        }
        if(type==4){
          return this.toastImg.success
        }
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
  .toast{}
  .toast .fullBg{background-color: #000;left: 0;right: 0;bottom: 0;opacity: 0.5;position: fixed;top: 0;filter: alpha(opacity=50);-moz-opacity: 0.5;-khtml-opacity: 0.5;z-index: 20;width: 100%;}
  .toast .mian{position: fixed;top: 50%;left: 50%;margin-top:-100px;margin-left: -150px;width: 300px;;background-color: rgba(0,0,0,.5);z-index: 101;text-align: center;border-radius: 8px}
  .toast .mian.nobg{background-color: none}
  .toast .mian i{width: 100px;height: 100px;display: inline-block;margin-top: 20px;}
  .toast .mian i img{display: block;width: 100%;height: 100%}
  .toast .mian p{font-size: 18px;color:#fff;line-height: 1;padding: 20px 0}

</style>
