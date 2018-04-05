// pages/detail/detail.js
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
    commentShowState:false
  },
  onLoad: function (options) {
    
    // The page initializes options for the parameters of the page jump.
    var author = options.author;
    var permlink = options.permlink;
    console.log(permlink);
    this.setData({author:author,permlink:permlink})
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
        * 1.temArrayName: The name of the array for your call.
        * 3.bindNameReg is A community of cycles.
        * 3.total:the repl number
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
        that.setData({ detail: obj, hidden: true, tags: obj.tags ,title:obj.title,author:author,permlink:permlink})
        // console.log(obj.tags);
      }
    })
  },
  showComment:function(e){
    var author = this.data.author;
    var permlink = this. data.permlink;
    this.getPostComment(author, permlink);
    this.setData({ showState:"loading.."})
    wx.showNavigationBarLoading();
  },
  // get the first depth conment of the post
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
          obj.permlink = data[d].permlink;
          obj.avatar = "https://steemitimages.com/u/" + obj.author + "/avatar/small";
          obj.body = data[d].body;
          obj.comment_num = data[d].children;
          obj.time = that.getTime(data[d].created);
          obj.like_num = data[d].net_votes;
          obj.depth = data[d].depth;
          obj.child = 0;
          obj.pending_payout_value = "$" + data[d].pending_payout_value.replace("SBD", "");
          obj.reputation = that.getReputation(data[d].author_reputation);
          commentData.push(obj);
        }
        console.log(commentData);       
      },
      complete: function () {
        console.log("commentData");
        var replyTemArray = commentData;
        // console.log("Get comment body");
        if (commentData.length > 0) {
          for (let i = 0; i < commentData.length; i++) {
            WxParse.wxParse('reply' + i, 'md', commentData[i].body, that, 5);
            if (i === commentData.length - 1) {
              WxParse.wxParseTemArray("replyTemArray", 'reply', commentData.length, that, 5)
            }
          }
        }
        
        that.setData({ comments: commentData, showState: "Show", commentShowState:true}); 
        wx.hideNavigationBarLoading();
      }
    })
      
  },
  /**
   * deal with the clicking operation on the child comments num button
   * to deal with the showing order , i save all depth of child comments of the same  parent comments in a array.
   * if clicking on the first depth child comments ,then add the second depth child comments of this first depth comment to the array in the order after this fisrst depth comment. 
   **/
  loadChildComment:function(e){
    var that = this;
    var idx = e.currentTarget.dataset.idx;
    var originidx = e.currentTarget.dataset.originidx;
    var comment_item = e.currentTarget.dataset.item;
    var author = e.currentTarget.dataset.item.author;
    var permlink = e.currentTarget.dataset.item.permlink;
    var children = comment_item.children;
    var origin_children = [];
    var child = comment_item.child;
    var origin_depth = comment_item.depth;
    if (origin_depth == 1){
      idx= 1;
    }
    var update_item_child = "comments[" + originidx + "].child";
    var update_item_children = "comments[" + originidx + "].children";
    console.log(idx);
    console.log(comment_item);
    origin_children = this.data.comments[originidx].children;
    var ChildCommentData =[];
    
    if (origin_children){
      ChildCommentData = origin_children;
    }
    
    console.log("ChildCommentData");
    console.log(ChildCommentData);
    var data_length = 0; 
    var singleChildCommentData=[];
    wx.request({
      url: 'https://api.steemjs.com/get_content_replies?author=' + author + '&permlink=' + permlink,
      method: 'GET',
      success: function (res) {
        var data = res.data;
        var i =0;
        data_length = data.length;
        console.log("data_length");
        console.log(data_length);
        var check_exist = false;
        for (var d in data) {
          var obj = new Object();
          i = i + 1;
          obj.author = data[d].author;
          obj.avatar = "https://steemitimages.com/u/" + obj.author + "/avatar/small";
          obj.permlink = data[d].permlink;
          obj.body = data[d].body;
          obj.comment_num = data[d].children;
          obj.time = that.getTime(data[d].created);
          obj.like_num = data[d].net_votes;
          obj.depth = data[d].depth;
          obj.parent_author = data[d].parent_author;
          obj.pending_payout_value = "$" + data[d].pending_payout_value.replace("SBD", "");
          obj.reputation = that.getReputation(data[d].author_reputation);
          obj.showState = true;
          singleChildCommentData.push(obj);

          // judge the click operation if it is the fisrt clicking or not 
          if (ChildCommentData.length == 0){
            ChildCommentData.splice(idx + i, 0, obj);
          }
          // if that is not the first clicking , it means there have been child comments saved in the array .
          else{
            // everytime before adding child comments to the array , search if the same child comments if already existing in the array or not .
            for (var existChildComment in origin_children){
              // if the ont of this level child coments have already been in the array , that means this level child comments are now in showing state which they should be hidden after the clicking .
              if (origin_children[existChildComment].permlink == obj.permlink){
                // setting  the check_existing sign true means that  this level child comments will not be able to saved in the array once more .On the contrary they should be deleted for having existed in the array .
                check_exist=true;
                console.log("existChildComment");
                console.log(existChildComment);
                console.log(origin_children[existChildComment].permlink);
                ChildCommentData.splice(existChildComment,1);
                console.log(ChildCommentData);
                console.log(ChildCommentData.length);
                // when clicking the button to hide the child comments , firstly check if there have been further level child comments of this comments in the showing state or not .
                // if there have been further level child comments in the showing state , just hide them all when clicking to hide their parent comments .
                for (var j = existChildComment; j < ChildCommentData.length;j=j){
                  console.log('j');
                  console.log(j);
                  console.log("ChildCommentData_length");
                  console.log(ChildCommentData.length);
                  if (origin_children[j].depth == obj.depth) {
                    break;
                  }
                  if (origin_children[j].depth > obj.depth){
                    ChildCommentData.splice(j, 1);
                  }
                  
                }
                break;

              }
            }
            // if thses child comments have not been in the array , just add to the array in the order after the parent comment to show in the UI
            if ((origin_depth!=1)&& (!check_exist)){
              ChildCommentData.splice(idx + i, 0, obj);
              console.log("add new child");
            }
            else{
              console.log("existing ");
            } 
          }
          
        }
      },
      // after dealing with the array , set into the showing array, then can show in the page UI
      complete: function () {
        that.setData({ [update_item_child]: 1, [update_item_children]: ChildCommentData });
        console.log("childComments");
        console.log(ChildCommentData);
        console.log(that.data.comments[originidx])
      }
    })
      
  },
  // according to the parent comments , loading different depth of child comments data
  getChildComment(author, permlink){
    var that = this;
    var ChildCommentData = [];
    wx.request({
      url: 'https://api.steemjs.com/get_content_replies?author=' + author + '&permlink=' + permlink,
      method: 'GET',
      success: function (res) {
        var data = res.data;
        // console.log(data);
        for (var d in data) {
          var obj = new Object();
          obj.author = data[d].author;
          obj.avatar = "https://steemitimages.com/u/" + obj.author + "/avatar/small";
          obj.body = data[d].body;
          obj.comment_num = data[d].children;
          obj.time = that.getTime(data[d].created);
          obj.like_num = data[d].net_votes;
          obj.depth = data[d].depth;
          obj.parent_author = data[d].parent_author;
          obj.pending_payout_value = "$" + data[d].pending_payout_value.replace("SBD", "");
          obj.reputation = that.getReputation(data[d].author_reputation);
          ChildCommentData.push(obj);
        }
      },
      complete: function () {
      }
    })
  },
  
})