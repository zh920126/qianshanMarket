// pages/cart/index.js
//引入封装的axios
const app=getApp()
//引入await和async
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data:{
    //获取用户信息数据
    userAddress:{},
    //获取用户的加入购物车的数据，渲染页面
    cartList:[],
    totalPrice:0,
    totalCount:0,
    checkAll:false
  },
  //封装一个计算总价的函数
  totalPrice(){
    //初始化数据
    let {cartList}=this.data
    let totalPrice=0
    let totalCount=0
    let count=0
    //遍历数组，计算出被选中的商品的价格
    cartList.forEach(v => {
      //判断是否被选中
      if(v.goods_selected){
        //如果被选中就需要计算他的价格
        totalPrice+=v.goods_price*v.goods_count
        totalCount+=v.goods_count
        count++
      }
    });
    //给数据重新赋值,同时加两个0
    // console.log(totalPrice);
    this.setData({
      totalPrice:totalPrice.toFixed(2),
      totalCount,
      checkAll:count===cartList.length
    })
    //每次改变完数据都需要重新加入到本地储存中去
    wx.setStorageSync('cart',cartList)
  },
  //全选
  checkAll(){
    //获取数据
    let {checkAll,cartList}=this.data
    checkAll=!checkAll
    //遍历数组，如果里面的每一项的goods_selected的值都为true，则全选
    cartList.forEach(v=>{
      v.goods_selected=checkAll
    })
    console.log(cartList);
    this.setData({
      cartList,
      checkAll
    })
    //调用封装的计算总价的函数
    this.totalPrice()
  },
  //单选时
  check(e){
    // 获取数据
    let {index}=e.currentTarget.dataset
    let {cartList,checkAll}=this.data
    // console.log(index);
    cartList.forEach((v,i)=>{
      if(i===index){
        v.goods_selected=!v.goods_selected
      }
    })
    this.totalPrice()
  },
  //加减
  changeNum(e){
    // console.log(e);
    let {count,index}=e.currentTarget.dataset
    let {cartList}=this.data
    cartList.forEach((v,i)=>{
     //先选中对应的哪一项
     if(i===index){
       //同时数量为1，并且按的是-号时
       if(v.goods_count===1 && count===-1){
        //  console.log(123);
        //此时提示用户是否删除此项
        wx.showModal({
          title: '是否删除此商品',
          content: '',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#000000',
          confirmText: '确定',
          confirmColor: '#3CC51F',
          success: (result) => {
            if(result.confirm){
              // console.log('确定');
              //用户点击确定时，删除对应的哪一项
              cartList.splice(index,1)
              this.setData({
                cartList
              })
              this.totalPrice()
            }else{
              // console.log('取消');
            }
          }
        });
       }else{
         v.goods_count+=count
         this.setData({
          cartList
        })
        this.totalPrice()
       }
     }
    })
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
    this.setData({
      userAddress:wx.getStorageSync('userAddress')||{},
      cartList:wx.getStorageSync('cart')||[],
    })
    //调用封装的计算价格的函数
    this.totalPrice()
  }
})