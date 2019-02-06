<template>
	<div class="body_bg">
	<div class="handover">
		<headbar></headbar>
		<div class="bigTit" v-if="handDutyInfoData.logintime">
				<p><span>当班时间：{{setFormatDate(handDutyInfoData.logintime)}}</span><span>至</span> <span>{{etime}}</span><span class="nextSta">开班人：{{handDutyInfoData.eusername}}</span></p>
				<p><span>订单金额：{{handDutyInfoData.mpriceSum}}</span><span>实收金额：{{handDutyInfoData.moneySum}}</span></p>
		</div>
		<div class="mainInner">
			<div class="panel">
				<div class="getMoney clear">
					<div class="leftTitle"><span>本班收款情况</span></div>
					<table width="100%" border="0" cellspacing="0" cellpadding="0">
						<thead>
							<tr>
								<th scope="col">收款类型</th>
								<th scope="col">消费次数</th>
								<th scope="col">订单金额</th>
								<th scope="col">实收金额</th>
							</tr>
						</thead>
						<tbody>
							<tr class="" v-if="handDutyInfoData.payData.length>0" v-for="item in handDutyInfoData.payData">
								<td>{{item.payName}}</td>
								<td>{{item.payNum}}</td>
								<td>{{item.payPriceSum}}</td>
								<td>{{item.payMoneySum}}</td>
							</tr>
<!-- 							<tr class="" v-if="handDutyInfoData.couponList.length==0">
								<td>{{0}}</td>
								<td>{{0}}</td>
								<td>{{0}}</td>
								<td>{{0}}</td>
							</tr>
 -->							<tr class="">
								<td>合计</td>
								<td>{{handDutyInfoData.orderNum}}</td>
								<td>{{handDutyInfoData.mpriceSum}}</td>
								<td>{{handDutyInfoData.moneySum}}</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="business">
					<div class="leftTitle"><span>本班营业情况</span></div>
					<table width="100%" border="0" cellspacing="0" cellpadding="0">
						<tbody>
							<tr>
								<td scope="col">消费单数 {{handDutyInfoData.orderNum}}</td>
								<td scope="col">单均消费 ￥{{handDutyInfoData.orderAvg}}</td>
								<td scope="col">消费人数 {{handDutyInfoData.consumerNum}}</td>
								<td scope="col">人均消费 ￥{{handDutyInfoData.consumerAvg}}</td>
							</tr>
							<tr>
								<td>菜品优惠 ￥{{handDutyInfoData.discountDishSum}}</td>
								<td>赠菜优惠 ￥{{handDutyInfoData.freeDishPrice}}</td>
								<td>会员折扣 ￥{{handDutyInfoData.discountMonSum}}</td>
								<td>储值抵扣 ￥{{handDutyInfoData.rediscountMonSum}}</td>

							</tr>
							<tr>
								<td>优惠券抵扣 ￥{{handDutyInfoData.reduceCostSum}}<span v-if="handDutyInfoData.couponNum">（{{handDutyInfoData.couponNum}}张）</span></td>
								<td>积分抵扣 ￥{{handDutyInfoData.pointMoneySum}}<span v-if="handDutyInfoData.costPointNum">（{{handDutyInfoData.costPointNum}}积分）</span></td>
								<td>改价优惠 ￥{{handDutyInfoData.selfChangeSum}}</td>
								<td>随机立减 ￥{{handDutyInfoData.payReduceSum}}</td>

							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div class="bottomOpa">
				<div class="btn" @click="overHandDuty">
					交班并退出
				</div>
				<div class="print fr" @click="printToggle" v-if="handDutyInfoData.handOverPrint==1">
					<div class="fr" :class="{bg2 : isPrint==1 }">打印</div>
					<div class="fl" :class="{bg1 : isPrint==0 }">不打印</div>
				</div>
			</div>
		</div>
		<fullbg v-if="bgshow"></fullbg>
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

  export default {
	components:{headbar,fullbg},
    data () {
      return {
        bgshow:false,
        begintime:'',
        endtime:'',
        isShowStartDate:false,
        isShowEndDate:false,
        pg:1,
        pcount:1,
        alltotal:6,
        filterindex:0,
        handDutyInfoData:{},
        etime:'',
        isPrint:0,
        logintime:'',
        refresh:0,
        roleModule:{}
    }
    },
    created:function() {
        store.commit('searchVisi',0)
        var date = this.formatDate(new Date());
        this.begintime = date + ' 00:00:01';
        this.endtime = date + ' 23:59:59';

		this.cid=publicFun.fetch('cid');

    },
    mounted:function(){
    	var that=this;
        clearInterval(publicFun.setInterval);
    	that.timeNow();
    	that.handDutyInfo();
		publicFun.timer(that.handDutyInfo)
        that.roleModule=publicFun.fetch('roleModule');

    },
    methods:{

    	timeNow(){
    		var that=this;
			setInterval(function(){

					that.etime=that.setFormatDate(Date.parse(new Date())/1000)
			},1000);
    	},

        // 时间戳转换
        formatDate(now) {
            var year = now.getFullYear();
            var month = (now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
            var date = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
            var hour = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
            var minute = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
            var second = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds();
            return year + "-" + month + "-" + date;
        },
        handDutyInfo(){
        	var that=this;
        	var url="index.php?g=Home&m=repastPcApi&a=handDutyInfo";
        	var etime=that.setFormatDate(Date.parse(new Date())/1000);
        	var params={
        		cid:that.cid,
        		etime:etime,
        		refresh:that.refresh++
        	}
        	// that.etime=etime;
        	http.get(url,params,'handDutyInfoCallBack',that)
        },
        handDutyInfoCallBack(res){
        	console.log(res)
        	var that=this;
        	that.handDutyInfoData=res.datas;
        	that.isPrint=res.datas.shiftprint;
   //      	if(res.datas.lastlogoutabnormal==1){

   //  		publicFun.showModal({
			// 	isShow:true,
			// 	mask:true,
			// 	txt:'您于'+that.setFormatDate(res.datas.lastlogtime)+'异常退出，您上次的交班记录，是否需要累计至本次交班里？若放弃，则上次的交班情况将不再保存。',
			// 	confirm:that.dutyAbnormal
			// })



   //      	}
        },
        dutyAbnormal(){
        	var that=this;
        	var url="index.php?g=Home&m=repastPcApi&a=dutyAbnormal";
        	var params={
        		isneed:1
        	}
        	http.get(url,params,'dutyAbnormalCallBack',that);
        },
        dutyAbnormalCallBack(res){
        	var that=this;
        	that.logintime=that.setFormatDate(res.datas.logintime);
    		publicFun.hideModal();
        },
        setFormatDate(date){
        	return publicFun.setDate(date);
        },
        overHandDuty(){
        	var that=this;
            if(this.roleModule.handOver!=1){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'没有交接班权限',
                    dur:3000
                });
                return;
            }
	        clearInterval(publicFun.setInterval);
        	var url="index.php?g=Home&m=repastPcApi&a=overHandDuty";
        	var etime=that.setFormatDate(Date.parse(new Date())/1000);
        	// if(that.logintime!=''&&that.handDutyInfoData.lastlogoutabnormal==1){
        	// 	etime=that.logintime
        	// }
        	// if(publicFun.fetch('checkLastLogin')){
        	// 	var logintime=publicFun.fetch('checkLastLogin')
        	// 	etime=logintime.logintime;
        	// }
        	var params={
        		cid:that.cid,
        		etime:etime
        	}
        	http.post(url,params,'overHandDutyCallBack',that)
        },
        overHandDutyCallBack(res){
        	var that=this;
			publicFun.showToast({
				isShow:true,
				type:4,
				mask:false,
				txt:res.msg,
				dur:500
			})

			setTimeout(function(){
				publicFun.remove('isLogIn');
				that.$router.go(0)
			},1500)

        },
        printToggle(){
        	var that=this;
        	that.isPrint=that.isPrint==0?1:0;
        	if(that.handDutyInfoData.handOverPrint==0){
                that.isPrint=0
			}
        	var url="index.php?g=Home&m=repastPcApi&a=shiftPrint";
        	var params={
        		cid:that.cid,
        		isPrint:that.isPrint
        	}
        	http.get(url,params,'printToggleCallBack',that);
        },
        printToggleCallBack(res){
        	var that=this;
	          publicFun.showToast({
	            isShow:true,
	            type:4,
	            mask:false,
	            txt:res.msg,
	            dur:500
	          })
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

<style scoped>
	span.nextSta{margin-left: 60px;}
	.clear:after{content:'';display:block;clear: both;height: 0;overflow: hidden;}
	.handover .bigTit{background-color: rgba(0,0,0,.4);height: 80px;text-align: left;line-height: 80px;color: #fff;font-size: 32px;padding-left: 28px;}
	.handover .bigTit{font-size: 18px;line-height: 28px;}
	.handover .bigTit span{padding-right: 20px;}
	.handover .bigTit input{width: 100px;height: 32px;position: relative;top: -4px;padding-left: 10px;}
	.handover .bigTit p{height: 36px;line-height: 46px;}
	.mainInner{padding: 15px 28px;box-sizing: border-box;-webkit-box-sizing: border-box;-o-box-sizing: border-box;-moz-box-sizing: border-box;-ms-box-sizing: border-box;top: 180px;}
	.page{position: absolute;left:28px;bottom: 44px;font-size: 24px;color: #48465b}
	.page em{margin-right: 15px}
	.page .arrow{font-size: 40px;margin-left: 20px;cursor: pointer;}
    .panel table{background-color: rgba(255,255,255,.7);width: 100%;position: relative;margin-left: 4px;}
	.panel table thead th{background-color: hsla(0,0%,100%,.3);font-size: 20px;color: #555062;font-weight: normal;height: 70px;color: #666;}
	.panel table tbody tr:nth-child(odd){background-color: #fff}
	.panel table tbody tr:nth-child(even){background-color: #ddd}
	.panel table tr td{height: 44px;font-size: 20px;color: #555062;text-align: center;}
	.panel table tbody tr td.ctrlBtn span{display: inline-block;padding: 3px 10px;font-size: 18px;color: #cdcad4;background-color: #48465b;cursor: pointer;margin:0 5px;}
	.panel .leftTitle{width: 68px;background: #f1932f;color: #fff;font-size: 20px;padding: 0 24px;box-sizing: border-box;height: 100%;position: absolute;left: -1px;top: 0px;z-index: 20;}
	.panel .leftTitle span{position: absolute;top: 50%;margin-top: -76px;width: 20px;display: inline-block;}
	.panel table tbody tr td:first-child{padding-left: 68px;}
	.panel table tr th:first-child{padding-left: 68px;}
	.handover .getMoney table tbody {
	    display:block;
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
		-o-box-sizing: border-box;
		-moz-box-sizing: border-box;
		-ms-box-sizing: border-box;
	}
	table thead, tbody tr {
	    display:table;
	    width:100%;
	    table-layout:fixed;
	}
	.panel table tbody tr.total{
		position: absolute;
		bottom: 0;
		z-index: 19;
		background: #fff;
		height: 40px;
	}
	.panel table tbody tr.total td{height: 40px;}
    .totalMoney {
        font-size: 16px;
        color: #48465b;
        position: absolute;
        bottom: 10px;right: 28px;
    }
    .totalMoney span{font-size: 30px;font-weight: bold;}
	.divline{height: 140px;padding: 15px 0}
	.getMoney{overflow: hidden;position: relative;border-radius: 5px;overflow: hidden;}
	.business{position: relative; margin-top: 10px;border-radius: 5px;overflow: hidden;}
	.business .leftTitle{top: 0;}
	.panel .business table{height: 100%;}
	.panel .business table tbody tr{background:rgba(255,255,255,.7);border:0;}
	.panel .business table tbody td{text-align: left;height: 56px;}
	.panel .business table tr td:first-child{padding-left: 88px;}
	.bottomOpa{height: 70px;position: absolute;bottom: 20px;width: 96%;z-index: 20;}
	.bottomOpa .bag{width: 140px;height:70px;background: url(../../assets/moneyBag.png) no-repeat center;background-size: contain;font-size: 20px;position: absolute;left: 0;bottom: 0;}
	.bottomOpa .bag{line-height: 70px;text-align: right;padding-right: 20px;}
	.bottomOpa .print{position: absolute;right: 0;bottom: 0;background: rgba(255,255,255,.3);width: 230px;cursor: pointer;border-radius: 5px;}
	.bottomOpa .print div{width: 115px;height: 70px;font-size: 26px;text-align: center;line-height: 70px;color: #fff;color: #fff;}
	.bottomOpa .print div.bg1{border-top-left-radius: 5px;border-bottom-left-radius: 5px;background: #fa8b2e;}
	.bottomOpa .print div.bg2{border-top-right-radius: 5px;border-bottom-right-radius: 5px;background: #fa8b2e;}
	.bottomOpa .btn{width: 300px;height: 100%;text-align: center;font-size: 26px;color: #fff;background: #fa8b2e;margin:0 auto;
	background: -webkit-linear-gradient(#f1932f 50%, #fa8b2e 50%);
  background: -o-linear-gradient(#f1932f 50%, #fa8b2e 50%);
  background: -moz-linear-gradient(#f1932f 50%, #fa8b2e 50%);
  background: linear-gradient(#f1932f 50%, #fa8b2e 50%);
	;line-height: 70px;position: relative;left: -30px;cursor: pointer;border-radius: 5px;}

	@media screen and (max-width:1600px){
		.bottomOpa{bottom: 20px;}
	}
	@media screen and (max-width:1366px){
		.bottomOpa{bottom: 10px;}
		.panel .business table tbody tr td:first-child{width: 210px;}
		.panel table thead th{font-size: 16px;}
		.panel table tr td{font-size: 16px;}
		.bottomOpa{width:95.5%;}
		.panel table thead th, .panel table tr td{font-size: 16px;}
		/* .bottomOpa .btn,.bottomOpa .print div,.bottomOpa .print{height: 50px;line-height: 50px;} */
	}
	@media screen and (max-width:1280px){
		.bottomOpa{bottom: 20px;}
		.mainInner{top:140px;}
		.panel table tr td{font-size: 16px;}
		.bottomOpa{width: 94.5%;}
	}
	@media screen and (max-width: 1200px){
		.handover .bigTit{font-size: 16px;}
		.handover .bigTit input{width: 66px;height: 26px;}
	}
	 @media screen and (max-width: 1024px){
		.handover .mainInner{top:140px;}
		.bottomOpa{width: 94%;bottom: 24px;}
	}
	@media screen and (max-height:1000px){
		.panel table tr td,.panel table thead th{height: 44px;font-size: 18px;}
	}
	@media screen and (max-height:900px){
		.panel .leftTitle{font-size: 16px;}
		.panel .leftTitle span{margin-top: -62px;}
		.panel .business table tbody td{height: 46px;}
		.bottomOpa{height: 60px;}
		.bottomOpa .btn{line-height: 60px;}
		.bottomOpa .print div{height: 60px;line-height: 60px;}
		.panel table tr td{height: 40px;font-size: 16px;}
	}
	@media screen and (max-height:850px){
		.panel table tr td,.panel .leftTitle{font-size: 14px;}
		.panel .leftTitle span{margin-top: -56px;}
		.panel .business table tbody td{height: 40px;}

	}
	@media screen and (max-height:800px){
		.panel table thead th, .panel table tr td{height: 26px;font-size: 14px;}
		.bottomOpa{height: 50px;}
		.bottomOpa .btn{line-height: 50px;}
		.bottomOpa .print div{height: 50px;line-height: 50px;}
	}
</style>
