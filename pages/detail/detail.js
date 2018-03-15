// pages/detail/detail.js
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    detail: {},
    hidden: false,
    tags:{},
    comments:{},
    replyTemArray:{},
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var author = options.author;
    var permlink = options.permlink;
    console.log(permlink);
    this.getPostdDtail(author,permlink);
    this.getPostComment(author,permlink);
    
  },
  onReady: function () { 
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  getContent: function (author,permlink) {
    var p = this;
    console.log('p.data.id: ' + p.data.id);
    wx.request({
      url: 'https://cnodejs.org/api/v1/topic/' + p.data.id,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        //console.log(res.data.data); 
        var result = res.data.data;
        var content = result.content;
        //console.log(content);      
        p.setData({ detail: result, hidden: true });
        WxParse.wxParse('content', 'html', content, p, 5);

        var repliesArray = result.replies;
        var l = 100;
        if (repliesArray.length < l) {
          l = repliesArray.length;
        }
        var replyArr = [];
        for (var i = 0; i < l; i++) {
          if (repliesArray[i].content) {
            var c = repliesArray[i].content;
            if (c.length > 0) {
              replyArr.push(repliesArray[i].content);
            }
          }
        }
        /**
        * WxParse.wxParseTemArray(temArrayName,bindNameReg,total,that)
        * 1.temArrayName: 为你调用时的数组名称
        * 3.bindNameReg为循环的共同体 如绑定为reply1，reply2...则bindNameReg = 'reply'
        * 3.total为reply的个数
        */
        console.log('replies:' + replyArr.length);
        if (replyArr.length > 0) {
          for (let i = 0; i < replyArr.length; i++) {
            WxParse.wxParse('reply' + i, 'html', replyArr[i], p);
            if (i === replyArr.length - 1) {
              WxParse.wxParseTemArray("replyTemArray", 'reply', replyArr.length, p)
            }
          }
        }
      }
    });
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
        obj.avatar = "https://steemitimages.com/u/" + obj.author + "/avatar/small";
        obj.category = data.category;
        obj.title = data.title;
        obj.body = data.body;
        obj.time = that.getTime(data.created);
        obj.like_num = data.net_votes;
        obj.comment_num = data.children;
        obj.pending_payout_value = "$" + data.pending_payout_value.replace("SBD", "");
        obj.reputation = that.getReputation(data.author_reputation);
        obj.tags = JSON.parse(data.json_metadata).tags;
        WxParse.wxParse('content', 'md', obj.body, that, 5);
        that.setData({ detail: obj, hidden: true, tags: obj.tags })
        // console.log(obj.tags);
      }
    })
  },
  getPostComment(author,permlink){
    var that = this;
    var commentData= [];
    wx.request({
      url: 'https://api.steemjs.com/get_content_replies?author=' + author + '&permlink=' + permlink,
      method: 'GET',
      success: function (res) {
        var data = res.data;
        // console.log(data);
        for(var d in data){
          var obj = new Object();
          obj.author = data[d].author;
          obj.avatar = "https://steemitimages.com/u/" + obj.author + "/avatar/small";
          obj.body = data[d].body;
          obj.time = that.getTime(data[d].created);
          obj.like_num = data[d].net_votes;
          obj.depth = data[d].depth;
          obj.pending_payout_value = "$" + data[d].pending_payout_value.replace("SBD", "");
          obj.reputation = that.getReputation(data[d].author_reputation);
          commentData.push(obj);
        }
        console.log(commentData);       
        // that.setData({ comments: commentData }); 
      },
      complete: function () {
        
        var replyTemArray = commentData;
        console.log("Get comment body");
        if (commentData.length > 0) {
          for (let i = 0; i < commentData.length; i++) {
            WxParse.wxParse('reply' + i, 'md', commentData[i].body, that, 5);
            if (i === commentData.length - 1) {
              WxParse.wxParseTemArray("replyTemArray", 'reply', commentData.length, that, 5)
            }
          }
        }
        that.setData({ comments: commentData }); 
      }
    })
      
  }
})