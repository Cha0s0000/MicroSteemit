// pages/follow/follow.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    follow_list:[],
    
 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this ;
    var author = options.author;
    var follow_type = options.type;
    var follower = options.follower;
    var following = options.following;
    console.log(author);
    wx.request({
      // 由于没有域名，这行先注释，测试域名
      url: 'https://steemit.com/@' + author + '.json',
      method: 'GET',
      success: function (res) {
        console.log(res);
        if (res.data.status == '200') {
         
          that.setData({
            avatar: res.data.user.json_metadata.profile.profile_image,
            post_count: res.data.user.post_count,
            reputation: that.getReputation(res.data.user.reputation),
            steemitname: res.data.user.json_metadata.profile.name,
            about: res.data.user.json_metadata.profile.about,
            info_title: follow_type,
            follower: follower,
            following: following,
            hidden: true
          })
        }
      },
      complete:function(res){
        var list = [];
        if (follow_type == "Follower list"){
            wx.request({
              url: 'https://api.steemjs.com/get_followers?following=' + author + '&startFollower=START&followType=blog&limit=' + follower,
              method: "GET",
              success: function (res) {
                console.log(res.data);
                if (res.statusCode == '200') {
                  var datas = res.data;
                  for (var data in datas) {
                    list.push(datas[data].follower);
                  }
                  console.log(list)
                  that.setData({ follow_list: list,num:follower});
                }
              }
            })
          }
         else{
            wx.request({
              url: 'https://api.steemjs.com/get_following?follower=' + author + '&startFollowing=START&followType=blog&limit=' + following,
              method: "GET",
              success: function (res) {
                console.log(res.data);
                if (res.statusCode == '200') {
                  var datas = res.data;
                  for (var data in datas) {
                    list.push(datas[data].following);
                  }
                  console.log(list)
                  that.setData({ follow_list: list,num:following});
                }
              }
            })
        }
        
      }
    })
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  getReputation(rep) {
    if (rep == 0) {
      return 25
    }
    var score = (Math.log10(Math.abs(rep)) - 9) * 9 + 25;
    if (rep < 0) {
      score = 50 - score;
    }
    return Math.round(score);
  },
})