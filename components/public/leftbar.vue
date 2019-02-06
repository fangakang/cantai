<template>
	<div class="body_bg">
	<div class="leftbar">
		<div class="nav">
			<div class="row n_1" data-link="/index" :data-selected="$route.name == 'home'" @click="goLink('/index')">
				<i></i>
				<p>餐台</p>
			</div>
<!-- 			<div class="row n_2" data-link="/reserve" :data-selected="$route.path == '/reserve'" @click="goLink('/reserve')">
				<i></i>
				<p>预约</p>
			</div>
 -->			<div class="row n_3" data-link="/bills" :data-selected="$route.path == '/bills'" @click="goLink('/bills')">
				<i></i>
				<p>账单</p>
			</div>
			<div class="row n_4" data-link="/order" :data-selected="$route.path == '/estimate'" @click="goLink('/estimate')">
				<i></i>
				<p>沽清</p>
			</div>
			<div class="row n_5" data-link="/order" :data-selected="$route.path == '/handover'" @click="goLink('/handover')">
				<i></i>
				<p>交班</p>
			</div>
		</div>
		<div class="bottom">
<!-- 			<div class="row network">
				<i class="fa fa-fw fa-wifi"></i>
			</div> -->
			<div class="row time">{{time}}</div>
			<div class="row date">{{date}}</div>
			<div class="row week">{{week}}</div>
		</div>
	</div>
	</div>
</template>
<script>
	export default {
		data () {
			return {
			  msg: 'Welcome to Your Vue.js App',
			  date:'',
			  time:'',
			  week:''
			}
		},
		created:function(argument) {

		},
		mounted:function(){
			this.getTime()

		},
		methods:{
			goLink:function(link){
				var that=this;
				that.$router.push(link);
			},
			getTime(){
				var that=this;
				var b=["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
				var d=["星期天","星期一","星期二","星期三","星期四","星期五","星期六"];
				var a=new Date();
					a.setDate(a.getDate());
					that.date=b[a.getMonth()]+a.getDate()+"日 ";
					that.week=d[a.getDay()];
					setInterval(function(){
				var date=new Date();
				var hour=date.getHours();
				var min=date.getMinutes();
				var sec=date.getSeconds();
					that.time=[hour, min, sec].map(formatNumber).join(':')
				},1000);

				function formatNumber(n) {
				  n = n.toString()
				  return n[1] ? n : '0' + n
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
	.leftbar{position: absolute;left: 0;top: 0;bottom: 0;background-color: rgba(0,0,0,.3);width: 100px}
	.bottom{position: absolute;bottom: 0;width: 100%;padding-bottom: 20px;    line-height: 34px;}
	.bottom .row{font-size: 20px;color: #fff;text-align: center;}
	.bottom .network{}
	.bottom .network i{font-size: 40px}
	.bottom .time{font-weight: 700}
	.bottom .date{}
	.bottom .week{}

	.nav{font-size: 20px;color: #fff}

	.nav i{font-size: 40px;color: #fff;-webkit-text-stroke: 1px rgba(0,0,0,0);}
	.nav .row{padding: 15px 0;cursor: pointer;text-align: center;}
	.nav .row:hover{background-color: rgba(252,111,0,.5);}
	.nav .row i{height: 35px;display: inline-block;width: 100%;background-repeat: no-repeat;background-position: center center}
	.nav .row p{color: #a5abc9}
	.nav .row.n_1 i{background-image: url(../../assets/n_1.png);}
	.nav .row.n_2 i{background-image: url(../../assets/n_2.png);}
	.nav .row.n_3 i{background-image: url(../../assets/n_3.png);}
	.nav .row.n_4 i{background-image: url(../../assets/n_4.png);}
	.nav .row.n_5 i{background-image: url(../../assets/n_5.png);}

	.nav .row.n_1[data-selected=true] i{background-image: url(../../assets/n_1_a.png);}
	.nav .row.n_2[data-selected=true] i{background-image: url(../../assets/n_2_a.png);}
	.nav .row.n_3[data-selected=true] i{background-image: url(../../assets/n_3_a.png);}
	.nav .row.n_4[data-selected=true] i{background-image: url(../../assets/n_4_a.png);}
	.nav .row.n_5[data-selected=true] i{background-image: url(../../assets/n_5_a.png);}

	.nav .row[data-selected=true]{background-color: rgba(252,111,0,.5);}
	.nav .row[data-selected=true] p{color: #fff}

	@media screen and (max-width: 1024px) {
	    .leftbar{
	        width:80px;
	    }
	    .bottom .row{
	    	font-size: 14px
	    }

	    .nav{font-size: 14px}
	    .nav .row{padding: 10px 0;}
	    .nav .row i{height: 30px;background-size: contain;}
	}





</style>
