// pages/replyHistory/replyHistory.js
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
            info_title: "Reply history",
            hidden: true,
            author: author,
            postsData:[],
            startNum:-1,
            num:0
          })
        }
      },
      complete: function (res) {
        var num = 0;
        var authorPosts = [];
        wx.request({
          url: 'https://api.steemjs.com/get_state?path=/@' + author + '/recent-replies',
          method: 'GET',
          success: function (res) {
            var data = res.data['content'];
            console.log(data);
            for (var content in data) {
              var obj = new Object();
              obj.author = data[content].author;
              obj.permlink = data[content].permlink;
              obj.root_author = data[content].root_author;
              obj.avatar = "https://steemitimages.com/u/" + obj.author + "/avatar/small";
              obj.root_permlink = data[content].root_permlink;
              obj.category = data[content].category;
              obj.title = that.filterBody(data[content].root_title);
              obj.body = that.filterBody(data[content].body);
              obj.time = that.getTime(data[content].created);
              obj.originTime = data[content].created;
              obj.like_num = data[content].net_votes;
              obj.comment_num = data[content].children;
              var payout = parseFloat(data[content].pending_payout_value) + parseFloat(data[content].total_payout_value) + parseFloat(data[content].curator_payout_value);
              obj.pending_payout_value = "$" + payout.toFixed(2);
              obj.total_payout_value = "$" + data[content].total_payout_value.replace("SBD", "");
              obj.curator_payout_value = "$" + data[content].curator_payout_value.replace("SBD", "");
              obj.promoted = "$" + data[content].promoted.replace("SBD", "");
              obj.reputation = that.getReputation(data[content].author_reputation)
              authorPosts.push(obj);
            }
            authorPosts.sort(function(i1,i2){
              return Date.parse(i2.originTime) - Date.parse(i1.originTime);
            });
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
  click: function (e) {
    var author = e.currentTarget.dataset.block.root_author;
    var permlink = e.currentTarget.dataset.block.root_permlink;
    console.log("click");
    console.log(author);
    wx.navigateTo({
      url: '../detail/detail?author=' + author + '&permlink=' + permlink,
    })

  },

  // click to show all payout detail
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

  // click to show voter list
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