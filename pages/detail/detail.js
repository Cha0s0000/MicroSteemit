// pages/detail/detail.js
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    detail: {},
    hidden: false,
    tags: {},
    comments: {},
    replyTemArray: {},
    tittle: "",
    author: "",
    permlink: "",
    childComments: [],
    showState: "Show",
    commentShowState: false,
    commentBoxContent: ""
  },
  onLoad: function (options) {

    // The page initializes options for the parameters of the page jump.
    var author = options.author;
    var permlink = options.permlink;
    console.log(permlink);
    this.setData({ author: author, permlink: permlink })
    this.getPostdDtail(author, permlink);
    // this.getPostComment(author,permlink);

  },
  onShareAppMessage: function () {
    return {
      title: this.data.title,
      desc: "Steemit",
      path: '/pages/post/post?sharePage=detail&author=' + this.data.author + '&permlink=' + this.data.permlink
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
    var nowTime = Date.now();
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
  getPostdDtail(author, permlink) {
    var that = this;
    var obj = new Object();
    wx.request({
      url: 'https://openjoy.club/post/get_content?author=' + author + '&permlink=' + permlink,
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
        obj.voteOrNot = 0;
        that.voteOrNot(data.author, data.permlink, -1, -1, 'detail');
        that.setData({ detail: obj, hidden: true, tags: obj.tags, title: obj.title, author: author, permlink: permlink })
        // console.log(obj.tags);
      }
    })
  },
  showComment: function (e) {
    var author = this.data.author;
    var permlink = this.data.permlink;
    this.getPostComment(author, permlink);
    this.setData({ showState: "loading.." })
    wx.showNavigationBarLoading();
  },
  // get the first depth conment of the post
  getPostComment(author, permlink) {
    var that = this;
    var commentData = [];
    wx.request({
      url: 'https://openjoy.club/post/get_content_replies?author=' + author + '&permlink=' + permlink,
      method: 'GET',
      success: function (res) {
        var data = res.data;
        // console.log(data);
        for (var d in data) {
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
          that.voteOrNot(data[d].author, data[d].permlink, d, -1, 'comment');
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

        that.setData({ comments: commentData, showState: "Refresh", commentShowState: false });
        wx.hideNavigationBarLoading();
      }
    })

  },
  /**
   * deal with the clicking operation on the child comments num button
   * to deal with the showing order , i save all depth of child comments of the same  parent comments in a array.
   * if clicking on the first depth child comments ,then add the second depth child comments of this first depth comment to the array in the order after this fisrst depth comment. 
   **/
  loadChildComment: function (e) {
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
    if (origin_depth == 1) {
      idx = 1;
    }
    var update_item_child = "comments[" + originidx + "].child";
    var update_item_children = "comments[" + originidx + "].children";
    console.log(idx);
    console.log(comment_item);
    origin_children = this.data.comments[originidx].children;
    var ChildCommentData = [];

    if (origin_children) {
      ChildCommentData = origin_children;
    }

    console.log("ChildCommentData");
    console.log(ChildCommentData);
    var data_length = 0;
    var singleChildCommentData = [];
    wx.request({
      url: 'https://openjoy.club/post/get_content_replies?author=' + author + '&permlink=' + permlink,
      method: 'GET',
      success: function (res) {
        var data = res.data;
        var i = 0;
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
          if (ChildCommentData.length == 0) {
            ChildCommentData.splice(idx + i, 0, obj);
            that.voteOrNot(data[d].author, data[d].permlink, idx - 1, originidx, 'childComment');
          }
          // if that is not the first clicking , it means there have been child comments saved in the array .
          else {
            // everytime before adding child comments to the array , search if the same child comments if already existing in the array or not .
            for (var existChildComment in origin_children) {
              // if the ont of this level child coments have already been in the array , that means this level child comments are now in showing state which they should be hidden after the clicking .
              if (origin_children[existChildComment].permlink == obj.permlink) {
                // setting  the check_existing sign true means that  this level child comments will not be able to saved in the array once more .On the contrary they should be deleted for having existed in the array .
                check_exist = true;
                console.log("existChildComment");
                console.log(existChildComment);
                console.log(origin_children[existChildComment].permlink);
                ChildCommentData.splice(existChildComment, 1);
                console.log(ChildCommentData);
                console.log(ChildCommentData.length);
                // when clicking the button to hide the child comments , firstly check if there have been further level child comments of this comments in the showing state or not .
                // if there have been further level child comments in the showing state , just hide them all when clicking to hide their parent comments .
                for (var j = existChildComment; j < ChildCommentData.length; j = j) {
                  console.log('j');
                  console.log(j);
                  console.log("ChildCommentData_length");
                  console.log(ChildCommentData.length);
                  if (origin_children[j].depth == obj.depth) {
                    break;
                  }
                  if (origin_children[j].depth > obj.depth) {
                    ChildCommentData.splice(j, 1);
                  }

                }
                break;

              }
            }
            // if thses child comments have not been in the array , just add to the array in the order after the parent comment to show in the UI
            if ((origin_depth != 1) && (!check_exist)) {
              ChildCommentData.splice(idx + i, 0, obj);
              console.log("add new child");
              that.voteOrNot(data[d].author, data[d].permlink, idx + i, originidx, 'childComment');
            }
            else {
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
  getChildComment(author, permlink) {
    var that = this;
    var ChildCommentData = [];
    wx.request({
      url: 'https://openjoy.club/post/get_content_replies?author=' + author + '&permlink=' + permlink,
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
        url: 'https://openjoy.club/post/get_active_votes?author=' + that.data.author + '&permlink=' + that.data.permlink,
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

  // deal with the clicking to pop up the box for inputing comment
  showCommentBox: function (e) {
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
      commentAnimationData: animation.export()
    })
    setTimeout(function () {
      animation.opacity(1).rotateX(0).step();
      this.setData({
        commentAnimationData: animation
      })
      if (currentStatu == "close") {
        this.setData(
          {
            commentShowModalStatus: false
          }
        );
      }
    }.bind(this), 200)
    var payout = 0;
    // show
    if (currentStatu == "open") {
      this.setData({
        commentShowModalStatus: true,
        submitCommentAuthor: detail.author,
        submitCommentPermlink: detail.permlink,
        commentSubmitButton: true
      })
    }
  },

  // dynamically get the content of the comment box 
  inputComment: function (e) {
    var content = e.detail.value;
    if (content) {
      console.log(content);
      WxParse.wxParse('commentPreview', 'md', content, this, 5);
      this.setData({ commentContent: content, commentSubmitButton: false })
    }
    else {
      this.setData({ commentContent: content, commentSubmitButton: true })
    }
  },

  // cancel the comment box 
  cancelComment: function (e) {
    var animation = wx.createAnimation({
      duration: 200,  //Animation duration
      timingFunction: "linear", //linear  
      delay: 0  //0 means not delay 
    });
    this.animation = animation;
    animation.opacity(0).rotateX(-100).step();
    this.setData({
      commentAnimationData: animation.export()
    })
    setTimeout(function () {
      animation.opacity(1).rotateX(0).step();
      this.setData({
        commentAnimationData: animation
      })
      this.setData(
        {
          commentShowModalStatus: false
        }
      );
    }.bind(this), 200)
  },

  // submit the comment
  submitComment: function (e) {
    var commentContent = this.data.commentContent;
    var name = wx.getStorageSync('name');
    if (name) {
      var key = wx.getStorageSync('pass');
      var author = this.data.submitCommentAuthor;
      var permlink = this.data.submitCommentPermlink;
      var that = this;
      wx.request({
        url: 'https://openjoy.club/operation/comment',
        method: 'POST',
        data: {
          account: name,
          key: key,
          author: author,
          permlink: permlink,
          content: commentContent
        },
        success: function (res) {
          console.log(res);
          if (res.statusCode == '200' && res.data.message == 'success') {
            that.cancelComment();
            wx.showToast({
              title: 'Reply Success',
              icon: 'success',
              duration: 2000
            })
          }
          else {
            wx.showModal({
              title: 'Error',
              content: 'Something error with connection!',
              success: function (res) {
                if (res.confirm) {
                  console.log('Something error with connection!')
                } else if (res.cancel) {
                  console.log('Something error with connection!')
                }
              }
            })

          }
        }
      })
    }
  },
  // identify whether the post has been voted by the account or not 
  voteOrNot: function (author, permlink, index, originidx, category) {
    var that = this;
    var currentAccount = wx.getStorageSync('name');
    if (currentAccount) {
      wx.request({
        url: 'https://openjoy.club/post/get_active_votes?author=' + author + '&permlink=' + permlink,
        method: 'GET',
        success: function (e) {
          console.log("request for active votes");
          if (e.statusCode == '200') {
            var activeVotes = e.data
            for (var vote in activeVotes) {
              if (activeVotes[vote].voter == currentAccount) {
                console.log("I am one of the voters");
                if (category == 'detail') {
                  var postDetail = that.data.detail;
                  postDetail.voteOrNot = 1;
                  that.setData({ detail: postDetail });
                  console.log("update detail of voting or not")
                  console.log(postDetail)
                }
                else if (category == 'comment') {
                  var comments = that.data.comments;
                  comments[index].voteOrNot = 1;
                  that.setData({ comments: comments });
                  console.log("update comment of voting or not")
                  console.log(comments)
                }
                else {
                  var childComments = that.data.comments;
                  childComments[originidx].children[index].voteOrNot = 1;
                  that.setData({ comments: childComments });
                  console.log("update childComments of voting or not")
                  console.log("originindex:" + originidx + "index:" + index);
                  console.log(childComments)
                }
                break;
              }
            }
          }
        }
      })
    }
  },

  //clicking the voting button to select the vote weight
  showVoteWeightSlider: function (e) {
    var name = wx.getStorageSync('name');
    if (name) {
      var voteOrNot = e.currentTarget.dataset.voteornot;
      if (voteOrNot != 2) {
        var index = e.currentTarget.dataset.index;
        var state = e.currentTarget.dataset.state;
        if (index == '-1') {
          console.log("showVotingSlider of detail");
          var addVoteToDetail = this.data.detail;
          addVoteToDetail.vote = (state == 1 ? 0 : 1);
          addVoteToDetail.voteWeight = 10000;
          console.log(state);
          this.setData({ detail: addVoteToDetail })
        }
        else {
          if (e.currentTarget.dataset.rootindex == '-1') {
            console.log(e.currentTarget.dataset.rootindex);
            console.log("showVotingSlider of comments");
            var addVoteWeightToComment = this.data.comments;
            addVoteWeightToComment[index].vote = (state == 1 ? 0 : 1);
            addVoteWeightToComment[index].voteWeight = 10000;
            this.setData({ comments: addVoteWeightToComment })
          }
          else {

            console.log("showVotingSlider of childcomments");
            var addVoteWeightToChildComment = this.data.comments;
            addVoteWeightToChildComment[e.currentTarget.dataset.rootindex].children[index].voteWeight = 10000;
            addVoteWeightToChildComment[e.currentTarget.dataset.rootindex].children[index].vote = (state == 1 ? 0 : 1);
            this.setData({ comments: addVoteWeightToChildComment })
          }
        }
      }
    }
    else {
      wx.showModal({
        title: 'Login',
        content: 'Please login first',
        success: function (res) {
          if (res.confirm) {
            console.log('confirm')
          } else if (res.cancel) {
            console.log('cancel')
          }
        }
      })
    }
  },

  //slide the slider to set the vote wight
  setVoteWeight: function (e) {
    var index = e.currentTarget.dataset.index;
    var voteWeight = e.detail.value * 100;
    if (index == '-1') {
      var addVoteWeightToDetail = this.data.detail;
      addVoteWeightToDetail.voteWeight = voteWeight;
      console.log(voteWeight);
      this.setData({ detail: addVoteWeightToDetail })
    }
    else {
      if (e.currentTarget.dataset.rootindex == '-1') {
        var addVoteWeightToComment = this.data.comments;
        addVoteWeightToComment[index].voteWeight = voteWeight;
        console.log(voteWeight);
        this.setData({ comments: addVoteWeightToComment })
      }
      else {
        var addVoteWeightToChildComment = this.data.comments;
        addVoteWeightToChildComment[e.currentTarget.dataset.rootindex].children[index].voteWeight = voteWeight;
        console.log(voteWeight);
        this.setData({ comments: addVoteWeightToChildComment })
      }
    }
  },

  //vote the post
  voteThePost: function (e) {
    var index = e.currentTarget.dataset.index;
    if (index == '-1') {
      var addVoteStateToDetail = this.data.detail;
      addVoteStateToDetail.voteOrNot = 2;
      addVoteStateToDetail.vote = 0;
      this.setData({ detail: addVoteStateToDetail })
    }
    else {
      if (e.currentTarget.dataset.rootindex == '-1') {
        var addVoteWeightToComment = this.data.comments;
        addVoteWeightToComment[index].voteOrNot = 2;
        addVoteWeightToComment[index].vote = 0;
        this.setData({ comments: addVoteWeightToComment })
      }
      else {
        var addVoteWeightToChildComment = this.data.comments;
        addVoteWeightToChildComment[e.currentTarget.dataset.rootindex].children[index].voteOrNot = 2;
        addVoteWeightToChildComment[e.currentTarget.dataset.rootindex].children[index].vote = 0;
        this.setData({ comments: addVoteWeightToChildComment })
      }
    }

    var item = e.currentTarget.dataset.item;
    console.log("vote detail : author:" + item.author + "&permlink:" + item.permlink + "&weight:" + item.voteWeight);
    var author = item.author;
    var permlink = item.permlink;
    var voteWeight = item.voteWeight;
    var name = wx.getStorageSync('name');
    var key = wx.getStorageSync('pass');
    var that = this;
    wx.request({
      url: 'https://openjoy.club/operation/vote?voter=' + name + '&author=' + author + '&permlink=' + permlink + '&weight=' + voteWeight + '&key=' + key,
      method: 'GET',
      success: function (res) {
        console.log(res);
        if (res.statusCode == '200' && res.data.message == 'success') {
          if (index == '-1') {
            addVoteStateToDetail.voteOrNot = (voteWeight == 0 ? 0 : 1);
            that.setData({ detail: addVoteStateToDetail })
          }
          else {
            if (e.currentTarget.dataset.rootindex == '-1') {
              addVoteWeightToComment[index].voteOrNot = (voteWeight == 0 ? 0 : 1);
              that.setData({ comments: addVoteWeightToComment })
            }
            else {
              addVoteWeightToChildComment[e.currentTarget.dataset.rootindex].children[index].voteOrNot = (voteWeight == 0 ? 0 : 1);
              that.setData({ comments: addVoteWeightToChildComment })
            }
          }
        }
        else {
          if (index == '-1') {
            addVoteStateToDetail.voteOrNot = 0;
            that.setData({ detail: addVoteStateToDetail })
          }
          else {
            if (e.currentTarget.dataset.rootindex == '-1') {
              addVoteWeightToComment[index].voteOrNot = 0;
              that.setData({ comments: addVoteWeightToComment })
            }
            else {
              addVoteWeightToChildComment[e.currentTarget.dataset.rootindex].children[index].voteOrNot = 0;
              that.setData({ comments: addVoteWeightToChildComment })
            }
          }
          wx.showModal({
            title: 'Error',
            content: 'Something error with connection!',
            success: function (res) {
              if (res.confirm) {
                console.log('Something error with connection!')
              } else if (res.cancel) {
                console.log('Something error with connection!')
              }
            }
          })

        }
      }
    })
  },

  /*
    click on the share button to show the QR code of the post link
  */
  showQRcode: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    var animation = wx.createAnimation({
      duration: 200,  //Animation duration
      timingFunction: "linear", //linear  
      delay: 0  //0 means not delay 
    });
    this.animation = animation;
    animation.opacity(0).rotateX(-100).step();
    this.setData({
      QRcodeAnimationData: animation.export()
    })
    setTimeout(function () {
      animation.opacity(1).rotateX(0).step();
      this.setData({
        QRcodeAnimationData: animation
      })
      if (currentStatu == "close") {
        this.setData(
          {
            QRcodeShowModalStatus: false
          }
        );
      }
    }.bind(this), 200)
    // show
    if (currentStatu == "open") {
      this.setData({
        QRcodeShowModalStatus: true,
      })
      const qrcode = require('../../utils/qrcode/index');
      let link = 'https://steemit.com/@' + this.data.author + '/' + this.data.permlink;
      qrcode.drawQRCodeToCanvas(link, {
        ctx: 'qrcode',
        size: 200,
        color: '#CC6600',
        padding: 16,
        background: '#FFCC99'
      });
      let qrcode0 = qrcode.outputQRCodeBase64(link, {
        size: 400,
        color: '#CC6600',
        padding: 16,
        background: '#FFCC99'
      });

      this.setData({
        qrcode0
      })

    }
  },

})