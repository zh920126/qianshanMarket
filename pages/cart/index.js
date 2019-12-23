// pages/cart/index.js
//引入封装的axios
const app=getApp()
//引入await和async
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data:{
    //获取用户信息数据
    userAddress:wx.getStorageSync('userAddress')||{},
    //获取用户的加入购物车的数据，渲染页面
    cartList:wx.getStorageSync('cart')||[]
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
  //点击结算按钮，跳转到支付页面
  toOrder(){
    console.log(123);
    wx.navigateTo({
      url:'/pages/order/index'
    })
  },
  //获取用户地址信息
  getUserAddress(){
    // 先验证用户的授权状态
    wx.getSetting({
      success: (res)=>{
        console.log(res);
        // 当用户的授权状态为取消时--false，调用微信接口让用户打开调用地址
        if(res.authSetting['scope.address']===false){
          wx.openSetting({
            success: (res)=>{
              // console.log(res);
              //在用户手动打开借口之后，调用wx端口获取用户授权地址信息
              //调用封装的函数获取用户信息
              this.onGotUserInfo()
            },
            fail: (err)=>{
              console.log(err);
            }
          });
        }else{
          //如果是true状态 或者是undefined，则可以直接调用端口获取用户数据
          this.onGotUserInfo()
        }
      }
    });
  },
  //获取用户地址
  onGotUserInfo(){
    //获取用户授权后，获取到地址信息
    //因为授权只能条用一次，在授权的时候用户点击取消之后，再也不能调用，所以需要在调用之前必须要对用户的授权状态进行验证
    wx.chooseAddress({
      success: (res)=>{
        //将用户信息赋值，用于渲染页面
        console.log(res);
        //将数据存储到本地储存里面去
        wx.setStorageSync('userAddress', res);
        //给数据赋值
        this.setData({
          userAddress:res
        })
      },
      fail:err=>{
        // console.log(err);
        //当用户取消选择地址时，提示用户
        wx.showToast({
          title: '已取消选择地址',
          icon: 'none',
          duration: 1500,
          mask:true
        });
      }
    });
  },
  //页面跳转回来时也需要重新显示数据
  onShow(){
    this.getNum()
  }
})