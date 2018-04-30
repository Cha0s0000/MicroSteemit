// pages/follow/follow.js
var app = getApp();
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
              var payout = parseFloat(data[post].pending_payout_value) + parseFloat(data[post].total_payout_value) + parseFloat(data[post].curator_payout_value);
              obj.pending_payout_value = "$"+payout.toFixed(2);
              obj.total_payout_value = "$" + data[post].total_payout_value.replace("SBD", "");
              obj.curator_payout_value = "$" + data[post].curator_payout_value.replace("SBD", "");
              obj.promoted = "$" + data[post].promoted.replace("SBD", "");
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

  onReachBottom: function (e) {
    wx.showNavigationBarLoading();
    console.log("refresh");
    var last_author = this.data.postsData[this.data.postsData.length - 1].author;
    var last_permlink = this.data.postsData[this.data.postsData.length - 1].permlink;
    var beforeDate = "2019-07-23T22:00:06";
    var authorPosts = [];
    var that = this;
    var i = 0;
    console.log(last_author);
    console.log(last_permlink);
    wx.request({
      url: 'https://api.steemjs.com/get_discussions_by_author_before_date?author=' + last_author + '&startPermlink='+last_permlink+'&beforeDate=' + beforeDate + '&limit=10',
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        var data = res.data;
        for (var post in data) {
          if (i == 0) {
            i++;
            continue;
          }
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
          var payout = parseFloat(data[post].pending_payout_value) + parseFloat(data[post].total_payout_value) + parseFloat(data[post].curator_payout_value);
          obj.pending_payout_value = "$" + payout.toFixed(2);
          obj.total_payout_value = "$" + data[post].total_payout_value.replace("SBD", "");
          obj.curator_payout_value = "$" + data[post].curator_payout_value.replace("SBD", "");
          obj.promoted = "$" + data[post].promoted.replace("SBD", "");
          obj.reputation = that.data.reputation
          authorPosts.push(obj);
        }
        console.log(authorPosts);
        that.setData({
          postsData: that.data.postsData.concat(authorPosts),
          hidden: true
        })
        wx.hideNavigationBarLoading();
      }
    })

  },
  click: function (e) {
    if (this.tapEndTime - this.tapStartTime < 350) {
      var author = e.currentTarget.dataset.block.author;
      var permlink = e.currentTarget.dataset.block.permlink;
      console.log("click");
      console.log(author);
      wx.navigateTo({
        url: '../detail/detail?author=' + author + '&permlink=' + permlink,
      })
    }

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
  
  // monitoring the start touching  function of the view item
  bindTouchStart: function (e) {
    this.tapStartTime = e.timeStamp;
  },

  // monitoring the end touching  function of the view item
  bindTouchEnd: function (e) {
    this.tapEndTime = e.timeStamp;
  },

  // monitoring the long tap function of the view item
  bindLongTap: function (e) {
    console.log("long tap");
    wx.showModal({
      title: 'Favourite Posts',
      content: 'Would you like to add this to your favourite list?',
      success: function (res) {
        if (res.confirm) {
          console.log('confirm log out')
          var newList = [];
          var block2Arr = [];
          block2Arr.push(e.currentTarget.dataset.block);
          var existList = wx.getStorageSync('favouritePosts');
          if (existList) {
            newList = existList.concat(block2Arr);
          }
          else {
            newList = block2Arr;
          }
          wx.setStorageSync('favouritePosts', newList);
          console.log(wx.getStorageSync('favouritePosts'));
        } else if (res.cancel) {
          console.log('cancel model ');
        }
      }
    })

  },
  // deal with clicking on the tag
  clickCategory: function (e) {
    app.globalData.tag = e.currentTarget.dataset.category;
    console.log(app.globalData.tag);
    wx.switchTab({
      url: '../post/post',
      success: function (e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    })
  },

  // deal with clicking on author
  clickAuthor: function (e) {
    var account = e.currentTarget.dataset.author;
    wx.navigateTo({
      url: '../profile/profile?account=' + account
    })
  },

  showPayout: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    var time = e.currentTarget.dataset.time;
    var detail = e.currentTarget.dataset.detail;
    /* create thte animation */
    // Step 1：setup an animation instance
    var animation = wx.createAnimation({
      duration: 200,  //Animation duration
      timingFunction: "linear", //linear  
      delay: 0  //0 means not delay 
    });

    // Step 2: this animation instance is assigned to the current animation instance.
    this.animation = animation;

    // Step 3: perform the first set of animations.
    animation.opacity(0).rotateX(-100).step();

    // Step 4: export the animation object to the data object store.
    this.setData({
      animationData: animation.export()
    })

    // Step 5: set the timer to the specified time and execute the second set of animations.
    setTimeout(function () {
      // Execute the second set of animations.
      animation.opacity(1).rotateX(0).step();
      // The first set of animations that are stored for the data object are replaced by the animation objects that perform the second animation.
      this.setData({
        animationData: animation
      })

      //hide 
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)
    var payout = 0;
    // show
    if (currentStatu == "open") {
      if ((detail.time.indexOf("天") != -1)) {
        if (parseInt((detail.time.split('天')[0])) > 7) {
          payout = parseInt((detail.time.split('天')[0])) - 7;
          payout = payout + "天前";
        }
        else {
          payout = 7 - parseInt((detail.time.split('天')[0]));
          payout = payout + "天后";
        }

      }
      else {
        payout = "7天后";
      }
      this.setData(
        {
          PotentialPayout: detail.pending_payout_value,
          PromotedPayout: detail.promoted,
          AuthorPayout: detail.total_payout_value,
          CurationPayout: detail.curator_payout_value,
          Payout: payout,
          showModalStatus: true
        }
      );
    }
  },
  showVoters: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    var detail = e.currentTarget.dataset.detail;
    var animation = wx.createAnimation({
      duration: 200,  //Animation duration
      timingFunction: "linear", //linear  
      delay: 0  //0 means not delay 
    });
    this.animation = animation;
    animation.opacity(0).rotateX(-100).step();
    this.setData({
      voterListAnimationData: animation.export()
    })
    setTimeout(function () {
      animation.opacity(1).rotateX(0).step();
      this.setData({
        voterListAnimationData: animation
      })
      if (currentStatu == "close") {
        this.setData(
          {
            voterListShowModalStatus: false
          }
        );
      }
    }.bind(this), 200)
    var payout = 0;
    // show
    if (currentStatu == "open") {
      var that = this;
      var votersList = [];
      wx: wx.request({
        url: 'https://api.steemjs.com/get_active_votes?author=' + detail.author + '&permlink=' + detail.permlink,
        method: 'GET',
        success: function (res) {
          if (res.statusCode == '200') {
            var voterDatas = res.data;
            for (var voterData in voterDatas) {
              var obj = new Object();
              obj.voter = voterDatas[voterData].voter;
              obj.percent = String(voterDatas[voterData].percent / 100) + '%';
              obj.reputation = that.getReputation(voterDatas[voterData].reputation);
              obj.time = that.getTime(voterDatas[voterData].time);
              obj.weight = voterDatas[voterData].weight;
              votersList.push(obj);
            }
            console.log(votersList);
            that.setData({
              voterLists: votersList,
              voterListShowModalStatus: true
            })

          }
        },
        complete: function (res) { },
      })
    }
  },
})