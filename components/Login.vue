<template>
<div class="loginBg">
		<!--<div class="logoImg">-->
			<!--小猪餐饮收银台-->
		<!--</div>-->

	<div class="login" ref="login">
		<div class="subLoginLogo"></div>
		<div class="formWrap">
			<div class="formInnerWrap">
				<div class="thisForm">
					<div class="formHd">
						<h3>员工登录</h3>
						<p>
							<span></span>
						</p>
					</div>
					<div class="form">
						<div class="row">
							<div class="fr del" v-if="usename!=''"  @click="del('usename')">
								<i class="fa fa-fw fa-close"></i>
							</div>
							<div class="fl fontWrap">
								<i class="fa fa-fw fa-user-o"></i>
							</div>
							<div class="inputWrap">
								<input type="text" name="" v-model="usename" placeholder="请输入员工帐号" @keyup="fnKeyUp($event,'usename')" @keyup.enter="loginEnter('usename')" tabindex=1 ref="usename">
							</div>
						</div>
						<div class="row">
							<div class="fr del" v-if="pwd!=''" @click="del('pwd')" >
								<i class="fa fa-fw fa-close"></i>
							</div>
							<div class="fl fontWrap">
								<i class="fa fa-fw fa-key"></i>
							</div>
							<div class="inputWrap">
								<input type="password" name="" v-model="pwd" placeholder="请输入密码" @keyup="fnKeyUp($event,'pwd')" @keyup.enter="loginEnter('pwd')" tabindex=2 ref="pwd">
							</div>
						</div>
						<!-- 			<div class="row">
										<div class="fl fontWrap">
											<i class="fa fa-fw  fa-shopping-bag"></i>
										</div>
										<div class="storeSelect">
											<span class="fr arrow">
												<i class="fa fa-caret-down fa-fw"></i>
											</span>
											<div class="ofh">
												<div class="thisSelect">
													<em>点击更换门店</em>
												</div>
											</div>
										</div>
									</div>
						 -->
					</div>
					<div class="row rememberRow">
						<label><input type="checkbox" v-model="iskeep" name=""><i class="fa" :class="iskeep?'fa-check-square':'fa-square-o'"></i><em>记住密码</em></label>
					</div>
					<div class="subBtn" @click="loginFn()">
						登录
					</div>
				</div>
			</div>
		</div>
	</div>

	<fullbg v-if="bgshow"></fullbg>
	<div class="selectStore" v-if="isstorelists">
		<div class="wrap">

			<div class="hd">
				选择门店
			</div>
			<div class="stores">
				<ul class="clearfix">
					<li v-for="(item,index) in storelists" @click="choosestore(item.store_id,index)">
						<div class="wrap">
						<i class="fa fa-w" :class="selectedIndex==index?'fa-dot-circle-o':'fa-circle-o'"></i><em>{{item.store_name+' '+item.branch_name}}</em>
						</div>
					</li>
				</ul>
			</div>

			<div class="ft clearfix">
				<span class="makesure" @click="storeMakeSure">确定</span>
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
	import fullbg from '@/components/public/fullbg'

	export default {
		store,
		components:{fullbg},
		data () {
			return {
			  msg: 'Welcome to Your Vue.js App',
			  usename:'',
			  pwd:'',
			  iskeep:false,
			  isstorelists:false,
			  bgshow:false,
			  storelists:[],
			  selectedIndex:999999999999999,
			  selectedId:0,
			}
		},
		created:function(argument) {

		},
		mounted:function(){
			var that=this;
			console.log(window.localStorage.isLogIn)
	        //clearInterval(publicFun.setInterval);
			//查看是否登录过了
		    if(publicFun.fetch('isLogIn')){
		        that.sucisShow=true;
		        that.sucText='您正在登录中，即将进入系统';
		        setTimeout(function () {
		            that.$router.replace('/index');
		        },2000);
		    }
			//查看是否保存过帐号密码
			var iskeepPassWord=publicFun.fetch('iskeepPassWord');
			if(iskeepPassWord){
				that.usename=iskeepPassWord.usename;
				that.pwd=iskeepPassWord.pwd;
				that.iskeep=true
			}
		},
		methods:{

			del(type){
				if(type=='pwd'){
					this.pwd=''
				}else if(type=='usename'){
					this.usename=''
				}
			},
			fnKeyUp(e,type){
				if(type=='pwd'){
					this.pwd=this.pwd.replace(/[, ]/g,'')
				}else if(type=='usename'){
					this.usename=this.usename.replace(/[, ]/g,'')
				}
			},
			loginEnter(e){
				var that=this;
				// if(e=='usename'){
				// 	that.$refs.pwd.focus();
				// }else{
					that.loginFn();
				//}

			},
			loginFn(){
				var that=this;
				console.log(that.usename.indexOf('@'));


				if(that.usename==''||that.pwd==''){
					publicFun.showToast({
						isShow:true,
						type:2,
						mask:false,
						txt:'帐号或者密码不得为空',
						dur:800
					})
					return
				}


				if(that.usename.indexOf('@')<0){
					publicFun.showToast({
						isShow:true,
						type:2,
						mask:false,
						txt:'当前不支持商家账号登录，请使用员工账号登录',
						dur:800
					})
					return
				}

				var data={
					usename:that.usename,
					pwd:that.pwd
				}
		      http.login('index.php?g=Home&m=repastPcApi&a=login',data,'loginCallBack',that);
			},
			loginCallBack(res){
				var that=this;
				if(res.idtoken){
				    publicFun.save('idtoken',res.idtoken);
				}else if(res.datas.token){
				    publicFun.save('idtoken',res.datas.idtoken);
				}
			    publicFun.save('token',res.datas.token);
			    publicFun.save('eusername',res.datas.eusername);
			    if(res.datas.roleModule){
                    publicFun.save('roleModule',res.datas.roleModule);
                }
			    if(res.datas.store){
				    publicFun.save('storename',res.datas.store.store_name+' '+res.datas.store.branch_name);
			    }
				//判断是否需要保存帐号密码
				if(res.datas.store_id>0&&res.datas.cid>0){
		              console.log(6688)
					// publicFun.save('isLogIn',true)
                    publicFun.save('isLogIn',true)
					if(that.iskeep){
						let data={
							usename:that.usename,
							pwd:that.pwd
						}
						publicFun.save('iskeepPassWord',data);
					}else{

						publicFun.remove('iskeepPassWord');
					}

					publicFun.showToast({
						isShow:true,
						type:4,
						mask:true,
						txt:res.msg==''?'登录成功':res.msg
					})
					publicFun.save('cid',res.datas.cid)
					window.setTimeout(function(){
						publicFun.hideToast();
						that.$router.replace(`/index`);
					},1000)

		              console.log(6688)
				}

				if(res.datas.storelist&&res.datas.storelist.length>1 &&!res.datas.store_id>0&&!res.datas.cid>0){
					that.storelists=res.datas.storelist;
					// that.storelists=[{	//此名员工所属的可用门店列表
					// 					"store_id": "284",	//门店id （卡券系统的）
					// 					"store_name": "中央公园",	//门店名称 （卡券系统的）
					// 					"branch_name": "",	//门店分支名称 （卡券系统的）
					// 					"telephone": "15566667777",	//门店联系电话 （卡券系统的）
					// 					"pt_store_logo": ""	//门店logo （卡券系统的）
					// 				}, {
					// 					"store_id": "309",
					// 					"store_name": "东风公园",
					// 					"branch_name": "",
					// 					"telephone": "13388880000",
					// 					"pt_store_logo": ""
					// 				}, {
					// 					"store_id": "320",
					// 					"store_name": "人民艺术剧院",
					// 					"branch_name": "",
					// 					"telephone": "13566662221",
					// 					"pt_store_logo": ""
					// 				}];
					this.bgshow=true;
					this.isstorelists=true
				}else{

					this.selectedId=res.datas.storelist[0].store_id;
				    publicFun.save('storename',res.datas.storelist[0].store_name);
					that.storeMakeSure();
				}
			},
			choosestore(id,index){
				this.selectedId=id;
				this.selectedIndex=index
			},
			storeMakeSure(){
				var that=this;
				let data={
					store_id:that.selectedId
				}
			      http.post('index.php?g=Home&m=repastPcApi&a=chooseShop',data,'loginCallBack',that);
			},
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
	body{width: 100%; height: 100%; background:none}
	/*.loginBg{width: 100%; height: 100%}*/
	.loginBg{width: 100%;background: url(../assets/loginbg.jpg) no-repeat;background-size: cover;height: 100%}
	.login{width: 700px;margin: 0 auto;position: relative;top: 160px}
	.logoImg{background: url(../assets/logo.png) no-repeat center;height:59px;width: 354px;margin: 0 auto;line-height: 999999999999;overflow: hidden;    margin-bottom: 50px;position: absolute;top: 50px;left: 50px;background-size: contain;}
	.subLoginLogo{height: 35px;width: 100%;background:url(../assets/subloginlogo.png) no-repeat top center;background-size: contain;}

	.formWrap{background:rgba(255,255,255,.4);padding: 20px;border-radius: 5px;margin-top: 50px}
	.formInnerWrap{background-color: #fff;border-radius: 5px;background-color: #fff;overflow: hidden;}
	.thisForm{padding: 50px}
	.formHd{}
	.formHd h3{font-size: 28px;color: #40454b;text-align: center;}
	.formHd p{text-align: center;margin-top: 15px}
	.formHd p span{width: 58px;height: 8px;background-color: #d2e6ff;border-radius: 20px;display: inline-block;}

	.login .form{width: 100%}
	.login .form .row{border: 1px solid #ddd;overflow: hidden;border-radius: 5px;margin-top: 34px}
	.login .form .fontWrap{overflow: hidden;line-height: 70px;padding: 0 15px}
	.login .form .fa{font-size: 40px;color: #c3c3c3;vertical-align: middle;padding:0 10px;border-right: 1px solid #ddd;;}
	.login .form .inputWrap{overflow: hidden;}
	.login .form .row input[type=text],.login .form .row input[type=password]{font-size: 24px;color: #999;width: 100%;border:0;height: 70px;text-align: left;}
	.login .form .del{overflow: hidden;line-height: 70px;padding: 0 5px;cursor: pointer;}
	.login .form .del .fa{color:#c3c3c3;font-size: 22px;border: 0}

	.login .form .storeSelect .arrow{height: 70px;line-height: 70px}
	.login .form .storeSelect .arrow i{vertical-align: middle;}
	.login .form .storeSelect .thisSelect em{line-height: 70px;font-size: 24px;color: #999;text-align: left;display: inline-block;width: 100%;cursor: pointer;}
	.login .form .storeSelect .thisSelect{}
	.login .rememberRow{text-align: left;padding: 20px 0}
	.login .rememberRow label{font-size: 24px;color: #fff}
	.login .rememberRow label em{margin-left: 5px;color: #333}
	.login .rememberRow label em,	.login .rememberRow label .fa{vertical-align: middle;}
	.login .rememberRow label .fa{color: #c3c3c3;width: 24px;overflow: hidden;display: inline-block;margin-top: 2px}
	.login .rememberRow label input{opacity: 0;width: 1px;overflow: hidden;}
/*	.subBtn{height: 78px;line-height: 78px;text-align: center;;background-color: #fa9139;font-size: 32px;color: #fff}
	.subBtn:hover{background-color: #FA8E3B}
*/
	.subBtn {
	  background: #6abcaa;
	  color: #ffffff;
	  font-size: 32px;
	  width: 100%;
	  margin: 0 auto;
	  border-radius: 50px;
	height: 78px;line-height: 78px;text-align: center; cursor: pointer;margin-top: 20px;
	}

	.subBtn:hover {
	  color: #ffffff;
	  background: #579386;
	}
	.selectStore{width: 848px;;position: fixed;top: 20%;left: 50%;margin-left: -424px;background-color: #fff;z-index: 10}
	.selectStore .wrap{padding: 0 55px}
	.selectStore .hd{font-size: 30px;padding: 15px 0;text-align: center;border-bottom: 1px solid #dedee1;color: #48465b}
	.selectStore  .ft{padding: 20px 0 40px 0}
	.selectStore  .ft span{width: 100%;height: 60px;line-height: 60px;text-align: center;display: block;text-align: center;background-color: #fa8b2e;margin: 0 auto;font-size: 24px;color: #fff}
	.selectStore  .stores{}
	.selectStore  .stores ul{padding-left: 50px;margin-top: 15px;max-height: 300px;overflow: auto;}
	.selectStore  .stores ul li{width: 50%;float: left;    white-space: nowrap;overflow: hidden;}
	.selectStore  .stores ul li .wrap{padding: 8px 20px}
	.selectStore  .stores ul li em{font-size: 16px;vertical-align: middle;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;display: inline-block;max-width: 200px}
	.selectStore  .stores ul li i{font-size: 20px;vertical-align: middle;margin-right: 5px}
	.selectStore  .stores ul li i.fa-dot-circle-o{color: #fa8b2e}


	@media screen and (max-height:840px){
		.subBtn{height: 50px;line-height: 50px;font-size: 28px;}
		.login .form .row input[type=text],.login .form .row input[type=password]{height: 50px;}
		.login .form .fontWrap,.login .form .del{line-height: 50px;}
		.login .form .row{margin-top: 26px;}
		.formWrap{margin-top: 30px;}
	}
	@media screen and (max-width:1366px) {
		.login{width:600px;}
		.thisForm{padding:40px;}
		.logoImg{width: 280px;}
		.login{width:520px;}
		.login .form .fa{font-size: 30px;}
		.login .form .row input[type=text],.login .form .row input[type=password]{height: 42px;font-size: 20px;}
		.login .form .fontWrap,.login .form .del{line-height: 42px;}


	}
	@media screen and (max-height:800px){
		.subBtn{height: 50px;line-height: 50px;font-size: 22px;}
		.login .form .row input[type=text],.login .form .row input[type=password]{height: 42px;font-size: 20px;}
		.login .form .fontWrap,.login .form .del{line-height: 40px;}
		.login .form .row input[type=text],.login .form .row input[type=password]{font-size: 20px;}
		.login .form .fontWrap{line-height: 40px;}
		.login .form .fa{font-size: 30px;}
		.login .rememberRow label{font-size: 20px;}
		.login{top: 110px;}
		.logoImg{top: 20px;}
		.thisForm{padding: 40px 40px 20px}
		.subBtn{margin-top: 0;}
	}
	@media screen and (max-width:1280px){
		.login .rememberRow label em{font-size: 16px;}
		.login .form .fontWrap,.login .form .del{line-height: 42px;}
		.subBtn{font-size: 20px;height: 50px;line-height: 50px}

	}
	@media screen and (max-width: 1024px){
		.subBtn{font-size: 20px;height: 40px;line-height: 40px}
		.login .form .row input[type=text],.login .form .row input[type=password]{height: 42px;font-size: 18px;}
		.login .form .row input[type=text],.login .form .row input[type=password]{font-size: 20px;}
		.subBtn{height: 50px;line-height: 50px;font-size: 24px;}
	}
	@media screen and (max-width:1280px){
		.login .rememberRow label em{font-size: 16px;}
		.subBtn{font-size: 22px;}
	}
	@media screen and (max-width: 1024px){
		.subBtn{font-size: 20px;}
		.login .form .row input[type=text],.login .form .row input[type=password]{font-size: 18px;}
		.login .form .fa{font-size: 26px;}
		.login .form .fontWrap,.login .form .del{line-height: 42px;}

	}
</style>
