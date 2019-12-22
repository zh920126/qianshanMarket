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
    showRed:0
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
  }
})