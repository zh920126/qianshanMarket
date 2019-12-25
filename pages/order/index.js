// pages/order/index.js
//引入自己封装的myAxios组件 
const app =getApp()
//引入async和await
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data:{
    list:['全部','待付款','已付款','退款/退货'],
    isShow:0
  },
  //点击顶部的筛选按钮
  chose(e){
    //获取所点击的索引值
    let {index}=e.currentTarget.dataset
    console.log(index);
    this.setData({
      isShow:index
    })
  }
})