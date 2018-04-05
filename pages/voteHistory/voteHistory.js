// pages/voteHistory/voteHistory.js
Page({

  /**
   * The initial data of the page.
   */
  data: {
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
            info_title: "Voting history",
            hidden: true,
            loadMore:false
          })
        }
      },
      complete: function(res) {
        var votingHistory = [];
        // because of the limitation of the requesting for the api, we only can get all the voting history data at a time. 
        // But wechat parse engine is not able to deal with the large data at a time 
        // So only can we show the part of the voting history at a time .
        wx:wx.request({
          url: 'https://api.steemjs.com/get_account_votes?voter='+ author,
          method: 'GET',
          success: function(res) {
            console.log(res);
            if (res.statusCode == '200') {
              var data = res.data;
              for (var voting in data) {
                var obj = new Object();
                obj.authorperm = data[voting].authorperm;
                obj.author = obj.authorperm.split("/")[0];
                obj.avatar = "https://steemitimages.com/u/" + obj.author + "/avatar/small";
                obj.weight = data[voting].weight/100;
                obj.rshares = data[voting].rshares/1000000;
                obj.rshares = obj.rshares.toFixed(0);
                obj.percent = data[voting].percent/100;
                obj.time = that.getTime(data[voting].time);
                votingHistory.push(obj);
              }
              console.log(votingHistory);
              var showList = [];
              // get the first 30 voting history showing 
              for( var i=0;i<30;i++){
                showList.push(votingHistory[votingHistory.length-i-1])
              }
              
              that.setData({
                votingList: showList,
                page:1,
                pageDownDis:true,
                loadMore:true
              })
              // save the whole voting history in an array .
              that.setData({
                votingHistory: votingHistory
              })

            }
          },
        })
        
      },
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
  },

  /**
   *Users click the top right corner to share.
   */
  onShareAppMessage: function () {

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

  // deal with the clicking on the pageUp and pageDown button
  pageChange: function (e) {
    this.setData({
      loadMore: false
    })
    // get the button type .it can be "pageUp" or "pageDown" type 
    var pageType = e.currentTarget.dataset.type;
    var page = this.data.page;
    var votingHistory = this.data.votingHistory;

    // if users click the "pageUp" button , load the next part of the voting history and save in the showing array.
    if (pageType == "up"){
      var showList = [];
      for (var i = page * 30; i < (page +1)* 30; i++) {
        showList.push(votingHistory[votingHistory.length - i - 1])
      };
      // the page number will add one 
      // whenever clicking on the "pageUp" button , that means that there are the last part of the voting history ,for which users can click on the "pageDown" button.
      this.setData({
        votingList: showList,
        page: page + 1,
        loadMore: true,
        pageDownDis:false

      })
      
      // when click on the "pageUp" button , judge if it has more next voting history to show or not .
      // if not , just disable the "pageUp" button , letting the user not able to click for loading more 
      var votingLength = votingHistory.length;
      if (votingLength % 30 != 0){
        votingLength = parseInt(votingHistory.length / 30) + 1;
      }
      if (page + 1 == votingLength){
        this.setData({ pageUpDis: true })
      }
    }
     // if users click the "pageDown" button , load the last part of the voting history and save in the showing array.
    else if (pageType == "down"){
      var showList = [];
      for (var i = (page-2) * 30; i < (page-1) * 30; i++) {
        showList.push(votingHistory[votingHistory.length - i - 1])
      };
      this.setData({
        votingList: showList,
        page: page -1,
        loadMore: true,
        pageUpDis:false
      })
      // if the first part of the voting history will be showing after this clicking operation , then disable the "pageDown" button for no more last part of voting history
      if(page-1==1){
        this.setData({ pageDownDis:true})
      }
    }
    
  },
  click: function (e) {
    var author = e.currentTarget.dataset.block.author;
    var permlink = e.currentTarget.dataset.block.authorperm.split(author+'/')[1];
    console.log("click");
    console.log(permlink);
    wx.navigateTo({
      url: '../detail/detail?author=' + author + '&permlink=' + permlink,
    })

  },
})