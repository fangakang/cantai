<template>
	<div class="body_bg">
	<div class="order">
		<headbar @childEvent="searchEvent"></headbar>
		<div class="mainInner">
			<div class="menu">
					<div class="hd" v-if="tableInfo">
						<div class="topClip">
						</div>
						<div class="wrap">
							<div class="top clearfix">
								<span class="fr w45 waiter">服务员：{{tableInfo.staffname}}</span>
								<span class="fl w45 tableNo">
									台号：{{tableInfo.classify +'-'+tableInfo.t_name}}
								</span>
							</div>
							<div>
								<p class="fl">客人数：{{tableInfo.pnum}}/{{tableInfo.t_num}}</p>
								<p class="fr">开台时间：{{handleTime(tableInfo.opentime)}}</p>
							</div>
						</div>
					</div>
					<div class="bd">
						<div class="wrap">
							<ul>
								<li v-for="item in dishPageData[dishPageIndex]" v-if="item.pro_num>0">
									<div class="thisDish clearfix">
										<div class="fr ctrlBtn">
											<i class="fa fa-fw fa-minus-circle" @click="leftAddAndReduce('reduce',item)"></i>
												<!--<input class="orderNum" type="text" v-on:input="orderInput(item)" v-model="item.pro_num" onkeyup="value=value.replace(/[^0-9]/g,'')">-->
												<em>{{item.pro_num}}</em>
											<i class="fa fa-fw fa-plus-circle" @click="leftAddAndReduce('add',item)"></i>
										</div>
										<span class="fl name" @click.self="toggleSubItem(item,$event)"><i class="fa fa-fw"  v-if="item.pro_dpackage"></i>{{item.pro_name}}</span>
										<!--按照禅道改成单价-->
										<!--span class="fl price">￥{{calcPrice(item.pro_price,item.pro_num)}}</span-->
										<span class="fl price">￥{{item.pro_price}}</span>
									</div>

									<div class="subDish" v-if="item.pro_dpackage">
										<div class="wrap">
											<div class="row clearfix" v-for="subItem in item.pro_dpackage">
												<p class="clearfix">
<!-- 													<span class="fr">x{{subItem.num}}</span>
 -->													<span class="fl">{{subItem.name}}</span>
												</p>
												<p class="tt"><em v-if="subItem.spec&&subItem.spec!=''">{{subItem.spec}}&nbsp;</em><em v-if="subItem.attr&&subItem.attr!=''">{{subItem.attr}}</em></p>
											</div>
										</div>
									</div>

									<div class="attr grayText"><em v-if="item.pro_spec">{{item.pro_spec}}</em><em v-if="item.pro_attr">&nbsp;&nbsp;/&nbsp;&nbsp;{{item.pro_attr}}</em></div>
								</li>
							</ul>
						</div>
					</div>
					<div class="ft">
						<div class="wrap">
							<div class="dishNum clearfix">
								<span class="fr page" v-if="dishPageData.length > 1">
									<i class="fa fa-fw fa-chevron-circle-left" @click="dishPagePrevAndNext('prev')"></i><i class="fa fa-fw fa-chevron-circle-right" @click="dishPagePrevAndNext('next')"></i>
								</span>
								<span class="fl nums">已点餐品：{{totalnums}}</span>
								<span class="fr mr5 mypage" @click="clearCart" v-if="dishPageData.length > 1">
									{{dishPageIndex + 1}}/{{dishPageData.length}}
								</span>

							</div>
							<div class="delAll" @click="clearCart" v-if="tables[tid]&&tables[tid].length>0">
								<i class="fa fa-fw fa-trash-o"></i><em>清空</em>
							</div>
							<div class="remarks">
								<div class="wrap">
									<span class="fl">
										整单备注：
									</span>
									<div class="ofh">
										<textarea v-model="remark"></textarea>
									</div>
								</div>
							</div>
							<div class="total">
								<div class="wrap clearfix">
									<span class="fr">
										<em>原价:</em><span class="zprice">￥{{totalprice}}</span>
									</span>
								</div>
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
							<li v-for="(item,index) in showlist" :class='{on:navIndex==index,two:item && item.group_name && item.group_name.length > 5}' @click="navClickThis(index)" :style="{width: navWidth + 'px'}">
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
						<!--<input class="searchPart" placeholder="请输入搜索内容" v-model="search" type="text" v-on:blur="searchTarget"/>-->
					</div>
				</div>
				<div class="bd">
					<div class="noData" v-if="noData">
						<img src="../../assets/noDish.png" alt="">
						<p>找不到对应菜品哦~</p>
					</div>
					<ul v-if="pageData&&pageData.lists">
						<!-- 						<li v-for="(item,index) in pageData.lists[currentPage]" :class="{on:isInCart(item)}" @click="rightAddDish(item)" v-if="(item.opts&&(item.opts.isstockopen!=0&&item.opts.inventory>0)||item.opts&&item.opts.isstockopen==0)||(!item.opts&&(item.isstockopen!=0&&item.instock>0)||!item.opts&&item.isstockopen==0)">
						 -->
						<li v-for="(item,index) in pageData.lists[currentPage]" :class="{on:isInCart(item)}" @click="rightAddDish(item)" :style="{height:boxHeight + 'px',width:boxWidth}">
							<div class="liwrap">
								<div class="h3" :style="{height:h3Hei + 'px'}">
									<div class="">
										<div class="text">
											{{item.name}}<em v-if="item.opts">({{item.opts.name}})</em>
										</div>
									</div>
								</div>
								<div class="mod" v-if="item.opts">
									<!--div class="row" v-if="item.opts&&item.opts.isstockopen!=0&&item.opts.inventory>0">
										<div class="p"><div class="wrap"><span class="fl" v-if="item.opts.isstockopen!=0&&isInCart(item)">{{'剩'+item.opts.inventory+'份'}}</span>￥{{item.opts.price}}</div></div>
									</div-->

									<div class="row" v-if="item.opts&&item.opts.isstockopen!=0&&item.opts.inventory>0">
										<div class="p"><div class="wrap"><span class="fl"  v-if="item.plimit&&item.plimit>0">限{{item.plimit}}份</span>￥{{item.opts.price}}</div></div>
									</div>
									<div class="row" v-if="item.opts&&item.opts.isstockopen==0">
										<div class="p"><div class="wrap"><span class="fl" v-if="item.plimit&&item.plimit>0">限{{item.plimit}}份</span>￥{{item.opts.price}}</div></div>
									</div>
									<div class="row" v-if="item.opts&&item.opts.isstockopen!=0&&item.opts.inventory<1">
										<div class="p"><div class="wrap"><span class="fl">已售罄</span>￥{{item.opts.price}}</div></div>
									</div>
								</div>
								<div class="mod" v-else>

									<!--div class="row" v-if="item.isstockopen!=0&&item.instock>0">
										<div class="p"><div class="wrap"><span class="fl" v-if="item.isstockopen!=0&&isInCart(item)">{{'剩'+item.instock+'份'}}</span>￥{{item.price}}</div></div>
									</div-->
									<div class="row" v-if="item.isstockopen!=0&&item.instock>0">
										<div class="p"><div class="wrap"><span class="fl" v-if="item.plimit&&item.plimit>0">限{{item.plimit}}份</span>￥{{item.price}}</div></div>
									</div>
									<div class="row" v-if="item.isstockopen==0">
										<div class="p"><div class="wrap"><span class="fl" v-if="item.plimit&&item.plimit>0">限{{item.plimit}}份</span>￥{{item.price}}</div></div>
									</div>
									<div class="row" v-if="item.isstockopen!=0&&item.instock<1">
										<div class="p"><div class="wrap"><span class="fl">已售罄</span>￥{{item.price}}</div></div>
									</div>




								</div>
							</div>

						</li>
						<!--<li class="on">
							<div class="h3 disTable">
								<div class="disTable-cell">
									<span>
										测试套餐
									</span>
								</div>
							</div>
							<div class="p"><div class="wrap">￥50.00</div></div>
						</li>-->
					</ul>
				</div>
				<div class="ft">
					<div class="fr" v-if="pageData&&pageData.lists&&pageData.lists.length>1">
						<div class="pageArrow fr">
							<i class="fa fa-fw fa-chevron-up" :class="{opacity: currentPage+1 == 1}" @click="nextAndPrev('prev')"></i><i class="fa fa-fw fa-chevron-down" :class="{opacity: currentPage+1 == pageData.lists.length}"  @click="nextAndPrev('next')"></i>
						</div>
						<div class="page fr">共{{pageData.list.length}}道，{{currentPage+1}}/{{pageData.lists.length}}</div>
					</div>
					<div class="fl btns">
						<span class="cancel"  @click="clearTable" v-if="oid==0">
							<em class="">撤   台</em>
						</span>
<!-- 						<span @click="submitDish">
							<em class="">下   单</em>
						</span>
 -->						<span class="order" @click="submitDishMakeSure">
							<em class="">下   单</em>
						</span>
					</div>
				</div>
			</div>
		</div>
		<itemwindow v-if="isMultiAttrWindow" :xClosed="xClosed" :multiAttrData="multiAttrData" :tid="tid"></itemwindow>
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
	import itemwindow from '@/components/public/itemwindow'
	import _ from "lodash";
  export default {

	components:{headbar,fullbg,itemwindow},
	store,
    data () {
      return {
        search:'',
        msg: 'Welcome to Your Vue.js App',
        navIndex:0,
        dlist:[],
        pageData:[],
        currentPage:0,
        isMultiAttrWindow:false,
        oid:0,
        tableInfo:'',
        totalnums:0,
        totalprice:0.00,
        remark:'',
        dishPageData:[],
		dishPageIndex:0,
		hidenavsIndex:null,
		hidelist:[],
		showlist:[],
		navWidth:'',
		leftWidth:'',
		h3Hei:'',
		boxHeight:'',
		boxWidth:'20%',
		refresh:0,
	    pageInit:0,//初次进入页面
        roleModule:{},
		noData:false,
		}
    },

    beforecreate:function(){

    },
    created:function(argument) {
        store.commit('searchVisi',1)
    	var that=this;
		var clientHei,bdHei,windWid = window.outerWidth,leftWidth;
		// document.documentElement ? clientHei = document.documentElement.clientHeight : clientHei = document.body.clientHeight
		// this.boxHeight = bdHei / 4
		// windWid >= 1366 ? bdHei = clientHei - 102 - 100 - 115 - 14 * 4 :
		// 				bdHei = clientHei - 62 - 100 - 115 - 14 * 5
		// windWid >= 1366 ? this.boxHeight = bdHei / 4 :
		// 					this.boxHeight = bdHei / 5
		// windWid >= 1900 ? this.h3Hei = this.boxHeight-50 :
		// 		windWid >= 1600 ? this.h3Hei = this.boxHeight-40 :
		// 		windWid >= 1366	? this.h3Hei = this.boxHeight-30 :
		// 		''
		// console.log(windWid,'windWid','bdHei',bdHei)
		windWid >= 1366 ? this.boxWidth = '20%' : this.boxWidth = '25%'
		windWid > 1366 ? leftWidth =  546 :
				windWid > 1080 ? leftWidth =  486 :
					windWid > 1024 ? leftWidth = 416 :
									leftWidth =  396
		this.leftWidth = leftWidth

		var query=this.$route.query;
		that.cid=publicFun.fetch('cid');

	    that.tid =query.tid;
	    if(query.from){
	    	that.oid=query.oid;
	    }
	    that.getTableInfo();
		that.apiDishMenu();
    },
    mounted:function(){
		var that=this;
        clearInterval(publicFun.setInterval);
        that.roleModule=publicFun.fetch('roleModule');

		//console.log(val)
		// console.log(that.tables[that.tid])
		// var nums=0,totalprice=0;
		// for(let v of that.tables[that.tid]){
		// 	nums+=v.pro_num;
		// 	totalprice+=v.pro_num*v.pro_price
		// }
		// that.totalnums=nums;
		// that.totalprice=totalprice.toFixed(2);
		that.$nextTick(function(){
			console.log(that.tables)
			//计算菜品价格数量，来源vuex
			if(that.tables){
				that.calcTable(that.tables)
			}
			//页面初始化给备注赋值，来源vuex
			if(that.tableRemark[that.tid]){
				that.remark=that.tableRemark[that.tid]
			}

		});
    },
    methods:{
        searchEvent(msg){
			var that=this;
			that.search=msg;
            that.apiDishMenu();
		},
        searchTarget(){
			var that=this;
			that.apiDishMenu();
		},
    	toggleSubItem(item,e){
    		if(!item.pro_dpackage) return
			var thisBoj=e.target
	        var par=e.target.parentNode.parentNode;
	        if(par.hasClass('on')){
	        	par.classList.remove("on")
	        }else{
	        	par.classList.add("on")
	        }
    	},
    	getTableInfo:function(){
    		var that=this;
    		var url="index.php?g=Home&m=repastPcApi&a=getTableDetail";
    		var params={
    			tid:that.tid,
    			cid:that.cid,
    			oid:that.oid
    		}
    		http.get(url,params,'getTableInfoCallBack',that)
    	},
    	getTableInfoCallBack:function(res){
    		var that=this;
    		// console.log(res)
    		that.tableInfo=res.datas
    	},
    	apiDishMenu:function(){
    		var that=this;
    		var url="index.php?g=Home&m=repastPcApi&a=apiDishMenu";
    		var params={cid:that.cid,search:that.search,refresh:that.refresh++};
    		http.get(url,params,'apiDishMenuCallBack',that);
    	},
    	apiDishMenuCallBack:function(res){
    		var that=this;
    		if(res!=undefined){
                publicFun.timer(that.apiDishMenu);
                that.pageInit=1;//首次进入页面，轮询成功
			}else{//轮询失败
                store.commit('updateLoadingStatus', {ishow:true,mask:true});
			}
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

			windWid >= 1600 ? that.navWidth = 158:
				windWid >= 1366 ? that.navWidth = 128:
				windWid >= 1280 ? that.navWidth =104 :
				windWid >= 1024 ? that.navWidth = 100 : that.navWidth = 80
			let num = Math.floor(mainWid / (that.navWidth + 10))
			that.showlist = that.dlist.slice(0,num-1)
			that.hidelist = that.dlist.slice(num-1)



			this.$nextTick(function () {
	    		that.pageData=that.dlist[that.navIndex];
	    		// console.log(that.pageData);
			})
    	},
	    //分类点击触发事件
	    navClickThis(index,ishide){
			ishide ? this.hidenavsIndex = index : this.navIndex=index
			ishide ? this.navIndex = null : this.hidenavsIndex=null
			if(ishide) this.navIndex=index+this.showlist.length
//			ishide ? this.pageData=this.hidelist[index] : this.pageData=this.showlist[index]
			//console.log(this.navIndex)
	        this.currentPage=0;//一旦切换后重置为0;
            this.apiDishMenu();
	        // document.querySelector('.homeList').scrollTop = 0;
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
	    xClosed:function(){
	    	var that=this;
	    	//console.log(data)
	    	that.isMultiAttrWindow=false
	    },
	    rightAddDish(item){
	    	var that=this;
	    	if(that.roleModule.addOrder!=1){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'没有点菜权限',
                    dur:3000
                });
                return;
			}
	    	// if(isInCart) return false
	    	var dish={};
	    	if(item.attr==""&&!item.opts){
	    		dish.pro_ids=item.id;
	    		dish.pro_num=1;
	    		dish.pro_name=item.name;
	    		dish.pro_price=item.price;
	    		dish.pro_inventory=item.instock;
	    		dish.pro_isstockopen=item.isstockopen;
	    		dish.pro_isopen=item.isopen;
		    	if(item.plimit>0){
		    		dish.pro_plimit=item.plimit;
		    	}
	    		if(item.dpackage){
		    		dish.pro_dpackage=item.dpackage;
	    		}
	    	}else if(item.attr==""&&item.opts){
	    		dish.pro_ids=item.id;
	    		dish.pro_num=1;
	    		dish.pro_name=item.name;
	    		dish.pro_price=item.opts.price;
	    		dish.pro_spec=item.opts.name;
		    	dish.pro_inventory=item.opts.inventory;
		    	dish.pro_isstockopen=item.opts.isstockopen;
		    	dish.pro_isopen=item.opts.isopen;
		    	if(item.plimit>0){
		    		dish.pro_plimit=item.plimit;
		    	}
	    		if(item.dpackage){
		    		dish.pro_dpackage=item.dpackage;
	    		}

	    	}else if(item.attr!=""&&item.opts){
	    		item.attrarray=item.attr.split(",");



	    		if(item.attrarray.length>1){
	    			if(item.opts.inventory<1){
			          publicFun.showToast({
			            isShow:true,
			            type:2,
			            mask:false,
			            txt:'库存已达上限',
			            dur:500
			          })
	    				return;
	    			}
		    		that.isMultiAttrWindow=true;
		    		that.multiAttrData=item;
		    		return;
	    		}else{
	    		    console.log(dish)
		    		dish.pro_ids=item.id;
		    		dish.pro_num=1;
		    		dish.pro_name=item.name;
		    		dish.pro_price=item.opts.price;
		    		dish.pro_spec=item.opts.name;
		    		dish.pro_attr=item.attrarray[0];
			    	dish.pro_inventory=item.opts.inventory;
			    	dish.pro_isstockopen=item.opts.isstockopen;
			    	dish.pro_isopen=item.opts.isopen;
			    	if(item.plimit>0){
			    		dish.pro_plimit=item.plimit;
			    	}
		    		if(item.dpackage){
			    		dish.pro_dpackage=item.dpackage;
		    		}

	    		}
	    	}
			publicFun.addDish(that.tid,dish);
	    },
	    clearTable(){
	    	var that=this;
			publicFun.showModal({
				isShow:true,
				mask:true,
				txt:'确定要撤台吗？',
				confirm:that.clearTableSure
			})

	    },

	    clearTableSure(){
	    	var that=this;
	    	var url="index.php?g=Home&m=repastPcApi&a=clearTable";
	    	var params={
	    		cid:that.cid,
	    		tid:that.tid
	    	};
	    	http.get(url,params,"clearTableCallBack",that);

	    },
	    clearTableCallBack(res){
	    	var that=this;
	    	// console.log(res)
	    	store.commit('clearTableDate',that.tid)
	        publicFun.hideModal();
    		that.$router.replace(`/index`);
	    },
	    isInCart:function(item){
	    	var that=this;
	    	if(!that.tables[that.tid]) return
	    	for(let v of that.tables[that.tid]){
	    		if(item.opts){
	    			if(v.pro_ids==item.id&&v.pro_spec==item.opts.name&&v.pro_num>0){
	    				return true
	    			}
	    		}else{
	    			if(v.pro_ids==item.id&&v.pro_num>0){
	    				return true
	    			}
	    		}
	    	}
	    	return false;
	    },
	    checkInventory:function(item){
	    	var that=this;
	    	for(let v of that.tables[that.tid]){
	    		if(item.opts){
	    			//console.log(v.pro_ids==item.id&&v.pro_spec==item.opts.name)
		    		return v.pro_ids==item.id&&v.pro_spec==item.opts.name
	    		}else{
	    			//console.log(v.pro_ids==item.id)
		    		return v.pro_ids==item.id
	    		}
	    	}
	    },
	    calcPrice(price,nums){
	    	return (price*nums).toFixed(2)
	    },
	    handleTime(time){
	    	return publicFun.setDate(time)
	    },
	    clearCart(){
	    	var that=this;
			publicFun.showModal({
				isShow:true,
				mask:true,
				txt:'确定要清除全部已点菜品吗？',
				confirm:that.clearCartSure
			})
	    },
	    clearCartSure(){
	    	var that=this;
	    	store.commit('clearTableDate',that.tid)
	        publicFun.hideModal();
	    },
	    leftAddAndReduce:function(type,item){
	    	var that=this;

	    	var dish=JSON.parse(JSON.stringify(item));
	    	var numsNow=dish.pro_num;
	    	// console.log(item)
	    	if(type=='add'){
	    		dish.pro_num=1;
               // dish.pro_num++
	    	}else{
	    		if(numsNow==0) return
	    		dish.pro_num=-1;
 //               dish.pro_num--
	    	}

			publicFun.addDish(that.tid,dish);

	    },
        orderInput:function(item){
            var that=this;
            var dish=JSON.parse(JSON.stringify(item));
            var numsNow=dish.pro_num;
            console.log(dish)
            publicFun.dishInput(numsNow,that.tid,dish);
		},
	    calcTable(val){

    		var that=this;
    		//console.log(val)
    		var nums=0,totalprice=0;
    		if(!val[that.tid]) return
    		for(let v of val[that.tid]){
    			//console.log(v)
    			nums+=parseInt(v.pro_num);
    			totalprice+=v.pro_num*v.pro_price
			}
			that.dishPageData= _.chunk(val[that.tid],10)
			// let windWid = window.outerWidth
			// windWid == 1024 ? that.dishPageData= _.chunk(val[that.tid],8) :
			// 	windWid == 1280 ? that.dishPageData= _.chunk(val[that.tid],8) :
			// 	windWid == 1366 ? that.dishPageData= _.chunk(val[that.tid],6) :
			// 	windWid == 1600 ? that.dishPageData= _.chunk(val[that.tid],8) :
			// 	windWid == 1920 ? that.dishPageData= _.chunk(val[that.tid],10) : ''

    		that.totalnums=nums;
    		that.totalprice=totalprice.toFixed(2);
	    },
	    dishPagePrevAndNext(type){
	    	var that=this;
	    	if(type=="prev"){
	    		that.dishPageIndex--
	    		if(that.dishPageIndex<0){
	    			that.dishPageIndex=0
					publicFun.showToast({
						isShow:true,
						type:2,
						mask:true,
						txt:'已到首页',
						dur:1500
					})

	    		}
	    	}else{
	    		that.dishPageIndex++
	    		if(that.dishPageIndex>that.dishPageData.length-1){
	    			that.dishPageIndex=that.dishPageData.length-1
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
	    submitDish(){
	    	var that=this;

			publicFun.showModal({
				isShow:true,
				mask:true,
				txt:'确定要下单么吗？',
				confirm:that.submitDishMakeSure
			})

	    },
	    submitDishMakeSure(){

	    	var that=this;
	    	if(!that.tables[that.tid]||that.tables[that.tid].length==0||that.totalnums==0){

	    		publicFun.showToast({
					isShow:true,
					type:2,
					mask:false,
					txt:'请添加菜品后下单',
					dur:500
	    		});
	    		return false
	    	}
	    	var url="index.php?g=Home&m=repastPcApi&a=apiSaveOrder";
	    	var params={
	    		oid:that.oid,
	    		tid:that.tid,
	    		nums:that.tableInfo.pnum,
	    		allmark:that.remark,
	    		ytel:'',
	    		youname:'',
	    		totalnum:that.totalnums,
	    		totalmoney:that.totalprice,
	    		dlist:JSON.stringify(that.tables[that.tid])
	    	};
	    	http.post(url,params,'submitDishCallBack',that);


	    },
	    submitDishCallBack(res){
	    	var that=this;
	    	publicFun.hideModal();
    		publicFun.showToast({
				isShow:true,
				type:4,
				mask:false,
				txt:res.msg,
				dur:500
    		});
    		setTimeout(function(){
				store.commit('clearTableDate',that.tid);
                publicFun.save('tid',res.datas.tid);
    			that.$router.replace(`/checkout?oid=${res.datas.oid}&tid=${res.datas.tid}`)
    			//that.$router.replace('/checkout?orderid='+res.datas.orderid)
    		},1500)
	    }
    },
    beforeDestroy () {

    },
    watch: {
    	tables:function(val){
    		var that=this;
    		//console.log(val)
    		// var nums=0,totalprice=0;
    		// for(let v of val[that.tid]){
    		// 	//console.log(v)
    		// 	nums+=v.pro_num;
    		// 	totalprice+=v.pro_num*v.pro_price
    		// }
    		// that.totalnums=nums;
    		// that.totalprice=totalprice.toFixed(2);
    		//console.log(nums)

    		that.calcTable(val);
    	},
    	remark:function(val){
    		var that=this;
    		if(val){
    			publicFun.commitRemark(that.tid,val);
    		}
    	}
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
	.detailPop .list td.name{
		padding-right: 20px;
	}
	.noData{
		text-align: center;
		margin-top: 15%;
		font-size: 30px;
	}
	.noData p{
		margin-top: 10px;
	}
	.wrap ul li:first-child{background: rgba(255,139,46,.5)}
	.wrap ul li:first-child .orderNum{background: rgba(255,139,46,0)}
	.orderNum{
		width: 30px;
		text-align: center;
		border: none;
	}
	.zprice{position: relative;bottom: -2px;}
	.order .rightMain .navs ul li.two{    display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;font-size: 22px;line-height:36px;white-space: normal;}
	@media screen and (max-width: 1600px){
		.order .rightMain .navs ul li.two{font-size: 22px;line-height: 36px;}
	}
	@media screen and (max-width: 1366px){
		.order .rightMain .navs ul li.two{    display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;font-size: 20px;line-height: 28px;white-space: normal;}

	}
	.w45{
		width: 45%;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}
	.tableNo{
		text-align: left;
	}
	.waiter{
		text-align: right;
	}
</style>
