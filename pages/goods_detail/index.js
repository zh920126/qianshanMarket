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
    //显示不同的类样式
    this.setData({
      isShow:!this.data.isShow
    })
    if(!this.data.isShow){
      //提示用户
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        duration: 1000,
        // 添加隔罩层
        mask:true
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
        duration: 1000,
        mask:true
      })
      //取消收藏时，将本地存储中的数据先拉取出来，删除掉对应的项，然后再存回去
      let arr=wx.getStorageSync('collect');
      arr.pop()
      wx.setStorageSync('collect', arr);
    }
  },
  //点击加入购物车时，将数据追加到本地存储中去
  addCart(){
  //先将需要获取的数据结构出来
    let {goods_id,goods_name,goods_price,goods_big_logo,goods_small_logo}=this.data.goodDetail
    //点击按钮时，先获取本地存储中的数据
    let arr= wx.getStorageSync('cart')||[]
    //根据商品的ID进行判断，如果已经添加了的，就直接加一个数量
    let index= arr.findIndex(item=>{
      return item.goods_id===goods_id
    })
    //进行判定
    if(index===-1){
      //判定没有数据的时候就追加一个新对象
      arr.push({
        goods_id,
        goods_name,
        goods_price,
        goods_big_logo,
        goods_small_logo,
        goods_count:1
      })
    }else{
      //否则就是里面的项已经有了的，就不额外增加一项，只是在家一个数量
      arr[index].goods_count++
    }
    //然后将新的数据存起来
    wx.setStorageSync('cart',arr)
    //提示用户加入购物车成功
    wx.showToast({
      title:'加入购物车成功',
      icon:'success',
      duration:1500,
      // 添加隔罩层，防止用户连续快速点击
      mask:true
    })
  },
  //点击立即购买时,将数据追加过去,然后跳转到订单页面
  buy(){
    //点击时，将数据存储到本地储存中去
    let arr=[]
    arr.push(this.data.goodDetail)
    wx.setStorageSync('buy',arr)
    //跳转到订单页面
    wx.navigateTo({
      url: '/pages/order/index'
    });
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
    //检查是什么操作系统
    let {platform}=wx.getSystemInfoSync();
    // console.log(res);
    //如果是IOS系统的（因为ios无法识别webp格式的图片），需要对无法识别的图片进行替换
    if(platform==="ios"){
      goodDetail.goods_introduce=goodDetail.goods_introduce.replace(/\?.+?webp/g,'')
    }
    // console.log(goodDetail);
    this.setData({goodDetail})
  },
  //点击按钮返回顶部
  toTop(){
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });
  }
})