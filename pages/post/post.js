var postsData=require('../../data/posts-data.js')
Page({
  data:{
    imgUrls: [
      '/images/wx.png',
      '/images/vr.png',
      '/images/iqiyi.png'
    ]
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    // this.data.postList=postsData.postList
    this.setData({
      posts_key:postsData.postList
    })
  },
  
  onShareAppMessage: function() {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  }
})