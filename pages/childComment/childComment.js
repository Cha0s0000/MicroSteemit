// pages/childComment/childComment.js
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    detail: {},
    hidden: false,
    tags:{},
    comments:{},
    replyTemArray:{},
    tittle:"",
    author:"",
    permlink:"",
    childComments:[],
    showState:"Show",
    commentShowState:false,
    commentBoxContent:""
  },
  onLoad: function (options) {
    
    // The page initializes options for the parameters of the page jump.
    var author = options.author;
    var permlink = options.permlink;
    var parent_author = options.parent_author;
    var parent_permlink = options.parent_permlink;
    console.log(permlink);
    this.setData({ author: author, permlink: permlink, parent_author: parent_author, parent_permlink: parent_permlink})
    this.getPostdDtail(author,permlink);
    // this.getPostComment(author,permlink);
    
  },
  onShareAppMessage: function () {
    return {
      title: this.data.title,
      desc: "Steemit",
      path: '/detail/detail?author=' + this.data.author + '&permlink=' + this.data.permlink
    }
  },
  onReady: function () { 
    //Page rendering complete
  },
  onShow: function () {
    //Page shows
  },
  onHide: function () {
    // Page hide
  },
  onUnload: function () {
    // Page close
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
// Get the body and other detail info of the post whose permlink was transmitted by navigating 
  getPostdDtail(author,permlink){
    var that = this;
    var obj = new Object();
    wx.request({
      url: 'https://api.steemjs.com/get_content?author=' + author + '&permlink=' + permlink,
      method: 'GET',
      success: function (res) {
        var data = res.data;
        // console.log(data)
        obj.author = data.author;
        obj.permlink = data.permlink;
        obj.avatar = "https://steemitimages.com/u/" + obj.author + "/avatar/small";
        obj.category = data.category;
        obj.title = data.title;
        obj.body = data.body;
        obj.time = that.getTime(data.created);
        obj.like_num = data.net_votes;
        obj.comment_num = data.children;
        obj.pending_payout_value = "$" + data.pending_payout_value.replace("SBD", "");
        obj.total_payout_value = "$" + data.total_payout_value.replace("SBD", "");
        obj.curator_payout_value = "$" + data.curator_payout_value.replace("SBD", "");
        obj.promoted = "$" + data.promoted.replace("SBD", "");
        obj.reputation = that.getReputation(data.author_reputation);
        obj.tags = JSON.parse(data.json_metadata).tags;
        WxParse.wxParse('content', 'md', obj.body, that, 5);
        that.setData({ detail: obj, hidden: true, tags: obj.tags ,title:obj.title,author:author,permlink:permlink})
        // console.log(obj.tags);
      }
    })
  },

  // navigate to full content
  
})