// pages/pay/index.js
//引入全局myAxios
const app=getApp()
//引入async和await
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data:{
    payList:[],
    userAddress:wx.getStorageSync('userAddress'),
    totalPrice:0,
    totalCount:0
  },
  //页面一开打就获取数据进行渲染
  onLoad(){
    //获取被选中的数据
    let arr=wx.getStorageSync('buy')|| wx.getStorageSync('cart');
    //筛选出被选中需要支付的商品
    let payList= arr.filter(v=>{
      return v.goods_selected===true
    })
    //赋值，用于渲染页面
    this.setData({
      payList
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
  //点击结算按钮时
  toPay(){
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
    let token=wx.getStorageSync('token');
    console.log(address);
    console.log(arr1);
    console.log(token);
    console.log(this.data.totalPrice);
    //发送请求生成订单
    app.myAxios({
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
    }).then(res=>{
      console.log(res);
    })
  }
})