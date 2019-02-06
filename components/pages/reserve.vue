<template>
	<div class="body_bg">
	<div class="reserve">
		<headbar></headbar>
		<div class="bigTit">
				<div class="fr searchInput">
					<div class="searchInputWrap clearfix">
						<div class="icon fl" @click="searchNow()">
							<i class="fa fa-fw fa-search"></i>
						</div>
						<input type="text" class="fl" name="" v-model="search" placeholder="输入手机号、预约人进行查找" />
					</div>
				</div>
				<p class="tc">在线预约</p>
		</div>
		<div class="mainInner">
			<div class="filter clearfix">

				<div class="fr reserveNow">
					<span @click="newReserveBtn()"><i class="fa fa-plus fa-fw"></i>新增预约</span>
				</div>
				<div class="fl">
					<span v-for="(item,index) in filters" :class="{on:filterindex==index}" @click="filterfn(index)">{{item}}</span>
				</div>
				<div class="fl">
					<div class="selectWrap fl">
						<select v-model="rstatus" @change="selectChange">
							<option :value="option.value" v-for="option in rstatusArray">
								{{option.name}}
							</option>
						</select>
					</div>
					<div class="selectWrap fl">
						<select @change="selectChange" v-model="filterClassify">
							<option>
								餐台类型
							</option>
							<option v-for="item in tableClassify">{{item}}</option>
						</select>
					</div>
				</div>
			</div>
			<div class="panel">
<!-- 				<div class="thead">

				</div>
 -->

				<table width="100%" border="0" cellspacing="0" cellpadding="0">
				<thead>
				  <tr>

				    <th scope="col">预约单号</th>
				    <th scope="col">就餐时间</th>
				    <th scope="col">预约餐桌</th>
				    <th scope="col">预约人--手机号</th>
				    <th scope="col">预约状态</th>
				    <th scope="col">预定备注</th>
				    <th scope="col">操作</th>
				  </tr>
				  </thead>
				  <tbody>
				  <tr v-for="item in rlist">
				    <td>{{item.orderid}}</td>
				    <td>{{getTime(item.reservetime)}}</td>

				    <td>{{item.classify +'--'+ item.nums}}</td>
				    <td>{{item.name+'('+item.tel+')'}}</td>
				    <td>{{checkRstatus(item.rstatus)}} <em v-if="item.rstatus==2">({{item.classify+'-'+item.tname}})</em></td>
				    <td>{{item.des}}</td>
				    <td class="tc ctrlBtn">
				    <span @click="getEmptyTable(item)" class="span1" v-if="item.rstatus==1">去安排</span>
				    <span @click="cancelReserve(item)"  class="span2" v-if="item.rstatus==1">取消</span>

				    <span @click="getEmptyTable(item)" class="span1" v-if="item.rstatus==2">去开台</span>
				    <span @click="cancelReserve(item)"  class="span2" v-if="item.rstatus==2">释放餐桌</span>

				    </td>
				  </tr>
				  </tbody>
				</table>
			</div>
			<div class="divline"></div>
			<div class="page"  v-if="pcount>1">
				<em>{{pg}}/{{pcount}}</em>共{{alltotal}}单<div class="arrow dib" v-if="pcount>1">
					<i class="fa fa-fw fa-chevron-up" @click="nextAndPrev('prev')"></i><i class="fa fa-fw fa-chevron-down"  @click="nextAndPrev('next')"></i>
				</div>
			</div>
<!-- 			<div class="cashier">
				<p>应收合计：<span>￥574.00</span></p>
				<p>实收合计：<span>￥574.00</span></p>
			</div> -->
		</div>
		<fullbg v-if="bgshow"></fullbg>
		<div class="window newReserve" v-if="isNewReserve">
			<div class="wrap">
				<div class="hd">
					预约
				</div>
				<div class="bd">
					<div class="row" @click="setTime">
						<span class="fl">就餐时间</span>
						<div class="ofh">

							<div class="wrap">
								<input type="text" name="" v-model="reservetime" readonly >
							</div>

						</div>
					</div>
					<div class="row">
						<span class="fl">餐厅类型</span>
						<div class="ofh">

							<div class="wrap">
								<select v-model="classify">
									<option v-for="item in tableClassify">{{item}}</option>
								</select>
							</div>

						</div>
					</div>
					<div class="row">
						<span class="fl">就餐人数</span>
						<div class="ofh">
							<div class="wrap" style="border: 0">
								<i class="fa fa-fw fa-minus-circle" @click="pnumReduceAndAdd('reduce')"></i><div class="wrap dib" style="maring:0 5px"><input type="text" v-model="nums" name="" style="text-align: center;" @keyup="fnKeyUp($event,'nums')"></div><i class="fa fa-fw fa-plus-circle" @click="pnumReduceAndAdd('add')"></i>
							</div>
						</div>
					</div>
					<div class="row">
						<span class="fl">顾客姓名</span>
						<div class="ofh">
							<div class="wrap">
								<input type="text" v-model="youname" name="">
							</div>
						</div>
					</div>
					<div class="row">
						<span class="fl">手机号码</span>
						<div class="ofh">

							<div class="wrap">
								<input type="text" v-model="youtel" name="" @keyup="fnKeyUp($event,'youtel')"  maxlength="11">
							</div>

						</div>
					</div>
					<div class="row">
						<span class="fl">备注(选填)</span>
						<div class="ofh">

							<div class="wrap">
								<textarea v-model="youmark"></textarea>
							</div>

						</div>
					</div>
				</div>


				<div class="ft clearfix">
					<span class="makesure fr" @click="addReserve">确定</span>
					<span class="cancel fl" @click="newReserveBtn">取消</span>
				</div>
			</div>
		</div>

		<datepicker @getDate="getDate" v-if="isShowDatePicker" :date="reservetime"></datepicker>
		<div class="window dalog emptyTableWindow" v-if="isEmptyTable">

			<div class="wrap">
				<div class="hd">
					<h3>选择餐桌——{{tableclassify}}</h3>
				</div>
				<div class="bd">
					<div class="tableLists clearfix">
						<div class="table pr" :class="{on:tableId==item.id}" v-for="item in tableList[tableIndex]" @click="selectTableClick(item)">
							<div class="wrap">
								<div class="dataNum clearfix">
									<em class="fr">{{item.pnum}}/{{item.num}}</em>
									<em class="fl">{{item.id}}</em>
								</div>
								<p class="subDataNum">{{item.isbox}}</p>
							</div>
						</div>
					</div>

						<div class="arrow tc">
							<i class="fa fa-fw fa-chevron-up" @click="emptyTablePrevAndAdd('prev')"  v-if="tableIndex>0"></i><i class="fa fa-fw fa-chevron-down"  @click="emptyTablePrevAndAdd('next')" v-if="tableIndex<tableList.length-1"></i>
						</div>


				</div>
				<div class="ft clearfix">
				  <span class="fr sure" @click="useTableStart">确定</span>
				  <span class="fl cancel" @click="cancelWindow">取消</span>
				</div>
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
	import datepicker from '@/components/public/datepicker'
	import _ from "lodash";

  export default {
	components:{headbar,fullbg,datepicker},

    data () {
      return {
        dstatus:1,
        search:'',
        pg:0,
        pcount:0,
        alltotal:0,
        rlist:[],
        filters:['全部','今天','明天','后天','近一周'],
        filterindex:1,
        tableType:[],
        bgshow:false,
        isNewReserve:false,
        isShowDatePicker:false,
        tableClassify:[],
        reservetime:'',
        classify:'',
        nums:1,
        youname:'',
        youtel:'',
        youmark:'',
        tables:[],
        isEmptyTable:false,
        tableList:[],
        tableIndex:0,
        tableId:'',
        selectTable:'',
        rstatusArray:[
        	{
        		name:'预约状态',
        		value:''
        	},
        	{
        		name:'全部',
        		value:0
        	},
        	{
        		name:'待安排',
        		value:1
        	},
        	{
        		name:'已安排',
        		value:2
        	},
        	{
        		name:'已取消',
        		value:3
        	}
        ],
        filterClassify:'餐台类型',
        rstatus:'',
		showToastTimes:0,//这里是个小坑，记录错误弹窗的次数，0就弹一次，大于0就不再弹。注意每次切换分类后会被重置为0
		refresh:0

      }
    },
    created:function() {
    	var that=this;
        store.commit('searchVisi',0)
    	// var query = this.$route.query;
    	that.cid=publicFun.fetch('cid');
    	that.pg+=1;
    	that.getReserveLists();
    	that.getTableClassify();
    },
    mounted:function(){
    	var that=this;
        clearInterval(publicFun.setInterval);
		publicFun.timer(that.getReserveLists)

    },
    methods:{
    	checkRstatus(val){
    		var that=this;
    		console.log(val)
    		for(let v of that.rstatusArray){
    			if(v.value==val){
    				return v.name
    			}
    		}
    	},
    	fnKeyUp(e,type){
    		var that=this;
    		if(type=="nums"){
	    		that.nums=filter(that.nums);
    		}else if(type=="youtel"){
	    		that.youtel=filter(that.youtel);
    		}

    		function filter(data){
    			return data.replace(/[^\d]/g,'')
    		}
    	},
    	selectChange(){
    		var that=this;
    		that.pg=1;
    		that.showToastTimes=0;
    		that.getReserveLists();

    	},
    	getReserveLists:function(){
    		var that=this;
	    	var url="index.php?g=Home&m=repastPcApi&a=getReserveLists";
	    	var filterClassify=that.filterClassify;
			var params={
				cid:that.cid,
				dstatus:that.dstatus,
				classify:filterClassify=='餐台类型'?'':filterClassify,
				rstatus:that.rstatus,
				search:that.search,
				pg:that.pg,
				refresh:that.refresh++
			}
	    	http.get(url,params,'getReserveListsCallBack',that);
    	},
    	getReserveListsCallBack:function(res){
    		var that=this;
    		that.pcount=res.datas.pcount;
    		that.alltotal=res.datas.alltotal;
    		that.rlist=res.datas.rlist;
    		if(res.datas.rlist=''){

    			that.pg=0;
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
    	},
    	getTime:function(date){
    		return publicFun.txtTime(date)
    	},
    	nextAndPrev:function(type){
    		var that=this;
    		var pg=that.pg;
    		if(pg==that.pcount) return;
    		if(type=='next'){

	    		pg++
	    		if(pg>that.pcount){
					publicFun.showToast({
						isShow:true,
						type:2,
						mask:true,
						txt:'已到首页',
						dur:1500
					})
					return;

	    		};
	    		that.pg=pg;
	    		that.dstatus=0;
    		}else{
	    		pg--
	    		if(pg<=0){

					publicFun.showToast({
						isShow:true,
						type:2,
						mask:true,
						txt:'已到最后一页',
						dur:1500
					})
	    			return
	    		};
	    		that.pg=pg;
	    		that.dstatus=0;
    		}
    		//console.log(e);
    		that.getReserveLists();
    	},
    	filterfn:function(index){
    		var that=this;
    		that.filterindex=index;
    		that.pg=1;
    		that.rlist=[];
    		that.search='';
    		that.dstatus=index;
    		that.rstatus='';
    		that.filterClassify='餐台类型';
    		that.showToastTimes=0;
    		that.getReserveLists();
    	},
    	searchNow:function(){
    		var that=this;
    		that.pg=1;
    		that.dstatus=that.dstatus;
    		that.rlist=[];//重置
    		that.getReserveLists()
    	},
    	newReserveBtn:function(){
    		var that=this;
    		that.bgshow=!that.bgshow;
    		that.isNewReserve=!that.isNewReserve;
    	},
    	//获取分类，用于添加预约的餐厅类型选择
    	getTableClassify:function(){
    		var that=this;
    		var url="index.php?g=Home&m=repastPcApi&a=getTableClassify";
    		var params={
    			cid:that.cid
    		}
    		http.get(url,params,'getTableClassifyCallBack',that);
    	},
    	getTableClassifyCallBack(res){
    		console.log(res);
    		var that=this;
    		that.tableClassify=res.datas
    		that.classify=res.datas[0]
    	},

    	//获取设置的日期，同时处理取消日期设置关闭窗口
    	getDate:function(date){
    		console.log(date)
    		var that=this;
    		if(date){
    			if(date.time){

	    			that.isShowDatePicker=false;
	    			that.reservetime=date.time;

    			}else if(date.cancel){
	    			that.isShowDatePicker=false;
    			}
    		}
    	},
    	setTime:function(){
    		var that=this;
    		that.isShowDatePicker=true;
    	},
    	addReserve:function(){
    		var that=this;
    		if(that.nums==''||!publicFun.isNumber(that.nums)){
	    		publicFun.showToast({
					isShow:true,
					type:2,
					mask:false,
					txt:'请输入人数',
					dur:500
	    		});
	    		return false;
    		}
    		if(that.classify==''){
	    		publicFun.showToast({
					isShow:true,
					type:2,
					mask:false,
					txt:'请选择餐桌类型',
					dur:500
	    		});
	    		return false;
    		}
    		if(that.youtel==''){
	    		publicFun.showToast({
					isShow:true,
					type:2,
					mask:false,
					txt:'请输入手机号码',
					dur:500
	    		});
	    		return false;
    		}
    		if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(that.youtel))){
	    		publicFun.showToast({
					isShow:true,
					type:2,
					mask:false,
					txt:'手机号码格式错误',
					dur:500
	    		});
	    		return false;
    		}

    		var url="index.php?g=Home&m=repastPcApi&a=addReserve";
    		var params={
    			reservetime:that.reservetime,
    			classify:that.classify,
    			nums:that.nums,
    			youname:that.youname,
    			youtel:that.youtel,
    			youmark:that.youmark
    		}
    		http.post(url,params,'addReserveCallBack',that);
    	},
    	addReserveCallBack:function(res){
    		//console.log(8888)
    		var that=this;
    		publicFun.showToast({
				isShow:true,
				type:4,
				mask:false,
				txt:res.msg,
				dur:500
    		});
    		that.pg=1;
    		that.dstatus=0;
    		that.filterindex=0;
    		that.rlist=[];//重置

    		//添加成功后清除上次输入的信息

    		that.reservetime='';
    		that.nums=1;
    		that.youname='';
    		that.youtel='';
    		that.youmark='';

    		that.newReserveBtn();
    		that.getReserveLists();
    	},
    	cancelReserve:function(item){
    		var that=this;
    		var url="index.php?g=Home&m=repastPcApi&a=cancelReserve";
    		var params={
    			tid:item.tableid,
    			oid:item.oid,
    			rid:item.rid
    		}
    		http.post(url,params,'cancelReserveCallBack',that);
    	},
    	cancelReserveCallBack:function(res){
    		var that=this;
    		publicFun.showToast({
				isShow:true,
				type:4,
				mask:false,
				txt:res.msg,
				dur:500
    		});
			that.getReserveLists();

    	},

    	dealwith:function(item){

    	},
    	getEmptyTable(item){
    		var that=this;
    		that.isEmptyTable=true;
    		that.bgshow=true;
    		that.tableIndex=0;
    		that.selectTable='';
    		that.thisReserve=item;
    		var url="index.php?g=Home&m=repastPcApi&a=tableList";
    		var params={
    			cid:that.cid,
    			tstatus:0,
    			classify:item.classify,
    			search:'',
    			pg:0
    		}
    		that.tableclassify=item.classify;
    		http.get(url,params,'getEmptyTableCallBack',that);
    	},
    	getEmptyTableCallBack:function(res){
    		console.log(res)
    		var that=this;
    		if(res.datas.tlist!=''){
	    		that.tableList= _.chunk(res.datas.tlist,8);
	    		console.log(that.tableList)
    		}else{
				publicFun.showToast({
					isShow:true,
					type:2,
					mask:false,
					txt:'暂时没有空桌',
					dur:500
				})
    		}

    	},
    	emptyTablePrevAndAdd(type){
    		var that=this;
    		if(type=="next"){
    			if(that.tableIndex==that.tableList.length-1) return;
    			that.tableIndex++;
    		}else{
    			if(that.tableIndex==0) return;

    			that.tableIndex--
    		}
    		that.selectTable='';
	        that.tableId='',
	        that.selectTable=''

    		console.log(that.tableIndex)
    	},
    	selectTableClick(item){
    		var that=this;
    		that.tableId=item.id
    		that.selectTable=item
    	},


   //  	useTableReserve:function(item){

   //  		var that=this;
   //  		var url="index.php?g=Home&m=repastPcApi&a=useTableReserve";
   //  		var params={
   //  			tid:item.tableid,
   //  			oid:item.oid,
   //  			rid:item.rid
   //  		}
   //  		http.post(url,params,'useTableReserveCallBack',that);
   //  	},
   //  	useTableReserveCallBack:function(res){
   //  		var that=this;
   //  		publicFun.showToast({
			// 	isShow:true,
			// 	type:4,
			// 	mask:false,
			// 	txt:res.msg,
			// 	dur:1500
   //  		});
			// that.getReserveLists();
   //  	},


    	useTableStart:function(){
    		var that=this;
    		if(that.selectTable==""){
				publicFun.showToast({
					isShow:true,
					type:2,
					mask:false,
					txt:'请选择餐桌',
					dur:500
				});
				return;



    		}
    		if(parseInt(that.thisReserve.nums)>that.selectTable.num){
				publicFun.showToast({
					isShow:true,
					type:2,
					mask:false,
					txt:'此餐桌不能容纳'+that.thisReserve.nums+'人',
					dur:500
				});
				return;
    		}
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
    		var url="index.php?g=Home&m=repastPcApi&a=useTableReserve";
    		console.log(that.selectTable)
    		var params={cid:that.cid,tid:that.tableId,rid:that.thisReserve.rid,oid:that.thisReserve.oid,nums:that.thisReserve.nums};
    		http.post(url,params,'useTableStartCallBack',that);

    	},
    	useTableStartCallBack:function(res){
    		var that=this;
    		console.log(res)
    		publicFun.showToast({
				isShow:true,
				type:4,
				mask:false,
				txt:res.msg,
				dur:500
    		});
			that.cancelWindow();

			that.getReserveLists();
    		//that.$router.push(`/order?tid=${that.selectTable.id}`);
    	},
    	cancelWindow:function(){
    		var that=this;
    		that.tableIndex=0;
    		that.selectTable='';
    		that.tableId='';
    		that.thisReserve=''


    		that.isEmptyTable=false;
    		that.bgshow=false;
    	},
    	pnumReduceAndAdd(type){
    		var that=this;

    		var nums=parseInt(that.nums);
    		if(!publicFun.isNumber(nums)) nums=1;
    		if(type=='add'){
    			nums++
    		}else{
    			if(nums==1) return;
    			nums--
    		}
    		that.nums=nums;
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
	.mainInner{top: 186px}
	.bigTit{background-color: rgba(0,0,0,.4);height: 80px;text-align: center;line-height: 80px;color: #fff;font-size: 32px}
	.filter{position: absolute;top: 20px;left: 0;right: 28px}
	.filter span{font-size: 18px;width: 90px;height: 30px;text-align: center;line-height: 30px;float: left;margin-left: 28px;background: #48465b;color: #fff;cursor: pointer;border:2px solid #48465b;}
	.filter span.on{border-color: #fa8b2e;background-color: #fa8b2e}
	.filter .reserveNow{}
	.filter .reserveNow span{background-color: #69bf16;color: #fff;border:0;width: auto;padding: 0 15px;height: 34px;line-height: 34px;margin: 0;border-radius: 3px}

	.page{position: absolute;left:28px;bottom: 44px;font-size: 24px;color: #48465b;line-height: 40px;}
	.page em{margin-right: 15px}
	.page .arrow{font-size: 40px;margin-left: 20px;cursor: pointer;}

	.cashier{position: absolute;right: 30px;bottom: 30px}
	.cashier p {font-size: 20px}
	.cashier p span{font-size: 32px;color: #48465b}

	.panel{position: absolute;top: 76px;left: 28px;right: 28px;bottom: 140px}
	.panel table{background-color: rgba(255,255,255,.2);width: 100%;    height: 100%;}
	.panel table thead{}
	.panel table thead th{background-color: rgba(255,255,255,.3);font-size: 20px;color: #555062;font-weight: normal;height: 46px}
	.panel table tbody{}
	.panel table tbody tr:nth-child(odd){background-color: rgba(0,0,0,.05)}
	.panel table tbody tr:nth-child(even){background-color: rgba(0,0,0,.1)}
	.panel table tbody tr td{height: 70px;font-size: 20px;color: #555062;text-align: center;word-break: break-all;padding: 0 10px;}
	.panel table tbody tr td.ctrlBtn span{display: inline-block;padding: 0 10px;font-size: 18px;color: #cdcad4;background-color: #48465b;cursor: pointer;margin:0 5px;border-radius: 3px;height: 30px;line-height: 30px;width: 74px;text-align: center;}
	.panel table tbody tr td.ctrlBtn span.span1{background-color: #69bf16;color: #fff}
	 table tbody {
	    display:block;
	    height:574px;
	    overflow-y:auto;
	}
	table thead, tbody tr {
	    display:table;
	    width:100%;
	    table-layout:fixed;
	}


/*table thead {
    width: calc( 100% - 1em )
}  */


	.searchInput .searchInputWrap{border:10px solid #474957;}
	.searchInput .icon{width: 60px;height: 60px;line-height: 57px;text-align: center;background-color: #fff}
	.searchInput .icon i{font-size: 30px;color: #999}
	.searchInput input{border:0;height: 60px;line-height: 60px;width: 300px;font-size: 24px}


	.newReserve{width: 600px;;position: fixed;top: 20%;left: 50%;margin-left: -300px;background-color: #fff;z-index: 10}
	.newReserve>.wrap{padding: 0 30px}
	.newReserve .hd{font-size: 25px;padding: 10px 0;text-align: center;border-bottom: 1px solid #dedee1;color: #48465b}
	.newReserve .bd .row{margin: 15px 0}
	.newReserve .bd .row span{    font-size: 14px;
    color: #333;
    height: 30px;
    line-height: 30px;
    width: 100px;
    text-align: right;margin-right: 10px}
    .newReserve .bd .row input,.newReserve .bd .row select{height: 30px;display: block;width: 100%;border:0;}
    .newReserve .bd .row textarea{height: 50px;border:0;width: 100%;resize: none;padding: 5px 0}
    .newReserve .bd .row .wrap{padding:0 10px;border:1px solid #eee;}
    .newReserve .bd .row .wrap i{    font-size: 30px;vertical-align: middle;color: #fa8b2e}
	.newReserve  .ft{width: 400px;margin: 0 auto;padding-bottom: 20px}
	.newReserve  .ft span{width: 150px;height: 40px;line-height: 40px;text-align: center;display: block;text-align: center;background-color: #fa8b2e;margin: 0 auto;font-size: 16px;color: #fff;cursor: pointer;}
	.newReserve  .ft span.cancel{color: #333;background-color: #d6d6d6}
	.divline{height: 140px;padding: 15px 0}
	.emptyTableWindow .hd{font-size: 16px}
	.tableLists{margin-right: -5px}
	.tableLists .table{float: left;width: 105px;height: 105px;background-color: #fff;margin-right: 5px;margin-bottom: 5px;cursor: pointer;border: 1px solid #eee}
	.tableLists .table{background: #fff url(../../assets/t_1.png) no-repeat center center;}
	.tableLists .table.on{background-image: url('../../assets/table_5.png');}
	.tableLists .table>.wrap{padding: 6px;padding-bottom: 0}
	.tableLists .table .dataNum{font-size: 12px;color: #999}
	.tableLists .table .subDataNum{font-size: 14px;color: #999;text-align: left;}
	.tableLists .table .tableFoot{bottom: 6px;left: 6px;right: 6px}
	.tableLists .table .tableFoot .yyTxt{color: #fa8b2e;font-size: 24px;line-height: 24px}
	.tableLists .table .tableFoot .phoneNum{line-height: 24px}


	.selectWrap{margin-left: 28px}
	.selectWrap select{height: 34px;border: 0;padding: 0 5px;width: 100px}
	@media screen and (max-height:960px){
		table tbody{height: 540px}
	}
	@media screen and (max-width:1600px){
		table tbody{height: 480px;}
		.panel table tbody tr td.ctrlBtn span.span1{margin-bottom: 5px;}
	}
	@media screen and (max-width:1366px){
		.panel table tbody tr td{font-size: 16px;}
		.panel table thead th{font-size: 18px;}
		.page{bottom: 30px}
		table tbody{height: 360px;}
	}
	@media screen and (max-width: 1280px) {
		.mainInner{top:116px;}
		.searchInput .searchInputWrap{border:5px solid #474957;}
		.searchInput .icon{width: 40px;height: 40px;line-height: 50px;}
		.searchInput .icon i{font-size: 24px;}
		.searchInput input{border:0;height: 40px;line-height: 40px;font-size: 16px}
		.panel table tbody tr td.ctrlBtn span{width: 66px;}
		.navDiv .span{height: 50px;line-height: 50px;font-size: 20px}
		.navDiv .span:hover::after,.navDiv .span.on::after{height: 3px}
		.dataTip .wrap span{font-size: 18px}
		.tableList{top: 106px;bottom: 132px;}
		.tableList .table{width: 150px;height: 150px}

		.ctrlBtn span{height: 38px;font-size: 14px;line-height: 38px;padding: 0 15px;width: auto;border-radius: 5px}
		.ctrlBtn span i{width: 26px !important;height: 26px !important;}
		.page{bottom: 40px}
		.tableList .table .tableFoot .yyTxt{font-size: 14px}
		.bigTit{height:50px;line-height: 50px;font-size: 24px;}
		.panel table tbody tr td.ctrlBtn span{font-size: 16px;height: 25px;line-height: 25px;}
		table tbody{height: 454px;}
	}
	@media screen  and (max-width: 1024px){
		.page{bottom: 40px;}
		table tbody{height: 430px;}
		.filter span{width: 80px;margin-left: 15px;font-size: 16px;}
		.selectWrap{margin-left: 15px;}
	}

</style>
