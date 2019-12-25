// pages/order/index.js
//引入自己封装的myAxios组件 
const app =getApp()
//引入async和await
import regeneratorRuntime, { values } from '../../lib/runtime/runtime';
Page({
  data:{
    list:['全部','待付款','已付款','退款/退货'],
    isShow:0,
    orderList:[],
    hasPay:[]
  },
  //点击顶部的筛选按钮
  chose(e){
    //获取所点击的索引值
    let {index}=e.currentTarget.dataset
    console.log(index);
    this.setData({
      isShow:index
    })
  },
  //从本地存储中获取数据
  onShow(){
    let orderList=wx.getStorageSync('cart')||[];
    let hasPay=wx.getStorageSync('hasPay')||[];
    //将时间戳转化为年月日
    let arr =hasPay.map(v=>{
      let data=new Date(v.create_time*1000)
      let year=data.getFullYear()
      let month=data.getMonth()+1
      let days=data.getDate()
      let hours=data.getHours()
      let mins=data.getMinutes()
      let sec=data.getSeconds()
      if(days<10){
        days='0'+days
      }
      if(month<10){
        month= '0'+month
      }
      if(hours<10){
        hours= '0'+hours
      }
      if(mins<10){
        mins= '0'+mins
      }
      if(sec<10){
        sec= '0'+sec
      }
      v.create_time=year+'/'+month+'/'+days+' '+hours+':'+mins+':'+sec
      return v
    })
    console.log(new Date(1577282874));
    this.setData({
      orderList,hasPay
    })
  },
  //点击未支付的订单，跳转到支付页面
  toPay(e){
    // console.log(e);
    let {index}=e.currentTarget.dataset
    let {orderList}=this.data
    let newOrderList=orderList.map((v,i)=>{
      if(i===index){
        v.goods_selected=true
      }
      return v
    })
    //存到本地存储去
    wx.setStorageSync('cart', newOrderList);
    //然后跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    });
  },
  //从user页面跳过来时，获取参数
  onLoad(options){
    //获取传过来的参数
    let {index}=options
    let {isShow}=this.data
    console.log(index);
    if(+index===0){
      this.setData({
        isShow:1
      })
    }
    if(+index===1){
      this.setData({
        isShow:2
      })
    }
    if(+index===2){
      console.log(123);
      this.setData({
        isShow:3
      })
    }
    if(+index===3){
      this.setData({
        isShow:0
      })
    }
  }
})