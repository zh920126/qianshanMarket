// pages/goods_list/index.js
//引入全局的myAxios
const app=getApp()
//引入async和await
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data:{
    //定义遍量接收数据，用于渲染页面
    a:[],
    goodsList:[],
    //定义变量存储传送过来的cid
    cid:0,
    //定义变量用过来存储传送过来的query
    query:"",
    //定义页码
    pagenum:1,
    //定义每页显示数据
    pagesize:4,
    //定义变量用于获取搜索新的总数据条数
    total:0
  },
  //将获取数据的函数封装
  async getGoodsList(query,cid,pagenum,pagesize){
    let goodsList=await app.myAxios({
      url:"/goods/search",
     data:{
      query:query,
      cid:cid,
      pagenum:pagenum,
      pagesize:pagesize
     }
    })
    //将数据里面的所有价格数据全部转化为带2个点
    let newList=goodsList.goods.map(item=>{
      item.goods_price=item.goods_price.toFixed(2)
      return item
    })
    // console.log(newList);
    this.data.a.push(...newList)
    // console.log(this.data.a);
    // this.data.goodsList.push(...newList)
    //将获取到的数据赋值给data
    this.setData({
      // goodsList:this.goodsList.push(...newList),
      goodsList:this.data.a,
      total:goodsList.total
    })
  },
  //根据传入的参数来获取数据
  async onLoad(options){
    // console.log(options);
    //将获取到的 参数解构出来
    let {query,cid}=options
    this.setData({
      query,
      cid
    })
    // console.log(query,cid);
    //发送请求获取数据
    //调用函数
    this.getGoodsList(query,cid,this.data.pagenum,this.data.pagesize)
  },
  //上啦加载更多
  onReachBottom(){
    ++this.data.pagenum
    // console.log(this.data.pagenum);
    // console.log(this.data.total);
    //调用封装的函数
    if(this.data.goodsList.length<this.data.total){
      //如果成立，表示还有数据没有获取完
      this.getGoodsList(this.data.query,this.data.cid,this.data.pagenum,this.data.pagesize)
    }else{
      //提示用户没有更多数据了
      wx.showToast({
        title: '没有更多了',
        icon: 'warn',
        duration: 1000
      })
    }
  }
})