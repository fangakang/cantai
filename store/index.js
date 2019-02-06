import Vue from 'vue'
import Vuex from 'vuex'
import publicFun from './../js/public'
Vue.use(Vuex)
// import createLogger from 'vuex/dist/logger'
// var http=Vue.http;
const store = new Vuex.Store({
    // plugins:[createLogger()],
  state: {
    searchVal:'',
    searchGroup:false,
    roleModule:{},
  	authKeep:false,
    polling:{
  	  isShow:false,
      mask:false,
      txt:'加载中',
      istxt:true
    },
    loading:{
      isShow:false,
      mask:false,
      txt:'加载中',
      istxt:true
    },
    toast:{
      isShow:false,
      mask:false,
      txt:'',
      type:0//2是警告，1是提示，3是错误操作，4是成功， 0是没有icon

    },
    modal:{
      isShow:false,
      mask:false,
      txt:'',
      confirm:{},
      cancel:''
    },
    logoutmodal:{
      isShow:false
    },
    tables:[],
    tableRemark:{},
    num:0
  },
  getters: {
    polling: state => state.polling,
    loading: state => state.loading,
    toast: state => state.toast,
    modal: state => state.modal,
    logoutmodal:state => state.logoutmodal,
    tables: state => state.tables,
    tableRemark:state=>state.tableRemark,
    roleModule:state=>state.roleModule,
    searchGroup:state=>state.searchGroup,
    searchVal:state=>state.searchVal,

  },
  mutations: {
      searchClear(state){
          state.searchVal='';
      },
      searchVisi(state,data){
        console.log(data)
        if(data==1){
          console.log(123)
          state.searchGroup=true;
        }else{
            state.searchGroup=false;
        }
      },
      roleModuleStatus(state,data){//用户角色权限
        state.roleModule=data;
      },
      updatePollingStatus(state,data){
        let polling={};
          polling.isShow=data.isShow
          if(data.mask){
              polling.mask=data.mask
          }else{

              polling.mask=false
          }
          if(data.txt){
              polling.txt=data.txt
          }else{
              polling.txt='加载中'
          }
          if(data.istxt){
              polling.istxt=data.istxt
          }else{
              polling.istxt=true
          }
          state.polling=polling
      },
      updateLoadingStatus (state, data) {
        let loading={};
          loading.isShow=data.isShow
        if(data.mask){
          loading.mask=data.mask
        }else{

          loading.mask=false
        }
        if(data.txt){
          loading.txt=data.txt
        }else{
          loading.txt='加载中'
        }
        if(data.istxt){
          loading.istxt=data.istxt
        }else{
          loading.istxt=true
        }
        state.loading=loading
      },
      updateToast (state, data) {
        let toast={};
          toast.isShow=data.isShow
        if(data.mask){
          toast.mask=true
        }else{
          toast.mask=true
        }
        if(data.txt){
          toast.txt=data.txt
        }else{
          toast.txt=''
        }
        if(data.type){
          toast.type=data.type
        }else{
          toast.type=0
        }
        state.toast=toast
      },
      updateModal (state, data) {
        let modal={};
          modal.isShow=data.isShow
        if(data.mask){
          modal.mask=true
        }else{
          modal.mask=false
        }
        if(data.txt){
          modal.txt=data.txt
        }else{
          modal.txt='确定么？'
        }
        if(data.confirm){
          modal.confirm=data.confirm
        }
        if(data.cancel){
          modal.cancel=data.cancel
        }else{
          modal.cancel=''
        }
        state.modal=modal
      },
      updateLogoutmodal (state, data) {
        //console.log(data)
        state.logoutmodal.isShow=data.isShow
      },
      tablesInput(state,{num,tid,data}){
        console.log(num)
        if(num==''){
          num=0;
        }
        data.pro_num=parseInt(num);
        state.num=num;
        publicFun.addDish(tid,data);
      },
      updateTablesDate(state,{tid,data}){
          // console.log(tid)
          console.log(data)
          if(!state.tables[tid]){
              state.tables[tid]=[];
          }
          var thisDishTid=state.tables[tid];
          var i=0;
          if((data.pro_num>data.pro_inventory)&&data.pro_isstockopen!=0){
              publicFun.showToast({
                  isShow:true,
                  type:2,
                  mask:false,
                  txt:'库存已达上限',
                  dur:1500
              })
              return false
          }

          if(thisDishTid&&thisDishTid.length>0){
              for(let k in thisDishTid){
                  if(thisDishTid[k].pro_ids==data.pro_ids&&thisDishTid[k].pro_spec==data.pro_spec&&thisDishTid[k].pro_attr==data.pro_attr){
                      if(data.pro_plimit){
                          if((thisDishTid[k].pro_num>=data.pro_plimit)&&data.pro_num!=-1){
                              publicFun.showToast({
                                  isShow:true,
                                  type:2,
                                  mask:false,
                                  txt:'限购'+data.pro_plimit+'份',
                                  dur:1500
                              })
                              return false
                          }
                      }
                      if((thisDishTid[k].pro_num+data.pro_num>data.pro_inventory)&&data.pro_isstockopen!=0){
                          publicFun.showToast({
                              isShow:true,
                              type:2,
                              mask:false,
                              txt:'库存已达上限',
                              dur:1500
                          })
                          return false
                      }
                      i++
                      thisDishTid[k].pro_num+=data.pro_num*1;
                      var unshiftData=thisDishTid[k];
                      if(thisDishTid[k].pro_num==0){
                          thisDishTid.splice(k, 1)
                      }else{
                          Vue.set(thisDishTid,k,unshiftData)
                      }
                  }
              }
              if(i==0){
                  thisDishTid.unshift(data)
              }
          }else{
              thisDishTid.unshift(data)
          }
          Vue.set(state.tables,tid,thisDishTid)
      },
      clearTableDate(state,tid){
          Vue.set(state.tables,tid,[])
          state.tableRemark[tid]=''
      },
      updateRemark(state,{tid,data}){
        state.tableRemark[tid]=data;
        // console.log(state.tableRemark)
      }

  },
  actions: {
    uploadimg({commit}, data) {

    }
  }
})
export default store
