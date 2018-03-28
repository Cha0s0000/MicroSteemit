// pages/follow/follow.js
Page({

  /**
   * The initial data of the page.
   */
  data: {
    follow_list: [],


  },

  /**
   * Life cycle function - listen to page load.
   */
  onLoad: function (options) {
    var that = this;
    var author = options.author;
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
            info_title: "Author posts",
            hidden: true
          })
        }
      },
      complete: function (res) {
        var authorPosts = [];
        // var that = this;
        var beforeDate = "2019-07-23T22:00:06";
        wx.request({
          url: 'https://api.steemjs.com/get_discussions_by_author_before_date?author='+ author +'&startPermlink=0&beforeDate='+ beforeDate +'&limit=10',
          method: 'GET',
          success: function (res) {
            console.log(res.data)
            var data = res.data;
            for (var post in data) {
              var obj = new Object();
              var images = [];
              obj.author = data[post].author;
              obj.avatar = "https://steemitimages.com/u/" + obj.author + "/avatar/small";
              obj.permlink = data[post].permlink;
              obj.category = data[post].category;
              obj.title = that.filterBody(data[post].title);
              obj.body = that.filterBody(data[post].body);
              obj.bodyMD = data[post].body;
              obj.json_metadata = data[post].json_metadata;
              images = JSON.parse(obj.json_metadata).image;
              obj.image = that.getImage(images);
              if (!obj.image) {
                obj.image = 'https://steemitimages.com/640x480/' + JSON.parse(obj.json_metadata).thumbnail;
              }
              obj.time = that.getTime(data[post].created);
              obj.like_num = data[post].net_votes;
              obj.comment_num = data[post].children;
              obj.pending_payout_value = "$" + data[post].pending_payout_value.replace("SBD", "");
              obj.reputation = that.data.reputation
              authorPosts.push(obj);
            }
            console.log(authorPosts);
            that.setData({
              postsData: authorPosts,
              loading: true
            })
            wx.hideNavigationBarLoading();
          }
        })


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
  onReachBottom: function () {

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
  filterBody(body) {
    var str = body;
    var filter1 = str.replace(/\([^\)]*\)/g, "");
    var filter2 = filter1.replace(/\[[^\]]*\]/g, "");
    var filter3 = filter2.replace(/\<[^\>]*\>/g, "");
    var filter4 = filter3.replace(/[\|\~|\`|\-|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\||\\|\[|\]|\{|\}|\<|\>|\?]/g, "").replace(/^\s*/g, "").replace(/[\r\n]/g, "");
    // console.log(filter4);
    return filter4;
  },
  getImage(images) {
    var imgurl = 'https://steemitimages.com/640x480/' + images[0];
    return imgurl;
  },
  getTime(time) {
    var postTime = new Date(time);
    // console.log(Date.parse(postTime));
    var nowTime = Date.now() - 28800000;
    // console.log(nowTime);
    var ago = nowTime - postTime;
    if (ago / 1000 / 60 / 60 / 24 >= 1) {
      var dayNum = parseInt(ago / 1000 / 60 / 60 / 24);
      var getTimeData = dayNum.toString();
      getTimeData += "天前";
      // console.log(getTimeData);
      return getTimeData;
    }
    else if (ago / 1000 / 60 / 60 >= 1) {
      var hourNum = parseInt(ago / 1000 / 60 / 60);
      var getTimeData = hourNum.toString();
      getTimeData += "小时前";
      // console.log(getTimeData);
      return getTimeData;
    }
    else if (ago / 1000 / 60 >= 1) {
      var minNum = parseInt(ago / 1000 / 60);
      var getTimeData = minNum.toString();
      getTimeData += "分钟前";
      // console.log(getTimeData);
      return getTimeData;
    }
    else if (ago / 1000 >= 1) {
      var secNum = parseInt(ago / 1000);
      var getTimeData = secNum.toString();
      getTimeData += "秒前";
      // console.log(getTimeData);
      return getTimeData;
    }
    else {
      var getTimeData = "1秒前";
      return getTimeData;
    }
  },
})