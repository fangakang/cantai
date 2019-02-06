import store from '../store'
var publicFun={};


publicFun.setInterval = null;

publicFun.timer=function(fn){
    if(!navigator.onLine){
        return;
    }
    clearInterval(publicFun.setInterval);
    publicFun.setInterval=setInterval(function() {
        fn();
    }, 5000)
};
publicFun.globalTip=function(textTip,that){
      var t=null
        that.tiptext=textTip
        that.tipShow=true;
        t=setTimeout(function(){
            that.tipShow=false;
        },1000)
        return
} 
publicFun.getQueryString = function(name, url) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = url.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
};


publicFun.fetch=function(key){
    return JSON.parse(window.localStorage.getItem(key))
};
publicFun.save=function(key,val){
        window.localStorage.setItem(key,JSON.stringify(val))
};
publicFun.remove=function(key){
        window.localStorage.removeItem(key)
};
publicFun.sesfetch=function(key){
    return JSON.parse(sessionStorage.getItem(key))
};
publicFun.sessave=function(key,val){
        sessionStorage.setItem(key,JSON.stringify(val))
};
publicFun.sesremove=function(key){
        sessionStorage.removeItem(key)
};
publicFun.showToast=function(data,that){
        store.commit('updateToast', data);
        if(data.dur&&data.dur!=''){
            window.setTimeout(function(){
                publicFun.hideToast();                
            },1500)
        }
};
publicFun.showModal=function(data,that){
        store.commit('updateModal', data);
};
publicFun.hideToast=function(){
        store.commit('updateToast', {isShow:false})
};

publicFun.hideModal=function(){
        store.commit('updateModal', {isShow:false})
};
publicFun.addDish=function(tid,data){
        store.commit('updateTablesDate',{tid,data})
};
publicFun.dishInput=function (num,tid,data) {
    store.commit('tablesInput',{num,tid,data})
};
publicFun.commitRemark=function(tid,data){
        store.commit('updateRemark',{tid,data})
};



publicFun.setDate = function(date) {
    var date = new Date(date * 1000);
    var seperator1 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var strDate1 = date.getMinutes();
    var seperator2 = ":";
    if (strDate1 >= 0 && strDate1 <= 9) {
        strDate1 = "0" + strDate1;
    }
    var getSeconds = date.getSeconds();

    if (getSeconds >= 0 && getSeconds <= 9) {
        getSeconds = "0" + getSeconds;
    }
    var getHours = date.getHours();

    if (getHours >= 0 && getHours <= 9) {
        getHours = "0" + getHours;
    }
    return date.getFullYear() + seperator1 + month + seperator1 + strDate + ' ' + getHours + seperator2 + strDate1 + seperator2 + getSeconds;
};
publicFun.setDateDay = function(date) {
    if ((date != '') && date) {
        date = new Date(date * 1000)
    } else {
        date = new Date()
    }

    var seperator1 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var strDate1 = date.getMinutes();
    var seperator2 = ":";
    if (strDate1 >= 0 && strDate1 <= 9) {
        strDate1 = "0" + strDate1;
    }
    return date.getFullYear() + seperator1 + month + seperator1 + strDate

};
publicFun.setDateTime = function(date) {
    var date = new Date();
    var seperator1 = "-";
    var hours = date.getHours();
    var seconds = date.getSeconds();
    var strDate1 = date.getMinutes();
    if (hours >= 1 && hours <= 9) {
        hours = "0" + hours;
    }
    if (seconds >= 0 && seconds <= 9) {
        seconds = "0" + seconds;
    }

    var seperator2 = ":";
    if (strDate1 >= 0 && strDate1 <= 9) {
        strDate1 = "0" + strDate1;
    }
    var getSeconds = date.getSeconds();

    if (getSeconds >= 0 && getSeconds <= 9) {
        getSeconds = "0" + getSeconds;
    }
    return hours + seperator2 + strDate1 + seperator2 + getSeconds;

};
publicFun.getNowFormatDate = function(that) { //获取日期时间
    var getNowFormatDate = {}
    getNowFormatDate.currentdate = function() {
        var date = new Date();
        var seperator1 = "-";

        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        return date.getFullYear() + seperator1 + month + seperator1 + strDate;
    }
    getNowFormatDate.currentTime = function() {
        var date = new Date();
        var strDate = date.getMinutes();
        var seperator2 = ":";
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        return date.getHours() + seperator2 + strDate + seperator2 + date.getSeconds()
    }
    that.setData({
        date: getNowFormatDate.currentdate(),
        time: getNowFormatDate.currentTime()
    })
};

//判断指定年份的某个月的天数
publicFun.getDaysInOneMonth = function getDaysInOneMonth(year, month){  
  month = parseInt(month, 10);  
  var d= new Date(year, month, 0);  
  return d.getDate();  
};

//判断是否为数字
publicFun.isNumber=function(val){
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if(regPos.test(val) || regNeg.test(val)){
        return true;
    }else{
        return false;
    }

};
//检测正负数
publicFun.isIntNum=function(val){
    var regPos = / ^\d+$/; // 非负整数
    var regNeg = /^\-[1-9][0-9]*$/; // 负整数
    if(regPos.test(val) || regNeg.test(val)){
        return true;
    }else{
        return false;
    }
};

publicFun.txtTime=function(data){
    var date = publicFun.setDate(data).toString();
   var year = date.substring(0,4);
   var month = date.substring(5,7);
   var day = date.substring(8,10);
   var hour = date.substring(11,13);
   var minute = date.substring(14,16);
   // var createTime = year + "-" + month + "-" + day + " "+hour+":"+minute;
   var createTime = hour+":"+minute;
   var date3 = publicFun.GetDateStr(-1);//昨天
   var str3=date3.split("-");
   str3[1]=str3[1].length == 1 ? '0'+str3[1]:str3[1];
   str3[2]=str3[2].length == 1 ? '0'+str3[2]:str3[2];
   
   var date0 = publicFun.GetDateStr(0);//今天
   var str0=date0.split("-");
   str0[1]=str0[1].length == 1 ? '0'+str0[1]:str0[1];
   str0[2]=str0[2].length == 1 ? '0'+str0[2]:str0[2];
   
   var date1 = publicFun.GetDateStr(1);//明天
   var str1=date1.split("-");
   str1[1]=str1[1].length == 1 ? '0'+str1[1]:str1[1];
   str1[2]=str1[2].length == 1 ? '0'+str1[2]:str1[2];


   var date2 = publicFun.GetDateStr(2);//后天
   var str2=date2.split("-");
   str2[1]=str2[1].length == 1 ? '0'+str2[1]:str2[1];
   str2[2]=str2[2].length == 1 ? '0'+str2[2]:str2[2];
   
   if(year == str3[0] && month == str3[1] && day == str3[2]){
       return "昨天"+ " "+hour+":"+minute
   }else if(year == str0[0] && month == str0[1] && day == str0[2]){
       return "今天"+ " "+hour+":"+minute
   }else if(year == str1[0] && month == str1[1] && day == str1[2]){
       return "明天"+ " "+hour+":"+minute
   }else if(year == str2[0] && month == str2[1] && day == str2[2]){
       return "后天"+ " "+hour+":"+minute       
   }else{
       return createTime;
   }
};
publicFun.GetDateStr=function(AddDayCount) { 
    var dd = new Date(); 
    dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期 
    var y = dd.getFullYear(); 
    var m = dd.getMonth()+1;//获取当前月份的日期 
    var d = dd.getDate(); 
    return y+"-"+m+"-"+d; 
}

export default publicFun