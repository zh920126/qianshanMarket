//index.js
//引入async await
import regeneratorRuntime from '../../lib/runtime/runtime';
//获取全局应用实例
const app = getApp()
console.log(app);

Page({
  data:{
    //定义变量用来接收轮播图的数据
    swiperdata:[],
    //分类信息的数据
    catitems:[],
    //楼层数据
    floordata:[]
  },
  //点击按钮返回顶部
  toTop(){
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });
  },
  //当页面一打开就马上发送请求，获取数据用来渲染页面
  async onLoad(){
    let swiperdata= await app.myAxios({
      url:"/home/swiperdata"
    })
    let catitems=await app.myAxios({
      url:"/home/catitems"
    })
    let floordata=await app.myAxios({
      url:"/home/floordata"
    })
    this.setData({
      swiperdata,catitems,floordata
    })
  }
})
