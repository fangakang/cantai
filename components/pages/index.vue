<template>
	<div class="body_bg">
	<div class="index">
		<headbar></headbar>
		<div class="mainInner">
			<div class="navs clearfix">
				<!-- <div class="fr searchInput">
					<div class="searchInputWrap clearfix">
						<div class="icon fl" @click="searchNow()">
							<i class="fa fa-fw fa-search"></i>
						</div>
						<input type="text" class="fl" name="" v-model="search" placeholder="输入餐台号搜索" />
					</div>
				</div> -->
				<div class="navDiv">
					<span v-for="(item,index) in shownNav" class="span" :index="'span'+index" :class="{'on':navsIndex==index,'two':item && item.length > 5}" @click="changeClassify(item,index)" :style="{width:navWidth + 'px'}">
						{{item}}
					</span>
					<div class="span more" :class="{on : hidenavsIndex != null}" v-if="hideNav.length > 0" :style="{width:navWidth + 'px'}">
						更多
						<div class="moreNavs">
							<span v-for="(item,index) in hideNav" :class="{'on':hidenavsIndex==index}" @click="changeClassify(item,index,true)">{{item}}</span>
						</div>
					</div>
					<div class="maskbg"></div>
				</div>
			</div>


			<div class="tableList">
				<div class="wrap clearfix">
					<div class="innerWarp clearfix">
						<div class="table pr" v-for="item in tableList" :class="'status'+item.usestatus" :style="{width : tableWidth}" >

							<div class="tablewrap" :class="{clear:isClear(item)}">
								<div class="pa tableClick" @click.self="tableClick(item,$event)"></div>
								<i class="icon" :class="item.notpayprice>0?'notpay':''"></i>
								<div class="wrap">
									<div class="dataNum clearfix">
										<em class="fr">{{item.pnum}}/{{item.num}}</em>
										<em class="fl">{{item.name}}</em>
									</div>
									<p class="subDataNum">{{item.isbox}}</p>
									<div class="tableFoot pa">
										<div class="row"  v-if="item.usestatus==3||item.usestatus==4">
											<span class="fr">{{txtTime(item.ordertime)}}</span>
											<span class="fl" v-if="item.usestatus==3&&item.paid==0">￥{{item.notpayprice}}</span>
											<span class="fl" v-if="item.usestatus==4&&item.paid==0">再付￥{{item.notpayprice}}</span>

										</div>
										<div class="row clearfix" v-if="item.usestatus==2">
											<p class="tc"><span>{{txtTime(item.ordertime)}}</span></p>
											<div class="clearfix">
												<span class="fr yyTxt">预约</span>
												<span class="fl phoneNum">{{item.ptel}}</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="page clearfix">
				<div class="fr"  v-if="pcount>1">
					<em>{{pg}}/{{pcount}}</em><div class="arrow dib">
						<i class="fa fa-fw fa-chevron-up" @click="loadMore('prev')" :class="{gray:pg==1}"></i><i class="fa fa-fw fa-chevron-down" :class="{gray:pg==pcount}"  @click="loadMore('next')"></i>
					</div>
				</div>
				<div class="dataTip fl">
					<div v-if="tstatus==0 || tstatus==3 " class="wrap clearfix">
						<span>未结账单数：{{tjdatas.nopaytotal}}</span>
						<!--<span>未结账实收金额：{{tjdatas.notpay}}<span class="f16">（扣除一切优惠后，最终顾客实际所需支付的金额）</span></span>-->
					</div>
				</div>
				<!--<div class="cleartotalBtn fl" v-if="tableInfo.length>0" @click="clearTableToEmptyBtnClick">清台</div>-->
				<div class="cleartotalBtn fl"  @click="clearAllToEmptyBtnClick" v-if="clearFlag>0">一键清台</div>
			</div>


			<div class="tableCtrl">
				<div class="ctrlBtn">
					<span  :class="{'on':tstatus==0}"   @click="changeTstatus(0)">全部({{tjdatas.allcount}})</span>
					<span class="empty" :class="{'on':tstatus==1}" @click="changeTstatus(1)"><i></i><em>空台（{{tjdatas.emptytotal}}）</em></span>
					<span class="open"  :class="{'on':tstatus==4}"  @click="changeTstatus(4)"><i></i><em>已开台（{{tjdatas.kttotal}}）</em></span>
					<span v-if="false" class="booked" :class="{'on':tstatus==2}"  @click="changeTstatus(2)"><i></i><em>已预约（{{tjdatas.yytotal}})）</em></span>
					<span class="checkout"  :class="{'on':tstatus==3}"  @click="changeTstatus(3)"><i></i><em>待结账（{{tjdatas.nopaytotal}}）</em></span>
					<span class="cleartotal"  :class="{'on':tstatus==5}"  @click="changeTstatus(5)"><i></i><em>待清台（{{tjdatas.cleartotal}}）</em></span>
				</div>
			</div>
			<div class="divline"></div>
		</div>
		<fullbg v-if="bgshow"></fullbg>
		<div class="window useTableStartWindow dalog" v-if="isUseTableStartWindow">
			<div class="wrap">
				<div class="hd">
					<h3>开台</h3>
				</div>
				<div class="bd">
					<div class="clearfix"  style="width: 100%; padding: 0px 0 10px 0; " >
							<div class="fl"><span class="tit">台  号：</span><span class="tit">{{currentItem.isbox+'-'+currentItem.name}}</span></div>
							<div class="fl" style="margin-left: 100px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="tit">餐位数：</span><span class="tit">{{num}}</span></div>
					</div>
		           	<div class="row">
		           		<span class="fl tit">人  数：</span><div class="fl">
							<i class="fa fa-fw fa-minus-circle" @click="pnumReduce"></i><input type="text" maxlength="2" v-model="pnum" @keyup="fnKeyUp($event,'pnum')"/><i class="fa fa-fw fa-plus-circle" @click="pnumAdd"></i>
		           		</div>
		           	</div>
				</div>
				<div class="ft clearfix">
				  <span class="fr sure" @click="useTableStart">确定</span>
				  <span class="fl cancel" @click="cancelWindow">取消</span>
				</div>
			</div>
		</div>
		<div class="modalOut" v-if="operateModal">
		    <div class="modal operateModal">
                <div class="modalHead">
                    <div class="modalTitle">操作</div>
                    <span class="_close fr" @click="operateModalClose">×</span>
                </div>
                <div class="modalContent clearfix">
                    <div class="addDish fl" @click="addDish">加菜</div>
                    <div class="clearTableBtn fl" @click="clearTableToEmpty">清台</div>
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
	import axios from 'axios'

	var CancelToken = axios.CancelToken;
	var cancel;
  export default {
	components:{headbar,fullbg},

    data () {
      return {
        operateModal:false,
        clearFlag:0,
        operateTable:0,
        targetTable:0,
        mergeChange:false,
        operateType:0,//1：并台，2：换台
        switchOpen:false,
        navs:['全部'],
        navsIndex:0,
        classify:'',
        tstatus:0,
        search:'',
        pg:1,
        tableList:[],
        tjdatas:{},
        cid:0,
        isUseTableStartWindow:false,
        bgshow:false,
        pnum:1,//就餐人数
        pcount:0,
		shownNav:[],
		hideNav:[],
		navWidth:'',
		showToastTimes:0,//这里是个小坑，记录错误弹窗的次数，0就弹一次，大于0就不再弹。注意每次切换分类后会被重置为0
		hidenavsIndex:null,
		tableWidth:'',
		tableInfo:[],//待清台数据
		allTableInfo:[],//所有待清台数据
		refresh:0,
		pageInit:0,
		roleModule:{}
      }
    },
    beforecreate:function(){

    },
    created:function() {
        store.commit('searchVisi',0)
    	// var query = this.$route.query;
    	this.cid=publicFun.fetch('cid');
		let windWid = window.outerWidth
		windWid > 1600 ? this.tableWidth = '12.4%'  :
			windWid > 1366 ? this.tableWidth = '14.1%' :
							this.tableWidth = '16.5%'

    },
    mounted:function(){
    	var that=this;
	    clearInterval(publicFun.setInterval);
		that.checkLogStatus();
		that.roleModule=publicFun.fetch('roleModule');
    },
    methods:{
        searchTarget:function(){
            var that=this;
            if(that.search==''){
                return;
            }else{
                that.getTableList();
            }
        },
        addDish:function () {
            var that=this;
            that.bgshow=false;
            that.operateModal=false;
            if(that.roleModule.addOrder!=1){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'没有加菜权限',
                    dur:3000
                });
                that.tableInfo=[];
                return;
            }
            publicFun.save('tid',that.tableInfo[0].tid);
            that.$router.replace(`/order?oid=${that.tableInfo[0].oid}&tid=${that.tableInfo[0].tid}&from=add`);
        },
        operateModalClose(){
            var that=this;
            that.bgshow=false;
            that.operateModal=false;
            that.tableInfo=[];
        },
    	getTableClassify(){
	    	var that=this;
	    	var url="index.php?g=Home&m=repastPcApi&a=getTableClassify&cid="+that.cid;
    		var params={
    			refresh:that.refresh++
    		}

	    	http.get(url,params,'getTableClassifyCallBack',that);
    	},
    	checkLogStatus(){
    		var that=this;
    		var url="index.php?g=Home&m=repastPcApi&a=getLoginInfo";
    		var params={
    			cid:that.cid
    		}
    		http.get(url,params,'checkLogStatusCallBack',that);
    	},
    	checkLogStatusCallBack(res){
    		var that=this;
        	if(res.datas.lastlogoutabnormal==1){
	    		publicFun.showModal({
					isShow:true,
					mask:true,
					txt:'您于'+that.setFormatDate(res.datas.lastlogtime)+'异常退出，您上次的交班记录，是否需要累计至本次交班里？若取消，则上次的交班情况将不再保存。',
					confirm:that.dutyAbnormal,
					cancel:that.dutyAbnormalCancel
				})


        	}
	    	//that.getTableList();
	    	that.getTableClassify();



    	},

        dutyAbnormal(){
        	var that=this;
        	var url="index.php?g=Home&m=repastPcApi&a=dutyAbnormal";
        	var params={
        		isneed:1
        	}
        	http.get(url,params,'dutyAbnormalCallBack',that);
        },

        dutyAbnormalCancel(){
        	var that=this;
        	var url="index.php?g=Home&m=repastPcApi&a=dutyAbnormal";
        	var params={
        		isneed:0
        	}
        	http.get(url,params,'dutyAbnormalCallBack',that);
        },


        dutyAbnormalCallBack(res){
        	var that=this;
        	// var logintime=that.setFormatDate(res.datas.logintime);
        	// var checkLastLogin={
        	// 	logintime:logintime,
        	// 	lastlogoutabnormal:1
        	// }
        	// publicFun.save('checkLastLogin',checkLastLogin);
    		publicFun.hideModal();
        },
        setFormatDate(date){
        	return publicFun.setDate(date);
        },

    	getTableClassifyCallBack:function(res){
    		var that=this;
			// console.log(res)
			this.navs=['全部'];
			this.navs=this.navs.concat(res.datas);
			//this.classify='';
			//this.getTableList();
			let windWid = window.outerWidth,
				mainWid = windWid - 116;
			console.log('windWid',windWid)
			windWid > 1620 ? this.navWidth = 163 :
				windWid >= 1386 ? this.navWidth = 140 : this.navWidth = 118
			let num = Math.floor(mainWid / (this.navWidth+10))
			console.log(mainWid)
			this.shownNav = this.navs.slice(0,num-1)
			this.hideNav = this.navs.slice(num-1)
			that.getTableList()


    	},
    	getTableList:function(){

    		var that=this;
    		var url="index.php?g=Home&m=repastPcApi&a=tableList";
    		var params={
    			cid:that.cid,
    			tstatus:that.tstatus,
    			classify:that.classify,
    			search:that.search,
    			pg:that.pg,
    			refresh:that.refresh++
    		}
    		console.log(that.refresh)
    		if(that.refresh==2){
	    		store.commit('updateLoadingStatus', {isShow:true,mask:true})
    		}

    		http.get(url,params,'getTableListCallBack',that);
    	},
    	getTableListCallBack:function(res){
    		 console.log(res)
    		var that=this;
    		if(res!=undefined){
                publicFun.timer(that.getTableClassify)
                that.pageInit=1;//首次进入页面，轮询成功
            }else{
                store.commit('updateLoadingStatus', {ishow:true,mask:true});
            }
    		if(res.datas.tlist!=''||res.datas.tlist.length!=0){
    		    var clearFlag=0
    		    for(var i=0;i<res.datas.tlist.length;i++){
    		        if(res.datas.tlist[i].paid==1&&res.datas.tlist[i].usestatus==4){
    		            clearFlag++;
    		        }
    		    }
    		    that.clearFlag=clearFlag
	    		that.tableList=res.datas.tlist;
	    		that.pcount=res.datas.pcount;

    		}else{
    			that.tableList=[];
    			if(that.showToastTimes==0){
					publicFun.showToast({
						isShow:true,
						type:2,
						mask:false,
						txt:'没有相关数据',
						dur:500
					});
					that.showToastTimes++
    			}
    		}
    		that.tjdatas=res.tjdatas;
    	},
    	loadMore:function(type){
    		var that=this;
    		that.refresh=1;
    		if(type=="next"){
	    		if(that.pg==that.pcount){

					publicFun.showToast({
						isShow:true,
						type:2,
						mask:true,
						txt:'已到最后一页',
						dur:1500
					})
					//that.busy = false;
    				return
    			}
	    		that.pg++;
				that.getTableList();

    		}else{

    			if(that.pg==1){

					publicFun.showToast({
						isShow:true,
						type:2,
						mask:true,
						txt:'已到首页',
						dur:1500
					})
    				return
    			}
		    		that.pg--;
					that.getTableList();

    		}
    	},
    	changeClassify:function(item,index,ishide){
			var that=this;
			if(ishide) { if(index==that.hidenavsIndex&&that.tstatus==0) return; that.hidenavsIndex=index;that.navsIndex=null;}
    		else{if(index==that.navsIndex&&that.tstatus==0) return;that.navsIndex=index;that.hidenavsIndex=null;}
    		if(item=='全部'){
    			that.classify='';
    		}else{
    			that.classify=item;
    		}
    		that.search='';
			that.tstatus=0;
    		that.pg=1;//重置
    		that.pcount=0//重置
    		that.tableList=[];//重置
    		that.showToastTimes=0;
    		that.tableInfo=[];
    		that.refresh=1;
    		that.getTableList();
    	},
    	changeTstatus:function(tstatus){
    		var that=this;
    		that.search='';
			that.tstatus=tstatus;
    		that.pg=1;//重置
    		that.pcount=0//重置
    		that.tableList=[];//重置
    		that.tableInfo=[];
    		that.refresh=1;
    		that.showToastTimes=0;
    		//clearInterval(publicFun.setInterval);

			// axios.get（'/ user / 12345'，{
			//    cancelToken：new CancelToken（function executor（c）{
			//      //一个执行器函数接收一个取消函数作为参数
			//      cancel = c;
			//    }）
			// }）;
			if(tstatus==4||tstatus==2||tstatus==3){
			    that.clearFlag=0
			}
    		var url="index.php?g=Home&m=repastPcApi&a=tableList";
			http.get(url,{
			   cancelToken:new CancelToken(function executor(c){
			     //一个执行器函数接收一个取消函数作为参数
			     cancel = c;
			   })
			},'',that);

    		that.getTableList()

    	},
    	searchNow:function(){
    		var that=this;
    		that.pg=1;
    		that.tstatus=0;
    		that.pcount=0;
    		that.tableList=[];//重置
    		that.getTableList()
    	},
    	tableClick:function(item,e){
    		var that=this;
    		console.log(item)
    		that.currentItem=item;
    		that.currentTid=item.id;
    		that.num=item.num;//可容纳人数
    		if(item.usestatus==0){
    			that.bgshow=true;
    			that.isUseTableStartWindow=true
    		}
    		if(item.usestatus==1||item.usestatus==2){
	    		that.$router.replace(`/order?tid=${that.currentTid}`);
    		}
    		if(item.usestatus==3){
                publicFun.save('tid',that.currentTid)
                that.$router.replace(`/checkout?tid=${that.currentTid}&oid=${item.oid}`);
    		}
    		if(item.usestatus==4&&item.notpayprice!=0){
    		    publicFun.save('tid',that.currentTid)
                that.$router.replace(`/checkout?tid=${that.currentTid}&oid=${item.oid}`);
    		}
    		if(item.usestatus==4&&item.notpayprice==0){
		        console.log(e)

		        var obj={
		        	tid:item.id,
		        	oid:item.oid
		        }
		        that.bgshow=true;
		        that.operateModal=true;
				var thisBoj=e.target
		        var par=e.target.parentNode;
		        if(par.hasClass('clear')){
		        	for(let k in that.tableInfo){
		        		if(that.tableInfo[k].tid==item.id){
		        			that.tableInfo.splice(k,1)
		        		}
		        	}
		        	//par.classList.remove("clear")
		        }else{
		        	//par.classList.add("clear");
		        	that.tableInfo.push(obj)

		        }

		        //console.log(that.tableInfo)
    		}



    	},
    	useTableStart:function(){
    		var that=this;
    		// console.log(that.num)
    		/*if(parseInt(that.pnum)>that.num){
				publicFun.showToast({
					isShow:true,
					type:2,
					mask:false,
					txt:'就餐人数不能超过餐位数',
					dur:500
				});
				return;
    		}*/
    		if(that.pnum<1||that.pnum==''){
				publicFun.showToast({
					isShow:true,
					type:2,
					mask:false,
					txt:'请输入合适的就餐人数',
					dur:500
				});
				return;
    		}
    		var url="index.php?g=Home&m=repastPcApi&a=useTableStart";
    		var params={cid:that.cid,tid:that.currentTid,nums:that.pnum};
    		http.get(url,params,'useTableStartCallBack',that);

    	},
    	useTableStartCallBack:function(res){
    		var that=this;
    		if(res.error==0){
    		    that.$router.push(`/order?tid=${that.currentTid}`);
    		}

    	},
    	cancelWindow:function(){
    		var that=this;
    		that.isUseTableStartWindow=false;
    		that.bgshow=false;
    	},
    	pnumAdd:function(){
    		var that=this;
    		/*if(parseInt(that.pnum)>=that.num){
				publicFun.showToast({
					isShow:true,
					type:2,
					mask:false,
					txt:'就餐人数不能超过餐位数',
					dur:500
				});
				return;
    		}*/
    		that.pnum++;
    		if(that.pnum>=100){
    		    that.pnum=99;
    		    return;
    		}

    	},
    	pnumReduce:function(){
    		var that=this;
    		if(that.pnum<2||that.pnum==''){
				publicFun.showToast({
					isShow:true,
					type:2,
					mask:false,
					txt:'请输入合适的就餐人数',
					dur:500
				});
				return;
    		}
    		that.pnum--;
    	},
    	txtTime(date){
			return publicFun.txtTime(date);
    	},
    	fnKeyUp(e,type){
    		var that=this;
    		if(type=="pnum"){
	    		that.pnum=filter(that.pnum);
    		}

    		function filter(data){
    			return data.replace(/[^\d]/g,'')
    		}
    	},
    	clearAllToEmptyBtnClick(){
    	    var that=this;
    	    publicFun.showModal({
                isShow:true,
                mask:true,
                txt:'确定要全部清台吗？',
                confirm:that.clearTableToEmpty,
                cancel:that.cancelClear
            })

            for(var i=0;i<that.tableList.length;i++){
                var allTableInfo={
                    tid:'',
                    oid:''
                };
                if(that.tableList[i].paid==1&&that.tableList[i].usestatus==4){
                    allTableInfo.tid=that.tableList[i].id;
                    allTableInfo.oid=that.tableList[i].oid;
                    that.tableInfo.push(allTableInfo)
                }

            }
    	},
    	clearTableToEmptyBtnClick(){
    		var that=this;
			publicFun.showModal({
				isShow:true,
				mask:true,
				txt:'确定要清台吗？',
				confirm:that.clearTableToEmpty
			})
    	},
    	cancelClear(){
    	    var that=this;
    	    that.tableInfo=[];
    	    publicFun.showModal({
                isShow:false,
                mask:false,
                txt:'确定要全部清台吗？',
                confirm:that.clearTableToEmpty,
                cancel:that.cancelClear
            })
    	},
    	clearTableToEmpty(){
    		var that=this;
    		var url="index.php?g=Home&m=repastPcApi&a=clearTableToEmpty"
    		var params={
    			cid:that.cid,
    			tableInfo:JSON.stringify(that.tableInfo)
    		}

    		http.post(url,params,'clearTableToEmptyCallBack',that);
    	},
    	clearTableToEmptyCallBack(res){
    		var that=this;
    		that.tableInfo=[];
    		publicFun.hideModal();
			publicFun.showToast({
				isShow:true,
				type:4,
				mask:false,
				txt:res.msg,
				dur:500
			});
			that.bgshow=false;
			that.operateModal=false;
			//如果状态是在待清台的情况下，清台后会回到全部
			if(that.tstatus==5){
				that.tstatus=0
			}

    		that.getTableList();
    	},
    	isClear(item){//判断是否待清台
    		var that=this;
    		for(let v of that.tableInfo){
    			if(v.tid==item.id){
    				return true
    			}
    		}

    		return false
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
    .dataTip .wrap .f16{font-size:16px}
    .tableNum{margin-top:15px;}
    ._close{display: inline-block;font-size: 32px;margin-top: -65px;margin-right: -37px;cursor: pointer;}
    .operateModal{width:375px}
    .operateModal .modalContent>div{font-size:25px;background:#ddd;padding:15px 45px;cursor:pointer; border-radius: 3px}
    .operateModal .modalContent>div{margin-left:35px;}
    .operateModal .modalContent .addDish{background:#fa8b2e;color:#fff}
    .modalOut{position:fixed;top:0;left:0;bottom:0;right:0;text-align:center;z-index: 10;}
    .modal{background: #fff;padding: 20px 45px 30px;border-radius: 5px;margin:0 auto;margin-top:200px}
    .mergeChange {top:36%;left:35%}
    .modalHead{padding-bottom: 5px;border-bottom: 1px solid #ddd;}
    .modalFooter{overflow: hidden;width: 440px;margin: 20px auto;}
    .modalFooter div{font-size: 20px;text-align: center;line-height: 50px;cursor: pointer;border-radius: 5px;width: 200px;}
    .modalContent>div{margin :0 auto;margin-top:20px}
    .mergeChange span{font-size: 20px;color: #333;line-height: 40px;}
    .mergeChange select{font-size: 18px;color: #333;height: 40px;margin-left:15px;width:300px;}
    .cancel{background: #ececee; color: #333;}
    .makeSure{background: #fa8b2e;color: #fff;margin-left: 40px;}
    .modalTitle{font-size: 30px;text-align: center;color: #333;}
	.maskbg{background: rgba(0,0,0,.3);position: fixed;top: 180px;left: 116px;right: 0;bottom: 0;z-index:10;}
	.navs{background-color: rgba(0,0,0,.4);}
	.searchInput .searchInputWrap{border:10px solid #474957;}
	.searchInput .icon{width: 60px;height: 60px;line-height: 74px;text-align: center;background-color: #fff}
	.searchInput .icon i{font-size: 30px;color: #999}
	.searchInput input{border:0;height: 60px;line-height: 60px;width: 300px;font-size: 24px}
	.navDiv .span{    float: left;height: 60px;line-height: 60px;font-size: 24px;color: #fff;cursor: pointer;text-align: center;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;border-bottom:6px solid transparent;padding: 0 5px;}
	.navDiv .span.more{overflow: inherit;}
	.navDiv .moreNavs{position: absolute;width: 100%;right: 0px;top: 80px;background-color: #fff;z-index: 2;padding-bottom: 15px;display: block;left: 0;z-index:11;display: none;}
	.navDiv .maskbg{display: none;}
	.navDiv .two{    display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;font-size: 28px;line-height: 36px;white-space: normal;}
	.navDiv .moreNavs span{margin-top: 15px;margin-left: 1.45%;width: 15%;height: 65px;line-height: 65px;text-align: center;font-size: 26px;color: #48465b;float: left;background-color: #ececee;overflow: hidden;text-overflow: ellipsis;}
	.navDiv .moreNavs span:hover,.navDiv .moreNavs span.on{background-color: #f7892d;color: #fff}
	.navDiv .span:hover,.navDiv .span.on{background-color: #f7892d;color: #fff}
	.navDiv .span:hover,.navDiv .span.on{border-bottom:6px solid #fa8b2e;}
	.navDiv .span.more:hover .moreNavs,.navDiv .span.more:hover~.maskbg{display: block;}
	.dataTip .wrap{padding: 0 12px;text-align: left;}
	.dataTip .wrap span{margin-right: 50px;font-size: 24px;color: #fff;padding: 15px 0;display: inline-block;}
	.tableList{position: absolute;bottom: 160px;top: 90px;overflow: auto;width: 100%;}
	.tableList>.wrap{overflow: hidden;}
	.tableList>.wrap .innerWarp{overflow: hidden;}
	.tableList .table{float: left;height: 178px;margin-bottom: 12px;cursor: pointer;border-radius: 5px;}
	.tableList .table .tablewrap{margin-left: 12px;background-color:hsla(0,0%,100%,.8);height: 100%;border-radius: 5px;}
	.tableList .table .tablewrap .wrap{padding: 5px;}
	.tableList .table .tablewrap .tableClick{top: 0;left: 0;right: 0;bottom: 0;    z-index: 2;}
	.tableList .table .icon{display:block;width:64px;height: 64px;position: absolute;top: 50%;left: 50%;margin-left: -28px;margin-top: -28px;}
	.tableList .table.status0 .icon{background:  url(../../assets/t_1.png) no-repeat center;background-size: contain;width: 72px;height: 72px;}
	.tableList .table.status1 .icon{background: url(../../assets/t_2.png) no-repeat center;background-size: contain;width: 70px;height: 70px;}
	.tableList .table.status2 .icon{background: url('../../assets/table_3.png') no-repeat center;background-size: contain}
	.tableList .table.status3 .icon{background: url(../../assets/t_3.png) no-repeat center;background-size: contain}
	.tableList .table.status4 .icon{background: url(../../assets/t_5.png) no-repeat center;background-size: contain}
	.tableList .table.status4 .icon.notpay{background: url(../../assets/t_3.png) no-repeat center;background-size: contain}
	.tableList .table>.wrap{padding: 6px;padding-bottom: 0}

	.tableList .table .dataNum{font-size: 18px;color: #666}
	.tableList .table .subDataNum{font-size: 20px;color: #666;text-align: left;}
	.tableList .table .tablewrap.clear .dataNum{color: #fa8b2e;}
	.tableList .table .tablewrap.clear .subDataNum{color: #fa8b2e;}
	.tableList .table .tableFoot{bottom: 6px;left:18px;right: 6px}
	.tableList .table .tableFoot .yyTxt{color: #fa8b2e;font-size: 24px;line-height: 24px}
	.tableList .table .tableFoot .phoneNum{line-height: 24px;font-size: 14px}
	.tableList .table .tablewrap.clear{background: #48465A}
	.tableCtrl{position: absolute;left: 0;right: 0;bottom: 0;background-color: #474957;padding: 15px 0}
	.tableCtrl .switch{position:relative;margin-right:60px;}
	.tableCtrl .switch .tableOperate{position:absolute;top:-117px;border:1px solid #999;border-radius:5px;}
	.tableCtrl .switch .tableOperate span{margin-left:0;border-radius:0;border-bottom:1px solid #999}
	.tableCtrl .switch .tableOperate span:last-child{border-bottom:none}
	.tableCtrl .switch span{display:block;width:100px;text-align:center;height: 54px;font-size: 20px;line-height: 54px;padding: 0 15px;border-radius: 5px;color: #474957;border: 4px solid #fff;cursor: pointer;background-color: #fff;}

	.ctrlBtn span{height: 54px;line-height: 54px;text-align: center;width: 200px;background-color: #fff;color: #474957;float: left;font-size: 20px;color: #474957;border:4px solid #fff;margin-left: 35px;cursor: pointer;border-radius: 5px;}
	.ctrlBtn span em{vertical-align: middle;}
	.ctrlBtn span i{display: inline-block;width: 26px;height: 26px;background-image: url(../../assets/table_1.png);background-size: contain;background-repeat: no-repeat;background-position: center center;vertical-align: middle;margin-right: 15px}
	.ctrlBtn span.empty i{background-image: url(../../assets/t_1.png);width: 47px;height: 30px}
	.ctrlBtn span.checkout i{background-image: url(../../assets/t_3.png);width: 25px;height: 29px;}
	.ctrlBtn span.booked i{background-image: url(../../assets/t_4.png);width: 29px;height: 29px;}
	.ctrlBtn span.open i{background-image: url(../../assets/t_2.png);width: 40px;height: 30px}
	.ctrlBtn span.cleartotal i{background-image: url(../../assets/t_5.png);width: 25px;height: 25px}
	.ctrlBtn span.on{border-color: #fa8b2e}
	.divline{height: 58px;padding: 15px 0}
	.selectStore  .ft{padding: 20px 0 40px 0}
	.selectStore  .ft span{width: 500px;height: 60px;line-height: 60px;text-align: center;display: block;text-align: center;background-color: #fa8b2e;margin: 0 auto;font-size: 24px;color: #fff}
	/*.useTableStartWindow .row{width: 220px;margin: 0 auto}*/
	.useTableStartWindow .hd p{font-size: 16px;text-align: left; padding:15px 0 10px 0; font-size: 15px}
	.page{position: absolute;left:28px;bottom: 100px;font-size: 24px;color: #fff;height: 80px;line-height: 80px;text-align: right;right: 28px;}
	.page em{margin-right: 15px}
	.page .arrow{font-size: 40px;margin-left: 20px;cursor: pointer;}
	.page i.gray{color: #fff; opacity: 0.4}
	.tableList .table .tableFoot{font-size: 18px;}
	.tableList .table .tableFoot{color: #fa8b2e;}
	.tableList .table .dataNum em.fl,.tableList .table .subDataNum{width: 66%;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
	.tableList .table .subDataNum{width:80%}

	.cleartotalBtn{width: 150px;border-radius: 5px;height: 40px;text-align: center;font-size: 14px;background: #fa8b2e;color: #333;line-height:40px;margin-top: 35px;margin-right: 15px;color: #fff;cursor: pointer;}

	@media screen and (max-width: 1920px) {
		.tableList .table{height: 222px}
	}
	@media screen and (max-width: 1600px) {
		.tableList{top: 100px;}
		.tableList .table{height: 161px}
		.tableList .table .subDataNum,.tableList .table .subDataNum,.tableList .table .dataNum{font-size: 16px;}
		.navDiv .moreNavs span{font-size: 24px;}
		.tableList .table .tableFoot{font-size: 14px;}
		.tableList .table .tableFoot{font-size: 16px;}
		.tableList .table .icon{width: 50px;height: 50px;}
		.navDiv .two{ font-size: 24px;line-height: 36px;white-space: normal;}
		.navDiv .span{font-size: 24px;}
	}
	@media screen and (max-width: 1366px) {
		.tableList .table .dataNum{font-size: 16px;}
		.tableList .table .subDataNum,.tableList .table .subDataNum{font-size: 16px;}
		.tableList .table{height: 180px}
		.navDiv .span{font-size: 22px;}
		.tableList .table .icon{display:block;width:50px;height: 50px;position: absolute;top: 50%;left: 50%;margin-left: -25px;margin-top: -25px;}
		.navDiv .moreNavs span{font-size: 22px;}
		.navDiv .moreNavs span{height: 60px;line-height:60px;}
		.tableList .table.status0 .icon{width: 66px;height: 60px;}
		.tableList .table.status1 .icon{width: 64px;height: 64px; }
		.tableList .table .tableFoot{font-size: 14px;}
		.navDiv .two{ font-size: 22px;line-height: 36px;white-space: normal;}
	}
	@media screen and (max-width:1330px){
		.ctrlBtn span{height: 38px;font-size: 14px;line-height: 38px;padding: 0 15px;width: auto;border-radius: 5px}
		.tableCtrl .switch span{height: 38px;font-size: 14px;line-height: 38px;padding: 0 15px;width: auto;border-radius: 5px}
		.ctrlBtn span i{width: 26px !important;height: 26px !important;}
	}
	@media screen and (max-width: 1280px) {
	    .searchPart{top:8px;width:200px;font-size:16px;right:5px;}
		.searchInput .searchInputWrap{border:5px solid #474957;}
		.searchInput .icon{width: 40px;height: 40px;line-height: 50px;}
		.searchInput .icon i{font-size: 24px;}
		.searchInput input{border:0;height: 40px;line-height: 40px;font-size: 16px}
		.navDiv .span{height: 45px;line-height: 45px;font-size: 18px}
		.navDiv .span:hover::after,.navDiv .span.on::after{height: 3px}
		.dataTip .wrap span{font-size: 18px}
		.tableList{top: 70px;bottom: 132px;}
		.tableList .table{height: 166px}
		.tableList .table .tableFoot{font-size: 12px;}
		.page{bottom: 80px}
		.tableList .table .tableFoot .yyTxt{font-size: 14px}
		.navDiv .moreNavs span{font-size: 20px;}
		.navDiv .moreNavs span{height: 56px;line-height:56px;}
		.navDiv .moreNavs{top: 56px;}
		.dataNum,.tableList .table .subDataNum,.tableList .table .dataNum{font-size: 15px;}
		.navDiv .two{ font-size: 20px;line-height: 26px;white-space: normal;}
	}

	@media screen and (max-width: 1024px) {
		.searchInput .searchInputWrap{border:5px solid #474957;}
		.searchInput .icon{width: 40px;height: 40px;line-height: 50px;}
		.searchInput .icon i{font-size: 24px;}
		.searchInput input{border:0;height: 40px;line-height: 40px;font-size: 16px}
		.navDiv .span{height: 40px;line-height: 40px;font-size: 16px}
		.navDiv .span:hover::after,.navDiv .span.on::after{height: 3px}
		.dataTip .wrap span{font-size: 18px}
		.tableList{top: 65px;bottom: 132px;}
		.tableList .table{height: 168px}
		.tableList .table .dataNum,.tableList .table .subDataNum{font-size: 16px;}
		.ctrlBtn span{height: 38px;font-size: 14px;line-height: 38px;padding: 0 15px;width: auto;border-radius: 5px;width: 92px;}
		.tableCtrl .switch span{height: 38px;font-size: 14px;line-height: 38px;padding: 0 15px;width: auto;border-radius: 5px;width: 92px;}
		.ctrlBtn span i{width: 26px !important;height: 26px !important;}
		.page{bottom: 80px}
		.tableList .table{height: 160px;}
		.navDiv .moreNavs span{font-size: 18px;}
		.navDiv .moreNavs span{height: 46px;line-height:46px;}
		.dataNum,.tableList .table .subDataNum,.tableList .table .dataNum{font-size: 14px;}
		.navDiv .two{ font-size: 20px;line-height: 24px;white-space: normal;}
	}
</style>
