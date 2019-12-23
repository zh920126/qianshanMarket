// pages/cart/index.js
//引入封装的axios
const app=getApp()
//引入await和async
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data:{
    //获取用户信息数据
    userMessage:{},
    //获取用户的加入购物车的数据，渲染页面
    cartList:[]
  },
  //获取用户数据，并将数据改为.00
  async getNum(){
    let cartList=await wx.getStorageSync('cart')||[]
    let newCartList=cartList.map(v=>{
      v.goods_price=v.goods_price.toFixed(2)
      return v
    })
    this.setData({
      cartList:newCartList
    })
  },
  //点击-时
  reduce(e){
    //获取点击的哪一项的索引值
    let {index,count}=e.currentTarget.dataset
    console.log(count);
  },
  //点击+时
  add(e){
    //获取点击的哪一项的索引值
    let {index}=e.currentTarget.dataset
    // console.log(index);
  },
  //点击结算按钮，跳转到支付页面
  toOrder(){
    console.log(123);
    wx.navigateTo({
      url:'/pages/order/index'
    })
  },
  //获取用户地址
  onGotUserInfo(e){
    // console.log(e);
    //获取用户授权后，获取到地址信息
    wx.chooseAddress({
      success: (res)=>{
        //将用户信息赋值，用于渲染页面
        console.log(res);
        this.setData({
          userMessage:res
        })
      }
    });
  },
  //页面一加载就能调用封装的函数进行赋值
  onLoad(){
    this.getNum()
  }
})