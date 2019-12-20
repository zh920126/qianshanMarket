// pages/category/index.js
//引入全局的myAxios组件
const app = getApp();
//引入async await
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  data:{
    //定义变量用于渲染右侧页面
    categories:wx.getStorageSync('categories')||[],
    //定义变量渲染左侧页面
    cateItems:wx.getStorageSync('categories')[0]||[],
    //每次切换类目都让滚动条还原
    toTop:0,
    //切换类目时，改变被选中项的颜色
    choseIndex:0
  },
  //点击左侧分类栏时触发
  choseCate(e){
    //获取每次点击之后得到的索引值
    let {index}=e.currentTarget.dataset
    // console.log(index);
    //每次点击时将对应索引值的数据在左边渲染
    this.setData({
      cateItems:this.data.categories[index],
      toTop:0,
      choseIndex:index
    })
  },
  async onLoad(){
    if(this.data.categories.length===0){
      //页面一打开就需要获取数据
    let categories=await app.myAxios({
      url:"/categories"
    })
    // console.log(aa);
    //因为数据过大 ，每次获取都需要很长时间，因此将该数据存储到本地储存中去
    wx.setStorageSync("categories", categories);
    //将数据赋值，用于渲染页面
    this.setData({
      categories,
      cateItems:categories[0]
    })
    }
  }
  // 每当页面显示的时候 ，让类目还原到第一个
  // onShow(e){
  //   this.setData({
  //     toTop:0,
  //     choseIndex:0,
  //      cateItems:wx.getStorageSync('categories')[0]||[],
  //   })
  // }
})