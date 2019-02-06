<template>
	<div class="body_bg">
		<div class="mianWrap">
			<leftbar></leftbar>
			<div class="mian">
			        <router-view>
			        </router-view>
			</div>
		</div>
	</div>
</template>
<script>
	import leftbar from '@/components/public/leftbar'
	export default {
		components:{leftbar},
		data () {
			return {
			  msg: 'Welcome to Your Vue.js App'
			}
		},
		created:function(argument) {

		},
		mounted:function(){

		},
		methods:{

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
	.mianWrap{position: absolute;top: 0;left: 0;right: 0;bottom: 0;}
	.mian{position: absolute;left: 100px;top: 0;right: 0;bottom: 0;margin-left: 16px}

	@media screen and (max-width: 1024px) {

		.mian{left: 80px}


	}

</style>
