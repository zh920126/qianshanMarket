// pages/pay/index.js
//引入全局myAxios
const app=getApp()
//引入async和await
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data:{
    payList:[],
    userAddress:{},
    totalPrice:0,
    totalCount:0
  },
  //页面一开打就获取数据进行渲染
  onLoad(){
    //获取被选中的数据
    let arr=wx.getStorageSync('buy')|| wx.getStorageSync('cart');
    let userAddress=wx.getStorageSync('userAddress')||{};
    //筛选出被选中需要支付的商品
    let payList= arr.filter(v=>{
      return v.goods_selected===true
    })
    //赋值，用于渲染页面
    this.setData({
      payList,
      userAddress
    })
    // console.log(payList);
    // 获取总价格与总数量
    let{totalPrice,totalCount}=this.data
    payList.forEach(v=>{
      totalPrice+=v.goods_price*v.goods_count
      totalCount+=v.goods_count
    })
    this.setData({
      totalPrice,totalCount
    })
  },
  //创建订单
  getOrder(token){
        //获取数据进行参数的拼接
        let {payList}=this.data
        //遍历需要支付的商品将需要你的数据结构出来生成新的数组
        let arr1=[]
        let goodsItem={}
        payList.forEach(v=>{
          let {goods_count,goods_id,goods_price}=v
          goodsItem={
          goods_number:goods_count,
          goods_id:goods_id,
          goods_price:goods_price
         }
         arr1.push(goodsItem)
        })
       //  console.log(goodsItem);
       //拼接收货地址
       let obj=wx.getStorageSync('userAddress');
       // console.log(obj);
       let address=obj.provinceName+obj.cityName+obj.countyName+obj.detailInfo
      //  console.log(address);
      //  console.log(arr1);
      //  console.log(token);
      //  console.log(this.data.totalPrice);
        //发送请求生成订单
    return app.myAxios({
      method:'post',
      url:"/my/orders/create",
      data:{
        order_price:this.data.totalPrice,
        consignee_addr:address,
        goods:arr1
      },
      // 请求头中添加token
      header:{
        "Authorization":token
      }
    })
  },
  //预支付
  beforePay(order_number,token){
    return app.myAxios({
      method:'post',
      url:'/my/orders/req_unifiedorder',
      data:{
        order_number
      },
      header:{
        'Authorization':token
      }
    })
  },
  //向微信发送请求
  pay(pay){
    return new Promise((resolve,reject)=>{
      wx.requestPayment({
        ...pay,
        success: (res)=>{
          // console.log(res);
          resolve(res)
        },
        fail: (err)=>{
          // console.log(err);
          reject(err)
          //支付失败，就需要提示用户
          wx.showToast({
            title: '支付失败',
            icon: 'none',
            duration: 1500,
            mask: false,
          });
        }
      });
    })
  },
  //检查订单状态
  checkOrder(order_number,token){
    return app.myAxios({
      method:'post',
      url:'/my/orders/chkOrder',
      data:{
        order_number
      },
      header:{
        'Authorization':token
      }
    })
  },
  //点击结算按钮时
  async toPay(){
    //点击结算之前需要先验证token
    let token=wx.getStorageSync('token');
    if(token){
        //如果有token就继续发送请求
        //生成订单号
      let res=await this.getOrder(token)
      console.log(res);
      //获取订单号
      let {order_number}=res
      //预支付
      let res1=await this.beforePay(order_number,token)
      console.log(res1);
      let {pay}=res1
      //发送请求到微信端口
      let res2=await this.pay(pay)
      // console.log(res2);
      //检查订单支付状态
      let res3=await this.checkOrder(order_number,token)
      console.log(res3);
      if(res3==='支付成功'){
        let arr=wx.getStorageSync('hasPay')||[];
          //解构数据，用于渲染order页面
        let {order_number,order_price,create_time}=res
        let obj={order_number,order_price,create_time}
        arr.push(obj)
        //存到本地存储中
        wx.setStorageSync('hasPay', arr);
      }
      // console.log(res3);
      //重定向到order页面
      wx.showToast({
        title: '支付成功，正在跳转到订单页',
        icon: 'none',
        duration: 1500,
        mask: true,
        success: (result)=>{  
          wx.redirectTo({
            url: '/pages/order/index'
          });
          //同时将对应的项删除掉，不要再存在于本地存储中
          let buy=wx.getStorageSync('buy')||[];
          if(buy.length){
            //如果是从商品详情页面进来
            wx.removeStorageSync('buy')
            console.log(buy);
          }else{
            //如果是从购物车进入的
            let cart=wx.getStorageSync('cart');
            let newCart=cart.filter(v=>{
              return v.goods_selected===false
            })
            console.log(newCart);
            if(!newCart.length){
              wx.removeStorageSync('cart');
            }else{
              wx.setStorageSync('cart', newCart);
            }
          }
        }

      });
    }else{
      //没有token就返回登录
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000,
        mask: true,
        success: (result)=>{
          wx.switchTab({
            url: '/pages/user/index'
          });
        }
      });
    }
  }
})