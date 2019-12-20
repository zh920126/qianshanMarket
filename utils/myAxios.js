//将wx.request用promise来封装起来
//设置一个baseURL
const baseURL="https://api.zbztb.cn/api/public/v1"
export const myAxios =(params)=>{
  //当调用axios是开启正在加载提示框
  wx.showLoading({
    title:"玩命加载中"
  })
  //创建一个新的额Promise对象
  return new Promise((resolve,reject)=>{
    wx.request({
      //将传入的params参数解构出来
      ...params,
      url:baseURL+params.url,
      success:res=>{
        resolve(res.data.message)
      },
      fail:err=>{
        reject(err)
      },
      complete:()=>{
        //不管成功还是失败，都需要将加载提示框关闭掉
        wx.hideLoading();
      }
    })
  })
}