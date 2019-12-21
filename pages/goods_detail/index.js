// pages/goods_detail/index.js
//引入封装的myAxios
const app=getApp()
//引入async 和await
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data:{
    //定义变量用于页面的渲染
    goodDetail:{}
  },
  //打开页面就需要获取到商品的ID，进行数据的获取
  async onLoad(options){
    let{goods_id}=options
    //根据ID来发送请求 获取数据
    let goodDetail=await app.myAxios({
      url:"/goods/detail",
      data:{
        goods_id
      }
    })
    // console.log(goodDetail);
    this.setData({goodDetail})
  }
})