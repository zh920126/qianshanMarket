// pages/collect/index.js
//引入全局的myaxios
const app=getApp()
//引入async和await
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data:{
    collect:[
      {name:'商品收藏'},
      {name:'品牌收藏'},
      {name:'店铺收藏'},
      {name:'浏览足迹'}
    ],
    all:[
      {name:'全部'},
      {name:'正在热卖'},
      {name:'即将上线'}
    ],
    //定义变量用于tab栏切换
    isShow:0,
    showRed:0,
    //获取收藏的数据，渲染页面
    collectList:[]
  },
  //点击顶部tab栏时，切换样式与数据
  choseItem(e){
    let {index}=e.currentTarget.dataset
    // console.log(index);
    this.setData({
      isShow:index
    })
  },
  //点击全部收藏栏时，切换样式与数据
  choseCollect(e){
    let {index}=e.currentTarget.dataset
    this.setData({
      showRed:index
    })
  },
  //点击删除时，删除对应的哪一项数据
  delItem(e){
    let {index}=e.currentTarget.dataset
    // console.log(index);
    //获取本地存储的数据
    let arr=wx.getStorageSync('collect')
    arr.splice(index,1)
    //将新的数组上传到本地存储中去
    wx.setStorageSync('collect', arr);
    //删除完之后，进行页面刷新
    this.onLoad()
  },
  //页面一打开就获取到用户收藏的数据
  onLoad(){
    //从本地存储中获取用户的收藏数据
    let arr=wx.getStorageSync('collect');
    //将数据赋值给定义好的数据，用于渲染页面
    this.setData({
      collectList:arr
    })
  },
  //开启下拉刷新
  onPullDownRefresh(){
      this.onLoad()
  }
})