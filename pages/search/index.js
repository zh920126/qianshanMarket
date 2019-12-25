// pages/search/index.js
//引入全局的myAxios
const app=getApp()
//引入async和await
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data:{
    //是否显示字体图标
    showIcon:true,
    goodsList:[],
    value:"",
    historyList:[]
  },
  //当获得焦点的时候
  getFocus(){
    //首先就需要让字体图标消失
    this.setData({
      showIcon:false
    })
  },
  //失去焦点时
  blurFoucs(){
    this.setData({
      showIcon:true
    })
    this.showHistory()
  },
  //监听输入框内容
   getList(e){
    // console.log(e);
    //获取输入的内容
    let {value}=e.detail
    //调用axios
    app.myAxios({
      url:"/goods/qsearch",
      data:{
        query:value
      }
    }).then(res=>{
      console.log(res);
      //将获取到的结果赋值变量用于渲染页面
      //同时将数据赋值给定义的变量
      this.setData({
        goodsList:res,
        value
      })
    })
  } ,
  //点击进行跳转
  gtToDetail(e){
    console.log(e);
    let {goods_id}=e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/goods_detail/index?goods_id=${goods_id}`,
      success: (res)=>{
        // console.log(res);
        //每次用户点击之后，就将用户输入的数据存起来
        let arr= wx.getStorageSync('history')||[];
        arr.push(this.data.value)
        wx.setStorageSync('history', arr);
      }
    });
  },
  //封装显示历史记录的函数
  showHistory(){
    let historyList=wx.getStorageSync('history')||[];
    this.setData({
      historyList
    })
  },
  onLoad(){
    this.showHistory()
  },
  //清空历史记录
  delHistory(){
    wx.removeStorageSync('history');
    //同时提示用户删除成功
    wx.showToast({
      title: '删除历史记录成功',
      icon: 'success',
      duration: 1500,
      mask: true
    });
    this.setData({
      historyList:[]
    })
  },
  //点击取消时
  cancle(){
    
  }
})