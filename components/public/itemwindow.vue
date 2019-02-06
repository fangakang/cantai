<template>
	<div class="body_bg">
		<div class="multiAttrWindow">
		  <div class="fullBg" @click="xClosed"></div>
		  <div class="mian">
		      <div class="wrap">
	      			<!--<span class="fa fa-window-close-o xClosed" @click="xClosed"></span>-->
		          <div class="hd">{{multiAttrData.name}} ({{multiAttrData.opts.name}})</div>
		          <div class="bd">
		           	<div class="row">
		           		<span class="fl tit">份数：</span><div class="fl">
							<i class="fa fa-fw fa-minus-circle" @click="addAndReduce('reduce')"></i><input type="text" v-model="defaultNum" onkeyup="value=value.replace(/[^\d]/g,'') "
onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^\d]/g,''))"
ID="Text2" NAME="Text2" /><i class="fa fa-fw fa-plus-circle"  @click="addAndReduce('add')"></i>
		           		</div>
		           	</div>
		           	<div class="row">
		           		<span class="fl tit" style="line-height: 30px;height: 30px">做法：</span><div class="ofh attrs" v-if="multiAttrData.attrarray">
							<em v-for="(item,index) in multiAttrData.attrarray" @click="clicksx(item,index)" :class="{on:sxActive==index}">{{item}}</em>
		           		</div>
		           	</div>
		          </div>
		          <div class="ft clearfix">
		              <span class="fr sure" @click="addDish">确定</span>
		              <span class="fl cancel" @click="xClosed">取消</span>
		          </div>
		      </div>

		  </div>
		</div>
	</div>
</template>
<script>
	import store from '@/store'
	import {mapGetters} from 'vuex'
	import http from '@/js/http.js'
	import publicFun from '@/js/public'

  export default {
  	props:['xClosed','multiAttrData','tid'],
    data () {
      return {
              sxActive:0,
              defaultNum:1,
              singlePrice:0,
              singleStock:0,
              sxText:this.multiAttrData.attrarray[0],//属性文字
      }
    },

    beforecreate:function(){

    },
    created:function(argument) {

    },
    mounted:function(){

    	console.log(this.sxText)
    },
    methods:{
            clicksx(item,index){
                this.sxActive=index;
                // this.defaultNum=1;
                this.sxText=item
            },
            addAndReduce(type){
              var that=this;
            	if(type=="add"){
                if(this.defaultNum==that.multiAttrData.opts.inventory&&that.multiAttrData.opts.isstockopen!=0){
                  publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'已超出库存数量',
                    dur:1500
                  });
                  return false;
                }
            		this.defaultNum++
            	}else{
                if(this.defaultNum<=1) return false;
            		this.defaultNum--
            	}
            },
            addDish(){
            	var that=this;
    		    	var dish={};
    		    	if(that.defaultNum==0){

    					publicFun.showToast({
    						isShow:true,
    						type:2,
    						mask:false,
    						txt:'菜品数量不能为0',
    						dur:1500
    					});
    					return false
    		    	}
    		    	dish.pro_ids=that.multiAttrData.id;
    		    	dish.pro_num=parseInt(that.defaultNum);
      				dish.pro_name=that.multiAttrData.name;
    	    		dish.pro_price=that.multiAttrData.opts.price;
    		    	dish.pro_spec=that.multiAttrData.opts.name;
    		    	dish.pro_attr=that.sxText;
    		    	dish.pro_inventory=that.multiAttrData.opts.inventory;
    		    	dish.pro_isstockopen=that.multiAttrData.opts.isstockopen;
    		    	dish.pro_isopen=that.multiAttrData.opts.isopen;

      				publicFun.addDish(that.tid,dish);
              that.xClosed();
              that.defaultNum=1;

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
  .multiAttrWindow{position: absolute;top: 0;right: 0;left: 0;bottom: 0}
  .multiAttrWindow .fullBg{background-color: #000;left: 0;right: 0;bottom: 0;opacity: 0.5;position: fixed;top: 0;filter: alpha(opacity=50);-moz-opacity: 0.5;-khtml-opacity: 0.5;z-index: 20;width: 100%;}
  .multiAttrWindow .mian{position: fixed;top: 20%;left: 50%; margin-left: -300px;width: 600px;background-color:#fff;z-index: 21;text-align: center;border-radius: 8px;
	  padding: 20px;}
  .multiAttrWindow .mian .wrap{padding: 0 28px}

  .multiAttrWindow .mian .hd{font-size: 24px;color: #333;border-bottom: 1px solid #eee;padding:20px 0;margin-bottom: 10px}


  .multiAttrWindow .mian .bd .row{margin-top: 20px}
  .multiAttrWindow .mian .bd span.tit{float: left;font-size: 18px;height: 40px;line-height: 40px}
  .multiAttrWindow .mian .bd input{height: 40px;line-height: 40px;text-align: center;width: 370px;border: 1px solid #eee;margin: 0 10px}
  .multiAttrWindow .mian .bd .fa{font-size: 30px;vertical-align: middle;color: #fa8b2e;cursor: pointer;}
  .multiAttrWindow .mian .bd .fa:hover{ color:#fa8b2e}
  .multiAttrWindow .mian .bd .attrs{margin-left: -15px}
  .multiAttrWindow .mian .bd em{display: inline-block;width: 100px;height: 30px;border: 1px solid #eee;line-height: 30px;float: left;margin-left: 15px;margin-bottom: 15px;cursor: pointer;font-size: 15px; border-radius: 3px; color:#999}
  .multiAttrWindow .mian .bd em.on{background: #fa8b2e;color: #fff;border-radius: 3px; border-color: #fa8b2e}
  .multiAttrWindow .mian .ft{padding: 20px 0}
  .multiAttrWindow .mian .ft span{width: 200px;height: 50px;color: #fff;line-height: 50px;font-size: 18px;cursor: pointer; border-radius:3px}
  .multiAttrWindow .mian .ft span.cancel{background: #CBCBCB;color: #fff}
  .multiAttrWindow .mian .ft span.sure{background: #ED881D;color: #fff}

  .multiAttrWindow .xClosed{position: absolute;right: 15px;top: 15px;font-size: 26px;color: #fa8b2e;cursor: pointer;}

</style>
