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
  //点击轮播图上的图片，显示大图
  showBigImage(e){
    // console.log(e)
    // console.log(this.data.goodDetail.pics)
    let {index}=e.currentTarget.dataset
    // 由于全屏预览图片的wx.previewImage里面只能存放字符串，所以需要先将图片路劲单独取出来才行
    let newList=this.data.goodDetail.pics.map(item=>{
      return item.pics_big
    })
    console.log(index)
    wx.previewImage({
      current: index,
      urls:newList
    });
  },
  //打开页面就需要获取到商品的ID，进行数据的获取
  async onLoad(options){
    let{goods_id}=options
    //根据ID来发送请求 获取数据
    let goodDetail=await app.myAxios({
      url:"/goods/detail",
      data:{
        goods_id:129
      }
    })
    // console.log(goodDetail);
    this.setData({goodDetail})
  }
})