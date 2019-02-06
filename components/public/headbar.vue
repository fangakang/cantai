<template>
	<div class="body_bg">
	<div class="header">
		<div class="fr userStatus">
			<div class="userStatusWrap"><i class="fa fa-fw fa-user"></i><em>{{eusername}}</em><i class="fa fa-fw fa-caret-down"></i>
				<div class="userStatusCtrl">
					<!-- <div class="row"><i class="change"></i><em>切换用户</em></div> -->
					<div class="row" @click="logOut()"><i class="signOut"></i><em>安全退出</em></div>
				</div>
			</div>


		</div>
		<div v-if="searchShow" class="searchPart">
			<input  placeholder="支持简拼、中文搜索" v-model="search" type="text" v-on:input="searchTarget"/>
			<img v-if="search" @click="deleteSearch" class="deleteIcon" src="../../assets/delectIcon.png" alt="">
		</div>
		<!--<span class="fr refresh" @click="refresh">-->
			<!--<i class="fa fa-fw fa-refresh"></i>-->
		<!--</span>-->
<!-- 		<div class="title"><span>火锅</span><i></i></div>
 -->		<div class="title"><span>{{storename}}</span></div>

	</div>
	</div>
</template>
<script>
	import publicFun from '@/js/public'
	import store from '@/store'
	import http from '@/js/http.js'

	export default {
		store,
		data () {
			return {
			  	msg: 'Welcome to Your Vue.js App',
			  	storename:'',
			  	eusername:'',
				search:'',
				searchShow:false
			}
		},
		created:function(argument) {

		},
		mounted:function(){
			var that=this;
			that.storename=publicFun.fetch('storename')
			that.eusername=publicFun.fetch('eusername')
			that.searchShow=store.state.searchGroup;
		},
		methods:{
            deleteSearch(){
                var that=this;
                that.search='';
                that.searchTarget();
			},
            searchTarget(){
				var that=this;
				that.$emit('childEvent',that.search)
			},
			logOut:function(){

				store.commit('updateLogoutmodal', {isShow:true})

				publicFun.remove('isLogIn');
                publicFun.remove('roleModule');
				// this.$router.replace(`/login`);

			},
			refresh(){
				var that=this;
				that.$router.go(0)

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
	.searchPart{float: right;top:25px;position: relative}
	.searchPart input{line-height:40px;font-size:15px;background:url('../../assets/search.png');background-size:20px 20px;background-repeat:no-repeat;background-position:8px 10px;background-color:#fff;padding-left:35px;border:none;width:230px;padding-right: 40px; border-radius: 3px}
	.deleteIcon{width:40px;height:40px;position: absolute;right: 0;top: 0;cursor: pointer;}
	.header{height: 80px;width: 100%;position: relative;z-index: 3}
	.header .title{text-align: left;line-height: 80px}
	.header .title span{font-size: 28px;color: #fff;vertical-align: middle;margin-right: 15px}
	.header .title i{display: inline-block;width: 46px;height: 46px;background: url(../../assets/keybordbtn.png);vertical-align: middle;}
	.userStatus{margin-right: 35px;position: relative;cursor: pointer;}

	.userStatusWrap{line-height: 80px;font-size: 24px;color: #fff;height: 80px;position: relative;}

	.userStatusWrap i.fa-user{font-size: 26px;vertical-align: middle;}
	.userStatusWrap i.fa-caret-down{font-size: 24px;vertical-align: middle;}
	.userStatusWrap em{vertical-align: middle;}
	.userStatusCtrl{position: absolute;top: 78px;font-size: 16px;color: #fff;text-align:center;background-color: #474957;width: 100%;display: none;padding: 0 15px;min-width: 124px;box-sizing: border-box;-webkit-box-sizing:border-box;-o-box-sizing: border-box;-moz-box-sizing: border-box;-ms-box-sizing: border-box;right: 0;}
	.userStatusCtrl .row{height: 55px;border-bottom: 1px solid #5a5c68;line-height: 55px;cursor: pointer;}
	.userStatusCtrl .row:last-child{border-bottom: 0}
	.userStatusCtrl i{vertical-align: middle;width: 16px;height: 16px;display: inline-block;background-repeat: no-repeat;background-position: center center;margin-right: 10px;}
	.userStatusCtrl i.change{background-image:url(../../assets/change.png);}
	.userStatusCtrl i.signOut{background-image:url(../../assets/signout.png);}
	.userStatus:hover .userStatusCtrl{display: block;}

	.refresh{height:80px;line-height: 80px;color: #fff;font-size: 20px;margin-right: 20px;cursor: pointer;}
	.userStatusCtrl::before{content: '';display: block;border:10px solid transparent;border-bottom-color: #474957;position: absolute;width: 0px;height: 0px;left: 50%;top: -18px;margin-left: -5px;}

	@media screen and (max-width: 1024px) {
		.header{height: 60px;}
		.header .title{line-height: 60px}
		.header .title span{font-size: 24px;}
		.userStatusWrap{line-height: 60px;height: 60px}
		.userStatusWrap i.fa-user{font-size: 20px;}
		.userStatusWrap i.fa-caret-down{font-size: 18px;}

		.userStatusCtrl{top: 50px}

		.refresh{height: 60px;line-height: 60px;}

	}
	@media screen and (max-width: 1280px) {
		.searchPart{top:15px;}
		.searchPart input{line-height:35px;font-size:14px;background-position:8px 6px;padding-left:35px;padding-right: 35px;}
		.deleteIcon{width:35px;height:35px;}
		.header{height: 60px;}
		.header .title{line-height: 60px}
		.header .title span{font-size: 22px;}
		.userStatusWrap{line-height: 60px;height: 60px}
		.userStatusWrap i.fa-user{font-size: 20px;}
		.userStatusWrap i.fa-caret-down{font-size: 18px;}

		.userStatusCtrl{top: 60px}
		.refresh{height: 60px;line-height: 60px;}


	}
	@media screen and (max-width:1024px) {
		.userStatusWrap{font-size: 18px;}
		.header .title span{font-size: 22px;}
	}



</style>
