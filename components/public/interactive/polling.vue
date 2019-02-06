<template>
    <div class="loading">
        <div class="fullBg" v-if="polling.mask"></div>
        <div class="mian" :class="polling.mask?'':'nobg'">
            <i>
                <img src="../../../assets/loading.gif">
            </i>
            <p v-if="polling.istxt">{{polling.txt}}</p>
        </div>
    </div>
</template>
<script>
    export default {
        props: ['polling'],
        data () {
            return {
                msg: 'Welcome to Your Vue.js App'
            }
        },

        beforecreate:function(){

        },
        created:function(argument) {

        },
        mounted:function(){

            console.log(this.loading)
        },
        methods:{

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
    .loading{}
    .loading .fullBg{background-color: #000;left: 0;right: 0;bottom: 0;opacity: 0.4;position: fixed;top: 0;filter: alpha(opacity=40);-moz-opacity: 0.4;-khtml-opacity: 0.4;z-index: 20;width: 100%;}
    .loading .mian{position: fixed;top: 50%;left: 50%;margin-top:-100px;margin-left: -150px;width: 300px;;background-color: rgba(0,0,0,.5);z-index: 21;text-align: center;border-radius: 8px}
    .loading .mian.nobg{background-color: none}
    .loading .mian i{width: 100px;height: 100px;display: inline-block;margin: 40px 0 20px 0}
    .loading .mian i img{display: block;width: 100%;height: 100%}
    .loading .mian p{font-size: 18px;color:#fff;line-height: 1;padding-bottom: 20px}

</style>
