<template>
  <div id="app" ref="app" :style="{height:fullHeight+'px'}">
    <router-view/>
    <loading v-if="loading.isShow" :loading="loading"></loading>
    <polling v-if="polling.isShow" :polling="polling"></polling>
    <toast v-if="toast.isShow" :toast="toast"></toast>
    <modal v-if="modal.isShow" :modal="modal"></modal>
    <logoutmodal v-if="logoutmodal.isShow"></logoutmodal>
  </div>
</template>

<script>
  import store from './store'
  import {mapGetters} from 'vuex'
  import polling from '@/components/public/interactive/polling'
  import loading from '@/components/public/interactive/loading'
  import toast from '@/components/public/interactive/toast'
  import modal from '@/components/public/interactive/modal'
  import logoutmodal from '@/components/public/interactive/logoutmodal'
  import publicFun from '@/js/public'

export default {

  components:{loading,toast,modal,logoutmodal,polling},
  name: 'App',
  store,
  // mounted:function(){
  //     let w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  //     let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  //     this.$refs.app.style.height = h + 'px';
  //     // this.$refs.rightAnswer.style.height = h + 'px';
  //     // this.$refs.sc.style.height = h + 'px';
  //     console.log(this.loading)
  // },

  data (){
      return {
          fullHeight: document.documentElement.clientHeight,
          ishow:false
      }
  },
  mounted() {
      const that = this
      console.log(that.logoutmodal)
      window.onresize = () => {
        return (() => {
          window.fullHeight = document.documentElement.clientHeight
          that.fullHeight = window.fullHeight
          console.log(that.fullHeight);
        })()
      }
  }, 
  watch: {
      fullHeight (val) {
        if(!this.timer) {
          this.fullHeight = val
          this.timer = true
          let that = this
          setTimeout(function (){
            that.timer = false
          },400)
        }
      }
  },
  computed:{
    ...mapGetters({
      loading:'loading',
      polling:'polling',
      toast:'toast',
      modal:'modal',
      logoutmodal:'logoutmodal'
    })
  },


}
</script>

<style>
/*#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}*/
</style>
