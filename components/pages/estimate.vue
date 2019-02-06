<template>
	<div class="body_bg">
	<div class="order">
		<headbar @childEvent="searchEvent"></headbar>
		<div class="mainInner">
			<div class="menu">

					<div class="hd">
						<div class="topClip">
						</div>
						<div class="wrap">
							<div class="eTop">
							<span class="cancelAll fr" @click="unCheckSellAll">全部取消</span>
							<h3 class="fl">已沽清种类：{{checksellData.length}}</h3>
							</div>
						</div>
					</div>
					<div class="bd">
						<div class="top">
							<div class="wrap">
								<span class="name">菜名</span>
								<!-- <span>剩余</span> -->
								<span>沽清</span>
								<span>操作</span>
							</div>
						</div>
						<div class="lists">
							<div class="wrap">

								<div class="row" v-for="item in estimatedData[estimatedIndex]">
									<span class="name">{{item.name}}<em v-if="item.spec&&item.spec!=''">({{item.spec}})</em></span>
									<!-- <span>{{item.inventory}}</span> -->
									<span>{{item.inventory}}</span>
									<span @click="unCheckSell(item)">
										<em class="cancel">取消</em>
									</span>
								</div>
							</div>
						</div>
					</div>
					<div class="ft" v-if="estimatedData.length > 1">
						<!-- <div class="wrap">
							<div class="tr page">
								<span @click="estimatedPrevAndNext('prev')">上一页</span>
								<span @click="estimatedPrevAndNext('next')">下一页</span>
							</div>
						</div> -->
						<div class="wrap">
							<div class="dishNum clearfix">
								<span class="fr page">
									<i class="fa fa-fw fa-chevron-circle-left"  @click="estimatedPrevAndNext('prev')"></i><i class="fa fa-fw fa-chevron-circle-right"  @click="estimatedPrevAndNext('next')"></i>
								</span>
								<span class="fr mr5 mypage">
									{{estimatedIndex+1}}/{{estimatedData.length}}
								</span>
							</div>
						</div>
					</div>
			</div>
<!-- 			<div class="leftft">
				<span class="fr">
					<i class="fa fa-fw fa-hourglass-2"></i><em class="">等叫</em>
				</span>
				<span class="fl">
					<i class="fa fa-fw fa-edit"></i><em class="">备注</em>
				</span>
			</div> -->
			<div class="rightMain">
				<div class="hd clearfix">
						<!-- 					<div class="fr searchInput">
						<div class="searchInputWrap clearfix">
							<div class="icon fl" @click="searchNow()">
								<i class="fa fa-fw fa-search"></i>
							</div>
							<input type="text" class="fl" name="" v-model="search" placeholder="输入助记码搜索" />
						</div>
					</div> -->
					<div class=" navs ofh">
						<ul>
							<li :style="{width: navWidth + 'px'}" v-for="(item,index) in showlist" :class='{on:navIndex==index,two:item && item.group_name && item.group_name.length > 5}' @click="navClickThis(index)">
								{{item.group_name}}
							</li>
							<li class="span more" :class="{on : hidenavsIndex != null}" v-if="hidelist.length > 0" :style="{width: navWidth + 'px'}">
								更多
								<div class="moreNavs">
									<li v-for="(item,index) in hidelist" :class="{'on':hidenavsIndex==index}" @click="navClickThis(index,true)">{{item.group_name}}</li>
								</div>
							</li>
							<div class="maskbg" :style="{left: leftWidth + 'px'}"></div>
						</ul>
					</div>
				</div>
				<div class="bd">
					<div class="noData" v-if="noData">
						<img src="../../assets/noDish.png" alt="">
						<p>找不到对应菜品哦~</p>
					</div>
					<ul v-if="pageData&&pageData.lists">
<!-- 						<li v-for="(item,index) in pageData.lists[currentPage]" :class="{on:item.checksell!=0||(item.opts&&item.opts.checksell!=0)}"  v-if="(item.opts&&(item.opts.isstockopen!=0&&item.opts.inventory>0)||item.opts&&item.opts.isstockopen==0)||(!item.opts&&(item.isstockopen!=0&&item.instock>0)||!item.opts&&item.isstockopen==0)" @click="dishClick(item)">
 -->						<li v-for="(item,index) in pageData.lists[currentPage]" :class="{on:item.checksell!=0||(item.opts&&item.opts.checksell!=0)}" @click="dishClick(item)"  :style="{width:boxWidth}">
	 						<div class="liwrap">
								<div class="h3">
									<div class="">
										<div class="text">
											{{item.name}}<em v-if="item.opts">({{item.opts.name}})</em>
										</div>
									</div>
								</div>
								<div class="p clearfix" v-if="item.opts"><div class="wrap"><span class="fl" v-if="item.opts.isstockopen!=0&&item.opts.checksell!=0">{{item.opts.inventory<1?'已售完':'剩'+item.opts.inventory+'份'}}</span>￥{{item.opts.price}}</div></div>
								<div class="p clearfix" v-else><div class="wrap"><span class="fl" v-if="item.isstockopen!=0&&item.checksell!=0">{{item.instock<1?'已售完':'剩'+item.instock+'份'}}</span>￥{{item.price}}</div></div>
	 						</div>
						</li>
					</ul>
				</div>
				<div class="ft">
					<div class="fr" v-if="pageData&&pageData.lists&&pageData.lists.length>1">
						<div class="page fl">共{{pageData.list.length}}道，{{currentPage+1}}/{{pageData.lists.length}}</div>
						<div class="pageArrow fl">
							<i class="fa fa-fw fa-chevron-up" :class="{opacity: currentPage+1 == 1}" @click="nextAndPrev('prev')"></i><i :class="{opacity: currentPage+1 == pageData.lists.length}" class="fa fa-fw fa-chevron-down"  @click="nextAndPrev('next')"></i>
						</div>
					</div>
				</div>
			</div>
		</div>
		<fullbg v-if="bgshow"></fullbg>
		<div class="window estimateWindow dalog" v-if="isestimateWindow">
			<div class="wrap">
				<div class="hd">
					<h3>{{waiting.name}} <em v-if="waiting.opts">({{waiting.opts.name}})</em></h3>
				</div>
				<div class="bd">
		           	<div class="row" style="width: 100%">
		           		<span class="fl tit">沽清数量：</span><div class="fl">
							<i class="fa fa-fw fa-minus-circle" @click="enumAddAndReduce('reduce')"></i><input type="text" maxlength="4" v-model="eNum" onkeyup="value=value.replace(/[^\d]/g,'') "
onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^\d]/g,''))"
ID="Text2" NAME="Text2" /><i class="fa fa-fw fa-plus-circle" @click="enumAddAndReduce('add')"></i>
		           		</div>
		           	</div>
<!-- 		           	<p class="tc red" style="font-size: 16px" v-if="waiting.isstockopen!=0||(waiting.opts&&waiting.opts.isstockopen!=0)">沽清数量不能大于当前剩余的库存数量</p>
 -->
 					</div>
				<div class="ft clearfix">
				  <span class="fr sure" @click="checkSell">确定</span>
				  <span class="fl cancel" @click="cancelWindow">取消</span>
				</div>
			</div>

		</div>
	</div>
	</div>
</template>
<script>
	import headbar from '@/components/public/headbar'
	import store from '@/store'
	import {mapGetters} from 'vuex'
	import http from '@/js/http.js'
	import publicFun from '@/js/public'
	import fullbg from '@/components/public/fullbg'
	import _ from "lodash";
  export default {

	components:{headbar,fullbg},
	store,
    data () {
      return {
        msg: 'Welcome to Your Vue.js App',
        navIndex:0,
        dlist:[],
        pageData:[],
        currentPage:0,
        isestimateWindow:false,
        bgshow:false,
        eNum:0,
        estimatedData:[],
        estimatedIndex:0,
        waiting:'',//等待被沽清
		checksellData:[],
		boxWidth:'',
		hidelist:[],
		showlist:[],
		leftWidth:'',
		navWidth:'',
		hidenavsIndex:null,
		refresh:0,
	    pageInit:0,
		search:'',
		noData:false,
      }
    },

    beforecreate:function(){

    },
    created:function(argument) {
        store.commit('searchVisi',1)
		var windWid = window.outerWidth,leftWidth;
		windWid >= 1500 ? this.boxWidth = '20%' : this.boxWidth = '25%'
		windWid > 1366 ? leftWidth =  546 :
				windWid > 1080 ? leftWidth =  486 :
					windWid > 1024 ? leftWidth = 416 :
									leftWidth =  396
		this.leftWidth = leftWidth
    	var that=this;
		that.cid=publicFun.fetch('cid');
	    that.tid = this.$route.query.tid;
		that.apiDishMenu();
    },
    mounted:function(){
		var that=this;
        clearInterval(publicFun.setInterval);
    },
    methods:{
        searchEvent(msg){
            var that=this;
            that.search=msg;
            that.apiDishMenu();
		},
    	apiDishMenu:function(){
    		var that=this;
    		var url="index.php?g=Home&m=repastPcApi&a=checkDishMenu";
    		var params={cid:that.cid,search:that.search,refresh:that.refresh++};
    		http.get(url,params,'apiDishMenuCallBack',that);
    	},
    	apiDishMenuCallBack:function(res){
    		var that=this;
            if(res!=undefined){
                publicFun.timer(that.apiDishMenu)
                that.pageInit=1;//首次进入页面，轮询成功
            }else{//轮询失败
                store.commit('updateLoadingStatus', {ishow:true,mask:true});
            };
            if(res.datas.dlist==''){
                that.pageData=[];
                that.noData=true;
                return;
            }else{
                that.noData=false;
            }
    		var dlist=res.datas.dlist;
    		var obj={
    			group_id:'',
    			group_name:'全部',
    			list:[]
    		}
    		for(let v of dlist){
    			var item=v.list;
    			obj.list=_.concat(obj.list,item);
    		}
    		dlist.unshift(obj);
    		that.dlist=dlist;
    		var transform;
    		for(let v of that.dlist){
    			var item=v.list;
    			if(item){
    				var chunkCountries =  _.chunk(item,20);
    				v.lists=chunkCountries;
    			}
			}

			let windWid = window.outerWidth,mainWid;

			mainWid = windWid - this.leftWidth

			windWid >= 1600 ? that.navWidth = 152:
				windWid >= 1366 ? that.navWidth = 128:
				windWid >= 1280 ? that.navWidth = 104 :
				windWid >= 1024 ? that.navWidth = 100 : that.navWidth = 80
			let num = Math.floor(mainWid / (that.navWidth+20))
			// console.log(mainWid,this.leftWidth)
			that.showlist = that.dlist.slice(0,num-1)
			that.hidelist = that.dlist.slice(num-1)

    		if(res.datas.checkSell!=''){
    			that.checksellData=res.datas.checkSell;
	    		that.estimatedData=_.chunk(res.datas.checkSell,10)
	    		// console.log(res.datas.checkSell)
    		}else{
    			that.checksellData=[];
	    		that.estimatedData=[];
    		}
			this.$nextTick(function () {
	    		that.pageData=that.dlist[that.navIndex];
	    		 // console.log(that.pageData);
			})
    	},
    	estimatedPrevAndNext(type){
    		var that=this;
    		if(type=="next"){
    			if(that.estimatedIndex==that.estimatedData.length-1) {
					publicFun.showToast({
						isShow:true,
						type:2,
						mask:true,
						txt:'已到最后一页',
						dur:1500
					})
    				return
    			};
    			that.estimatedIndex++
    		}else{
    			if(that.estimatedIndex==0) {
					publicFun.showToast({
						isShow:true,
						type:2,
						mask:true,
						txt:'已到首页',
						dur:1500
					})
    				return
    			};
    			that.estimatedIndex--
    		}
    	},
	    //分类点击触发事件
	    navClickThis(index,ishide){
			ishide ? this.hidenavsIndex = index : this.navIndex=index
			ishide ? this.navIndex = null : this.hidenavsIndex=null
			if(ishide) this.navIndex=index+this.showlist.length
//			ishide ? this.pageData=this.hidelist[index] : this.pageData=this.showlist[index]
			//console.log(this.navIndex)
	        this.currentPage=0;//一旦切换后重置为0;
	        // document.querySelector('.homeList').scrollTop = 0;
	        // console.log(this.hidenavsIndex);
			this.apiDishMenu();
	    },
	    nextAndPrev:function(type){
	    	var that=this;

	    	if(type=="prev"){
	    		that.currentPage--
	    		if(that.currentPage<0){
	    			that.currentPage=0
					publicFun.showToast({
						isShow:true,
						type:2,
						mask:true,
						txt:'已到首页',
						dur:1500
					})


	    		}
	    	}else{
	    		that.currentPage++
	    		if(that.currentPage>that.pageData.lists.length-1){
	    			that.currentPage=that.pageData.lists.length-1
					publicFun.showToast({
						isShow:true,
						type:2,
						mask:true,
						txt:'已到最后一页',
						dur:1500
					})

	    		}
	    	}
	    },

	    isCheckSell:function(item){
	    	var that=this;

	    	for(let v of that.checksellData){
	    		if(item.opts){
	    			if(v.did==item.id&&v.spec==item.opts.name){
	    				return true
	    			}
	    		}else{
	    			if(v.did==item.id){
	    				return true
	    			}
	    		}
	    	}
	    	return false;
	    },
    	enumAddAndReduce:function(type){
    		var that=this;

    		if(type=='add'){
    			if(that.waiting.opts){
    				// if(that.eNum>=that.waiting.opts.inventory&&that.waiting.opts.isstockopen!=0){

	       //            publicFun.showToast({
	       //              isShow:true,
	       //              type:2,
	       //              mask:false,
	       //              txt:'已达库存上限',
	       //              dur:1500
	       //            })
	       //            return
    				// }
    			}else{
	    			// if(that.eNum>=that.waiting.instock&&that.waiting.isstockopen!=0){
	       //            publicFun.showToast({
	       //              isShow:true,
	       //              type:2,
	       //              mask:false,
	       //              txt:'已达库存上限',
	       //              dur:1500
	       //            })
	       //            return
	    			// }
    			}
				that.eNum++;
    		}else{
    			if(that.eNum==0) return
    			that.eNum--
    		}
    	},
 		checkSell(){
 			var that=this;
 			if(that.eNum===''){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'请输入数量',
                    dur:1500
                })
				return
			};
			if(that.waiting.opts){
				// if(that.eNum>that.waiting.opts.inventory&&that.waiting.opts.isstockopen!=0){

    //               publicFun.showToast({
    //                 isShow:true,
    //                 type:2,
    //                 mask:false,
    //                 txt:'已达库存上限',
    //                 dur:1500
    //               })
    //               return
				// }
			}else{
    			// if(that.eNum>that.waiting.instock&&that.waiting.isstockopen!=0){
       //            publicFun.showToast({
       //              isShow:true,
       //              type:2,
       //              mask:false,
       //              txt:'已达库存上限',
       //              dur:1500
       //            })
       //            return
    			// }
			}
			// if(that.eNum==0) return;
			var url="index.php?g=Home&m=repastPcApi&a=checkSell";
			var params={
				cid:that.cid,
				did:that.waiting.id,
				skuid:that.waiting.opts?that.waiting.opts.skuid:0,
				inventory:that.eNum
			}
			http.post(url,params,'checkSellCallBack',that);
 		},
 		checkSellCallBack(res){
 			var that=this;
	          publicFun.showToast({
	            isShow:true,
	            type:4,
	            mask:false,
	            txt:res.msg,
	            dur:500
	          })
	          that.cancelWindow();
	          that.apiDishMenu();

 		},
    	cancelWindow:function(){
    		var that=this;
    		that.isestimateWindow=false;
    		that.bgshow=false;
    		that.eNum=0
    	},
    	dishClick(item){
    		var that=this;
    		//if(item.checksell!=0||(item.opts&&item.opts.checksell!=0)) return
    		that.waiting=item;
    		that.isestimateWindow=true;
    		that.bgshow=true;
    		that.eNum=0;
    	},
    	unCheckSellAll(){
    		var that=this;
    		if(that.checksellData.length==0){

		          publicFun.showToast({
		            isShow:true,
		            type:1,
		            mask:false,
		            txt:'无被沽清的菜品',
		            dur:500
		          })
    			return false
    		}


    		publicFun.showModal({
				isShow:true,
				mask:true,
				txt:'确定要全部取消吗？',
				confirm:that.unCheckSellAllMakeSure
			})
    	},
    	unCheckSellAllMakeSure(){
    		var that=this;
    		publicFun.hideModal();
    		var url="index.php?g=Home&m=repastPcApi&a=unCheckSellAll";
    		var params={
    			undishinfo:JSON.stringify(that.checksellData)
    		};
    		http.post(url,params,'unCheckSellCallBack',that);
    	},
    	unCheckSell(item){
    		var that=this;
    		that.unCheckSellData=item;
    		publicFun.showModal({
				isShow:true,
				mask:true,
				txt:'确定将'+item.name+'取消沽清吗?',
				confirm:that.unCheckSellMakeSure
			})
    	},
    	unCheckSellMakeSure(){
    		var that=this;
    		publicFun.hideModal();
    		var url="index.php?g=Home&m=repastPcApi&a=unCheckSell";
    		var params={
    			cid:that.cid,
    			did:that.unCheckSellData.did,
    			skuid:that.unCheckSellData.skuid?that.unCheckSellData.skuid:0
    		};
    		http.get(url,params,'unCheckSellCallBack',that);
    	},
    	unCheckSellCallBack(res){
 			var that=this;
	          publicFun.showToast({
	            isShow:true,
	            type:4,
	            mask:false,
	            txt:res.msg,
	            dur:500
	          })
	          that.apiDishMenu();
    	}
    },
    beforeDestroy () {

    },
    watch: {

    },
    computed: {
    ...mapGetters({
      tables:"tables",
      tableRemark:'tableRemark'
    })

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.noData{
		text-align: center;
		margin-top: 15%;
		font-size: 30px;
	}
	.noData p{
		margin-top: 10px;
	}
.order .rightMain .ft{bottom: 0;}
.order .rightMain .bd{bottom: 82px;}
.order .menu .bd .wrap>.row{margin-top: 0;}
.menu .hd {font-size: 26px;color: #48465b;font-weight: normal;border: 0}
.menu .hd h3{font-weight: normal;}
.menu .hd .eTop{margin-top: 45px;}
.menu .hd .cancelAll{background-color: #dbdbdb;font-size: 22px;padding: 5px 10px;border-radius: 5px;}
.menu .ft .page{text-align: right;}
.menu .ft .page span{font-size: 18px;color: #999;margin-left: 30px;cursor: pointer;}
.menu .bd {bottom: 54px}
.menu .bd .top {border-bottom: 1px solid #eee;height: 49px;line-height: 49px}
.menu .bd .top span{float: left;width: 23%;text-align: center;font-size: 24px;color: #48465b}
.menu .bd .top span.name{width: 52%;text-align: left;}
.menu .bd .lists{position: absolute;top: 50px;left: 0;right: 0;bottom: 0;overflow: auto;}
.menu .bd .lists .row{border-bottom: 1px dashed #eee;padding: 15px 0}
.menu .bd .lists .row span{float: left;width: 23%;text-align: center;color: #48465b;font-size: 20px}
.menu .bd .lists .row span.name{width: 52%;text-align: left;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}
.menu .bd .lists .row span em.cancel{display: inline-block;padding: 3px 15px;font-size: 20px;background: #dbdbdb;cursor: pointer;border-radius: 5px;}

.estimateWindow .row{width: 260px;margin: 0 auto}
.order .rightMain .navs ul li{padding: 0 5px;}
.order .rightMain .navs ul li.two{    display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;font-size: 22px;line-height: 36px;white-space: normal;}
@media screen and (max-height: 880px){
	.menu .bd .lists .row{padding: 10px 0}
}
@media screen and (max-width: 1600px){
	.menu .bd .lists .row span{font-size: 18px;}
	.menu .bd .lists .row span.name{font-size: 20px;}
	.menu .hd h3{font-size: 26px;}
	.menu .bd .lists .row span em.cancel,.menu .bd .lists .row span.name,.menu .bd .lists .row span{font-size: 18px;}
	.order .rightMain .navs ul li{font-size: 22px;}
	.order .rightMain .navs ul li.two{font-size: 22px;line-height: 36px;}
}
@media screen and (max-width: 1366px){
	.menu .bd .lists .row span{font-size: 16px;}
	.menu .bd .top span{font-size: 16px;}
	.order .rightMain .ft{bottom: 15px;}
	.menu .hd h3,.menu .hd .cancelAll{font-size: 20px;}
	.order .menu .bd{top:106px;}
	.menu .bd .lists .row span em.cancel,.menu .bd .lists .row span.name,.menu .bd .lists .row span{font-size: 16px;}
	.order .rightMain .navs ul li{font-size: 20px;}
	.order .rightMain .navs ul li.two{    display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;font-size: 20px;line-height: 28px;white-space: normal;}
}
@media screen and (max-width: 1280px){
	.menu .bd .top span{font-size: 16px;}
	.eTop h3{font-size: 24px;}
	.menu .hd h3{font-size: 22px;}
	.menu .hd h3,.menu .hd .cancelAll{font-size: 18px;}
	.order .rightMain .navs ul li{font-size:18px;}
	.navs .maskbg{top: 120px;}

	/*.sendModal .reasonInput{*/
		/*width: 245px;*/
	/*}*/
}
@media screen and (max-width: 1100px){
	.menu .hd h3,.menu .hd .cancelAll{font-size: 16px;}
	.menu .bd .lists .row span em.cancel,.menu .bd .lists .row span.name,.menu .bd .lists .row span,.menu .bd .top span{font-size: 14px;}
	.eTop h3{font-size: 18px;}
	.lists .row span,.menu .bd .lists .row span em.cancel,.menu .bd .lists .row span,.menu .bd .lists .row span em,.menu .bd .top span{font-size: 14px;}
	.menu .hd .cancelAll{font-size: 14px;}
	.order .menu .bd{top:94px;}
	.menu .bd .lists .row{padding: 5px 0;}
	.menu .hd h3{font-size: 18px;}
	.menu .bd .lists .row span em.cancel{padding: 3px 10px;}
}
@media screen and (max-width: 1024px){
	.order .rightMain .navs ul li{
		height: 50px;
		line-height: 50px;
	}
	.order .rightMain .bd{
		top:65px
	}
}

</style>
