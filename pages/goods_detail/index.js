// pages/goods_detail/index.js
//引入封装的myAxios
const app=getApp()
//引入async 和await
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data:{
    //定义变量用于页面的渲染
    goodDetail:{},
    //用于显示收藏按钮
    isShow:true
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
  //点击收藏时，将获取到的商品的信息存到本地存储中去
  collectGoods(e){
    this.setData({
      isShow:!this.data.isShow
    })
    if(!this.data.isShow){
      //提示用户
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        duration: 1000
      })
      //当收藏成功时，将数据存储到本地存储中去,先获取本地存储中的数据，然后追加，再存进去
      let arr=wx.getStorageSync('collect')||[]
      arr.push(this.data.goodDetail)
      // console.log(arr);
      wx.setStorageSync('collect', arr);
    }else{
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        duration: 1000
      })
      //取消收藏时，将本地存储中的数据先拉取出来，删除掉对应的项，然后再存回去
      let arr=wx.getStorageSync('collect');
      arr.pop()
      wx.setStorageSync('collect', arr);
    }
  },
  //点击加入购物车时，将数据追加到本地存储中去
  addCart(){
    // console.log(123);
    //先获取本地存储中的数据，然后追加
    let arr=wx.getStorageSync('cart')||[]
    // 将数据追加进去，然后再存起来
    arr.push(this.data.goodDetail)
    wx.setStorageSync('cart',arr)
    //同时提示用户
    wx.showToast({
      title:"加入购物车成功",
      icon:'success',
      duration:1000
    })
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