<template>
	<div class="body_bg">
	<fullbg></fullbg>
	<div class="datepicker">
			<div class="wrap">
				<div class="hd">
					时间设置
				</div>
				<div class="bd clearfix">
					<div class="row">
						<span class="span" @click="changeTime('year',1)">+</span>
						<input type="text" v-model="year" name="" class="span" maxlength="4" >
						<span class="span" @click="changeTime('year',0)">-</span>
					</div>
					<div class="row">
						<span class="span" @click="changeTime('month',1)">+</span>
						<input type="text" v-model="month" name="" class="span" maxlength="2" >
						<span class="span" @click="changeTime('month',0)">-</span>
					</div>
					<div class="row">
						<span class="span" @click="changeTime('strDate',1)">+</span>
						<input type="text" v-model='strDate' name="" class="span" maxlength="2" >
						<span class="span" @click="changeTime('strDate',0)">-</span>
					</div>
					<div class="row">
						<span class="span" @click="changeTime('hour',1)">+</span>
						<input type="text" v-model="hour" name="" class="span" maxlength="2" >
						<span class="span" @click="changeTime('hour',0)">-</span>
					</div>
					<div class="row">
						<span class="span" @click="changeTime('minute',1)">+</span>
						<input type="text" v-model="minute" name="" class="span" maxlength="2" >
						<span class="span" @click="changeTime('minute',0)">-</span>
					</div>
					<div class="row">
						<span class="span" @click="changeTime('second',1)">+</span>
						<input type="text" v-model="second" name="" class="span" maxlength="2" >
						<span class="span" @click="changeTime('second',0)">-</span>
					</div>
				</div>
				<div class="ft clearfix">
					<span class="makesure fr" @click="makesure()">确定</span>
					<span class="cancel fl" @click="cancel()">取消</span>
				</div>
			</div>
	</div>
	</div>
</template>
<script>
	import fullbg from '@/components/public/fullbg'
	import publicFun from '@/js/public'

  export default {
	components:{fullbg},
	props: ['bills','date'],
    data () {
      return {
        year:new Date().getFullYear(),
        month:new Date().getMonth()+1,
        strDate:new Date().getDate(),
        hour:0,
        minute:0,
        second:0,
      }
    },

    beforecreate:function(){

    },
    created:function() {
        var that=this;

        if(that.date!=''&&that.date!=undefined&&that.date!='undefined'){
            var thisDate=new Date(that.date);
            that.year=thisDate.getFullYear();
            that.month=thisDate.getMonth()+1;
            that.strDate=thisDate.getDate();
            that.hour=thisDate.getHours();
            that.minute=thisDate.getMinutes();
            that.second=thisDate.getSeconds();
            console.log(that.year+'/'+that.month+'/'+that.strDate+'/'+that.hour+'/'+that.minute+'/'+that.second)
        }



    },
    mounted:function(){
    },
    methods:{
    	makesure:function(){
    		var that=this;

    		if(that.year<new Date().getFullYear()){
    			that.year=new Date().getFullYear()
    		}
    		if(that.month>12){
    			that.month=12
    		}

    		if(that.month<1){
    			that.month=1
    		}
    		var days=publicFun.getDaysInOneMonth(that.year,that.month);
    		if(that.strDate>days){
    			that.strDate=days
    		}
    		if(that.strDate<1){
    			that.strDate=1
    		}

    		if(that.hour>23){
    			that.hour=23
    		}


    		if(that.minute>59){
    			that.minute=59
    		}

    		if(that.second>59){
    			that.second=59
    		}


    		var date= [that.year, that.month, that.strDate].map(formatNumber).join('-') + ' ' + [that.hour, that.minute, that.second].map(formatNumber).join(':')

			function formatNumber(n) {
			  n = n.toString()
			  return n[1] ? n : '0' + n
			}


    		that.$emit("getDate",{time:date});
    		that.year='';
    		that.month='';
    		that.strDate='';
    		that.hour='';
    		that.minute='';
    		that.second='';
    	},
    	cancel:function(){
    		var that=this;
    		that.$emit("getDate",{cancel:true});

    	},
    	changeTime:function(type,x){
    		var that=this;
    		if(type=='year'){
    			if(x==1){
    				that.year+=1;
    			}else{
					if(that.bills){
						that.year-=1
					}else{
						if(that.year==new Date().getFullYear()){
							return
						}else{
							that.year-=1
						}
					}
    			}
    		}
    		if(type=='month'){
    			if(x==1){
    				that.month+=1;
    				if(that.month>=12){
    					that.month=12
    				}
                    that.strDate=1
    			}else{
					if(that.bills){
						that.month-=1
						if(that.month == 0) that.month = 12
					}else{
						if(that.month==new Date().getMonth()+1){
							return
						}else{

							that.month-=1
						}
					}

    			}
    		}
    		if(type=='strDate'){
    			var days=publicFun.getDaysInOneMonth(that.year,that.month);
    			if(x==1){

    				if(that.strDate>=days){
                        publicFun.showToast({
                            isShow:true,
                            type:2,
                            mask:false,
                            txt:'请修改月份',
                            dur:1500
                        });

	    				that.strDate=days;

    				}else{
	    				that.strDate+=1;
    				}
    			}else{
					if(that.bills){
						that.strDate-=1
						if(that.strDate < 1) that.strDate = 1
					}else{
						if(that.strDate==new Date().getDate()){
                            publicFun.showToast({
                                isShow:true,
                                type:2,
                                mask:false,
                                txt:'请修改月份',
                                dur:1500
                            });
							return;
						}else{
							that.strDate-=1
						}
					}
    			}
    		}
    		if(type=='hour'){
    			if(x==1){

    				if(that.hour>=23){
	    				that.hour=23;
    				}else{
	    				that.hour+=1;
    				}
    			}else{
    				if (that.hour==0) return;
    				that.hour-=1;
    			}
    		}
    		if(type=='minute'){
    			if(x==1){

    				if(that.minute>=59){
	    				that.minute=59;
    				}else{
	    				that.minute+=1;
    				}
    			}else{
    				if (that.minute==0) return;
    				that.minute-=1;
    			}
    		}
    		if(type=='second'){
    			if(x==1){

    				if(that.second>=59){
	    				that.second=59;
    				}else{
	    				that.second+=1;
    				}
    			}else{
    				if (that.second==0) return;
    				that.second-=1;
    			}
    		}

    	},
        filter(data){
            var that=this;
            return parseInt(JSON.stringify(data).replace(/[^\d]/g,''))
        }

    },
    beforeDestroy () {

    },
    destroyed: function() {



    },

    watch: {
    	year:function(val){
            var that=this;
            that.year=that.filter(that.year);
            if(isNaN(that.year)){
                that.year=new Date().getFullYear();
            }
    	},

        month:function(val){
            var that=this;
            //that.strDate=1;
            if(isNaN(that.month)){
                that.month=1
            }

            that.month=that.filter(that.month);
            if(parseInt(that.month)>12){
                that.month=12
            }
            if(parseInt(that.month)==0){
                that.month=1
            }


        },
        strDate:function(val,oldval){
            console.log(val +'--'+oldval)
            var that=this;
            var days=publicFun.getDaysInOneMonth(that.year,that.month);

            if(isNaN(that.strDate)){
                that.strDate=1
            }

            that.strDate=that.filter(that.strDate);
            if(parseInt(that.strDate)>days){
                that.strDate=days;
            }
            if(parseInt(that.strDate)==0){
                that.strDate=1
            }
        },
        hour:function(){
            var that=this;
            if(isNaN(that.hour)){
                that.hour=1
            }

            that.hour=that.filter(that.hour);
            if(parseInt(that.hour)>59){
                that.hour=59;
            }
            // if(parseInt(that.hour)==0){
            //     that.hour=1
            // }
        },

        minute:function(){
            var that=this;
            if(isNaN(that.minute)){
                that.minute=1
            }

            that.minute=that.filter(that.minute);
            if(parseInt(that.minute)>59){
                that.minute=59;
            }
            // if(parseInt(that.minute)==0){
            //     that.minute=1
            // }
        },

        second:function(){
            var that=this;
            if(isNaN(that.second)){
                that.second=1
            }

            that.second=that.filter(that.second);
            if(parseInt(that.second)>59){
                that.second=59;
            }
            // if(parseInt(that.second)==0){
            //     that.second=1
            // }
        },



    },
    computed: {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.datepicker{width: 600px;;position: fixed;top: 20%;left: 50%;margin-left: -300px;background-color: #fff;z-index: 13}
	.datepicker>.wrap{padding: 0 30px}
	.datepicker .hd{font-size: 25px;padding: 10px 0;text-align: center;border-bottom: 1px solid #dedee1;color: #48465b}
	.datepicker .bd .row{margin: 15px 0;float: left;width: 60px;margin: 15px;}
	.datepicker .bd .row .span{float: left;display: block;width: 100%;text-align: center;height: 50px;line-height: 50px}
	.datepicker .bd .row span.span{background-color: #91919D;font-size: 30px;color: #fff;cursor: pointer;}
	.datepicker .bd .row input.span{background-color: #fff;font-size: 16px;color: #333;border:1px solid #9D9D9D;    width: 58px;}

	.datepicker  .ft{width: 400px;margin: 0 auto;padding-bottom: 20px}
	.datepicker  .ft span{width: 150px;height: 40px;line-height: 40px;text-align: center;display: block;text-align: center;background-color: #fa8b2e;margin: 0 auto;font-size: 16px;color: #fff;cursor: pointer; border-radius: 3px;}
	.datepicker  .ft span.cancel{color: #333;background-color: #d6d6d6}
	.datepicker  .ft span.cancel:hover{ background:#fa8b2e; color:#fff}
	.fullBg{z-index: 12}

</style>
