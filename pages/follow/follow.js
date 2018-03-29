// pages/follow/follow.js
Page({

  /**
   * The initial data of the page.
   */
  data: {
    follow_list:[],
    
 
  },

  /**
   * Life cycle function - listen to page load.
   */
  onLoad: function (options) {
    var that = this ;
    var author = options.author;
    var follow_type = options.type;
    var follower = options.follower;
    var following = options.following;
    console.log(author);
    wx.request({
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
            author: author,
            hidden: true
          })
        }
      },
      complete:function(res){
        var list = [];
        if (follow_type == "Follower list"){
            wx.request({
              url: 'https://api.steemjs.com/get_followers?following=' + author + '&startFollower=START&followType=blog&limit=50',
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
              url: 'https://api.steemjs.com/get_following?follower=' + author + '&startFollowing=START&followType=blog&limit=50',
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
   * Life cycle function - the first rendering of the listening page.
   */
  onReady: function () {
  
  },

  /**
   *Life cycle function - monitor page display.
   */
  onShow: function () {
  
  },

  /**
   *Life cycle function - the listening page is hidden.
   */
  onHide: function () {
  
  },

  /**
   * Life cycle function - monitor page uninstall.
   */
  onUnload: function () {
  
  },

  /**
   *Page correlation event handler - listen to the user to pull.
   */
  onPullDownRefresh: function () {
  
  },

  /**
   *The handle function of the bottom event on the page.
   */
  onReachBottom: function (e) {
    wx.showNavigationBarLoading();
    console.log("refresh");
    var info_title = this.data.info_title;
    var follower = this.data.follower;
    var following = this.data.following;
    var last = this.data.follow_list[this.data.follow_list.length-1];
    var author = this.data.author;
    var list = [];
    var i = 0;
    console.log(last);
    var that = this;
    if (info_title == 'Follower list'){
      wx.request({
        url: 'https://api.steemjs.com/get_followers?following=' + author + '&startFollower=' + last+'&followType=blog&limit=50',
        method: "GET",
        success: function (res) {
          console.log(res.data);
          if (res.statusCode == '200') {
            var datas = res.data;
            for (var data in datas) {
              if (i == 0) {
                i++;
                continue;
              }
              list.push(datas[data].follower);
            }
            console.log(list)
            that.setData({ follow_list: that.data.follow_list.concat(list)});
          }
          wx.hideNavigationBarLoading();
        }
      })
    }
    else{
      wx.request({
        url: 'https://api.steemjs.com/get_following?follower=' + author + '&startFollowing='+last+'&followType=blog&limit=50',
        method: "GET",
        success: function (res) {
          console.log(res.data);
          if (res.statusCode == '200') {
            var datas = res.data;
            for (var data in datas) {
              if (i == 0) {
                i++;
                continue;
              }
              list.push(datas[data].following);
            }
            console.log(list)
            that.setData({ follow_list: that.data.follow_list.concat(list) });
          }
          wx.hideNavigationBarLoading();
        }
      })
    }
  },

  /**
   *Users click the top right corner to share.
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