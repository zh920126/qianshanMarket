// pages/user/index.js
//index.js
//获取应用实例
const app = getApp()
//使用async和await
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    //定义变量用来渲染用户收藏信息
    collect:[
      {name:'收藏的店铺',count:0},
      {name:'收藏的商品',count:0},
      {name:'关注的商品',count:0},
      {name:'我的足迹',count:0}
    ],
    //定义变量渲染我的订单部分
    order:[
      {name:'待付款',icon:'icon-daifukuan' },
      {name:'待收货',icon:'icon-daishouhuo01'},
      {name:'退款/退货',icon:'icon-icon'},
      {name:'全部订单',icon:'icon-quanbudingdan'}
    ]
  },
  //获取用户登录授权
  getUserInfo(e){
    console.log(e);
    let {detail}=e
    let {userInfo}=detail
  //  console.log(detail); 
  //  console.log(userInfo);
  //  判断时候已经获取到了用户信息
    if(userInfo){
      this.setData({
        hasUserInfo:true,
         userInfo
      })
      //判断有了之候，发起请求获取code
      //调用微信登录获取code
      wx.login({
        success: (res)=>{
          console.log(res);
          let {code}=res
          // console.log(code);
          //在获取code之后发送请求获取token
          app.myAxios({
            method:'post',
            url:"/users/wxlogin",
            data:{
              encryptedData:detail.encryptedData,
              rawData:detail.rawData,
              iv:detail.iv,
              signature:detail.signature,
              code:code
            }
          }).then(res=>{
            console.log(res);
            //将token存起来
            wx.setStorageSync('token', res.token);
          })
        }
      });
    }
    //同时将用户信息存储到本地存储中去
    wx.setStorageSync('userInfo', userInfo);
  },
  //页面打开时，验证是否已经登录
  onShow(){
    //页面 一打开就需要获取用户信息
    let userInfo=wx.getStorageSync('userInfo');
    console.log(userInfo);
    //如果已经登录
    if(userInfo){
      this.setData({
        hasUserInfo:true,
        userInfo
      })
    }
  }
})
