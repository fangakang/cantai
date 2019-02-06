<template>
    <div class="body_bg">
        <div class="bills">
            <headbar></headbar>
            <div class="bigTit clear">
                账单
            </div>
            <div class="mainInner">
                <div>
                    <div class="filter clear">
                        <div class="fl date">
                            <span>时间</span> <input type="text" name="" v-model="begintime" readonly @click="chooseStartTime"> <i class="date" @click="chooseStartTime"></i> <span>至</span> <input type="text" v-model="endtime" @click="chooseEndTime"> <i class="date" @click="chooseEndTime"></i>
                        </div>
                        <div class="time fl">
                            <span v-for="(item,index) in filters" :class="{on:filterindex==index}" @click="changeChoose(index)">{{item}}</span>
                        </div>
                    </div>
                    <div class="filter selectDiv clear">
                        <div class="select">
                            <div class="fl staff">
                                <p class="fl">收银员</p>
                                <select class="fl" v-model="pf_staffid">
                                    <option value="">全部收银员</option>
                                    <option :value="item.pf_staffid" v-for="item in staffs">{{item.eusername}}</option>
                                </select>
                            </div>
                            <div class="fl payway">
                                <p class="fl">付款方式</p>
                                <select class="fl" v-model="paytype">
                                    <option value="">全部付款方式</option>
                                    <option :value="item.type" v-for="item in paywayList">{{item.payName}}</option>
                                </select>
                            </div>
                            <div class="fl payway">
                                <p class="fl">下单来源</p>
                                <select class="fl" v-model="fromid">
                                    <option :value="item.id" v-for="item in orderfrom">{{item.title}}</option>
                                </select>
                            </div>
                            <div class="fl time search">
                                <span class="btn_searchStyleMo btn_searchStyle" @click="search">查询</span>
                                <span class="btn_searchStyle" @click="clearSearch">清空</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="panel">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <thead>
                        <tr>
                            <th scope="col">餐台号</th>
                            <!-- <th scope="col">类型</th> -->
                            <th scope="col">单号</th>
                            <th scope="col">下单来源</th>
                            <th scope="col">订单金额</th>
                            <th scope="col">未收订单金额</th>
                            <th scope="col">实收金额</th>
                            <th scope="col" class="tdpayways">付款方式</th>
                            <th scope="col">收银员</th>
                            <th scope="col">结账时间</th>
                            <th scope="col" class="ctrlBtn">操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(item,idx) in list" :key="idx">
                            <td>{{item.t_name ? item.classify + '--' + item.t_name : item.classify + '-----'}}</td>
                            <!-- <td>{{item.classify}}</td> -->
                            <td>{{item.orderid}}</td>
                            <td>{{item.ordercfrom == 0 ? '-----' : item.ordercfrom == 1 ? '小程序' : item.ordercfrom == 2 ? 'APP' : item.ordercfrom == 3 ? '餐饮收银台' : 'H5'}}</td>
                            <td>{{item.premoney}}</td>
                            <td>{{item.not_pay > 0 ? item.not_pay : '-----'}}</td>
                            <td>{{item.price}}</td>
                            <td class="tdpayways"><div class="payways">
                                <div>{{item.paytypeStr}}</div>
                                <div v-if="item.subpaytype.length > 0"><div v-for="(pay,payidx) in item.subpaytype" :key="payidx">{{pay.paytypeStr}}</div></div>
                            </div></td>
                            <td>{{item.staffname ? item.staffname : '-----'}}</td>
                            <td>{{item.payTime}}</td>
                            <td class="tc ctrlBtn"><span @click="showdetail(item.id)" class="span1">查看明细</span><span @click="orderPrint(item.id)" class="span2">补打账单</span></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="page" v-if="pcount>1">
                    <em>{{pg}}/{{pcount}}</em>共{{alltotal}}单<div class="arrow dib">
                    <i class="fa fa-fw fa-chevron-up" :class="{gray : pg == 1}" @click="nextAndPrev('prev')"></i><i class="fa fa-fw fa-chevron-down" :class="{gray : pg == pcount}"  @click="nextAndPrev('next')"></i>
                </div>
                </div>
                <div class="totalMoney">
                    <p class="fr total">实收合计：<span>￥{{allpaidmoney}}</span>（小程序无餐桌点餐的订单，暂且不进入收银台账单查看）</p>
                    <p class="fr" style="display:none;">应收合计：<span>￥{{allpremoney}}</span></p>
                </div>
            </div>
            <div class="detailPop" v-if="showDetail">
                <i class="close" @click="closePop"></i>
                <div class="title">{{detail.companyname}}</div>
                <div class="opation">
                    <table>
                        <tr>
                            <td>台号：{{detail.classify+'-'+detail.t_name}}</td>
                            <td width="150" style="text-align:center">人数：{{detail.nums}}</td>
                            <td>单号：{{detail.orderid}}</td>
                        </tr>
                        <tr>
                            <td>开台时间：{{detail.openTime}}</td>
                            <td></td>
                            <td>服务员：{{detail.staffname || '-----'}}</td>
                        </tr>
                        <tr>
                            <td>结账时间：{{detail.payTime || '-----'}}</td>
                            <td></td>
                            <td>收银员：{{detail.staffname}}</td>
                        </tr>
                    </table>
                </div>
                <div class="list">
                    <table>
                        <thead>
                        <tr>
                            <th scope="col">菜品</th>
                            <th scope="col">单价</th>
                            <th scope="col">数量</th>
                            <th scope="col">总额</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(item,index) in detail.dishLish"  v-if="item.num > 0&&item.num !=item.freenum ">
                            <td class="name nameTd">{{item.name}}{{item.spec ? '-'+item.spec : ''}}{{item.attr ? '-' + item.attr : ''}}{{item.paid == 0 ? '(未支付)' : ''}}</td>
                            <td>￥{{item.price}}</td>
                            <td v-if="item.freenum">{{(parseFloat(item.num)-parseFloat(item.freenum)).toFixed(2)}}</td>
                            <td v-if="!item.freenum">{{parseFloat(item.num).toFixed(2)}}</td>
                            <td v-if="item.freenum">￥{{(item.price * (item.num-item.freenum)).toFixed(2)}}</td>
                            <td v-if="!item.freenum">￥{{(item.price * (item.num)).toFixed(2)}}</td>
                        </tr>
                        <tr v-for="(item,index) in detail.dishLish"  v-if="item.offnum>0">
                            <td class="name nameTd">{{item.name}}{{item.spec ? '-'+item.spec : ''}}{{item.attr ? '-' + item.attr : ''}}{{item.paid == 0 ? '(未支付)' : ''}}<span class="sendFlag" v-if="item.offnum">退</span></td>
                            <td>￥{{item.price}}</td>
                            <td>{{parseFloat((item.offnum)).toFixed(2)}}</td>
                            <td>￥{{(item.price * item.offnum).toFixed(2)}}</td>
                        </tr>
                        <tr v-for="(item,index) in detail.dishLish"  v-if="item.freenum>0">
                            <td class="name nameTd">{{item.name}}{{item.spec ? '-'+item.spec : ''}}{{item.attr ? '-' + item.attr : ''}}{{item.paid == 0 ? '(未支付)' : ''}}<span class="sendFlag" v-if="item.freenum">赠</span></td>
                            <td>￥{{item.price}}</td>
                            <td>{{parseFloat((item.freenum)).toFixed(2)}}</td>
                            <td>￥{{(item.price * item.freenum).toFixed(2)}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="paymoney clearfix" style="padding: 12px 0;">
                    <div>订单金额：￥{{detail.totalprice}}</div>
                    <div>实付金额：￥{{detail.paidmoney}}</div>
                    <div v-if="detail.allprivilege > 0">优惠金额：￥{{detail.allprivilege}}</div>
                </div>
                <div class="account" v-if="minusTotal!=0||appDiscountList!=''">
                    <span v-if="minusList.drawReduce&&!appDiscountList.rediscountMon">储值折扣:￥{{parseFloat(minusList.drawReduce).toFixed(2)}}</span>
                    <span v-if="minusList.drawReduce&&appDiscountList.rediscountMon">储值折扣:￥{{(parseFloat(minusList.drawReduce)+parseFloat(appDiscountList.rediscountMon)).toFixed(2)}}</span>
                    <span v-if="!minusList.drawReduce&&appDiscountList.rediscountMon">储值折扣:￥{{parseFloat(appDiscountList.rediscountMon).toFixed(2)}}</span>


                    <span v-if="minusList.vipPoint&&!appDiscountList.reduce_money">积分抵扣:￥{{parseFloat(minusList.vipPoint).toFixed(2)}}</span>
                    <span v-if="minusList.vipPoint&&appDiscountList.reduce_money">积分抵扣:￥{{(parseFloat(minusList.vipPoint)+parseFloat(appDiscountList.reduce_money)).toFixed(2)}}</span>
                    <span v-if="!minusList.vipPoint&&appDiscountList.reduce_money">积分抵扣:￥{{parseFloat(appDiscountList.reduce_money).toFixed(2)}}</span>


                    <span v-if="minusList.vipcard&&!appDiscountList.discountMon">会员折扣:￥{{parseFloat(minusList.vipcard).toFixed(2)}}</span>
                    <span v-if="minusList.vipcard&&appDiscountList.discountMon">会员折扣:￥{{(parseFloat(minusList.vipcard)+parseFloat(appDiscountList.discountMon)).toFixed(2)}}</span>
                    <span v-if="!minusList.vipcard&&appDiscountList.discountMon">会员折扣:￥{{parseFloat(appDiscountList.discountMon).toFixed(2)}}</span>


                    <span v-if="minusList.couponcard&&!appDiscountList.reduce_cost">优惠券抵扣<span v-if="detail.couponName">({{detail.couponName}})</span>:￥{{parseFloat(minusList.couponcard).toFixed(2)}}</span>
                    <span v-if="minusList.couponcard&&appDiscountList.reduce_cost">优惠券抵扣<span v-if="detail.couponName">({{detail.couponName}})</span>:￥{{(parseFloat(minusList.couponcard)+parseFloat(appDiscountList.reduce_cost)).toFixed(2)}}</span>
                    <span v-if="!minusList.couponcard&&appDiscountList.reduce_cost">优惠券抵扣:￥{{parseFloat(appDiscountList.reduce_cost).toFixed(2)}}</span>


                    <span v-if="minusList.pReduce&&!appDiscountList.payReduce">随机立减:￥{{parseFloat(minusList.pReduce).toFixed(2)}}</span>
                    <span v-if="minusList.pReduce&&appDiscountList.payReduce">随机立减:￥{{(parseFloat(minusList.pReduce)+parseFloat(appDiscountList.payReduce)).toFixed(2)}}</span>
                    <span v-if="!minusList.pReduce&&appDiscountList.payReduce">随机立减:￥{{parseFloat(appDiscountList.payReduce).toFixed(2)}}</span>


                    <span v-if="minusList.mlreduce">改价优惠:￥{{parseFloat(minusList.mlreduce).toFixed(2)}}</span>
                    <span v-if="minusList.caiYHprice">菜品优惠:￥{{parseFloat(minusList.caiYHprice).toFixed(2)}}</span>
                    <span v-if="minusList.freeminus">赠菜优惠:￥{{parseFloat(minusList.freeminus).toFixed(2)}}</span>
                    <span v-if="appDiscountList.deposit">预定金抵扣:￥{{parseFloat(appDiscountList.deposit).toFixed(2)}}</span>

                    <!--<span v-if="minusList.length > 0">-->
                        <!--<span v-for="(item,index) in minusList" :key="index">-->
                            <!--<span v-if="item.title == 'drawReduce' && parseFloat(item.price) > 0">储值折扣:￥{{item.price}}</span>-->
                            <!--<span v-if="item.title == 'vipPoint' && parseFloat(item.price) > 0">积分抵扣:￥{{item.price}}</span>-->
                            <!--<span v-if="item.title == 'vipcard' && parseFloat(item.price) > 0">会员折扣:￥{{item.price}}</span>-->
                            <!--<span v-if="item.title == 'couponcard' && parseFloat(item.price) > 0">优惠券抵扣:￥{{item.price}}</span>-->
                            <!--<span v-if="item.title == 'pReduce' && parseFloat(item.price) > 0">随机立减:￥{{item.price}}</span>-->
                            <!--<span v-if="item.title == 'mlreduce' && parseFloat(item.price) > 0">改价优惠:￥{{item.price}}</span>-->
                            <!--<span v-if="item.title == 'caiYHprice' && parseFloat(item.price) > 0">菜品优惠:￥{{item.price}}</span>-->
                            <!--<span v-if="item.title == 'freeminus' && parseFloat(item.price) > 0">赠菜优惠:￥{{item.price}}</span>-->
                        <!--</span>-->
                    <!--</span>-->
                    <!--<span v-if="appDiscountList.length > 0">-->
                        <!--<span v-for="(item,index) in appDiscountList" :key="index">-->
                            <!--<span v-if="item.title == 'deposit' && parseFloat(item.price) > 0">预定金抵扣:￥{{item.price}}</span>-->
                            <!--<span v-if="item.title == 'discountMon' && parseFloat(item.price) > 0">会员折扣:￥{{item.price}}</span>-->
                            <!--<span v-if="item.title == 'rediscountMon' && parseFloat(item.price) > 0">储值折扣:￥{{item.price}}</span>-->
                            <!--<span v-if="item.title == 'reduce_money' && parseFloat(item.price) > 0">积分抵扣:￥{{item.price}}</span>-->
                            <!--<span v-if="item.title == 'reduce_cost' && parseFloat(item.price) > 0">优惠券抵扣:￥{{item.price}}</span>-->
                            <!--<span v-if="item.title == 'payReduce' && parseFloat(item.price) > 0">随机立减:￥{{item.price}}</span>-->
                        <!--</span>-->
                    <!--</span>-->

                </div>
                <div class="shishou" v-if="detail.not_pay > 0">
                    <span>未支付金额：￥{{detail.not_pay}}</span>
                </div>


            </div>
            <fullbg v-if="bgshow"></fullbg>
            <div class="successTip" v-if="showTip">
                <div class="title">提示</div>
                <div class="tip">{{printTip}}</div>
            </div>
            <datepicker @getDate="getStartDate" :bills="true" :date="begintime" v-if="isShowStartDate"></datepicker>
            <datepicker @getDate="getEndDate"  :bills="true" :date="endtime" v-if="isShowEndDate"></datepicker>
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
  export default {
	components:{headbar,fullbg,datepicker},

    data () {
      return {
            filters:['今天','近7天','近15天','近30天'],
            bgshow:false,
            showDetail:false,
            begintime:'',
            endtime:'',
            isShowStartDate:false,
            isShowEndDate:false,
            pg:0,
            pcount:0,
            alltotal:0,
            filterindex:0,
            cid:'',
            list:[],
            alllists:[],
            allpaidmoney:0,
            allpremoney:0,
            issearch:false,
            detail:[],
            filterindex:0,
            staffs:[],
            pf_staffid:'',
            paytype:'',
            showTip:false,
            paywayList:[
                {
                    payName:"微信",
                    type:"weixin"
                },
                {
                    payName:"支付宝",
                    type:"alipay"
                },
                {
                    payName:"现金",
                    type:"Cash"
                },
                {
                    payName:"POS",
                    type:"UnionPay"
                },
                {
                    payName:"余额支付",
                    type:"CardPay"
                },
                {
                    payName:"礼品卡支付",
                    type:"presentCardPay"
                }
            ],
            printTip:'',
            showToastTimes:0,//这里是个小坑，记录错误弹窗的次数，0就弹一次，大于0就不再弹。注意每次切换分类后会被重置为0
            eusername:'',
            orderfrom:[
                {
                    id:0,
                    title:'全部付款方式'
                },{
                    id:1,
                    title:'小程序'
                },{
                    id:2,
                    title:'APP'
                },{
                    id:3,
                    title:'餐饮收银台'
                },
                {
                    id:5,
                    title:'H5'
                }
            ],
            fromid:'0',
            refresh:0,
            minusList:{},
            roleModule:{},
            appDiscountList:{},
            minusTotal:0
        }
    },
    created:function() {
        store.commit('searchVisi',0)
        var date = this.formatDate(new Date(),'date');
        this.begintime = date + ' 00:00:01'
        this.endtime = date + ' 23:59:59'
        this.cid=publicFun.fetch('cid');
        this.pg+=1;
    },
    mounted:function(){
        var that=this;
        // clearInterval(publicFun.setInterval);
        that.eusername=publicFun.fetch('eusername');
        that.roleModule=publicFun.fetch('roleModule');
        that.loadData();
        that.httpstaff();

        //this.getpayway()
        // publicFun.timer(that.loadData)

    },
    methods:{
        loadData(){
            var url='index.php?g=Home&m=repastPcApi&a=getOrderLists&cid='+this.cid+'&stime='+this.begintime+'&etime='+ this.endtime +'&pf_staffid='+ this.pf_staffid +'&paytype='+ this.paytype +'&pg='+this.pg +'&ordercfrom=' + this.fromid;
            var params={
                refresh:this.refresh++
            }
            http.get(url,params,'getBillList',this)
        },
        getpayway(){
            var url = 'index.php?g=Home&m=repastPcApi&a=getPayType&cid='+this.cid
            http.get(url,'','getpaywayInfo',this)
        },
        getpaywayInfo(res){
            console.log(res)
            this.paywayList = res.datas
        },
        httpstaff(){
            var url = 'index.php?g=Home&m=repastPcApi&a=getStaffList&cid='+this.cid;
            http.get(url,'','getStaffs',this);
        },
        getStaffs(res){
            // console.log(res)
            this.staffs = res.datas;
        },
        getBillList(res){
            console.log(res)
            this.pcount = res.datas.pcount
            this.alltotal = res.datas.alltotal
            this.allpremoney = res.datas.allpremoney || 0
            this.allpaidmoney = res.datas.allpaidmoney || 0
            if(res.datas.olist &&   res.datas.olist.length > 0){
                this.list = res.datas.olist;
                for(let i = 0 ; i < this.list.length ; i++){
                    this.list[i].payTime = this.formatDate(new Date(this.list[i].paytime * 1000))
                    if(this.list[i].paytime == 0){
                        this.list[i].payTime = '-----'
                    }
                }
            }else{
                this.pg=0;
                this.list = ''
                if(this.showToastTimes==0){
                    publicFun.showToast({
                        isShow:true,
                        type:2,
                        mask:false,
                        txt:'没有相关数据',
                        dur:500
                    });
                    this.showToastTimes++
                }
            }
        },
        changeChoose(idx){
            this.filterindex = idx;
            this.pg = 1;
            this.showToastTimes=0;
            var enddate = this.formatDate(new Date(),'date');
            if(idx == 0){
                this.begintime = enddate + ' 00:00:01'
            }else if(idx == 1){
                var beigindate = this.formatDate(new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000),'date');
                this.begintime = beigindate + ' 00:00:01'
            }else if(idx == 2){
                var beigindate = this.formatDate(new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000),'date');
                this.begintime = beigindate + ' 00:00:01'
            }else{
                var beigindate = this.formatDate(new Date(new Date().getTime() - 29 * 24 * 60 * 60 * 1000),'date');
                this.begintime = beigindate + ' 00:00:01'
            }
            this.endtime = enddate + ' 23:59:59'
            this.loadData()
        },
        nextAndPrev:function(type){
            var pg=this.pg;

    		if(type=='next'){
                if(pg>=this.pcount){
                    publicFun.showToast({
                        isShow:true,
                        type:2,
                        mask:true,
                        txt:'已到最后一页',
                        dur:1500
                    })
                    return
                };
                document.getElementsByTagName('tbody')[0].scrollTop = 0
	    		pg++
	    		this.pg=pg;
	    		this.dstatus=0;
    		}else{
	    		pg--
	    		if(pg<=0) {
                    pg = 1
                    publicFun.showToast({
                        isShow:true,
                        type:2,
                        mask:true,
                        txt:'已到首页',
                        dur:1500
                    })

                };
                document.getElementsByTagName('tbody')[0].scrollTop = 0
	    		this.pg=pg;
	    		this.dstatus=0;
            }
            this.loadData()

        },
        closePop(){
            this.bgshow = this.showDetail = false;
        },
        search(){
            if(this.roleModule.viewBill!=1){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'没有账单查询权限',
                    dur:3000
                });
                return;
            }
            this.pg = 1;
            this.showToastTimes=0;
            this.loadData();
        },
        clearSearch(){
            var that=this;
            that.pf_staffid='';
            that.paytype='';
            that.fromid=0;
            that.filterindex=0;
            that.loadData();
        },
        showdetail(id){
            if(this.roleModule.billDetail!=1){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'没有查看账单权限',
                    dur:3000
                });
                return;
            }
            var url='index.php?g=Home&m=repastPcApi&a=orderInfo&cid='+this.cid;
            http.get(url,{oid:id},'getdetail',this)
            this.showDetail = this.bgshow = true
        },
        getdetail(res){
            console.log(res)
            var detail = res.datas;
            detail.openTime = this.formatDate(new Date(detail.opentime * 1000))
            detail.payTime = this.formatDate(new Date(detail.paytime * 1000))
            this.detail = detail;
            console.log(detail);
//            var minusList = [];
//            for(let key in res.datas.minusList){
//                if(parseFloat(res.datas.minusList[key]) > 0){
//                    minusList.push({title:key,price:res.datas.minusList[key]})
//                }
//            }
            this.minusList = res.datas.minusList;
            var minusTotal=0;
            for(var key in this.minusList){
                minusTotal=parseFloat(minusTotal)+parseFloat(this.minusList[key]).toFixed(2)
            }
            this.minusTotal=minusTotal;
//            var appDiscountList=[];
//            for(let key in res.datas.appDiscountList){
//                if(parseFloat(res.datas.appDiscountList[key]) > 0){
//                    appDiscountList.push({title:key,price:res.datas.appDiscountList[key]})
//                }
//            };
            this.appDiscountList =res.datas.appDiscountList;
            console.log(this.minusTotal)
        },
        chooseStartTime:function(){
            this.isShowStartDate=true;
        },
        chooseEndTime:function(){
            this.isShowEndDate=true;
        },

    	getTime:function(date){
    		return publicFun.setDate(date)
    	},
    	//获取设置的日期，同时处理取消日期设置关闭窗口
    	getDate:function(date,showname,timename){
    		var that=this;
    		if(date){
    			if(date.time){
	    			that[showname]=false;
	    			that[timename]=date.time;

    			}else if(date.cancel){
	    			that[showname]=false;
    			}
    		}
        },
        getStartDate(date){
            this.getDate(date,'isShowStartDate','begintime')
        },
        getEndDate(date){
            this.getDate(date,'isShowEndDate','endtime')
        },
        orderPrint(id){
            if(this.roleModule.printOrder!=1){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'没有补打单权限',
                    dur:3000
                });
                return;
            }
            var url = 'index.php?g=Home&m=repastPcApi&a=staffPrint&cid='+this.cid;
            var params = {oid : id}
            http.get(url,params,'staffPrint',this);
        },
        staffPrint(res){
            console.log(res)
            if(res.error=='0'){
                this.printTip = '补打账单成功！'
                this.showTip = true;
                this.bgshow = true
                var that  = this;
                setTimeout(function(){
                    that.showTip = false;
                    that.bgshow = false
                },1000)
            }
        },
        // 时间戳转换
        formatDate(now,day) {
            var year = now.getFullYear();
            var month = (now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
            var date = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
            var hour = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
            var minute = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
            var second = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds();
            if(day == 'date'){
                return year + "-" + month + "-" + date;
            }else{
                return year + "-" + month + "-" + date + ' ' + hour + ':' + minute + ':' + second;
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

<style scoped>
    .name{position: relative}
    .sendFlag{position: absolute;top: 3px;right: 0px;color: #f00;font-size: 12px;border: 1px solid #f00;line-height: 16px;width: 15px;text-align: center;}
    .payways{min-width: 180px !important;}
    td.tdpayways,th.tdpayways{width: 180px !important;}
    .clear:after{content:'';display:block;clear: both;height: 0;overflow: hidden;}
    .bills .mainInner{top: 176px}
    .bills .bigTit{background-color: rgba(0,0,0,.4);height: 70px;text-align: center;line-height: 70px;color: #fff;font-size: 28px}
    .bills .filter{width: 100%;position: absolute;top: 14px;}
    .bills .filter .time span{font-size: 18px;width: 90px;height: 30px;text-align: center;line-height: 30px;float: left;margin-left: 28px;background: rgba(255,255,255,.6);color: #666;cursor: pointer;border:2px solid transparent;border-radius: 3px;}
    .bills .filter .time{position: absolute;left: 580px;}
    .bills .filter .search{position: absolute;left: 870px;}
    .bills .filter .search span{width: 120px;height: 34px;line-height: 34px;margin-bottom: 10px;}
    .bills .filter .date{font-size: 20px;color: #48465b;cursor: pointer;}
    .bills .filter .date input{background: none;border:0;font-size: 18px;color:#48465b;position: relative;top: -2px; width: 186px;cursor: pointer;}
    .bills .filter .date span{margin-right: 10px;}
    .bills .filter i.date{display: inline-block;width: 24px;height: 24px;background: url(../../assets/date.png) no-repeat center;background-size: contain;position: relative;top: 4px;margin: 0 10px;}
    .mainInner{padding: 28px;box-sizing: border-box;-webkit-box-sizing: border-box;-o-box-sizing: border-box;-moz-box-sizing: border-box;-ms-box-sizing: border-box;}
    .mainInner{background: rgba(255,255,255,.3)}
    .panel table tbody tr:nth-child(2n){background: rgba(0,0,0,.15) !important;}
    .bills .selectDiv{top:58px;}
    .panel{position: absolute;top: 106px;left: 20px;right: 20px;}
    .filter .select{font-size: 20px;color: #48465b;line-height: 36px;}
    .filter .select select{width: 190px;height: 36px;border:1px solid #d7d7d7; color:#555062}
    .filter .select p{margin-right: 10px;}
    .filter .select .payway{margin-left: 20px;}
    .bills .filter .time span.on{border-color: #fa8b2e;background-color: #fa8b2e;color: #fff;}
	.page{position: absolute;right:28px;bottom: 16px;font-size: 24px;color: #48465b;line-height: 40px}
	.page em{margin-right: 15px}
	.page .arrow{font-size: 40px;margin-left: 20px;cursor: pointer;}
    .panel table{background-color: rgba(255,255,255,.3);width: 100%;height: 100%;overflow:
    ;}
	.panel table thead th{background-color: rgba(255,255,255,.3);font-size: 20px;color: #555062;font-weight: normal;height: 46px}
	.panel table tbody tr:nth-child(odd){background-color: rgba(0,0,0,.05)}
	.panel table tbody tr:nth-child(even){background-color: rgba(0,0,0,.1)}
	.panel table tbody tr td{height: 70px;font-size: 18px;color: #555062;text-align: center;word-wrap:break-word;padding: 0 10px;}
	.panel table tbody tr td.ctrlBtn span{display: inline-block;padding: 6px 10px;font-size: 16px;color: #cdcad4;background-color: #48465b;cursor: pointer;margin:0 5px;border-radius: 3px;}
    /* .panel table tbody tr td.ctrlBtn span.span1{color: #fff;margin-bottom: 5px;} */
    .panel table tbody tr td.ctrlBtn{width: 210px;}
    .panel table th.ctrlBtn{width: 240px;}
	table tbody {
	    display:block;
	    overflow-y:auto;
	}
	table thead, tbody tr {
	    display:table;
	    width:100%;
	    table-layout:fixed;
	}
    .totalMoney {
        font-size: 16px;
        color: #fff;
        position: absolute;
        bottom: 24px;left: 28px;
    }
    tbody::-webkit-scrollbar,.order .menu .bd::-webkit-scrollbar
	{
	    width: 10px;
	    height: 10px;
	    border-radius: 10px;
	    background-color: #F5F5F5;
	}
	tbody::-webkit-scrollbar-track,.order .menu .bd::-webkit-scrollbar-track
	{
	    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	    border-radius: 10px;
	    background-color: #F5F5F5;
	}
	tbody::-webkit-scrollbar-thumb,.order .menu .bd::-webkit-scrollbar-thumb
	{
	    border-radius: 10px;
	    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
	    background-color: #e5e5e5;
    }
    .filter .select select option{width: 100% !important;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;word-break: break-all; font-size: 14px}
    .totalMoney span{font-size: 30px;font-weight: bold;}
    .detailPop{padding: 15px;position: relative;padding-bottom: 0}
    .detailPop i.close{display: block;width:25px;height: 25px;background: url(../../assets/fail.png) no-repeat center;background-size: contain;position: absolute;top: 15px;right: 15px;cursor: pointer;}
    .detailPop{width: 650px;min-height: 500px;background: #fff;position: fixed;top: 45%;left: 50%;transform: translate(-50%,-50%);z-index: 10;}
    .detailPop .title{font-size: 24px;text-align: center;height: 40px;line-height: 40px;}
    .detailPop .opation{font-size: 14px;margin:20px 0;border-bottom: 1px solid #dedede;padding-bottom: 10px;}
    .detailPop .opation td{min-height: 25px;}
    .detailPop .list{font-size: 16px;padding-bottom: 30px;border-bottom: 1px solid #dedede;}
    .shishou{/*position: absolute;*/font-size: 16px;text-align: right;    overflow: hidden;text-align: right;padding: 10px 0;border-top:1px solid #dede;}
    .detailPop .list table tbody{height: 190px;overflow-y: auto;}
    .detailPop .list th{height: 25px;text-align: center;}
    .detailPop .list td{max-height: 50px;text-align: center;word-break: break-all;padding: 0 10px;}
    .detailPop .list td.nameTd{padding-right: 16px;}
    .detailPop .list td.name{display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;text-overflow: ellipsis;white-space: normal;overflow: hidden;text-align: left;margin-bottom: 10px;}
    .detailPop .account{line-height: 20px;font-size: 14px;padding:10px 0;/*position: absolute;*/bottom:30px;border-top: 1px solid #e6e6e6;}
    .detailPop .account span{padding-right: 5px;}
    .detailPop .paymoney{font-size: 18px;width: 100%;line-height: 28px;}
    .detailPop .paymoney span{padding-left: 20px;line-height: 50px;}
    .successTip{width: 500px;height: 180px;position: fixed;top: 50%;left: 50%;background: #fff;border-radius: 10px;margin-left: -300px;margin-top: -100px;padding: 0 40px;z-index: 10;}
    .successTip .title{height: 60px;font-size: 34px;text-align: center;line-height:60px;margin-top: 20px;}
    .successTip .tip{font-size: 26px;text-align: center;line-height: 80px;}
    table tbody{height:600px;}

    /*2018.8.27*/
    .bills .filter .search span.btn_searchStyleMo{
      background: #fa8b2e;
      color: #fff;
    }
    .bills .filter .search span.btn_searchStyleMo:hover{
      background:rgba(252,111,0,.5);
    }

    .bills .filter .search span.btn_searchStyleMo:visited{
        background:rgba(252,111,0,.5);
    }

    .bills .filter .search span.btn_searchStyleMo:visited{
        background:rgba(252,111,0,.5);
    }

    .bills .filter .search span.btn_searchStyle:active{
     background: #fa8b2e;
     color: #fff;
    }

    /*a {color:#252525; text-decoration:none;}*/
    /*a:visited {text-decoration:none;}*/
    /*a:hover {color:#ba2636;text-decoration:underline;}*/
    /*a:active {color:#ba2636;}*/

    .filter .select select{
        border-radius: 3px;
        font-size: 16px;
    }
    /*end*/
    @media screen and (max-width:1366px) {
        .panel table tbody tr td{font-size: 14px;}
        .panel table thead th{font-size: 18px;}
        .panel table tbody tr td.ctrlBtn span{font-size: 14px;}
        .totalMoney span{font-size: 24px;}
        .page{font-size: 20px;}
        .page .arrow{font-size: 32px;}
        .bills .filter .time{position: absolute;left: 570px;}
        .bills .filter .search{position: absolute;left: 850px;}
        .bills .bigTit{ height: 50px;line-height: 50px;font-size: 24px;}
        .bills .mainInner{top: 150px;}
        .bills .filter{top: 8px;}
        .bills .selectDiv{top: 46px;}
        .bills .filter .search span{height: 28px;line-height: 28px;font-size: 16px;}
        .bills .filter .time span{height: 26px;line-height: 26px;font-size: 16px;}
        .filter .select,.bills .filter .date input,.bills .filter .date{font-size: 16px;}
        .filter .select select{height: 30px;  font-size: 15px;}
        .filter .select{line-height: 30px}
        .bills .panel{top: 90px;}
    }
    @media screen and (max-width: 1280px){
        .panel table tbody tr td{font-size: 16px;}
        .panel table th.ctrlBtn{width: 140px;}
        .panel table tbody tr td.ctrlBtn{width: 110px;}
        .panel table tbody tr td.ctrlBtn span{margin-bottom: 5px;font-size: 14px;}
        .panel table tbody tr td.ctrlBtn span.span1{margin-top: 5px;}
        .bills .mainInner{top: 110px;}
        .bills .filter .time span{margin-left: 18px}
        .bills .filter .search span{ width: 100px}
    }

    @media screen and (max-width:1200px) {
        .bills .filter .date{font-size: 16px;}
        .bills .filter .date input{font-size: 16px;}
        .filter .select p{font-size: 16px;}
        .filter .select select{width: 130px;height: 26px;position: relative;top: 3px;}
        .bills .filter .date input{width: 160px;}
        .bills .filter .time span{font-size: 16px;width: 70px;height: 26px;line-height: 26px;margin-left: 10px;}
        .bills .filter .search span{width: 86px;}
        .bills .filter .time{position: absolute;left: 516px;}
        .bills .filter .search{position: absolute;left: 646px;}
        .panel table thead th{font-size: 16px;}
        .filter .select select{font-size: 14px}
    }
    @media screen and (max-width: 1150px){
        .panel table tbody tr td.ctrlBtn span{font-size: 14px;}
        .panel table tbody tr td{font-size: 14px;}
        .page .arrow{font-size: 30px;}
        .totalMoney span{font-size: 22px;}
        .panel table tbody tr td.ctrlBtn{width: 82px;}
        .panel table th.ctrlBtn{width: 140px;}
        .panel table tbody tr td.ctrlBtn span{font-size: 12px;}
        .panel table tbody tr td.ctrlBtn span.span1{margin-bottom: 5px;}
        .totalMoney span{font-size: 20px;}
    }
    @media screen and (max-height:1040px){
        table tbody{height:530px;}
    }
    @media screen and (max-height:960px){
        table tbody{height:480px;}
    }
    @media screen and (max-height:900px){
        table tbody{height:420px;}
    }
    @media screen and (max-height:840px){
        table tbody{height:350px;}
    }
    @media screen and (max-height:780px){
        table tbody{height:250px;}
    }

    @media screen and  (max-width: 1280px) and  (max-height:1080px){
        table tbody{height:680px;}
    }
    @media screen and  (max-width: 1280px) and  (max-height:1040px){
        table tbody{height:610px;}
    }
    @media screen and  (max-width: 1280px) and  (max-height:960px){
        table tbody{height:550px;}
    }
    @media screen and  (max-width: 1280px) and  (max-height:900px){
        table tbody{height:490px;}
    }
    @media screen and  (max-width: 1280px) and  (max-height:840px){
        table tbody{height:420px;}
    }
    @media screen and  (max-width: 1280px) and  (max-height:780px){
        table tbody{height:390px;}
    }
</style>
