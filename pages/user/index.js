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
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        } 
      })
    }
    //页面打开就需要获取数据，用来渲染页面
    let count=wx.getStorageSync('collect').length;
    // console.log(count);
    let arr=this.data.collect.map((v,i)=>{
      if(i===1){
        v.count=count
      }
      return v
    })
    // console.log(arr);
    this.setData({
      collect:arr
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
