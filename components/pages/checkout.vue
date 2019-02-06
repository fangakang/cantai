<template>
	<div class="body_bg">
	<div class="order">
		<headbar></headbar>
		<div class="mainInner">
			<div class="menu">

					<div class="hd">
						<div class="topClip">
						</div>
						<div class="wrap pr">
							<i class="fa fa-edit editIcon" @click="InvoiceModal"></i>
							<div class="top clearfix">
								<span class="fl w45 tableNo">
									台号：{{classify+'-'+t_name}}
								</span>
								<p class="fr w45 servicePeople">服务员：<span v-if="orderdata.staffname">{{orderdata.staffname}}</span><span v-if="!orderdata.staffname">--</span></p>
							</div>

							<p>开台时间：{{opentime}} <span class="fr">客人数：{{pnum}}/{{tnum}}</span></p>

						</div>
					</div>
					<div class="bd" id="bd"  ref='sbox'>
						<div id="wrap" class="wrap">

							<div class="row" v-for="(list,index) in orderdata.dishLish" >
								<div class="notRetired"  v-if="list.num-list.offnum-list.freenum>0" >
									<div class="textDesc clearfix"  @click="toggleSubBtn($event,index)">
										<div class="fr">
											<div class="retreat" v-if="list.j_c==1&&list.paid!=1">
												<em>加</em>
											</div>
											<div class="retreat" v-if="list.paid==1">
												<em>结</em>
											</div>
											<!--<div class="name" v-if="orderdata.staffname">{{orderdata.name}}</div>-->
											<!--<div class="time">{{dishTime}}</div>-->
										</div>
										<div class="dishDesc">
											<h3 ><i v-if="list.dpackage!=''" class="fa fa-fw" @click="toggleSubItem(list,$event)"></i><span>{{list.name}}</span>&nbsp;&nbsp;<span v-if="list.spec">{{list.spec}}</span><span v-if="list.attr">{{list.attr}}</span></h3>
											<p>{{list.dmark}}</p>
										</div>
										<div class="dishMsg">
											<span>￥{{list.price}}</span>&nbsp;&nbsp;<span>x{{list.num-list.offnum-list.freenum}}</span>
										</div>
									</div>
									<div class="dishPackage" v-if="list.dpackage!=''">
										<ul>
											<li v-for="packageList in list.dpackage">
												<div class="fl">
													<p>{{packageList.name}}</p>
													<p>{{packageList.spec}}</p>
												</div>
                                            </li>
										</ul>
									</div>
									<div class="btns retireBtnGroup" v-if="list.paid==undefined">
										<div class="row clearfix" v-if="list.offnum!=list.num">
											<span  class="fr retireBtn sendFoodBtn" @click="sendAdish(index,$event)" v-if="orderdata.paid==0">赠菜</span>
											<span  class="fr retireBtn" v-if="orderdata.paid==0" @click="retireAdish(index,$event)">退菜</span>
										</div>
									</div>

								</div>
								<div class="notRetired"  v-if="list.freenum!=0" >
									<div class="textDesc clearfix"  @click="toggleSubBtn($event,index)">
										<div class="fr">
											<div class="retreat" v-if="list.freenum!=0">
												<em>赠</em>
												<em v-if="list.paid==1">结</em>
											</div>
										</div>
										<div class="dishDesc">
											<h3 ><i v-if="list.dpackage!=''" class="fa fa-fw" @click="toggleSubItem(list,$event)"></i><span>{{list.name}}</span>&nbsp;&nbsp;<span v-if="list.spec">{{list.spec}}</span><span v-if="list.attr">{{list.attr}}</span></h3>
											<p>{{list.dmark}}</p>
										</div>
										<div class="dishMsg">
											<span>￥{{list.price}}</span>&nbsp;&nbsp;<span>x{{list.freenum}}</span>
										</div>
									</div>
									<div class="dishPackage" v-if="list.dpackage!=''">
										<ul>
											<li v-for="packageList in list.dpackage">
												<div class="fl">
													<p>{{packageList.name}}</p>
													<p>{{packageList.spec}}</p>
												</div>
											</li>
										</ul>
									</div>
									<div class="btns retireBtnGroup" v-if="list.paid==undefined">
										<div class="row clearfix">
											<span  class="fr retireBtn cancelSend" @click="cancelSend(index,$event)">取消赠菜</span>
										</div>
									</div>

								</div>
								<div class="retired" v-if="list.offnum!=0">
									<div  class="textDesc clearfix" @click="toggleSubBtn($event)" >
										<div class="fr">
											<div class="retreat" v-if="list.offnum!=0">
												<em>退</em>
												<em v-if="list.paid==1">结</em>
											</div>
										</div>
										<div class="dishDesc">
											<h3><i v-if="list.dpackage!=''" class="fa fa-fw" @click="toggleSubItem(list,$event)"></i><span>{{list.name}}</span>&nbsp;&nbsp;<span v-if="list.spec">{{list.spec}}</span><span v-if="list.attr">{{list.attr}}</span></h3>
											<p>{{list.dmark}}</p>
										</div>
										<div class="dishMsg">
											<span>￥{{list.price}}</span>&nbsp;&nbsp;<span>x{{list.offnum}}</span>
										</div>
									</div>
									<div class="dishPackage" v-if="list.dpackage!=''">
										<ul>
											<li v-for="packageList in list.dpackage">
												<div class="fl">
													<p>{{packageList.name}}</p>
													<p>{{packageList.spec}}</p>
												</div>
											</li>
										</ul>
									</div>
									<div class="btns" v-if="list.paid==undefined">
										<div class="row retiredBtnGroup"  @click="unRetire(index,$event)">
											<span class="cancel">取消退菜</span>
										</div>
									</div>
								</div>
							</div>

						</div>
					</div>
					<div class="ft">
						<div class="wrap">
							<div class="dishNum clearfix">
								<span class="fl nums">已点餐品：{{totalmenu}}</span>
							</div>
							<div class="remarks">
								<div class="wrap">
									<span class="fl">整单备注：</span>
									<div class="ofh">
										<textarea v-model="orderdata.allmarknopay" readonly>
										</textarea>
									</div>

								</div>
							</div>
							<div class="total">
								<div class="wrap clearfix">
									<span class="fl">
										<em>总价:</em>￥{{totalMoney}}
									</span>
								</div>
								<div class="addOffer clearfix">
									<span class="fl sendPart">菜品优惠：￥{{minusListnopay.caiYHprice}}</span>
									<span class="fr sendPart" v-if="freeMoney>0">赠菜优惠：￥{{freeMoney}}</span>

								</div>
							</div>
						</div>
					</div>
			</div>
			<div class="leftft">
				<span class="fr"   @click="addDish">
					<em>加菜</em>
				</span>
				<span class="fl"  @click="rejectAll">
					<em>全单退菜</em>
				</span>
				<span class="fl mt5" @click="changeTab">
					<em>换台</em>
				</span>
				<!--<span class="fr mt5" @click="changeTab">-->
					<!--<em>全单下厨</em>-->
				<!--</span>-->
			</div>
			<div class="rightMain">
                <div class="memberDis">
                    <div class="disHeader" :class="member?'':'hide'" >
                        <div class="memberMsg">
                            <div class="pic">
                               <img v-bind:src="member.head_img" v-if="member.head_img!=''">
                               <img src="../../assets/avatar.png" v-if="member.head_img==''">
                            </div>
                            <div class="memberName">
                                <span>{{member.nickname}}（{{member.phone}}）</span>
                                <span>{{member.grade_name}}</span>
								<p class="cardNo">卡号：{{member.card_no}}</p>
                            </div>
                        </div>
						<div class="fr btnGroup">
							<!--<span class="backIndex " @click="memberBack">返回</span>-->
							<span class="reSearch" @click="searchMember">重新查找</span>
						</div>
                    </div>
					<div class="discountList">
						<div class="discount" :class="{'active':mlreduce||minusList.mlreduce>0,'canNot':noReduce||minusList.mlreduce==undefined}" @click="selectOffer('mlreduce')">
							<p class="title" :class="minusList.mlreduce>0?'':'noSub'">改价</p>
							<p class="subTitle" v-if="minusList.mlreduce>0">(优惠￥{{minusList.mlreduce}}元)</p>
							<img class="activeLogo" :class="mlreduce||minusList.mlreduce>0?'':'hide'" src="../../assets/select.png" alt="">
							<div class="discountMask" v-if="noReduce||minusList.mlreduce==undefined">
								<img src="../../assets/canNot.png" alt="">
							</div>
						</div>
						<!--<div class="discount" :class="caiYHprice?'active':''" @click="selectOffer('caiYHprice')" v-if="minusList.caiYHprice!=undefined&&hadPay==0">-->
						<!--<p class="title">菜品优惠</p>-->
						<!--<p class="subTitle">(优惠￥{{minusList.caiYHprice}}元)</p>-->
						<!--<img class="activeLogo" :class="caiYHprice?'':'hide'" src="../../assets/select.png" alt="">-->
						<!--</div>-->
						<div class="discount" :class="{'active':member,'canNot':noReduce||!discountData.discountMoney}" @click="memberCoupon">
							<p class="title">会员折扣</p>
							<p class="subTitle" v-if="orderdata.paid!=0">(优惠{{minusList.vipcard}}元)</p>
							<p class="subTitle" v-if="orderdata.paid==0">(优惠{{offerDatas.discountMoney}}元)</p>
							<img class="activeLogo" :class="member?'':'hide'" src="../../assets/select.png" alt="">
							<div class="discountMask" v-if="noReduce||!discountData.discountMoney">
								<img src="../../assets/canNot.png" alt="">
							</div>
						</div>
						<div class="discount active" :class="{'canNot':noReduce||!discountData.drawcount}" @click="stordDiscount">
							<p class="title">储值折扣</p>
							<p class="subTitle" v-if="orderdata.paid!=0&&minusList.drawReduce!=undefined">(优惠{{minusList.drawReduce}}元)</p>
							<p class="subTitle" v-if="orderdata.paid==0">(优惠{{offerDatas.drawcountMoney}}元)</p>
							<img class="activeLogo" src="../../assets/select.png" alt="">
							<div class="discountMask" v-if="noReduce||!discountData.drawcount">
								<img src="../../assets/canNot.png" alt="">
							</div>
						</div>
						<div class="discount" :class="{'active':is_point,'canNot':noReduce||!discountData.is_can_bonus}" @click="selectOffer('vipPoint')">
							<p class="title">积分抵扣</p>
							<p class="subTitle" v-if="orderdata.paid!=0">(优惠￥{{minusList.vipPoint}}元)</p>
							<p class="subTitle" v-if="parseFloat(member.points)>=parseFloat(discountData.pointNum)&&orderdata.paid==0">({{discountData.pointNum}}积分减{{discountData.pointMoney}}元)</p>
							<p class="subTitle" v-if="parseFloat(member.points)<parseFloat(discountData.pointNum)&&orderdata.paid==0||member.points==''">(积分不足)</p>
							<img class="activeLogo" :class="is_point?'':'hide'" src="../../assets/select.png" alt="">
							<div class="discountMask" v-if="noReduce||!discountData.is_can_bonus">
								<img src="../../assets/canNot.png" alt="">
							</div>
						</div>
						<div class="discount"  :class="{'active':discountData.reduce_cost,'canNot':noReduce||discountData.can_use_coupon==0}" @click="selectOffer('couponcard')">
							<p class="title" :class="discountData.reduce_cost?'':'noSub'">优惠券</p>
							<p class="subTitle" v-if="discountData.reduce_cost">（优惠{{discountData.reduce_cost}}元）</p>
							<img class="activeLogo" :class="discountData.reduce_cost?'':'hide'" src="../../assets/select.png" alt="">
							<div class="discountMask" v-if="noReduce||discountData.can_use_coupon==0">
								<img src="../../assets/canNot.png" alt="">
							</div>
						</div>
						<div class="discount" :class="{'active':pReduce,'canNot':noReduce||!discountData.isPayReduce}" @click="randomReduce">
							<p class="title">随机立减</p>
							<p class="subTitle" v-if="orderdata.paid!=0">(优惠￥{{minusList.pReduce}}元)</p>
							<p class="subTitle" v-if="orderdata.paid==0">(优惠￥{{discountData.payReduceMoney}}元)</p>
							<img class="activeLogo" :class="pReduce||minusList.pReduce?'':'hide'" src="../../assets/select.png" alt="">
							<div class="discountMask" v-if="noReduce||!discountData.isPayReduce">
								<img src="../../assets/canNot.png" alt="">
							</div>
						</div>
						<div class="discount payWay" @click="choosePay(index)" v-for="(val,index) in payWay" v-if="val.vcarddisplay==1"  :class="index==selectPayWay?'active':''">
							<p class="title">{{val.payName}}</p>
							<img class="activeLogo" :class="index==selectPayWay?'':'hide'" src="../../assets/select.png" alt="">
						</div>
						<div class="discount payWay" v-if="!member" :class="memberCard?'active':''" @click="searchMember">
							<p class="title">会员卡</p>
							<img class="activeLogo" :class="memberCard?'':'hide'" src="../../assets/select.png" alt="">
						</div>
					</div>
					<div class="recharge">
						<div class="costOffer">
							<div class="costMoney fl">
								<div v-if="hadPay==0">
									<span class="rechargeName">订单金额</span>
									<span class="money" v-if="orderdata.paid==0">￥{{totalMoney}}</span>
									<span class="money" v-if="orderdata.paid!=0">￥{{orderdata.totalprice}}</span>
								</div>
								<div v-if="hadPay>0">
									<span class="rechargeName">加菜订单金额</span>
									<span class="money">￥{{addTotal}}
										<!--<span class="alreadyPay">(已支付￥{{orderdata.paidmoney}})</span>-->
									</span>
								</div>
							</div>
							<div class="offerMoney fl" v-if="hadPay==0">
								<span class="rechargeName">优惠金额</span>
								<span class="money" v-if="orderdata.paid==0">￥{{yhPrice}}</span>
								<span class="money" v-if="orderdata.paid!=0">￥{{orderdata.allprivilege}}</span>
							</div>
							<!--支付后加菜-->
							<div class="offerMoney fl" v-if="hadPay>0">
								<span class="rechargeName">优惠金额</span>
								<span class="money">￥{{addYh}}</span>
							</div>
						</div>
						<div class="payReset">
							<div class="payMoney fl">
								<div v-if="hadPay==0">
									<span class="rechargeName">实收金额</span>
									<span class="money" v-if="orderdata.paid==0">￥{{shouldPay}}</span>
									<span class="money" v-if="orderdata.paid!=0">￥{{orderdata.paidmoney}}</span>
								</div>
								<div v-if="hadPay>0">
									<span class="rechargeName">还需支付</span>
									<span class="money">￥{{remainToPay}}</span>
								</div>
							</div>
							<div class="fl">
								<span class="rechargeName">不参与优惠</span>
								<span class="money">￥{{noreduceMoneynotpay.toFixed(2)}}</span>
							</div>
							<!--<div class="fl" v-if="hadPay>0">-->
								<!--<span class="rechargeName">不参与优惠</span>-->
								<!--<span class="money">￥{{firstNoreduceMoney}}</span>-->
							<!--</div>-->
							<div class="reSet fr" v-if="orderdata.paid==0">
								<span class="reSetBtn" @click="reset">重置</span>
							</div>
						</div>
					</div>
					<div class="cash" :class="!member?'notMember':''" v-if="payType=='cashToPay'">
						<div class="fl cashMoney">
							<span class="cashName">现金</span>
							<div class="inputNum">
								<span class="moneyLogo">￥</span><input autofocus step="0.01" v-model="money" v-bind:readonly="payType!='cashToPay'" v-on:input="inputFunc" onkeyup="this.value=this.value.replace(/[^0-9.]+/,'');">
							</div>

							<img @click="clearNum" class="closeBtn" src="../../assets/close.png" alt="">
						</div>
						<div class="fl balance">
							<span class="balanceName">找零</span>
							<span class="balanceMoney">￥{{balanceMoney}}</span>
						</div>
					</div>
                </div>
				<div class="keyBordContent">
					<div class="keyBord" :class="member?'':'notMember'">
						<div class="normalKey fl">
							<div @click="keyBordNormal(key)" class="key" v-for="key in normalKey">{{key}}</div>
						</div>
						<div class="specialKey fl">
							<div @click="keyBordSpecial(key)" class="key" v-for="key in specialKey">{{key}}</div>
						</div>

					</div>
					<div class="operate" :class="member?'':'notMember'">
						<!--<div class="payBill">-->
						<!--<span class="print">打印结账单</span>-->
						<!--<span class="notPrint">不打印结账单</span>-->
						<!--</div>-->
						<div class="prePrint" @click="staffPrint">预打</div>
						<div class="billPlease" @click="payMoney">
							结账
						</div>
					</div>
				</div>


			</div>
		</div>
		<fullbg v-if="bgshow"></fullbg>
		<!--改抬头-->
        <div  class="InvoiceModal modal" v-if="invoiceModal">
			<div class="modalHead">
				<div class="modalTitle">改抬头</div>
				<div class="modalSub">操作台号：{{classify+'-'+t_name}}</div>
			</div>
			<div class="modalContent">
				<div class="people">
					<span class="labName fl">就餐人数：</span>
					<div class="lab fl">
						<i class="fa fa-fw fa-minus-circle" @click="lessPeople"></i>
						<input type="text" v-model="nums" maxlength="2" class="peopleNum" onkeyup="value=value.replace(/[^\d]/g,'') ">
						<i class="fa fa-fw fa-plus-circle" @click="addPeople"></i>
					</div>
				</div>
				<div class="service hide">
					<span class="labName fl">&nbsp;服&nbsp;务&nbsp;员：</span>
					<div class="lab fl">
						<select type="text" class="waiter" v-model="orderdata.staffname">
							<option value="" style="display: none">请选择</option>
							<option v-bind:value="item.eusername" v-for="item in staffList">{{item.eusername}}</option>
						</select>
					</div>
				</div>
			</div>
			<div class="modalFooter">
				<div class="fl cancel" @click="closeModal">取消</div>
				<div class="fl makeSure" @click="invoiceSure">确定</div>
			</div>
		</div>
		<!--赠菜-->
		<div class="modal sendModal modelNews" v-if="sendModal">
			<div class="modalHead">
				<div class="modalTitle" v-if="sendType==1">赠菜</div>
				<div class="modalTitle" v-if="sendType==2">取消赠菜</div>
			</div>
			<div class="modalContent">
				<div class="lab">
					<span class="foodName fl">{{sendName}}</span>
					<div class="fr">
						<span class="amount">数量：</span>
						<div class="fr">
							<i class="fa fa-fw fa-minus-circle" @click="dishReduce(sendIndex,1)"></i>
							<input class="foodAmount" v-model="sendNum" type="text" onkeyup="value=value.replace(/[^0-9]/g,'')">
							<i class="fa fa-fw fa-plus-circle" @click="dishAdd(sendIndex,1)"></i>
						</div>
					</div>
				</div>
				<!--<div class="reasonCon">-->
					<!--<span v-if="sendType==1">赠菜原因：</span>-->
					<!--<span v-if="sendType==2">取消原因：</span>-->
					<!--<input type="text" v-model="sendRemark" placeholder="请输入原因" class="reasonInput">-->
				<!--</div>-->
			</div>
			<div class="modalFooter">
				<div class="fl cancel" @click="closeModal">取消</div>
				<!--cancel-->
				<div class="fr makeSure"  v-if="sendType==1" @click="sendSure(sendIndex)">确定</div>
				<div class="fr makeSure"  v-if="sendType==2" @click="cancelSendSure(sendIndex)">确定</div>
				<!--makeSure-->
			</div>
		</div>
		<!--退菜-->
		<div class="modal rejectModal" v-if="rejectModal">
			<div class="modalHead">
				<div class="modalTitle">退菜</div>
			</div>
			<div class="modalContent">
				<div class="lab">
					<span class="foodName fl">{{retireName}}</span>
					<div class="fr">
						<span class="amount">数量：</span>
						<div class="fr">
							<i class="fa fa-fw fa-minus-circle" @click="cnumReduce(retireIndex)"></i>
							<input class="foodAmount" v-model="retireNum" v-on:input="retireInput(retireIndex)" type="text" onkeyup="value=value.replace(/[^0-9]/g,'')">
							<i class="fa fa-fw fa-plus-circle" @click="cnumAdd(retireIndex)"></i>
						</div>
					</div>
				</div>
				<div v-if="totalmenu==1||totalmenu==retireNum" class="remainOne">*将最后一道菜退掉后，则该餐台将变为空台状态</div>
				<!--<div class="otherReason" @click="showOtherReason">其他原因</div>-->
				<div class="reasonCon">
					<span>退菜原因：</span>
					<input type="text" v-model="retireRemark" placeholder="请输入退菜原因" class="reasonInput">
				</div>
			</div>
			<div class="modalFooter">
				<div class="fl cancel" @click="closeModal">取消</div>
				<div class="fl makeSure" @click="retireSure(retireIndex)">确定</div>
			</div>
		</div>
		<!--取消退菜-->
		<div class="modal rejectModal" v-if="cancleRejectModal">
			<div class="modalHead">
				<div class="modalTitle">取消退菜</div>
			</div>
			<div class="modalContent">
				<div class="lab">
					<span class="foodName fl">{{retireName}}</span>
					<div class="fr">
						<span class="amount">数量：</span>
						<div class="fr">
							<i class="fa fa-fw fa-minus-circle" @click="cancelReduce(cancleRetireIndex)"></i>
							<input class="foodAmount"  type="text" v-on:input="cancleRetireInput(cancleRetireIndex)" v-model="cancelRetireNum" onkeyup="value=value.replace(/[^\d]/g,'') ">
							<i class="fa fa-fw fa-plus-circle" @click="cancelAdd(cancleRetireIndex)"></i>
						</div>

					</div>

				</div>
				<!--<div class="otherReason" @click="showOtherReason">其他原因</div>-->
				<div class="reasonCon">
					<span>取消退菜原因：</span>
					<input type="text" v-model="cancelRetireRemark" placeholder="请输入取消退菜原因" class="reasonInput">
				</div>
			</div>
			<div class="modalFooter">
				<div class="fl cancel" @click="closeModal">取消</div>
				<div class="fl makeSure" @click="unRetireAdish(retireIndex)">确定</div>
			</div>
		</div>
		<!--全部退-->
		<div class="modal rejectAll" v-if="rejectAllModal">
			<div class="modalHead">
				<div class="modalTitle">全单退菜</div>
			</div>
			<div class="modalContent">
				<p v-if="!haveSend">是否确定全部退菜，<br>确定后，此餐台将变为空台状态</p>
				<div class="reasonCon">
					<span>退菜原因：</span>
					<input type="text" v-model="retireRemark" placeholder="请输入退菜原因" class="reasonInput">
				</div>
			</div>
			<div class="modalFooter">
				<div class="fl cancel" @click="closeModal">取消</div>
				<div class="fl makeSure" @click="retireAllDish">确定</div>
			</div>
		</div>
		<!--查找会员-->
		<div class="modal searchMember" v-if="searchMemberModal">
			<div class="modalHead">
				<div class="modalTitle">查找会员</div>
			</div>
			<div class="modalContent">
				<p class="searchNotice" style="padding:15px 0 10px 0;">请输入手机号、会员卡卡号或是扫码录入会员</p>
				<div class="memberInput">
					<input type="text" v-model="memberNumber" id="memberId" placeholder="请输入手机号、会员卡卡号或是扫码录入会员" @keyup.enter="searchenter">
					<img class="clearBtn" @click="deleteNum(5)" src="../../assets/clear.png" alt="">
				</div>
				<p class="searchNo" v-if="searchErr">没有会员信息，请重新查找</p>
			</div>
			<div class="modalFooter">
				<div class="fl cancel" @click="closeMemberModal">取消</div>
				<div class="fl makeSure" @click="vipMemberLogin">确定</div>
			</div>
		</div>
		<!--改价-->
		<div class="modal wipeZero" v-if="wipeZeroModal">
			<div class="modalHead">
				<div class="modalTitle">改价</div>
			</div>
			<div class="modalContent">
				<div class="shouldReceipt" v-if="hadPay==0">
					应收金额：￥{{shouldPay}}
				</div>
				<div class="shouldReceipt" v-if="hadPay>0">
					应收金额：￥{{remainToPay}}
				</div>
				<div>
					<span>优惠金额</span>
					<div class="inputOut">
						<input type="number" v-model="mlInput" v-on:input="wipeZeroInput" class="moneyInput" id="mlfocus"  placeholder="请输入优惠金额" @keyup.enter="wipeZeroEnter">
						<img class="clearBtn" @click="deleteNum(1)" src="../../assets/clear.png" alt="">
					</div>
				</div>
				<div class="mlNotice" v-if="payType=='sweepCodeToPay'">使用微信或是支付宝支付时，最低支付为0.01元</div>
				<p class="mlNotice" :class="minusList.mlreduce>shouldPay?'':'hide'">优惠金额不能大于消费金额</p>
			</div>
			<div class="modalFooter">
				<div class="fl cancel" @click="closeModal">取消</div>
				<div class="fl makeSure" @click="wipeZeroSure">确定</div>
			</div>
		</div>
		<!--优惠券验证-->
		<div class="modal couponCheck" v-if="couponCheckModal">
			<div class="modalHead">
				<div class="modalTitle">优惠券验证</div>
			</div>
			<div class="modalContent">
				<div class="contentTitle">
					请输入核销码或是直接扫码核销优惠券
				</div>
				<div class="couponNo">
					<input type="text" placeholder="请输入核销码或扫码核销"  v-model="couponCode" onkeyup="value=value.replace(/[^0-9]/g,'')" id="coupon1" @keyup.enter="couponCheckEnter">
					<img src="../../assets/clear.png" @click="deleteNum(4)" class="clearBtn" alt="">
				</div>
			</div>
			<div class="modalFooter">
				<div class="fl cancel" @click="couponCancelSearch">取消</div>
				<div class="fl makeSure" @click="checkCouponCode">确定</div>
			</div>
		</div>
		<!--微信支付宝扫码支付-->
		<div class="modal QRcode"  v-if="QRcodeModal">
			<div class="modalHead">
				<div class="modalTitle">微信/支付宝扫码支付</div>
			</div>
			<div class="modalContent">
				<div class="contentTitle">需支付<span class="titleMoney">{{shouldPay}}元</span>，请扫用户的微信或支付宝付款码</div>
				<div class="codeNum">
					<input onkeyup="value=value.replace(/[^0-9]/g,'')" type="text" id="onlinePayNo" v-model="authcode" ref="authcode" placeholder="请扫描支付码或手动输入识别码" @keyup.enter="QRcodeEnter">
					<p class="codeErr" v-if="errCode">抱歉，付款码不正确</p>
					<img src="../../assets/clear.png" @click="deleteNum(3)" class="clearBtn" alt="">
				</div>
			</div>
			<div class="modalFooter">
				<div class="fl cancel" @click="closeModal">取消</div>
				<div class="fl makeSure" @click="payOrder(1)">确定</div>
			</div>
		</div>
		<!--礼品卡支付-->
		<div class="modal giftCard" v-if="giftCardModal">
			<div class="modalHead">
				<div class="modalTitle">
					礼品卡支付
				</div>
			</div>
			<div class="modalContent">
				<div class="contentTitle">需支付<span class="titleMoney">{{shouldPay}}元</span>，支持实体卡刷卡、线上页面扫码、礼品卡卡号核销</div>
				<div class="giftNum">
					<input onkeyup="value=value.replace(/[^0-9]/g,'')" type="text" id="giftCard" v-model="presentno" placeholder="支持实体卡刷卡、线上页面扫码、礼品卡卡号核销" @keyup.enter="giftCardEnter">
					<img src="../../assets/clear.png" @click="deleteNum(2)" class="clearBtn" alt="">
					<p class="giftNotice hide">卡内金额不足，请使用其他方式支付</p>
					<p class="giftNotice hide">礼品卡卡号输入不正确，请重新核对</p>
					<p class="giftNotice hide">核销码输入不正确，请重新核对</p>
				</div>
			</div>
			<div class="modalFooter">
				<div class="fl cancel" @click="closeModal">取消</div>
				<div class="fl makeSure" @click="payOrder(3)">确定</div>
			</div>
		</div>
		<!--选择优惠券-->
		<div class="modal selectCoupon" v-if="selectCouponModal">
			<div class="modalHead">
				<div class="modalTitle">选择优惠券</div>
			</div>
			<div class="modalContent">
				<div class="couponInput">
					<input placeholder="请输入核销码或扫码优惠券，交易完成后才核销优惠券" id="coupon2" v-model="couponCode" type="number" @keyup.enter="selectCouponEnter">
					<img src="../../assets/clear.png" class="clearBtn" @click="deleteNum(4)" alt="">
				</div>
				<div class="couponList">
					<div class="couponType" :class="couponIndex===index?'couponActive':''" @click="selectCoupon(index)" v-for="(item,index) in couponList">（{{item.title}}）</div>
				</div>
			</div>
			<div class="modalFooter">
				<div class="fl cancel" @click="CouponCncel">取消</div>
				<div class="fl makeSure" @click="selectCouponSure">确定</div>
			</div>
		</div>
		<!--换台-->
		<div class="changeTableModal" v-if="changeTableModal">
			<div class="changeTable">
				<div class="modalHead">
					<div class="modalTitle">
                        {{classify+'-'+t_name}}换台至
						<!--<span class="tabId">操作台号：{{tid}}</span>-->
					</div>
				</div>
				<div class="modalContent clearfix">
					<div class="modalLeft fl">
						<ul class="roomList">
							<li :class="navIndex==index?'active':''" v-for="(item,index) in navList" @click="selectNav(index)">{{item}}</li>

						</ul>
					</div>
					<div class="modalRight fl">
						<div class="tableContent clearfix" id="tableContent">
							<div v-for="(item,index) in tlist" class="tableClick fl" @click="selectTable(index)">
								<div class="wrap">
									<div class="dataNum clearfix">
										<em class="fl">{{item.name}}</em>
										<em class="fr">{{item.pnum}}/{{item.num}}</em>
									</div>
									<p class="dataNum">{{item.isbox}}</p>
									<i class="icon" :class="index===tableIndex?'active':''"></i>
								</div>
							</div>
							<div class="noData" v-if="noTable">
								<img src="../../assets/noTable.png" alt="">
								<p>暂无对应餐台</p>
							</div>
						</div>
						<div class="changeTableFooter clearfix">
							<div class="fl pageSelect">
								<span @click="prevPage"><i class="fa fa-fw fa-chevron-up" :class="preCanClick?'':'opacity'"></i></span>
								<span >{{pg}}</span>
								<span @click="nextPage"><i class="fa fa-fw fa-chevron-down" :class="nextCanClick?'':'opacity'"></i></span>
							</div>
							<div class="fr">
								<div class="cancle" @click="cancleChange">取消</div>
								<div class="makeSure" @click="changeSure">确定</div>
							</div>
						</div>

					</div>
				</div>
			</div>
		</div>

	</div>
	</div>
</template>
<script>
	import Vue from 'vue'
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
          roleModule:{},
          changeTableModal:false,
          bgshow:false,
          fullHeight: document.documentElement.clientHeight,
          allmarknopay:'',
          totalmenu:0,
          couponTitle:'',
          memberCard:false,
          minusList:[],
          minusListnopay:[],
          mlInput:'',
          errCode:false,
          balanceMoney:'0',
          otherReason:false,
          selectPayWay:0,
		  payType:'cashToPay',
		  payChinese:'现金支付',
		  is_point:1,
          nums:0,
          pnum:0,
		  tnum:0,
		  t_name:'',
		  classify:'',
		  opentime:'',
		  dishTime:'',
		  orderdata:{},
          totalMoney:0,
          yhPrice:0,
		  cid:0,
          drawReduce: false,	//储值折扣   卡券平台统一优惠  此字段可能会没有
          vipPoint: false,	//积分抵扣   卡券平台统一优惠  此字段可能会没有
          vipcard:false,		//会员折扣   卡券平台统一优惠  此字段可能会没有
          couponcard:false,	//优惠券抵扣   卡券平台统一优惠  此字段可能会没有
          pReduce:true,	//随机立减   卡券平台统一优惠  此字段可能会没有
          mlreduce: false,	//改价优惠
          caiYHprice: true,	//菜品优惠
          memberNumber:'',
		  invoiceModal:false,
		  sendModal:false,
		  rejectModal:false,
          cancleRejectModal:false,
		  rejectAllModal:false,
		  searchMemberModal:false,
		  wipeZeroModal:false,
		  couponCheckModal:false,
		  QRcodeModal:false,
		  giftCardModal:false,
		  selectCouponModal:false,
		  msg: 'Welcome to Your Vue.js App',
		  member:false,
		  payWay:[],
		  normalKey:['7','8','9','4','5','6','1','2','3','0','00','.'],
		  specialKey:[10,20,50,100],
		  specialInput:false,
		  keyVal:'',
		  shouldPay:0,
          mlDiscount:'',
		  discountMoney:'',
		  people:0,
		  waiter:'Iron man',
		  waiterSelect:'Iron man',
          authcode:'',
          presentno:'',
		  retireIndex:0,
		  sendIndex:0,
          sendType:0,//1:赠菜、2:取消赠菜
          sendRemark:'',//赠菜理由
		  sendNum:1,//赠送数量
		  sendName:'',//赠菜名称
          retireName:'',//退菜名称
          retireRemark:'',//退菜理由
          retireNum:1,//退菜数量
          cancleRetireIndex:0,
          cancelRetireRemark:'',//取消退菜理由
          cancelRetireNum:1,//取消退菜数量
          couponList:[],
		  offerDatas:{},
          searchErr:false,
		  discountData:[],
		  couponIndex:'',
          couponCode:'',
          couponId:'',
		  staffList:[],//服务员列表
		  noReduce:false,
		  mlDpreduce:1,
          noreduceMoney:0,
          classifyChange:'',
          search:'',
		  pg:1,
          tlist:[],
		  navList:['全部'],
          navIndex:0,
		  preCanClick:false,
		  nextCanClick:false,
		  tableIndex:'',
		  hadPay:0,//是否已经支付过且有加菜的
          addTotal:0,//支付过加菜总额
		  addYh:0,//支付过加菜优惠
		  addBalance:0,//支付过加菜找零
          freeMoney:0,//赠菜优惠
          firstNoreduceMoney:0,
          noreduceMoneynotpay:0,
          haveSend:false,
          noTable:false,
          balancePayNow:false,
		  prevPoint:0,
      }
    },

    beforecreate:function(){

    },
    created:function(argument) {
        var that=this;
        store.commit('searchVisi',0)
		var query = that.$route.query;
        that.cid=publicFun.fetch('cid');
        that.tid=publicFun.fetch('tid');
        that.oid=query.oid;
        console.log(query);

    },
    mounted:function(){
		var that=this;
        clearInterval(publicFun.setInterval);
        that.getTableDetail();
        that.getStaffList();
        that.roleModule=publicFun.fetch('roleModule');
    },
//      watch: {
//          fullHeight (val) {
//              if(!this.timer) {
//                  this.fullHeight = val
//                  this.timer = true
//                  let that = this
//                  setTimeout(function (){
//                      that.timer = false
//                  },400)
//              }
//          }
//      },
    methods:{
        randomReduce(){
            var that=this;
            if(that.noReduce||!that.discountData.isPayReduce){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'使用'+that.payChinese+'不享有随机立减优惠',
                    dur:3000
                })
            }
		},
        memberCoupon(){
            var that=this;
            if(that.noReduce||!that.discountData.discountMoney){
				publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'使用'+that.payChinese+'不享有会员折扣优惠',
                    dur:3000
				})
			}
		},
        stordDiscount(){
            var that=this;
            if(that.noReduce||!that.discountData.drawcount){
                if(that.discountData.draw==2){
                    publicFun.showToast({
                        isShow:true,
                        type:2,
                        mask:false,
                        txt:'未达到储值折扣使用条件',
                        dur:3000
                    })
				}else{
                    publicFun.showToast({
                        isShow:true,
                        type:2,
                        mask:false,
                        txt:'使用'+that.payChinese+'不享有储值折扣优惠',
                        dur:3000
                    })
				}
            }
		},
        setHeight(){//键盘高度自适应
			var that=this;
            var windowHeight= document.body.clientHeight;
            var titleHei=document.querySelectorAll(".title")[0].clientHeight;
            var memberDisHei=document.querySelectorAll(".memberDis")[0].clientHeight;
            var keyBordContent=document.querySelector('.keyBordContent');
            keyBordContent.style.height=windowHeight-titleHei-memberDisHei+'px';
            var key=document.querySelectorAll(".key");
            var btnHeight=(windowHeight-titleHei-memberDisHei)/2-13;
            for(var i=0;i<key.length;i++){
                if(windowHeight<=662&&that.member){
                    var keyHeight=(windowHeight-titleHei-memberDisHei)/4-7;
                    key[i].style.cssText ='margin-bottom:5px;font-size:18px;line-height:'+keyHeight+'px';
				}else {
                    var keyHeight=(windowHeight-titleHei-memberDisHei)/4-11;
                    key[i].style.cssText ='font-size:30px;line-height:'+keyHeight+'px';
				}
			}
			var prePrint=document.querySelector('.prePrint');
            prePrint.style.cssText ='line-height:'+btnHeight+'px';
            var billPlease=document.querySelector('.billPlease');
            billPlease.style.cssText ='line-height:'+btnHeight+'px';
		},
		searchenter(){
			this.vipMemberLogin()
		},
		couponCheckEnter(){
			this.checkCouponCode()
		},
		QRcodeEnter(){
			this.payOrder(1)
		},
		wipeZeroEnter(){
			this.wipeZeroSure()
		},
		giftCardEnter(){
			this.payOrder(3)
		},
		selectCouponEnter(){
			this.selectCouponSure()
		},
        toggleSubBtn(e){
			var par=e.currentTarget.parentNode;
			var brother =par.parentNode.parentNode.children
            if(par.hasClass('btnShow')){
				for(var i= 0; i<=brother.length; i++ ){
					if(brother[i]){
					    for (var j=0;j<brother[i].children.length;j++){
                            brother[i].children[j].classList.remove("btnShow");
                            brother[i].children[j].classList.remove("on")
						}
					}
				}
            }else{
				for(var i= 0; i<=brother.length; i++ ){
					if(brother[i]){
                        for (var j=0;j<brother[i].children.length;j++){
                            brother[i].children[j].classList.remove("btnShow");
                            brother[i].children[j].classList.remove("on")
                        }
					}
				}
                par.classList.add("btnShow")
			};
			// 设置滚动条的位置
			var _height = this.$refs.sbox.offsetHeight;
			var _top = e.currentTarget.getBoundingClientRect().top
			if(_top-_height>120){
				this.$refs.sbox.scrollTop = this.$refs.sbox.scrollTop+(_top-280-_height/2);
			}
		},
        toggleSubItem(item,e){
            var thisBoj=e.target
            var par=e.target.parentNode.parentNode.parentNode.parentNode;
            var brother =par.parentNode.parentNode.children
            if(par.hasClass('on')){
                par.classList.remove("on")
            }else{
                for(var i= 0; i<=brother.length; i++ ){
                    if(brother[i]){
                        brother[i].children[0].classList.remove("btnShow");
                        brother[i].children[0].classList.remove("on")
                    }
                }
                par.classList.add("on")
            }
            // 设置滚动条的位置
            var _height = this.$refs.sbox.offsetHeight;
            var _top = e.currentTarget.getBoundingClientRect().top
            if(_top-_height>120){
                this.$refs.sbox.scrollTop = this.$refs.sbox.scrollTop+(_top-150-_height/2);
            }
            e.stopPropagation()
        },
        changeTab:function(){
            var that=this;
            if(that.roleModule.changeTable!=1){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'没有换台权限',
                    dur:3000
                });
                return;
			}
            that.getTableList();
            that.getTableClassify()
		},
        selectTable:function(index){
            var that=this;
            that.tableIndex=index;
		},
        selectNav:function (index) {
            var tableContent=document.getElementById('tableContent');
            tableContent.scrollTop = 0;
			var that=this;
			if(index==0){
			    that.classifyChange='';
			}else{
                that.classifyChange=that.navList[index]
			}
			that.pg=1;
			that.getTableList();
			that.navIndex=index;
        },
        prevPage:function(){
            var that=this;
            if(that.pg==1){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'已到首页',
                    dur:1500
                })
                return
			}else{
                that.pg--;
                that.getTableList();
			}
		},
        nextPage:function () {
			var that=this;
			if(!that.nextCanClick){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'已是最后一页',
                    dur:1500
                })
                return
			}else{
			    that.pg++;
                that.getTableList();
                that.preCanClick=true;
			}
        },
        getTableClassify(){
            var that=this;
            var url="index.php?g=Home&m=repastPcApi&a=getTableClassify";
            var params={
                cid:that.cid,
            }

            http.get(url,params,'getTableClassifyCallBack',that);
        },
        getTableClassifyCallBack:function(res){
          console.log(res)
			var that=this;
            that.navList=that.navList.concat(res.datas);
		},
        getTableList:function(){

            var that=this;
            var url="index.php?g=Home&m=repastPcApi&a=tableList";
            var params={
                cid:that.cid,
                tstatus:1,
                classify:that.classifyChange,
                search:that.search,
                pg:that.pg,
            }
            http.get(url,params,'getTableListCallBack',that);
        },
        getTableListCallBack:function (res) {
			console.log(res)

			var that=this;
            if(res.datas.tlist==''&&that.classifyChange==''){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'所有餐台均在使用中，无法换台',
                    dur:1500
                });
                return;
            }
            that.changeTableModal=true;
            that.bgshow=true;
            if(res.datas.tlist==''&&that.pg==1){
                that.noTable=true;
			}else{
                that.noTable=false;
			}
			if(res.datas.tlist.length<30){
			    that.nextCanClick=false;
			}else{
                that.nextCanClick=true;
            }
            if(that.pg==1){
                that.preCanClick=false;
            }else{
                that.preCanClick=true;
            }
			that.tlist=res.datas.tlist;
            that.tableIndex='';
        },
        changeSure:function () {
			var that=this;
			console.log(that.tableIndex);
			if(that.tableIndex===''){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'请先选择目标台号',
                    dur:1500
                });
                return;
			}
			console.log(that.tid);
            var url="index.php?g=Home&m=repastPcApi&a=change1Table";
            var params={
                cid:that.cid,
                tid:that.tid,	//餐桌id
                oid: that.orderdata.mainoid,
                totid:that.tlist[that.tableIndex].id,
            }
            http.get(url,params,'changeTableCallBack',that);
        },
        changeTableCallBack:function(res){
            console.log(res)
			var that=this;
            if(res.error==0){
                publicFun.save('tid',that.tlist[that.tableIndex].id);
                that.navList=['全部'];
                that.changeTableModal=false;
                that.bgshow=false;
                that.tid=res.newtid;
                that.getTableDetail();
			}
		},
		cancleChange(){
            var that=this;
            that.changeTableModal=false;
            that.bgshow=false;

            that. pg=1;
            that.tlist=[];
            that.navList=['全部'];
            that.navIndex=0;
			that.preCanClick=false;
            that.nextCanClick=false;
			that.tableIndex=''
		},
        //获取餐台详情
        getTableDetail:function(){
            var that=this;
            var url="index.php?g=Home&m=repastPcApi&a=getTableDetail";
            var params={
                cid:that.cid,
                tid:that.tid,	//餐桌id
                oid:that.oid,
            };
            http.get(url,params,'getTableDetailCallBack',that);
        },
        getTableDetailCallBack:function(res){
            var that=this;
            if(res.datas.orderdata.appmember!=null&&that.balancePayNow&&that.payType=='balanceToPay'){//会员余额支付余额不够重新调接口支付
                that.member=res.datas.orderdata.appmember;
                that.payOrder(that.selectPayWay);
                return;
			}
            that.balancePayNow=false;
            if(res.datas.orderdata.appmember!=null){
                that.member=res.datas.orderdata.appmember;
                that.setHeight();
//                if(that.member.points==''||that.member.points==0){
//                    that.is_point=0;
//				}
			}else{
                that.member='';
                that.setHeight();
			}
			var jList=[],//加菜列表
             otherList=[];//其他列表
            for(let i=0;i<res.datas.orderdata.dishLish.length;i++){
                if(res.datas.orderdata.dishLish[i].j_c&&res.datas.orderdata.dishLish[i].paid!=1){
                    jList.push(res.datas.orderdata.dishLish[i]);
				}else{
                    otherList.push(res.datas.orderdata.dishLish[i]);
				}
			}
           var totalList=[...jList,...otherList];
            res.datas.orderdata.dishLish=totalList;
            console.log(res.datas.orderdata.dishLish)
            that.pnum=res.datas.pnum;
            that.nums=res.datas.pnum;
            that.tnum=res.datas.t_num;
            that.t_name=res.datas.t_name;
            that.classify=res.datas.classify;
            that.opentime=that.timeFormat(parseInt(res.datas.opentime));
            that.minusList=res.datas.orderdata.minusList;
            that.minusListnopay=res.datas.orderdata.minusListnopay;
            if(that.minusList.vipPoint>0){
                that.vipPoint=true;
			}
			if(that.minusList.couponcard>0){
                that.couponTitle='优惠'+that.minusList.couponcard+'元'
			}
            that.dishTime=that.dishTimeFormat(parseInt(res.datas.orderdata.time));
            that.orderdata=res.datas.orderdata;
            if(that.orderdata.allmarknopay==''){
                that.allmarknopay=''
			}else{
                that.allmarknopay=that.orderdata.allmarknopay.join('，')
			}

            var num=0,
                offnum=0,
				freeMoney=0,
                totalMoney=0,
				addTotal=0,
				addYh=0;
            for(var i=0;i<res.datas.orderdata.dishLish.length;i++){
                if(res.datas.orderdata.dishLish[i].paid!=1){
                    totalMoney+=parseFloat(res.datas.orderdata.dishLish[i].price)*(res.datas.orderdata.dishLish[i].num-res.datas.orderdata.dishLish[i].offnum);
				}
				if(res.datas.orderdata.dishLish[i].paid==undefined){
                    num+=res.datas.orderdata.dishLish[i].num;
                    offnum+=res.datas.orderdata.dishLish[i].offnum;
				}

                if(res.datas.orderdata.dishLish[i].paid==1){
                    that.hadPay++
				}
                if(res.datas.orderdata.dishLish[i].paid==undefined){
                    addTotal+=parseFloat(res.datas.orderdata.dishLish[i].price)*(res.datas.orderdata.dishLish[i].num-res.datas.orderdata.dishLish[i].offnum).toFixed(2);

                }
            }
            that.freeMoney=res.datas.orderdata.minusListnopay.freePrice;
            that.totalmenu=num-offnum;
			that.totalMoney=totalMoney.toFixed(2);
            that.addTotal=addTotal.toFixed(2)
            var yhPrice=0;
            //非会员优惠金额计算
            for(var key in that.orderdata.minusListnopay){
                yhPrice+=parseFloat(that.orderdata.minusListnopay[key]);
                addYh+=parseFloat(that.orderdata.minusListnopay[key]);
			}
            console.log(yhPrice)
            that.yhPrice=parseFloat(yhPrice);
            that.addYh=addYh.toFixed(2);
            that.shouldPay=parseFloat(that.totalMoney-that.yhPrice).toFixed(2);
            that.remainToPay=(that.addTotal-that.addYh).toFixed(2)<0?0:(that.addTotal-that.addYh).toFixed(2);
            that.$forceUpdate();
            that.$set(that,'addYh',(that.addTotal-that.remainToPay).toFixed(2));
            if(that.selectPayWay==0){
                that.payType='cashToPay';
			}
			that.marketingDiscount();

            that.firstNoreduceMoney=res.datas.noreduceMoney;
            that.noreduceMoneynotpay=res.datas.noreduceMoneynotpay;
            that.getPayType();
        },
        //获取登录信息接口
        getStaffList:function () {
            var that=this;
            var url="index.php?g=Home&m=repastPcApi&a=getStaffList";
            var params={
                cid:that.cid,
            };
            http.get(url,params,'getStaffListCallBack',that);
        },
        getStaffListCallBack:function (res) {
            var that=this;
            that.staffList=res.datas;
        },
        //获取卡券平台的支付方式接口
        getPayType:function(){
            var that=this;
            var url="index.php?g=Home&m=repastPcApi&a=getPayType";
            var params={
                cid:that.cid,
            };
            http.get(url,params,'getPayTypeCallBack',that);

        },
        getPayTypeCallBack:function(res){
            var that=this;
            that.setHeight();
            that.payWay=res.datas;
            if(that.orderdata.paid!=0){
                for(var key in that.payWay){
                    if(that.payWay[key].type.indexOf(that.orderdata.paytype)!=-1){
                        that.selectPayWay=key;
                        that.payType==that.payWay[key].type
					}
				}
			}
            if(that.member){
				for(var key in that.payWay){
                    if(that.payWay[key].type=="balanceToPay"){
                        that.payWay[key].vcarddisplay=1
					}
				}
			}
        },
        //其他原因
        showOtherReason:function(){
            if(this.otherReason){
                this.otherReason=false;
                this.retireRemark='';
			}else{
                this.otherReason=true;
			}
		},
//		选择支付方式
        choosePay:function (index) {
            if(this.orderdata.paid!=0){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'订单已支付过,无法更改',
                    dur:1500
                });
                return;
            }
            if(this.hadPay>0&&this.remainToPay==0&&this.payWay[index].type!='cashToPay'){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'支付金额为0时，只能选择现金支付',
                    dur:3000
                });
                return;
			};
            if(this.hadPay==0&&this.shouldPay==0&&this.payWay[index].type!='cashToPay'){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'支付金额为0时，只能选择现金支付',
                    dur:3000
                });
                return;
            }
			this.selectPayWay=index;
			this.payType=this.payWay[index].type;
			this.payChinese=this.payWay[index].payName;
			this.memberCard=false;
            this.mlreduce=false;
            this.minusList.mlreduce=0;
//            this.is_point=0;
//            this.vipPoint=false;
            this.couponId='';
            this.couponIndex='';
			if(this.payWay[index].type=='balanceToPay'){
                this.balancePayNow=true;
			}else{
                this.balancePayNow=false;
			}
            console.log(this.payWay[index].is_point);
            this.setHeight();
			this.marketingDiscount();
        },
        //计算统一优惠接口
        marketingDiscount:function(){
            var that=this;
            var params= {
                cid: that.cid,
                tid: that.tid,	//餐桌id
                oid: that.orderdata.id,
                couponId:that.couponId,
                pprice:that.shouldPay,
                paytype:that.payType,
                isPoint:that.is_point
            }
            var url="index.php?g=Home&m=repastPcApi&a=marketingDiscount";
            http.get(url,params,'marketingDiscountCallBack',that);
        },
        marketingDiscountCallBack:function(res){
            var that=this;
            console.log(res)
            if(res.error==0){
                //that.vipPoint=false;//初始化积分抵扣
				if(res.msg=='没有优惠'){
				    that.noReduce=true;
				}else{
                    that.noReduce=false;
				}
               // that.$forceUpdate();
                that.$set(that,'discountData',res.datas);
//                that.discountData=res.datas;
				that.noreduceMoney=res.noreduceMoney;
				if(res.datas.use_bonus){
				    that.is_point=1;
                }else{
                    that.is_point=0;
                }
                if(res.couponList){
                    that.couponList=res.couponList;
				}else{
                    that.couponList=[];
				}
				if(res.preduce!=undefined){
                    that.mlDpreduce=res.preduce
				}
                that.offerDatas=res.datas;
                if(res.datas.pay_money){//当应付金额存在时
                    that.shouldPay=parseFloat(res.datas.pay_money).toFixed(2);
                    var remainToPay=parseFloat(res.datas.pay_money).toFixed(2);
                    that.$forceUpdate();
                    that.$set(that,'remainToPay',remainToPay)
                    that.$set(that,'addYh',(that.addTotal-that.remainToPay).toFixed(2));
				}else{
                    that.shouldPay=parseFloat(res.noreduceMoney).toFixed(2)
				};
                that.yhPrice=(that.totalMoney-that.shouldPay).toFixed(2);
                that.setHeight();
                if(that.orderdata.paid==0){
                    this.mlreduce=false;
                    this.minusList.mlreduce=0;
				};
                if(that.hadPay==0&&that.shouldPay==0||that.hadPay>0&&that.remainToPay==0){
                    that.selectPayWay=0;
                    that.payType='cashToPay';
                    that.payChinese='现金支付';
				}
            }
        },
        //重置操作
        reset:function(){
            this.keyVal='';
            this.drawReduce=false;
            this.vipPoint=false;
            this.vipcard=false;
            this.couponcard=false;
           // this.pReduce=false;
            this.mlreduce=false;
            this.selectPayWay=0;
            this.minusList.mlreduce=0;
			this. payType='cashToPay';
			this.couponId='';
			this.specialInput=false;
			this.balanceMoney=0;
			this.marketingDiscount();
        },
        searchMember:function () {
			var that=this;
//			that.selectPayWay='';
            if(that.orderdata.paid!=0){
                return;
            }
			that.bgshow=true;
			that.searchMemberModal=true;
			that.prevPoint=that.is_point;
            that.is_point=1;
            setTimeout("document.getElementById(\"memberId\").focus()",50);
        },
        //查询获取会员信息
        vipMemberLogin:function(){
            var that=this;
            if(that.memberNumber==''){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'请输入手机号或会员卡卡号',
                    dur:500
                })
			}else{
                var params={
                    cid:that.cid,
                    tid:that.tid,	//餐桌id
                    oid:that.orderdata.id,
                    memberNumber:that.memberNumber //入手机号、会员卡卡号等
                };
                var url="index.php?g=Home&m=repastPcApi&a=vipMemberLogin";
                http.get(url,params,'vipMemberLoginCallBack',that);
			}
		},
        vipMemberLoginCallBack:function(res){
            var that=this;
            if(res.error==1&&res.paid!=0){
                that.bgshow=false;
                that.searchMemberModal=false;
				return;
			}
			if(res.error==0){
                that.memberCard=true;
			    that.bgshow=false;
			    that.searchMemberModal=false;
                that.member=res.datas;
                that.vipcard=true;
                that.drawReduce=true;
                that.selectPayWay=0;
                that.payType='cashToPay';
//				that. is_point=0;
                that.couponCode='';
                that.couponTitle='';
                that.memberNumber='';
                that.getTableDetail();
                that.setHeight();
			}else{
			    that.searchErr=true;
			}
		},
        memberBack:function(){
			var that=this;
            that.member=false;
            that.vipcard=false;
            that.drawReduce=false;
            that.memberCard=false;
            that.selectPayWay=0;
            that. is_point=0;
            that.payType='cashToPay';
            that.marketingDiscount();
            that.getPayType();
		},
		//结账
        payMoney:function(){
            var that=this;
            if(that.roleModule.orderCashier!=1){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'没有收银权限',
                    dur:3000
				});
                return;
			}
            var num=0;
            var offnum=0;
            for(var i=0;i<that.orderdata.dishLish.length;i++){
				num+=parseFloat(that.orderdata.dishLish[i].num);
				offnum+=parseFloat(that.orderdata.dishLish[i].offnum);
			}
			if(num==offnum){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:true,
                    txt:'当前没有菜品，无法结账，请加菜！',
                    dur:1500
                });
                return;
			}
            if(that.selectPayWay==3){//礼品卡支付
                that.bgshow=true;
                that.giftCardModal=true;
                setTimeout("document.getElementById(\"giftCard\").focus()",50);
            }else if(that.selectPayWay==1){//微信、支付宝支付
                that.bgshow=true;
                that.QRcodeModal=true;
                that.authcode='';
                setTimeout("document.getElementById(\"onlinePayNo\").focus()",50);
            }else{
                if(that.balancePayNow){
                    that.getTableDetail()
				}else{
                    that.payOrder(that.selectPayWay);
				}
			}
		},
        //支付宝、微信、礼品卡支付
        payOrder:function(index){
            var that=this;
            var ishaveVip=0;
            if(that.member){
                ishaveVip=1
			}else{
                ishaveVip=0;
			}
            that.bgshow=false;
            that.QRcodeModal=false;
            if(that.orderdata.paid!=0){//订单已支付过
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'订单已支付过',
                    dur:1500
                });
			}else{
                if(index==1){//微信支付宝
                    that.presentno=''
                }
                else if(index==3){//礼品卡支付
                    that.authcode="";
                    if(that.presentno==''){
                        publicFun.showToast({
                            isShow:true,
                            type:2,
                            mask:true,
                            txt:'请先输入礼品卡信息',
                            dur:1500
                        });
                        that.bgshow=true;
                        return;
					}
                }
                if(that.payWay[index].type=='cashToPay'){//现金支付
					if(that.shouldPay!=0&&that.hadPay==0){
                        if(parseFloat(that.money)<parseFloat(that.shouldPay)||that.money===''){//输入现金小于实收金额，或者为空或者为0
                            publicFun.showToast({
                                isShow:true,
                                type:2,
                                mask:true,
                                txt:'输入现金不能小于实收金额',
                                dur:1500
                            });
                            return;
                        }
					}
					else if(that.remainToPay!=0&&that.hadPay>0){
                        if(parseFloat(that.money)<parseFloat(that.remainToPay)||that.money===''){//输入现金小于实收金额，或者为空或者为0
                            publicFun.showToast({
                                isShow:true,
                                type:2,
                                mask:true,
                                txt:'输入现金不能小于实收金额',
                                dur:1500
                            });
                            return;
                        }
					}
				}
				that.QRcodeModal=false;
                var url="index.php?g=Home&m=repastPcApi&a=payOrder";
                var params={
                    cid:that.cid,
                    tid:that.tid,	//餐桌id
                    oid:that.orderdata.id,
					isPoint:that.is_point,
                    paytype:that.payWay[index].type,	//支付方式
                    authcode:that.authcode,  //微信/支付宝支付码（如果是 微信/支付宝支付 sweepCodeToPay 此值必须传 否则传空字符串）
                    presentno:that.presentno,  //礼品卡卡号（礼品卡支付且输入了礼品卡号 此值必须传 否则传空字符串）
                    ishaveVip:ishaveVip
                };
                http.get(url,params,'payOrderCallBack',that);
			}
		},
        payOrderCallBack:function(res){
            console.log(res)
			var that=this;
			if(res.error==0){//支付成功
                that.bgshow=false;
                that.giftCardModal=false;
                that.QRcodeModal=false;
                publicFun.showToast({
                    isShow:true,
                    type:4,
                    mask:false,
                    txt:'支付成功',
                    dur:1500
                })

				setTimeout(function () {
                    that.$router.replace(`/index`);
                },2000)

			}else if(res.error==1){
				if(that.payType=='balanceToPay'&&res.msg=='您余额不足，请更换其他支付方式。'){
					that.enoughMoney=false;
				}
				if(res.msg=='您已在其他设备上登录了会员！'){
				    that.getTableDetail();
				}
			}
		},
        sendAdish:function(index,e){
            var that=this;
            if(that.roleModule.freeDish!=1){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'没有赠菜权限',
                    dur:3000
                });
                return;
            }
            that.bgshow=true;
            that.sendModal=true;
            that.sendIndex=index;
            that.sendName=that.orderdata.dishLish[index].name;
            that.sendRemark='';
			that.sendType=1;//1:赠菜、2：取消赠菜
            var par=e.currentTarget.parentNode.parentNode.parentNode;
             if(par.hasClass('btnShow')){
                 par.classList.remove("btnShow")
             }else{
                 par.classList.add("btnShow")
             }
		},
		//赠菜、取消赠菜：增加
		dishAdd:function(index){
            var that=this;
            if(that.sendType==1){//赠菜
				that.sendNum++;
				if(that.sendNum>(that.orderdata.dishLish[index].num-that.orderdata.dishLish[index].offnum-that.orderdata.dishLish[index].freenum)){
                    that.sendNum--;
                    publicFun.showToast({
                        isShow:true,
                        type:2,
                        mask:false,
                        txt:'赠菜数量不能大于点菜数量',
                        dur:1500
                    });
				}
			}else if(that.sendType==2){//取消赠菜
				that.sendNum++;
				if(that.sendNum>that.orderdata.dishLish[index].freenum){
                    that.sendNum--;
                    publicFun.showToast({
                        isShow:true,
                        type:2,
                        mask:false,
                        txt:'取消赠菜数量不能大于赠菜数量',
                        dur:1500
                    });
				}
			}
		},
        //赠菜、取消赠菜：减少
        dishReduce:function(index,type){
		    var that=this;
			that.sendNum--;
			if(that.sendNum<=0){
				that.sendNum=1;
			}
		},
        cancelSend:function(index,e){
            var that=this;
            if(that.roleModule.freeDish!=1){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'没有取消赠菜权限',
                    dur:3000
                });
                return;
            }
            that.bgshow=true;
            that.sendModal=true;
            that.sendIndex=index;
            that.sendName=that.orderdata.dishLish[index].name;
            that.sendRemark='';
            that.sendType=2;//1:赠菜、2：取消赠菜
            var par=e.currentTarget.parentNode.parentNode.parentNode;
             if(par.hasClass('btnShow')){
                 par.classList.remove("btnShow")
             }else{
                 par.classList.add("btnShow")
             }
		},
        sendSure:function (index) {
			var that=this;
//            if(that.sendRemark==''){
//                publicFun.showToast({
//                    isShow:true,
//                    type:2,
//                    mask:false,
//                    txt:'请输入原因',
//                    dur:500
//                });
//                return;
//            }
            if(that.sendNum>that.orderdata.dishLish[index].num-that.orderdata.dishLish[index].offnum-that.orderdata.dishLish[index].freenum){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'赠菜数量不能大于点菜数量',
                    dur:1500
                });
                return
            }
            if(that.sendNum==0){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'数量不能为0',
                    dur:500
                });
                return;
            }
            var url="index.php?g=Home&m=repastPcApi&a=freeAdish";
			var params={
                cid:that.cid,
                tid:that.tid,	//餐桌id
                oid:that.orderdata.id,
                did:that.orderdata.dishLish[index].did,
                spec:that.orderdata.dishLish[index].spec,
                attr:that.orderdata.dishLish[index].attr,
                didkey:that.orderdata.dishLish[index].didkey,
                remark:that.sendRemark,
                nums:that.sendNum
			};
            http.get(url,params,'sendSureCallBack',that);

        },
        sendSureCallBack:function(res){
            console.log(res)
			var that=this;
            that.bgshow=false;
            that.sendModal=false;
            that.sendNum=1;
            that.getTableDetail();
		},
        cancelSendSure:function(index){
            var that=this;
//            if(that.sendRemark==''){
//                publicFun.showToast({
//                    isShow:true,
//                    type:2,
//                    mask:false,
//                    txt:'请输入原因',
//                    dur:500
//                });
//                return;
//			}
            if(that.sendNum>that.orderdata.dishLish[index].freenum){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'取消赠菜数量不能大于赠菜数量',
                    dur:1500
                });
                return
            }
			if(that.sendNum==0){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'数量不能为0',
                    dur:1500
                });
                return;
			}
            var url="index.php?g=Home&m=repastPcApi&a=unFreeAdish";
            var params={
                cid:that.cid,
                tid:that.tid,	//餐桌id
                oid:that.orderdata.id,
                did:that.orderdata.dishLish[index].did,
                spec:that.orderdata.dishLish[index].spec,
                attr:that.orderdata.dishLish[index].attr,
                didkey:that.orderdata.dishLish[index].didkey,
                remark:that.sendRemark,
                nums:that.sendNum
            };
            http.get(url,params,'cancelSendCallBack',that);
		},
        cancelSendCallBack:function(res){
            console.log(res)
            var that=this;
            that.bgshow=false;
            that.sendModal=false;
            that.sendNum=1;
            that.getTableDetail();
		},
		//退菜
		retireAdish:function(index,e){
            var that=this;
            that.retireRemark='';
            if(that.roleModule.cutDish!=1){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'没有退菜权限',
                    dur:3000
				})
				return;
			}
            console.log(e)
            var par=e.currentTarget.parentNode.parentNode.parentNode;
             if(par.hasClass('btnShow')){
                 par.classList.remove("btnShow")
             }else{
                 par.classList.add("btnShow")
             }
            that.bgshow=true;
            that.rejectModal=true;
            that.retireIndex=index;
            that.cancleRetireIndex=index;
            that.retireName=that.orderdata.dishLish[index].name
		},
		//增加退菜数量
        cnumAdd:function(index){
		    var that=this;
		    that.retireNum++;
		    if(that.retireNum>(that.orderdata.dishLish[index].num-that.orderdata.dishLish[index].offnum-that.orderdata.dishLish[index].freenum)){
                that.retireNum--;
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'退菜数量不能大于点菜数量',
                    dur:1500
                });
			}
		},
		//减少退菜数量
        cnumReduce:function (index) {
            var that=this;
            that.retireNum--;
            if(that.retireNum<=0){
                that.retireNum=1
			}
        },
		//输入退菜数量
        retireInput:function (index) {
			var that=this;
            if(that.retireNum>(that.orderdata.dishLish[index].num-that.orderdata.dishLish[index].offnum-that.orderdata.dishLish[index].freenum)){
                that.retireNum=that.retireNum.substr(0,that.retireNum.length-1)
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'退菜数量不能大于点菜数量',
                    dur:1500
                });
			}
        },
        //退菜接口
        retireSure:function(index){
			var that=this;
			if(that.retireRemark==''){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'请输入退菜原因',
                    dur:1500
                });
                return;
			};
            var url="index.php?g=Home&m=repastPcApi&a=retireAdish";
            var params={
                cid:that.cid,
                tid:that.tid,	//餐桌id
                oid:that.orderdata.id,
				did:that.orderdata.dishLish[index].did,
                spec:that.orderdata.dishLish[index].spec,
                attr:that.orderdata.dishLish[index].attr,
                didkey:that.orderdata.dishLish[index].didkey,
                rmarke:that.retireRemark,
                nums:that.retireNum
            };
            if(that.retireNum==''||that.retireNum==0){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'退菜数量不能为0或空',
                    dur:1500
                });
				return;
			}else if(that.retireNum>that.orderdata.dishLish[index].num-that.orderdata.dishLish[index].offnum-that.orderdata.dishLish[index].freenum){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'退菜数量不能大于点菜数量',
                    dur:1500
                });
                that.retireNum=1;
                return;
			}
            http.get(url,params,'retireAdishCallBack',that);
		},
        retireAdishCallBack:function(res){
          console.log(res)
			var that=this;
          if(res.error==0){
              publicFun.showToast({
                  isShow:true,
                  type:2,
                  mask:false,
                  txt:res.msg,
                  dur:1500
              });
              that.bgshow=false;
              that.rejectModal=false;
              if(that.totalmenu==that.retireNum){
				that.clearTable();
				return;
              }
              that.retireNum=1;
              that.getTableDetail();
		  }else{
              publicFun.showToast({
                  isShow:true,
                  type:2,
                  mask:false,
                  txt:res.msg,
                  dur:1500
              });
		  }
        },
		//清台
        clearTable:function(){
            var that=this;
            var url="index.php?g=Home&m=repastPcApi&a=clearTable";
            var params={
                cid:that.cid,
				tid:that.tid	//餐桌id
            };
            http.get(url,params,'clearTableCallBack',that);
		},
        clearTableCallBack:function(res){
			var that=this;
            that.$router.replace('/index')
		},
        //取消退菜
        unRetire:function(index,e){
            var par=e.currentTarget.parentNode.parentNode;
            if(par.hasClass('btnShow')){
                par.classList.remove("btnShow")
            }else{
                par.classList.add("btnShow")
            }
            var that=this;
            if(that.roleModule.cutDish!=1){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'没有取消退菜权限',
                    dur:3000
                })
                return;
            }
            that.cancelRetireRemark='';
            that.bgshow=true;
            that.cancleRejectModal=true;
            that.retireIndex=index;
            that.retireName=that.orderdata.dishLish[index].name
		},
        cancelAdd:function(index){
            var that=this;
            that.cancelRetireNum++;
            if(that.cancelRetireNum>that.orderdata.dishLish[index].offnum){
                that.cancelRetireNum--;
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'取消退菜数量不能大于已退数量',
                    dur:1500
                });
			}
		},
        cancelReduce:function(index){
            var that=this;
            that.cancelRetireNum--;
            if(that.cancelRetireNum<=0){
                that.cancelRetireNum=1
            }
		},
        cancleRetireInput:function(index){
            var that=this;
            if(that.cancelRetireNum>that.orderdata.dishLish[index].offnum){
                that.cancelRetireNum=that.cancelRetireNum.substr(0,that.cancelRetireNum.length-1)
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'取消退菜数量不能大于已退数量',
                    dur:1500
                });
            }
		},
        unRetireAdish:function(index){
            var that=this;
            if(that.cancelRetireRemark==''){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'请输入取消退菜理由',
                    dur:1500
                });
                return;
            };
            if(that.cancelRetireNum==0||that.cancelRetireNum==''){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'取消退菜数量不能为0或空',
                    dur:1500
                });
                return;
			};
            var url="index.php?g=Home&m=repastPcApi&a=unRetireAdish";
            var params={
                cid:that.cid,
                tid:that.tid,	//餐桌id
                oid:that.orderdata.id,
				nums:that.cancelRetireNum,
                rmarke:that.cancelRetireRemark,
                did:that.orderdata.dishLish[index].did,
                spec:that.orderdata.dishLish[index].spec,
                attr:that.orderdata.dishLish[index].attr,
                didkey:that.orderdata.dishLish[index].didkey,
            };
            http.get(url,params,'unRetireAdishCallBack',that);
		},
        unRetireAdishCallBack:function(res){
            console.log(res)
			var that=this;
            if(res.error==0){
                that.cancleRejectModal=false;
                that.cancelRetireNum=1;
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:res.msg,
                    dur:1500
                });
                that.bgshow=false;
                that.cancleRejectModal=false;
                that.getTableDetail();
            }else{
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:res.msg,
                    dur:1500
                });
			}
		},
        //全退
        retireAllDish:function(){
            var that=this;
            if(that.retireRemark==''){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'请输入退菜原因',
                    dur:1500
                });
                return;
            }
            var url="index.php?g=Home&m=repastPcApi&a=retireAllDish";
            var params={
                cid:that.cid,
                tid:that.tid,	//餐桌id
                oid:that.orderdata.id,
                rmarke:that.retireRemark
            };
            http.get(url,params,'retireAllDishCallBack',that);
		},
        retireAllDishCallBack:function(res){
            console.log(res)
			var that=this;
            if(res.error==0){
                that.bgshow=false;
                that.rejectAllModal=false;
                if(that.haveSend){
                    publicFun.showToast({
                        isShow:true,
                        type:2,
                        mask:false,
                        txt:'仅退可退的菜品，不含所赠的菜品',
                        dur:1500
                    });
				}else{
                    publicFun.showToast({
                        isShow:true,
                        type:2,
                        mask:false,
                        txt:res.msg,
                        dur:1500
                    });
				}

                that.bgshow=false;
                that.rejectAllModal=false;
                if(!that.haveSend){
                    that.clearTable();
				}else{
                    that.getTableDetail();
				}
			}else{
                that.bgshow=false;
                that.rejectAllModal=false;
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:res.msg,
                    dur:500
                });
			}
		},
        //加菜
        addDish:function () {
			var that=this;
            if(that.roleModule.addOrder!=1){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'没有加菜权限',
                    dur:3000
                })
                return;
            }
            that.$router.replace(`/order?oid=${that.oid}&tid=${that.tid}&from=add`);
        },
        //时间戳转化成时间格式
		timeFormat:function (timestamp){
            var that=this;
			//timestamp是整数，否则要parseInt转换,不会出现少个0的情况
			var time = new Date(timestamp*1000);
			var year = time.getFullYear();
			var month = time.getMonth()+1;
			var date = time.getDate();
			var hours = time.getHours();
			var minutes = time.getMinutes();
			var seconds = time.getSeconds();
			return that.add0(month)+'-'+that.add0(date)+' '+that.add0(hours)+':'+that.add0(minutes)+':'+that.add0(seconds);
		},
		dishTimeFormat:function(timestamp){
            var that=this;
            var time = new Date(timestamp*1000);
            var hours = time.getHours();
            var minutes = time.getMinutes();
            return that.add0(hours)+':'+that.add0(minutes)
		},
        add0:function (m){return m<10?'0'+m:m },
		//现金输入框
        inputFunc:function () {
			var that=this;
			that.money=that.inputCheck(that.money);
			if(that.hadPay==0){
                that.balanceMoney=(that.money-that.shouldPay).toFixed(2)>0?(that.money-that.shouldPay).toFixed(2):0;
			}else if(that.hadPay>0){
                that.balanceMoney=(that.money-that.remainToPay).toFixed(2)>0?(that.money-that.remainToPay).toFixed(2):0;
			}

			that.addBalance=(that.money-(that.addTotal-that.addYh)).toFixed(2)
        },
		//改价输入
        wipeZeroInput:function(){
            var that=this;
            that.mlInput=that.inputCheck(that.mlInput);
		},
        //输入改价优惠金额并确定
        wipeZeroSure:function(){
            var that=this;
            if(parseFloat(that.mlInput)>parseFloat(that.shouldPay)){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'改价金额不能大于应付金额',
                    dur:500
                });
                return
            }else if(parseFloat(that.mlInput)>parseFloat(that.totalMoney)){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'改价金额不能大于消费金额',
                    dur:500
                });
                return
			}else if(that.payWay[that.selectPayWay].type=='sweepCodeToPay'){
                if(parseFloat(that.mlInput)==parseFloat(that.shouldPay)){
                    publicFun.showToast({
                        isShow:true,
                        type:2,
                        mask:false,
                        txt:'使用微信或支付宝支付时，最低支付为0.01元',
                        dur:500
                    });
                    return
                }
			}
			that. mlPreduce()

        },
		//改价接口
		mlPreduce:function(){
			var that=this;
            var params= {
                cid: that.cid,
				oid:that.orderdata.id,
				tid:that.tid,
                preduce:that.mlInput
            }
            var url="index.php?g=Home&m=repastPcApi&a=mLpreduce";
            http.get(url,params,'mlPreduceCallBack',that);
		},
        mlPreduceCallBack:function (res) {
			console.log(res);
			var that=this;
			if(res.error==0){
                that.minusList.mlreduce=that.mlInput;
                that.shouldPay=(parseFloat(that.shouldPay)-parseFloat(that.minusList.mlreduce)).toFixed(2);
                that.remainToPay=(parseFloat(that.remainToPay)-parseFloat(that.minusList.mlreduce)).toFixed(2);
                that.yhPrice=(parseFloat(that.yhPrice)+parseFloat(that.minusList.mlreduce)).toFixed(2);
                that.addYh=(parseFloat(that.addYh)+parseFloat(that.minusList.mlreduce)).toFixed(2);
                that.bgshow=false;
                that.wipeZeroModal=false;
                that.mlreduce=true;
                that.mlInput='';
                if(that.money!=''&&parseFloat(that.money)>parseFloat(that.shouldPay)){
                    that.balanceMoney=parseFloat(that.money)-parseFloat(that.shouldPay)
				}
				that.mlInput=''
                if(that.hadPay==0&&that.shouldPay==0||that.hadPay>0&&that.remainToPay==0){
                    that.selectPayWay=0;
                    that.payType='cashToPay';
                    that.payChinese='现金支付';
                    setTimeout(function(){
                        that.setHeight();
					},500)
                }
			}else{
                that.mlInput='';
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:res.msg,
                    dur:500
                })
			}
        },
		//输入校验
		inputCheck:function(money){
			var str = money;
            str = str.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
            str = str.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
            str = str.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
            str = str.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
            if(str.indexOf(".")< 0 && str !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
                str= parseFloat(str);
            }
            if(str=='.'){
                str=''
			}
			if(str>=100000000){
                str=str.toString().substr(0,str.toString().length-1)
			}
            return str;
        },
		//普通键盘
        keyBordNormal:function(key){
		    var that=this;
		    if(that.payType!='cashToPay'){
		        return;
			}
			if(that.specialInput==true){
		        if(key=='.'){
		            return;
				}
			    that.keyVal=(parseFloat(that.keyVal)+parseFloat(key)).toFixed(2);
			}else{
                that.keyVal+=key;
			}
            var str = that.keyVal;
            str = str.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
            str = str.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
            str = str.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
            str = str.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
            if(str.indexOf(".")< 0 && str !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
                str= parseFloat(str);
            }
            if(str=='.'){
                str=''
            }
            that.keyVal=str;
			if(parseFloat(that.keyVal)>=100000000){
			    if(key==='00'){
                    that.keyVal=that.keyVal.toString().substr(0,that.keyVal.toString().length-2)
				}else{
                    that.keyVal=that.keyVal.toString().substr(0,that.keyVal.toString().length-1)
				}

			}
			if(that.hadPay>0){
                that.balanceMoney=(that.money-that.shouldPay).toFixed(2)>0?(that.money-that.shouldPay).toFixed(2):0;
			}else{
                that.balanceMoney=(that.money-that.remainToPay).toFixed(2)>0?(that.money-that.remainToPay).toFixed(2):0;
			}

            that.addBalance=(that.money-(that.addTotal-that.addYh)).toFixed(2)
		},
		//大于10键盘
        keyBordSpecial:function(key){
            var that=this;
            if(that.payType!='cashToPay'){
                return;
            }
            console.log(parseFloat(that.keyVal))
			that.keyVal=key.toFixed(2);
			that.specialInput=true;
            if(that.hadPay>0){
                that.balanceMoney=(that.money-that.shouldPay).toFixed(2)>0?(that.money-that.shouldPay).toFixed(2):0;
            }else{
                that.balanceMoney=(that.money-that.remainToPay).toFixed(2)>0?(that.money-that.remainToPay).toFixed(2):0;
            }
            that.addBalance=(that.money-(that.addTotal-that.addYh)).toFixed(2)
		},
        //清空
        clearNum:function () {//清空
			var that=this;
			that.keyVal='';
			that.specialInput=false;
        },
        //改抬头弹框
        InvoiceModal:function(){
            this.bgshow=true;
			this.invoiceModal=true;
		},
        //改抬头接口调用
        invoiceSure:function(){
            var that=this;

            if(that.nums<=0){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'就餐人数不能为0',
                    dur:500
                });
                return;
            }
            var url="index.php?g=Home&m=repastPcApi&a=mdfyOrder";
            var params={
                cid:that.cid,
                tid:that.tid,	//餐桌id
                nums:that.nums,
                oid:that.orderdata.mainoid,
            }
            http.get(url,params,'mdfyOrderCallBack',that);
        },
        mdfyOrderCallBack:function(res){
            console.log(res)
            var that=this;
            if(res.error==0){
                that.bgshow=false;
                that.invoiceModal=false;
                that.pnum=that.nums;
                that.waiterSelect=that.waiter;
            }else{
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:res.msg,
                    dur:500
                })
            }
        },
        //全退弹框
        rejectAll:function(){
            var that=this;
            that.retireRemark='';
            var num=0;
            var freenum=0;
            for (var i=0;i<that.orderdata.dishLish.length;i++){
                if(that.orderdata.dishLish[i].paid==undefined){
                    num+=that.orderdata.dishLish[i].num;
                    freenum+=that.orderdata.dishLish[i].freenum;
				};
				if(that.orderdata.dishLish[i].paid==undefined&&that.orderdata.dishLish[i].freenum>0){
					that.haveSend=true;
				}
			}
            if(num==freenum){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'当前已点菜品均为赠菜，无法退菜',
                    dur:3000
                })
                return;
			}
            if(that.roleModule.cutDish!=1){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'没有退菜权限',
                    dur:3000
                })
                return;
            }
            that.haveSend=false;
            var num=0,
				offnum=0,
				freenum=0;
            for(var j=0;j<that.orderdata.dishLish.length;j++){
                num+=parseFloat(that.orderdata.dishLish[j].num);
                offnum+=parseFloat(that.orderdata.dishLish[j].offnum);
                freenum+=parseFloat(that.orderdata.dishLish[j].freenum);
                if(that.orderdata.dishLish[j].paid!=1&&that.orderdata.dishLish[j].freenum>0){
                    that.haveSend=true;
                }
            }

            if(offnum+freenum==num&&that.haveSend){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'已全退，请勿重复退菜',
                    dur:1500
                });
                return;
            }
            this.bgshow=true;
            this.rejectAllModal=true;
        },
        closeMemberModal:function(){
            this.bgshow=false;
            this.searchMemberModal=false;
            this.is_point=this.prevPoint
		},
        //关闭弹窗
        closeModal:function(){
            this.bgshow=false;
            this.sendModal=false;
            this.invoiceModal=false;
            this.rejectModal=false;
            this.rejectAllModal=false;
            this.searchMemberModal=false;
			this.wipeZeroModal=false;
			this.couponCheckModal=false;
			this.QRcodeModal=false;
			this.giftCardModal=false;
			this.selectCouponModal=false;
			this.memberCard=false;
			this.couponTitle='';
            this.couponIndex=''
            this.couponCode='';
            this.cancleRejectModal=false;
            this.mlInput='';
            this.presentno='';
            this.authcode='';
            this.retireNum=1;
            this.cancelRetireNum=1;
            this.sendNum=1;
            this.nums=this.pnum
		},
        //添加就餐人数
        addPeople:function () {
			this.nums++
//			if(this.nums>this.tnum){
//			    this.nums--;
//                publicFun.showToast({
//                    isShow:true,
//                    type:2,
//                    mask:false,
//                    txt:'就餐人数不能超过餐位数',
//                    dur:500
//                });
//			}
			if(this.nums>=100){
			    this.nums=99;
			}
        },
        //减少就餐人数
		lessPeople:function(){
            if(this.nums<=0){
                this.nums=0
			}else{
                this.nums--;
			}
		},
		//删除数字操作
		deleteNum:function(e){
            var that=this;
            if(e==1){//清零删除
                that.mlInput=that.mlInput.toString().substr(0,that.mlInput.toString().length-1)
			}else if(e==2){//礼品卡卡号删除
                that.presentno=that.presentno.toString().substr(0,that.presentno.toString().length-1)
			}else if(e==3){
                that.authcode=that.authcode.toString().substr(0,that.authcode.toString().length-1)
			}else if(e==4){//优惠券核销码删除
			    that.couponCode=that.couponCode.toString().substr(0,that.couponCode.toString().length-1)
			}else if(e==5){//会员号核销码删除
                that.memberNumber=that.memberNumber.toString().substr(0,that.memberNumber.toString().length-1)
            }
		},
        //选择优惠方式
        selectOffer:function(type){
		    var that=this;
		    if(that.orderdata.paid!=0){
                publicFun.showToast({
                    isShow:true,
                    type:2,
                    mask:false,
                    txt:'订单已支付过,无法更改',
                    dur:500
                });
		        return;
            }
		   if(type=='mlreduce'){//改价设置
			   	if(that.noReduce||that.minusList.mlreduce==undefined){
                    publicFun.showToast({
                        isShow:true,
                        type:2,
                        mask:false,
                        txt:'使用'+that.payChinese+'不享有改价优惠',
                        dur:3000
                    });
                    return;
				}
               if(that[type]){
                   that[type]=false;
                   that.yhPrice=(that.yhPrice-that.minusList.mlreduce).toFixed(2);
                   that.shouldPay=(that.totalMoney-that.yhPrice).toFixed(2);

                   that.addYh=(that.addYh-that.minusList.mlreduce).toFixed(2);
                   that.remainToPay=(that.totalMoney-that.addYh).toFixed(2);
                   that.minusList.mlreduce='';
                   if(that.money!=''&&parseFloat(that.money)>parseFloat(that.shouldPay)&&that.hadPay==0){
                       that.balanceMoney=parseFloat(that.money)-parseFloat(that.shouldPay)
                   };
                   if(that.money!=''&&parseFloat(that.money)>parseFloat(that.remainToPay)&&that.hadPay>0){
                       that.balanceMoney=parseFloat(that.money)-parseFloat(that.remainToPay)
                   }
               }else{
                   that[type]=false;
                   that.bgshow=true;
                   that.wipeZeroModal=true;
                   setTimeout("document.getElementById(\"mlfocus\").focus()",50);
               }
		   }else if(type=='couponcard'){
		       if(that.noReduce||that.discountData.can_use_coupon==0){
                   publicFun.showToast({
                       isShow:true,
                       type:2,
                       mask:false,
                       txt:'使用'+that.payChinese+'不享有优惠券优惠',
                       dur:3000
                   });
                   return;
			   };
		       that.bgshow=true;
		       if(that.member){//会员
                   that.selectCouponModal=true;
                   setTimeout("document.getElementById(\"coupon2\").focus()",50);
			   }else{
				   that.couponCheckModal=true;
                   setTimeout("document.getElementById(\"coupon1\").focus()",50);
			   }

			}else if(type=='vipPoint'){//积分抵扣
               if(that.noReduce||that.discountData.is_can_bonus==0){
                   publicFun.showToast({
                       isShow:true,
                       type:2,
                       mask:false,
                       txt:'使用'+that.payChinese+'不享有积分抵扣优惠',
                       dur:3000
                   });
                   return;
               };
		       if(that.is_point==1){
                   that.vipPoint=false;
                   that.is_point=0;
                   that.marketingDiscount();
			   }else{
                   if(parseFloat(that.member.points)<parseFloat(that.discountData.pointNum)||that.member.points==''){
                       publicFun.showToast({
                           isShow:true,
                           type:2,
                           mask:false,
                           txt:'积分不足',
                           dur:500
                       });
                   }else{
                       that.vipPoint=true;
                       that.is_point=1;
                       that.marketingDiscount();
                   }
			   }

		   }
//			else if(type=='caiYHprice'){//菜品优惠选择
//		       if(that.caiYHprice){
//		           that.caiYHprice=false;
//		           that.yhPrice=(that.yhPrice-that.orderdata.minusList.caiYHprice).toFixed(2);
//		           that.shouldPay=(parseFloat(that.shouldPay)+that.orderdata.minusList.caiYHprice).toFixed(2);
//			   }else{
//                   that.caiYHprice=true;
//                   that.yhPrice=(parseFloat(that.yhPrice)+that.orderdata.minusList.caiYHprice).toFixed(2);
//                   that.shouldPay=(parseFloat(that.shouldPay)-that.orderdata.minusList.caiYHprice).toFixed(2);
//			   }
//		   }

		},
		//预打
        staffPrint:function(){
            var that=this;
            var url="index.php?g=Home&m=repastPcApi&a=staffPrint";
            var params={
                cid:that.cid,
                tid:that.tid,	//餐桌id
                oid:that.orderdata.id,
                ptype:1
            };
            http.get(url,params,'staffPrintCallBack',that);
		},
        staffPrintCallBack:function(res){
            console.log(res)
		},
		//选择优惠券
		selectCoupon:function(index){
			var that=this;

			if(that.couponIndex===index){
                that.couponIndex='';
                that.couponId='';
            }else{
                that.couponIndex=index;
                that.couponId=that.couponList[that.couponIndex].couponId
            }
		},
		//选择优惠券确定
        selectCouponSure:function () {
		    var that=this;
			if(that.couponCode==''&&that.couponIndex===''){
				publicFun.showToast({
					isShow:true,
					type:2,
					mask:false,
					txt:'请先选择优惠券或输入核销码',
					dur:1500
				});
				return;
			};
            if(that.couponCode!=''){
                that.checkCouponCode()
			}else{
//                var i=that.couponList[that.couponIndex].title.indexOf('(');
//                var title=that.couponList[that.couponIndex].title.substr(0,i);
//                that.couponTitle=title;
                that.marketingDiscount();
                that.selectCouponModal=false;
                that.bgshow=false;
			}
        },
        CouponCncel:function(){
		    var that=this;
            that.couponTitle='';
            that.couponIndex=''
            that.couponCode='';
            that.couponId='';
            that.marketingDiscount();
            that.selectCouponModal=false;
            that.bgshow=false;
		},
		//验证优惠券是否可用接口
        checkCouponCode:function(){
            var that=this;
            var money=0;
			money=parseFloat(money)+parseFloat(that.discountData.payReduceMoney)+parseFloat(that.discountData.reduce_cost)+that.shouldPay-that.noreduceMoney;
            var url="index.php?g=Home&m=repastPcApi&a=checkCouponCode";
            var params={
                cid:that.cid,
                couponCode:that.couponCode,	//优惠券核销码
                paytype:that.payType,     //当前选择的支付方式 当前客户没选择支付方式 传 空字符串 值
                payMoney:money
            };
            http.get(url,params,'checkCouponCodeCallBack',that);

		},
        checkCouponCodeCallBack:function(res){
            var that=this;
            console.log(res)
			if(res.error==0){
                publicFun.showToast({
                    isShow:true,
                    type:4,
                    mask:false,
                    txt:'优惠券扫码成功',
                    dur:1500
                });
                that.couponId=res.datas.couponId;
                that.marketingDiscount();
                that.couponIndex='';
                that.couponCode='';
                that.selectCouponModal=false;
                that.couponCheckModal=false;
                that.bgshow=false;
			}else{
                publicFun.showToast({
                    isShow:true,
                    type:4,
                    mask:false,
                    txt:res.msg,
                    dur:1500
                });
                that.selectCouponModal=false;
                that.couponCheckModal=false;
                that.bgshow=false;
			}
		},
        couponCancelSearch:function(){
            var that=this;
            that.couponTitle='';
            that.couponCode='';
            that.couponId='';
            that.marketingDiscount();
            that.couponCheckModal=false;
            that.bgshow=false;
		}

    },
    beforeDestroy () {

    },
    watch: {

    },
    computed: {
		money:{
		    get:function(){
		        return this.keyVal
			},
			set:function(newVal){
		        this.keyVal=newVal
			}
		},
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.InvoiceModal .fa{
		color: #ed881d;
	}
	.memberInput{
		position:relative;
	}
	.memberInput img{
		position: absolute;
		top: 27px;
		right: 45px;
	}
	.noData{
		text-align: center;
		margin-top: 10%;
		font-size: 30px;
	}
	.discountList .discount{
		position: relative;
	}
	.discount .discountMask{
		position: absolute;
		top:-6px;
		left:-6px;
		right:-6px;
		bottom:-6px;
		border-radius: 2px;
		background: rgba(0,0,0,.3);
	}
	.discount .discountMask img{
		margin-top: 10%;
	}
	.discountList .canNot .subTitle{
		display: none;
	}
	.discountList .canNot .title{
		margin-top: 20px;
	}
	.discountList .canNot{
		background: #ddd;
		border-color: #ddd !important;
	}
	.discountList .canNot .activeLogo{
		display: none;
	}
    .discountList{
        margin-top:5px;
    }
	.order .menu .ft .total .sendPart{
		font-size: 16px;
		color:#666;
		padding-left: 10px;
	}
	.mt5{
		margin-top: 5px;
		width: 100% !important;
	}
	.alreadyPay{
		font-size: 17px;
	}
	.addOffer{
		font-size: 16px;
		padding-left: 5px;
	}
	.order .leftft .changeTabBtn{
		width: 100% !important;
		margin-top: 5px;
	}
	.tabId{
		position: absolute;
		font-size: 16px;
		left: 0;
		bottom: 5px;
	}
	.changeTableModal{
		position: fixed;
		left:0;
		top:0;
		right:0;
		bottom:0;
		text-align: center;
		z-index: 10;
	}
	.tableContent{
		height: 500px;
		overflow-y: auto;
	}
	.pageSelect{
		font-size: 20px;
		width:48%;
		text-align: left;
		margin-top: 10px;
		margin-left: 3%;
	}
	.pageSelect span{
		display: inline-block;
		color:#aaa;
		margin-right: 10px;
		cursor: pointer;
	}
	.pageSelect .preCanClick,.pageSelect .nextCanClick{
		color: #666;
	}
	.changeTable{
		padding:0;
		width:925px;
		margin: 0 auto;
		margin-top: 40px;
		border: 1px solid #fff;
		border-radius: 5px;
	}
	.changeTable .modalContent{
		background: #ddd;
		height: 590px;
	}
	.changeTable .modalHead{
		padding:0 20px;
		border-bottom: none;
		background: #fff;
	}
	.changeTable .modalHead .modalTitle{
		padding: 20px 0;
		border-bottom: 1px solid #ddd;
		position: relative;
	}
	.changeTable .cancle,.changeTable .makeSure{
		display: inline-block;
		font-size: 20px;
		width: 150px;
		text-align: center;
		line-height: 50px;
		cursor: pointer;
		border-radius: 5px;
		margin-left: 0;
		margin-right: 30px;
	}
	.changeTable .cancle{
		background: #ddd;
	}
	.modalLeft{
		width: 18%;
		height:590px;
		overflow-y: auto;
	}
	.modalRight{
		width:82%;
		padding-bottom: 20px;
		background: #fff;
	}
	.roomList li{
		background: #ddd;
		font-size: 25px;
		text-align: center;
		line-height: 60px;
		cursor: pointer;
	}
	.roomList li.active{
		background: #fff;
	}
	.tableClick{
		box-shadow: 0px 0px 10px #ddd;
		width: 20%;
		margin-left:4%;
		border-radius: 5px;
		height:150px;
		margin-top: 10px;
        margin-bottom: 5px;
		cursor: pointer;
	}
	.tableClick .wrap{
		padding: 10px;
	}
	.dataNum{text-align: left}
	.tableClick .icon{display:inline-block;background:  url(../../assets/t_1.png) no-repeat center;background-size: contain;width: 72px;height: 72px;margin-top: 10px;}
	.tableClick .icon.active{background:  url(../../assets/t_6.png) no-repeat center;background-size: contain;width: 72px;height: 72px;margin-top: 10px;}
	.tableClick .dataNum{font-size: 15px;}
	.changeTableFooter{
		margin-top: 20px;
	}
	.remainOne{
		font-size: 14px;
		text-align: left;
		color: #f00;
		margin-top: 5px;
	}
	.keyBordContent{
		overflow: hidden;
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
	.servicePeople{
		text-align: right;
	}
	.backIndex,.reSearch,.reSetBtn{
		cursor: pointer;
	}
	.textDesc{
		cursor: pointer;
	}
	.retired,.notRetired{
		padding-bottom: 5px;
		border-bottom: 1px dotted #ddd;
		margin-top: 8px;
	}
	.retireBtnGroup{
		display: none;
	}
	.retiredBtnGroup{
		display: none;
	}
	.btnShow .retireBtnGroup{
		display: block;
	}
	.btnShow .retiredBtnGroup{
		display: block;
	}
	.order .menu .hd .editIcon{
		top:10px;
		right:5px;
		height:25px;
		font-size: 25px;
	}
	.dishPackage{
		display: none;
	}
	.on .dishPackage{
		display: block;
	}
	.dishDesc i{font-size: 15px;cursor: pointer}
	.dishDesc i:before {
		content: "\f0da";
	}
	.on .dishDesc i:before {
		content: "\f0d7";
	}
	.order .menu .bd ul{
		margin-top: 10px;
	}
	.order .menu .bd ul li{
		border: none;
		padding:10px 5px;
		background: #efefef;
	}
	.dishPackage li{
		overflow: hidden;
	}
	.mlNotice{
		font-size: 15px;
		text-align: left;
		color: #f00;
		padding-left: 110px;
		margin-top: 5px;
	}
	.ofh{
		overflow: hidden;
	}
	.couponNo{
		padding-bottom: 5px;
	}
	.couponList .couponActive{
		color: #ED881D;
	}
	.retired{
		margin-top: 8px;
	}
	.order .leftft .havePaid{
		width: 100%;
	}
	.dishMsg{
		font-size: 18px;
		margin-top: 10px;
	}
	.couponList{
		height: 300px;
		overflow: auto;
	}
	.fa-fw {
		width: 1.28571429em;
		text-align: center;
	}
	.rejectModal .fa,.InvoiceModal .fa,.sendModal .fa{
		font-size: 30px;
		vertical-align: middle;
		color: #dddde5;
		cursor: pointer;
	}
	.order .menu {
		bottom: 115px;
	}
	.order .menu .hd {
		height: 120px;
	}
	.modal{
		position: fixed;
		background: #fff;
		padding: 20px 45px 30px 45px;
		border-radius: 5px;
		z-index: 10;
	}
	.modal input{
		padding-left: 10px;
	}
	.inputOut{position: relative;display: inline-block}
	.clearBtn{
		position: absolute;
		width:30px;
		cursor: pointer;
		top: 13px;
		right: 10px;
	}
	.lab{
		overflow: hidden;
	}
	.modalFooter{
		overflow: hidden;
		width: 440px;
		margin:50px auto 0 auto;
	}
	.modalFooter div{
		font-size: 20px;
		text-align: center;
		line-height: 50px;
		cursor: pointer;
		border-radius: 5px;
		width: 200px;
	}
	.cancel{
		background: #ececee;
		color: #333;
	}
	.makeSure{
		background: #fa8b2e;
		color:#fff;
		margin-left: 40px;
	}
	.InvoiceModal{
		left:50%;
		top: 50%;
		transform: translate(-50%,-50%);
		-moz-transform: translate(-50%,-50%);
		-o-transform: translate(-50%,-50%);
		-webkit-transform: translate(-50%,-50%);
		-ms-transform: translate(-50%,-50%);
	}
	.modalHead{
		padding-bottom: 15px;
		border-bottom: 1px solid #ddd;
	}
	.modalTitle{
		font-size: 36px;
		text-align: center;
		color:#333;
	}
	.modalSub{
		text-align: left;
		margin-top: 20px;
		font-size: 18px;
		color:#999;
		padding: 10px 0;
	}
	.people,.service{
		overflow: hidden;
		margin-top: 20px;
	}
	.peopleNum{
		width: 185px;
	}
	.waiter{
		width: 280px;
		border:1px solid #b2b2b2;
		height:40px;
		font-size: 18px;
		padding-left: 10px;
	}
	.modal .labName{
		font-size: 20px;
		margin-top: 5px;
	}
	.InvoiceModal input{
		border:1px solid #b2b2b2;
		line-height: 40px;
		text-align: center;
		font-size: 18px;
	}
	.addPeople,.less{
		display: inline-block;
		background: #ddd;
		color:#fff;
		border-radius: 50%;
		text-align: center;
		width:40px;
		line-height: 40px;
		font-size: 30px;
		cursor: pointer;
	}
	.rejectModal .lab,.sendModal .lab{
		margin-top: 15px;
	}
	.foodName,.amount{
		font-size: 16px;
		line-height: 40px;
		display: inline-block;
		margin-right: 5px;
	}
	.rejectModal,.sendModal{
		left:50%;
		top: 50%;
		transform: translate(-50%,-50%);
		-moz-transform: translate(-50%,-50%);
		-o-transform: translate(-50%,-50%);
		-webkit-transform: translate(-50%,-50%);
		-ms-transform: translate(-50%,-50%);
	}
	.rejectModal input,.sendModal input{
		border:1px solid #b2b2b2;
		font-size: 16px;
		width: 70px;
		padding-left: 0;
	}
	.rejectModal .reasonInput,.sendModal .reasonInput{
		width: 315px;
		padding-left: 10px;
	}
	.foodAmount{
		line-height: 40px;
		text-align: center;
	}
	.otherReason{
		font-size: 18px;
		background: #ececee;
		color: #333;
		text-align: center;
		line-height: 40px;
		border: 4px solid #ED881D;
		width: 150px;
		cursor: pointer;
		border-radius: 5px;
		margin: 0 auto;
		margin-top: 25px;
	}
	.reasonCon{
		margin-top: 30px;
	}
	.reasonCon span{
		font-size: 16px;
	}
	.reasonInput{
		line-height: 40px;
		width:300px
	}
	.rejectAll{
		left:50%;
		top: 50%;
		transform: translate(-50%,-50%);
		-moz-transform: translate(-50%,-50%);
		-o-transform: translate(-50%,-50%);
		-webkit-transform: translate(-50%,-50%);
		-ms-transform: translate(-50%,-50%);
	}
	.modalContent{
		text-align: left;
		/*min-height: 110px;*/
	}
	.modalContent input{
		border: 1px solid #999;
	}
	.rejectAll .modalContent{
		padding:20px;
		font-size: 29px;
		text-align: center;
	 }
	.searchMember .modalContent{
		position: relative;
	}
	.searchMember{
		left:32%;
	}
	.searchMember input{
		font-size: 16px;
		line-height: 40px;
		padding-left: 10px;
		width:350px;
		margin:15px 0 30px 0;
		padding-right: 40px;
	}
	.searchNotice{
		margin-top: 15px;
		font-size: 15px;
	}
	.searchNo{
		position: absolute;
		font-size: 13px;
		color:#f00;
		bottom:10px
	}
	.wipeZero{
		left:50%;
		top: 50%;
		transform: translate(-50%,-50%);
		-moz-transform: translate(-50%,-50%);
		-o-transform: translate(-50%,-50%);
		-webkit-transform: translate(-50%,-50%);
		-ms-transform: translate(-50%,-50%);
	}
	.shouldReceipt{
		font-size: 20px;
		color: #333;
		margin: 20px 0;
	}
	.wipeZero span{
		font-size:20px;
		color: #333;
		line-height: 40px;
	}
	.moneyInput{
		width: 260px;
		line-height: 40px;
		font-size: 18px;
		margin-left: 10px;
		padding-right: 40px;
	}
	.wipeZero .modalContent{
		position: relative;
	}
	.errorNotice{
		position: absolute;
		font-size: 13px;
		color:#f00;
		bottom: -20px;
		left: 91px;
	}
	.mb40{
		margin-bottom: 40px;
	}
	.couponCheck,.QRcode{
		left:50%;
		top: 50%;
		transform: translate(-50%,-50%);
		-moz-transform: translate(-50%,-50%);
		-o-transform: translate(-50%,-50%);
		-webkit-transform: translate(-50%,-50%);
		-ms-transform: translate(-50%,-50%);
	}
	.contentTitle{
		margin: 20px 0;
		font-size: 18px;
		text-align: center;
	}
	.couponNo,.codeNum,.giftNum{
		text-align: center;
		position: relative;
		margin: 0 auto;
		margin-bottom: 40px;
		display: inline-block;
		height:50px;

	}
	.couponNo input,.codeNum input,.giftNum input{
		line-height: 40px;
		font-size: 18px;
		width:350px;
		margin: 0 auto;
	}

	.codeNum input,.couponNo input{
		width:300px;
		padding-right: 40px;
	}

	.giftNum input{
		font-size: 16px;
		width:375px;
		padding-right: 45px;
	}
	.couponError,.codeErr,.giftNotice{
		color: #f00;
		font-size: 15px;
		position: absolute;
		left:36px
	}
	.giftNotice{
		left:60px;
	}
	.giftCard{
		left:50%;
		top: 50%;
		transform: translate(-50%,-50%);
		-moz-transform: translate(-50%,-50%);
		-o-transform: translate(-50%,-50%);
		-webkit-transform: translate(-50%,-50%);
		-ms-transform: translate(-50%,-50%);
	}
	.titleMoney{
		color: #f00;
		font-size: 25px;
	}
	.selectCoupon{
		left:35%;
        top:15%;
	}
	.selectCoupon .modalContent{
		margin-top: 20px;
	}
	.couponInput{
		position: relative;
	}
	.couponInput input{
		line-height: 60px;
		font-size: 16px;
		width:400px;
		margin: 0 auto;
		padding-right: 40px;
	}
	.couponInput .clearBtn{
		top:23px;
	}
	.couponType{
		text-align: center;
		color:#999;
		font-size: 16px;
		line-height: 50px;
		border:1px solid #ddd;
		border-top:none;
		cursor: pointer;
	}
	.couponType span{
		color: #ED881D;
	}
    .memberDis{
        background:rgba(0,0,0,.3);
		padding: 18px;
		overflow: hidden;
    }
    .disHeader{
        overflow:hidden;

    }
    .memberMsg{
        overflow:hidden;
        float:left;
    }
    .pic{
        width:70px;
        height:70px;
        border-radius:50%;
        background:#fff;
        float:left;
    }
    .pic img{
       width:70px;
       height:70px;
       border-radius:50%;
    }
	.memberName{
		float: left;
		color:#fff;
		font-size: 20px;
		margin-left: 26px;
	}
	.cardNo{
		margin-top: 10px;
	}
	.btnGroup span{
		display: inline-block;
		width: 172px;
		line-height: 50px;
		background-color: #fa8b2e;
		text-align: center;
		font-size: 23px;
		color:#fff;
		margin-top: 10px;
		border-radius: 3px;
	}
	.backIndex{
		margin-right: 25px;
	}
	.discountList{
		overflow: hidden;
		height:180px
	}
	.discount{
		width: 15.1%;
		height: 70px;
		background-color: #ffffff;
		border: solid 6px #fff;
		float: left;
		margin-right: 10px;
		text-align: center;
		margin-bottom: 10px;
		position: relative;
		cursor:pointer;
		border-radius: 3px;
	}
	.discount:nth-child(6),.discount:nth-child(12){
		margin-right: 0px;
	}
	.discount .title{
		font-size: 22px;
		margin-top: 5px;
	}
	.discount .subTitle{
		font-size: 16px;
	}
	.discount .title.noSub,.payWay .title{
		margin-top: 20px;
	}
	.discount.active{
		border: 6px solid #fa8b2e;
	}
	.activeLogo{
		position: absolute;
		top:-1px;
		right:-1px;
	}
	.recharge{
		color: #fff;

	}
	.costOffer{
		overflow: hidden;
		margin-top: 15px;
	}
	.costOffer.notMember{
		margin-top: 20px;
	}
	.costMoney,.payMoney{
		width: 45%;
	}
	.rechargeName{
		font-size: 18px;
		display: inline-block;
		margin-right:20px;
		padding-left: 14px;
		width: 110px;
		text-align: right;
	}
	.money{
		font-size:30px;
	}
	.payReset{
		overflow: hidden;
		margin-top: 30px;
	}
	.payReset.notMember{
		margin-top: 20px;
		padding-bottom: 5px
	}
	.reSet{margin-right: 20px;}
	.reSetBtn{
		display: inline-block;
		text-align: center;
		background: #fff;
		color: #48465b;
		font-size: 23px;
		width: 180px;
		line-height: 54px;
		cursor:pointer;
		border-radius: 3px;
	}
	.cash{
		overflow: hidden;
		color: #fff;
		padding-left: 14px;
		margin-top: 20px;
		padding-top: 10px;
		border-top: 1px solid rgba(255,255,255,.7);
	}
	.cash.notMember{
		margin-top: 18px
	}
	.cashMoney{
		width: 50%;
		position: relative;
		border-right: 1px solid rgba(255,255,255,.8);
        margin-top: 8px;
	}
	.cashName{
		font-size: 24px;
		margin-right: 45px;
	}
	.total{
		font-size: 38px;
	}
	/*.offerMoney{*/
		/*margin-left: 40px;*/
	/*}*/
	.cashMoney .closeBtn{
		position: absolute;
		right:20px;
		top:10px;
		cursor: pointer;
	}
	.balanceName{
		font-size: 24px;
		margin-right: 45px;
		margin-left: 40px;
	}
	.balanceMoney{
		font-size:38px;
	}
	.keyBord{
		overflow: hidden;
		width:80%;
		margin-top: 10px;
		float: left;
	}
	.keyBord .key{
		background: #fff;
		float: left;
		font-size: 30px;
		text-align: center;
		line-height: 65px;
		width: 32%;
		cursor:pointer;
		margin-bottom: 10px;
		margin-right: 10px;
	}
	.notMember .key{
		line-height: 83px;
	}
	.specialKey .key{
		width: 100%;
		border-radius: 3px;
	}
	.operate{
		float:left;
		margin-top: 10px;
		width: 20%;
		/* width: 260px; */
	}
	.payBill span{
		text-align: center;
		display: inline-block;
		line-height: 65px;
		color: #fff;
		cursor: pointer;
		font-size: 20px;
		/* width:129px; */
		width:49.5%;

	}
	.print{
		background: #fa9331;
	}
	.notPrint{
		background: #a3a3a3;
		margin-left: -3px;
	}
	.prePrint{
		background: #fff;
		color: #000;
		/*line-height: 65px;*/
		line-height:140px ;
		cursor: pointer;
		font-size: 20px;
		text-align: center;
		/*margin-top: 10px;*/
		margin-bottom: 10px;
		border-radius: 3px;
	}
	.notMember .prePrint{
		line-height:175px ;
	}
	.billPlease{
		background: #fa9331;
		font-size: 20px;
		text-align: center;
		line-height:140px ;
		color: #fff;
		cursor: pointer;
		border-radius: 3px;
	}
	.notMember .billPlease{
		line-height:175px ;
	}
	.inputNum{
		display: inline-block;
	}
	.moneyLogo{
		font-size: 32px;
	}
	.inputNum input{
		font-size: 30px;
		background: inherit;
		border:none;
		color: #fff;
		position: absolute;
		top:0px
	}
	.normalKey{
		overflow: hidden;
		width:75%;
	}
	.normalKey .key:nth-child(3),.normalKey .key:nth-child(6),.normalKey .key:nth-child(9),.normalKey .key:nth-child(12){
		margin-right: 0px;
	}
	.specialKey{
		overflow: hidden;
		width: 23%;
	}
	.normalKey .key{
		background: rgba(255,255,255,.7);
		border-radius: 3px;
	}
	.order .menu .bd .wrap>.row .dishDesc h3{font-size: 16px;}
	.order .menu .bd .wrap>.row .btns .retireBtn{width: 48%}
	.order .menu .bd .wrap>.row .btns .retireBtn.cancelSend{width: 100%}
	.sendFoodBtn{float: left}
	.order .menu .bd{overflow: auto}
    @media screen and (max-width: 1821px){
        .discount{
            width: 15%;
        }
    }
    @media screen and (max-width: 1821px){
        .discount{
            width: 14.9%;
        }
    }
    @media screen and (max-width: 1732px){
        .discount{
            width: 14.85%;
        }
    }
    @media screen and (max-width: 1702px){
        .discount{
            width: 14.8%;
        }
        .keyBord .key{
            line-height: 80px;
        }
        .notMember .key{
            line-height: 98px;
        }
        .prePrint,.billPlease{
            line-height: 170px;
        }
        .notMember .prePrint,.notMember .billPlease{
            line-height: 208px;
        }
    }
	@media screen and (max-width: 1680px){
		.discount{width: 14.6%;margin-right: 12px;}
	}
    @media screen and (max-width: 1646px){
        .discount{margin-right: 11px;}
    }
	@media screen and (max-width: 1625px){
		.discount{width: 14.5%;}
	}
    @media screen and (max-width: 1600px) {
        .keyBord .key{width: 31.5%;}
        .specialKey  .key{width: 100%;}
        .discount{width: 14.45%;}
        .discount .subTitle{font-size: 14px;}
        .costOffer.notMember{margin-top: 5px;}
        .payReset.notMember{margin-top: 5px;}
        .reSetBtn{line-height: 40px;width: 140px;}
        .keyBord .key{line-height: 57px;}
        .activeLogo{width: 36px;}
        .discount .title.noSub, .payWay .title{margin-top: 20px;}
        .keyBord{width: 75%;}
        .operate{width: 25%;}
        .billPlease{line-height: 125px;}
        .prePrint{line-height: 122px}
        .notMember .key{
            line-height: 82px;
        }
        .notMember .prePrint,.notMember .billPlease{
            line-height:174px;
        }

    }
	@media screen and (max-width: 1555px) {
		.discount{width: 14.4%;}
		.selectCoupon{
			left:30%
		}
	}
	@media screen and (max-width: 1538px){
		.keyBord .key{
			line-height: 43px;
		}
		.prePrint,.billPlease{
			line-height: 95px;
		}
		.notMember .key{
			line-height: 61px;
		}
		.notMember .prePrint,.notMember .billPlease{
			line-height: 132px;
		}
	}
	@media screen and (max-width: 1536px) {
		.discount{width: 14.3%;}
		/*.keyBord .key{*/
			/*line-height: 25px;*/
			/*margin-bottom: 5px;*/
		/*}*/
		/*.billPlease,.prePrint{*/
			/*line-height: 53px;*/
		/*}*/
		/*.notMember .key{*/
			/*line-height: 39px;*/
			/*margin-bottom: 10px;*/
		/*}*/
		/*.notMember .billPlease{*/
			/*line-height: 88px;*/
		/*}*/

	}
    @media screen and (max-width: 1498px){
        .discount{
            width: 14.3%;
        }
		.keyBord .key{
			line-height: 25px;
			margin-bottom: 10px;
		}
    }
    @media screen and (max-width: 1478px){
        .discount{
            width: 14.3%;
            margin-right: 10px;
        }
    }
	@media screen and (max-width: 1460px) {
		.discount{width: 14%;}
		.discount .title{font-size: 20px}
	}
	@media screen and (max-width: 1366px) {
		.discount .discountMask{
			top:-4px;
			right:-4px;
			bottom:-4px;
			left:-4px;
		}
		.tableContent{
			height:390px;
		}
		.changeTable .modalContent{
			height:480px;
		}
		.modalLeft{
			height:480px;
		}
		.tableClick .icon{
			width: 66px;
			height: 60px;
		}
		.tableClick .icon.active{
			width: 66px;
			height: 60px;
		}
		.memberName{font-size: 16px;}
		.btnGroup span{width: 120px;line-height: 30px;font-size: 16px;  }
		.discount .title{font-size: 16px;}
		.discount{width: 14.5%;height: 56px;border:4px solid #fff;}
		.discount .subTitle{font-size: 12px;}
		/*.discount .title.noSub{line-height: 50px;margin-top: 0;}*/
		.discountList{height: 140px;}
		.money{font-size: 24px;}
		.reSetBtn{width:100px;font-size: 20px;line-height: 30px;}
		.memberDis{padding: 12px;}
		.cash.notMember{margin-top: 12px;}
		.cashName{font-size: 18px;}
		.moneyLogo{font-size: 26px;}
        .cashMoney{margin-top: 0}
		.cashMoney .closeBtn{width: 20px;}
		.balanceName{font-size: 18px;}
		.balanceMoney{font-size: 24px;}
		.inputNum input{font-size: 24px;}
		.keyBord{width: 75%;}
		.keyBord .key{width: 31%;line-height: 49px;}
		.prePrint{line-height: 107px;}
		.specialKey  .key{width: 100%;}
		.billPlease{line-height: 109px;}
		.payWay .title{margin-top: 18px;}
		.order .menu .ft .total span{font-size:28px;}
		.order .menu .bd .wrap>.row .dishDesc h3{font-size: 16px;}
		.order .menu .bd .wrap>.row .btns span{height: 40px;line-height: 40px;}
		.order .menu .ft .dishNum{line-height: 20px;}
		.order .menu .wrap{padding: 5px;}
		.order .menu .bd{bottom: 170px;}
		.payBill span{font-size: 16px;}
		.discount.active{border: 4px solid #fa8b2e;}
		.activeLogo{width: 25px;}
		.notMember .key{
			line-height: 76px;
		}
		.notMember .prePrint{
			line-height: 162px;
		}
		.notMember .billPlease{
			line-height: 162px;
		}
	}
	@media screen and (max-width: 1348px) {
		.discount .discountMask{top:-4px;right:-4px;bottom:-4px;left:-4px;}
		.memberName{font-size: 16px;}
		.btnGroup span{width: 120px;line-height: 30px;font-size: 16px;}
		.discount .title{font-size: 16px;}
		.discount{width: 14.5%;height: 56px;border:4px solid #fff;}
		.discount .subTitle{font-size: 12px;}
		/*.discount .title.noSub{line-height: 50px;margin-top: 0;}*/
		.discountList{height: 140px;}
		.money{font-size: 24px;}
		.reSetBtn{width:100px;font-size: 20px;line-height: 30px;}
		.memberDis{padding: 12px;}
		.cash.notMember{margin-top: 12px;}
		.cashName{font-size: 18px;}
		.moneyLogo{font-size: 26px;}
        .cashMoney{margin-top: 0}
		.cashMoney .closeBtn{width: 20px;}
		.balanceName{font-size: 18px;}
		.balanceMoney{font-size: 24px;}
		.inputNum input{font-size: 24px;}
		.keyBord{width: 75%;}
		.keyBord .key{width: 31%;line-height: 49px;}
		.prePrint{line-height: 107px;}
		.specialKey  .key{width: 100%;}
		.billPlease{line-height: 109px;}
		.payWay .title{margin-top: 18px;}
		.order .menu .ft .total span{font-size:28px;}
		.order .menu .bd .wrap>.row .dishDesc h3{font-size: 16px;}
		.order .menu .bd .wrap>.row .btns span{height: 40px;line-height: 40px;}
		.order .menu .ft .dishNum{line-height: 20px;}
		.order .menu .wrap{padding: 5px;}
		.order .menu .bd{bottom: 170px;}
		.payBill span{font-size: 16px;}
		.discount.active{border: 4px solid #fa8b2e;}
		.activeLogo{width: 25px;}
		.notMember .key{
			line-height: 76px;
		}
		.notMember .prePrint{
			line-height: 162px;
		}
		.notMember .billPlease{
			line-height: 162px;
		}
	}
    @media screen and (max-width:1300px){
        .contentTitle{
            font-size: 15px;
        }
        .titleMoney{
            font-size: 23px;
        }
    }
	@media screen and (max-width: 1280px){
		.discount{width: 14%;margin-right: 13px;}
		.keyBord .key{width: 30.8%;line-height: 67px;}
		.prePrint{line-height: 145px;}
		.specialKey  .key{width: 100%;}
		.payBill span{font-size: 14px;}
		.billPlease{line-height: 145px;}
		.selectCoupon{
			left:28%
		}
		.notMember .key{line-height: 94px;}
		.notMember .prePrint{line-height: 198px}
		.notMember .billPlease{line-height: 198px}
	}
    @media screen and (max-width:1276px){
        .keyBord .key{
            line-height: 83px;
        }
        .prePrint,.billPlease{
            line-height: 175px;
        }
        .notMember .key{
            line-height: 103px;
        }
        .notMember .prePrint,.notMember .billPlease{
            line-height: 216px;
        }
    }
    @media screen and (max-width:1250px){
        .contentTitle{
            font-size: 14px;
        }
        .titleMoney{
            font-size: 22px;
        }
    }
    @media screen and (max-width: 1215px){
        .discount{margin-right: 10px;}
    }
	@media screen and (max-width: 1124px){
		.discount{width: 13.85%}
	}
	@media screen and (max-width: 1090px){
		.discount{width: 13.8%}
	}
    @media screen and (max-width:1070px){
        .contentTitle{
            font-size: 14px;
        }
        .titleMoney{
            font-size: 21px;
        }
    }
    @media screen and (max-width: 1060px){
        .discount .title{
            font-size: 15px;
        }
        .discount{
            margin-right: 9px;
        }
    }
    @media screen and (max-width: 1028px){
        .keyBord .key{
            line-height: 59px;
        }
        .prePrint,.billPlease{
            line-height: 128px;
        }
        .order .menu .hd{
            height: 108px;
        }
        .notMember .key{
            line-height: 78px;
        }
        .notMember .prePrint,.notMember .billPlease{
            line-height: 166px;
        }
    }
	@media screen and (max-width: 1024px){
		.keyBord{width: 70%;}
		.memberName{margin-left: 10px;}
		.btnGroup span{width: 80px;}
		.backIndex{margin-right: 10px;}
		.discount{width: 14%;}
		.discount .title{font-size: 14px;}
		.operate{width:30%;}
		.rejectAll .modalContent{font-size: 24px;}
		.modalTitle{font-size: 29px;}
		.giftCard .clearBtn{right: 10px;}
		.keyBord .key{width: 30.1%;line-height: 69px;}
		.specialKey  .key{width: 100%;}
		.modalFooter div{width: 160px;}
		.modalFooter{width: 360px;margin:20px auto 0px auto;}
		.billPlease{line-height: 156px;}
		.order .menu .bd .wrap>.row .dishDesc h3{font-size: 16px;}
		.sendModal .reasonInput{ width: 245px}
	}
/*2018.8.28*/
	/*.modelNews{*/
		/*padding: 0;*/
	/*}*/
	/*.modelNews .modalHead{*/
		/*padding: 10px 0;*/
	/*}*/
    /*.modelNews .modalContent{*/
	    /*padding: 20px 0;*/
	    /*margin: 0 30px;*/
	    /*min-height: 160px;*/
    /*}*/
    /*.modelNews .modalFooter{*/
	    /*border-top: 1px solid #ddd;*/
	    /*width: 100%;*/
	    /*margin: 0;*/
	    /*border-radius: 0 0 5px 5px;*/
    /*}*/
    /*.modelNews .modalFooter div{*/
	    /*width: 50%;*/
	    /*padding: 10px 0;*/
	    /*color: #fff;*/
	    /*border-radius: 0;*/
    /*}*/
    /*.modelNews .modalFooter .quxiao{*/
	    /*width:50%; */
	    /*background: #cbcbcb;*/
    /*}*/
    /*.modelNews .modalFooter .queding{*/
	     /**/
	    /*background: #ed881d;*/
    /*}*/

</style>
