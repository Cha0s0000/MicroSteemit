var postsData=require('../../data/posts-data.js')
var app = getApp();
Page({
    /**
   * initial page
   */
  data:{
    loading:false ,
    trendingPosts:[],
    createdPosts:[],
    promotedPosts:[],
    hotPosts:[],
    postsData:[],
    // ther are several types of post including trending , new created ,promoted ,hot 
    categoryTabs: ['流行','最新','热门','推广'],
    scrollTop:0,
    postsSelect :'流行',
    scrollTop:0
  },

   /**
   * Life cycle function - listen to page load.
   */
  onLoad:function(options){
    wx.getClipboardData({
      success: function (res) {
        console.log(res.data)
        var linkData = res.data;
        if (linkData.indexOf('https://steemit.com/') >= 0){
          wx.showModal({
            title: 'Clipboard Detection',
            content: 'Would you like to open this url?   ' + linkData,
            success: function (res) {
              if (res.confirm) {
                var linkAuthor = linkData.split('https://steemit.com/')[1].split('@')[1].split('/')[0];
                var linkEnd = linkData.split('https://steemit.com/')[1].split('@')[1].split('/')[1];
                console.log(linkAuthor);
                console.log(linkEnd);
                if(linkEnd){
                  if (linkEnd == 'feed'){
                    wx.navigateTo({
                      url: '../feed/feed?author=' + linkAuthor,
                    })
                  }
                  else if (linkEnd == 'comments'){
                    wx.navigateTo({
                      url: '../commentsHistory/commentsHistory?author=' + linkAuthor,
                    })
                  }
                  else if (linkEnd == 'recent-replies') {
                    wx.navigateTo({
                      url: '../replyHistory/replyHistory?author=' + linkAuthor,
                    })
                  }
                  else if (linkEnd == 'transfers') {
                    wx.navigateTo({
                      url: '../profile/profile?account=' + linkAuthor,
                    })
                  }
                  else if (linkEnd == 'settings') {
                    wx.navigateTo({
                      url: '../profile/profile?account=' + linkAuthor,
                    })
                  }
                  else{
                    wx.navigateTo({
                      url: '../detail/detail?author=' + linkAuthor + '&permlink=' + linkEnd,
                    })
                  }
                }
                else{
                    wx.navigateTo({
                      url: '../profile/profile?account=' + linkAuthor,
                    })
                }
                
              } else if (res.cancel) {
                console.log('cancel the log out ')
              }
            }
          })        

        }
      }
    })
    var tag = app.globalData.tag;
    this.setData({curTag:tag});
    console.log("current tag is ");
    console.log(tag);
    if(!tag){
      tag = "All";
    }
    this.setData({ open: false, currentTag: tag})
    this.getTrendingPosts();
  },

  // monitoring the change of different types of showing posts
  changeCategory:function(event){
    var chid = event.target.dataset.id;
    console.log(chid);
    if (this.data.postsSelect == chid){
      return false
    }
    this.setData({ 
      postsSelect:chid,
      scrollTop:0
      });
    if(chid == '流行'){
      if (this.data.trendingPosts.length ==0){
        console.log("getting trending");
        this.getTrendingPosts();
      }
      else{
        console.log("loading existing trending");
        this.setData({ postsData: this.data.trendingPosts})
      }
    }
    else if(chid =='最新'){
      if (this.data.createdPosts.length == 0) {
        this.getCreatedPosts();
      }
      else {
        console.log("loading existing created");
        this.setData({ postsData: this.data.createdPosts })
      }    
    }
    else if (chid == '热门') {
      if (this.data.hotPosts.length == 0) {
        this.getHotPosts();
      }
      else {
        console.log("loading existing created");
        this.setData({ postsData: this.data.hotPosts })
      }
    }
    else if (chid == '推广') {
      if (this.data.promotedPosts.length == 0) {
        this.getPromotedPosts();
      }
      else {
        console.log("loading existing created");
        this.setData({ postsData: this.data.promotedPosts })
      }
    }
  },

// mornitoring the scroll action
  scroll: function (event) {
    this.setData({
      scrollTop: event.detail.scrollTop
    });
    // console.log(event.detail.scrollTop);
  },

// whle pull down the app , the page will refresh
  onPullDownRefresh: function () {
    var category = this.data.postsSelect;
    wx.showNavigationBarLoading();
    switch(category){
      case "流行": this.getTrendingPosts();break;
      case "最新": this.getCreatedPosts(); break;
      case "热门": this.getHotPosts(); break;
      case "推广": this.getPromotedPosts(); break;
    }
    
    wx.stopPullDownRefresh() ;
    
  },

  // monitoring the click function of the view item
  click:function(e){
    if (this.tapEndTime - this.tapStartTime < 350) {
      console.log("short tap");
      var author = e.currentTarget.dataset.block.author;
      var permlink = e.currentTarget.dataset.block.permlink;
      console.log("click");
      console.log(author);
      wx.navigateTo({
        url: '../detail/detail?author=' + author +'&permlink=' + permlink,
      })
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
          if (existList){
            newList = existList.concat(block2Arr);
          }
          else{
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

// when the page reach the bottom of the page , js  will go on to request for more data 
  onReachBottom:function(e){
    console.log("refresh");
    this.setData({ loading:false});
    var category = this.data.postsSelect;
    switch (category) {
      case "流行": this.loadMoreTrending(); break;
      case "最新": this.loadMoreCreated(); break;
      case "热门": this.loadMoreHot(); break;
      case "推广": this.loadMorePromoted(); break;
    }
  },
  
  // when clicking the share button
  onShareAppMessage: function() {
    // Users click the top right corner to share.
    return {
      title: 'title', // sharing title
      desc: 'desc', // sharing description
      path: 'path' // sharing page
    }
  },

  // convert the created time to the time from now
  getTime(time){
    var postTime = new Date(time);
    // console.log(Date.parse(postTime));
    var nowTime = Date.now() - 28800000;
    // console.log(nowTime);
    var ago = nowTime - postTime;
    if(ago/1000/60/60/24 >= 1){
      var dayNum = parseInt(ago/1000/60/60/24);
      var getTimeData = dayNum.toString();
      getTimeData+="天前";
      // console.log(getTimeData);
      return getTimeData;
    }
    else if (ago/1000/60/60 >= 1){
      var hourNum = parseInt(ago/1000/60/60);
      var getTimeData = hourNum.toString();
      getTimeData += "小时前";
      // console.log(getTimeData);
      return getTimeData;
    }
    else if (ago/1000/60 >= 1) {
      var minNum = parseInt(ago/1000/60);
      var getTimeData = minNum.toString();
      getTimeData += "分钟前";
      // console.log(getTimeData);
      return getTimeData;
    }
    else if (ago/1000 >= 1) {
      var secNum = parseInt(ago/ 1000);
      var getTimeData = secNum.toString();
      getTimeData += "秒前";
      // console.log(getTimeData);
      return getTimeData;
    }
    else{
      var getTimeData = "1秒前";
      return getTimeData;
    }
  },
  // convert the vesting to the reputation 
  getReputation(rep){
    if(rep == 0){
      return 25
    }
    var score = (Math.log10(Math.abs(rep)) - 9) * 9 + 25;
    if (rep < 0){
      score = 50 - score;
    }
    return Math.round(score);
  },

// filter the content body to just get some of the text to show in the right short description
  filterBody(body){
    var str = body;
    var filter1 = str.replace(/\([^\)]*\)/g, ""); 
    var filter2 = filter1.replace(/\[[^\]]*\]/g, ""); 
    var filter3 = filter2.replace(/\<[^\>]*\>/g, ""); 
    var filter4 = filter3.replace(/[\|\~|\`|\-|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\||\\|\[|\]|\{|\}|\<|\>|\?]/g, "").replace(/^\s*/g, "").replace(/[\r\n]/g, "");
    // console.log(filter4);
    return filter4;
  },

  // get the  thumbnail showing in the left 
  getImage(images){
    var imgurl = 'https://steemitimages.com/640x480/' + images[0];
    return imgurl;
  },

  // get the trending post 
  getTrendingPosts(){
    this.setData({
      loading: false
    })
    var that = this;
    var posts = [];
    var tag = this.data.curTag;
    wx.request({
      url: 'https://api.steemjs.com/get_discussions_by_trending?query={"limit":"10","tag":"' + tag+'"}',
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
          obj.pending_payout_value = "$" + payout.toFixed(2);
          obj.total_payout_value = "$" + data[post].total_payout_value.replace("SBD", "");
          obj.curator_payout_value = "$" + data[post].curator_payout_value.replace("SBD", "");
          obj.promoted = "$" + data[post].promoted.replace("SBD", "");
          obj.reputation = that.getReputation(data[post].author_reputation);
          posts.push(obj);
        }
        console.log(posts);
        that.setData({
          postsData: posts,
          trendingPosts:posts,
          loading: true
        })
        wx.hideNavigationBarLoading();
      }
    })
  },
  // when scroll down , load more data of the trending posts
  loadMoreTrending(){
    var lastAuthor = this.data.trendingPosts[this.data.trendingPosts.length-1].author;
    var lastPermlink = this.data.trendingPosts[this.data.trendingPosts.length - 1].permlink;
    console.log(lastAuthor);
    var that = this;
    var posts = [];
    var tag = this.data.curTag;
    var i=0;
    var url = 'https://api.steemjs.com/get_discussions_by_trending?query={"limit":"10","tag":"'+tag +'","start_author":"' + lastAuthor + '","start_permlink":"' + lastPermlink + '"}';
    console.log(url);
    wx.request({
      url: url,
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        var data = res.data;
        for (var post in data) {
          if(i == 0){
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
          obj.total_payout_value = "$" + data[post].total_payout_value.replace("SBD", "");
          obj.curator_payout_value = "$" + data[post].curator_payout_value.replace("SBD", "");
          obj.promoted = "$" + data[post].promoted.replace("SBD", "");
          obj.reputation = that.getReputation(data[post].author_reputation);
          posts.push(obj);
        }
        console.log(posts);
        that.setData({
          postsData: that.data.trendingPosts.concat(posts),
          trendingPosts: that.data.trendingPosts.concat(posts),
          loading: true
        })
        wx.hideNavigationBarLoading();
      }
    })

  },
  // get new created posts
  getCreatedPosts() {
    this.setData({
      loading: false
    })
    var that = this;
    var posts = [];
    var tag = this.data.curTag;
    wx.request({
      url: 'https://api.steemjs.com/get_discussions_by_created?query={"limit":"10","tag":"'+tag +'"}',
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
          obj.total_payout_value = "$" + data[post].total_payout_value.replace("SBD", "");
          obj.curator_payout_value = "$" + data[post].curator_payout_value.replace("SBD", "");
          obj.promoted = "$" + data[post].promoted.replace("SBD", "");
          obj.reputation = that.getReputation(data[post].author_reputation);
          posts.push(obj);
        }
        console.log(posts);
        that.setData({
          postsData: posts,
          createdPosts:posts,
          loading: true
        })
        wx.hideNavigationBarLoading();
      }
    })
  },
  // load more data from new created posts
  loadMoreCreated() {
    var lastAuthor = this.data.createdPosts[this.data.createdPosts.length - 1].author;
    var lastPermlink = this.data.createdPosts[this.data.createdPosts.length - 1].permlink;
    console.log(lastAuthor);
    var that = this;
    var posts = [];
    var i = 0;
    var tag = this.data.curTag;
    var url = 'https://api.steemjs.com/get_discussions_by_created?query={"limit":"10","tag":"'+tag+'","start_author":"' + lastAuthor + '","start_permlink":"' + lastPermlink + '"}';
    console.log(url);
    wx.request({
      url: url,
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
          obj.total_payout_value = "$" + data[post].total_payout_value.replace("SBD", "");
          obj.curator_payout_value = "$" + data[post].curator_payout_value.replace("SBD", "");
          obj.promoted = "$" + data[post].promoted.replace("SBD", "");
          obj.reputation = that.getReputation(data[post].author_reputation);
          posts.push(obj);
        }
        console.log(posts);
        that.setData({
          postsData: that.data.createdPosts.concat(posts),
          createdPosts: that.data.createdPosts.concat(posts),
          loading: true
        })
        wx.hideNavigationBarLoading();
      }
    })

  },
// get the hot posts
  getHotPosts(){
    this.setData({
      loading: false
    })
    var that = this;
    var posts = [];
    var tag = this.data.curTag;
    wx.request({
      url: 'https://api.steemjs.com/get_discussions_by_hot?query={"limit":"10","tag":"'+tag+'"}',
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
          obj.total_payout_value = "$" + data[post].total_payout_value.replace("SBD", "");
          obj.curator_payout_value = "$" + data[post].curator_payout_value.replace("SBD", "");
          obj.promoted = "$" + data[post].promoted.replace("SBD", "");
          obj.reputation = that.getReputation(data[post].author_reputation);
          posts.push(obj);
        }
        console.log(posts);
        that.setData({
          postsData: posts,
          hotPosts: posts,
          loading: true
        })
        wx.hideNavigationBarLoading();
      }
    })

  },
  // load more data from the hot posts
  loadMoreHot() {
    var lastAuthor = this.data.hotPosts[this.data.hotPosts.length - 1].author;
    var lastPermlink = this.data.hotPosts[this.data.hotPosts.length - 1].permlink;
    console.log(lastAuthor);
    var that = this;
    var posts = [];
    var tag = this.data.curTag;
    var i = 0;
    var url = 'https://api.steemjs.com/get_discussions_by_hot?query={"limit":"10","tag":"'+tag+'","start_author":"' + lastAuthor + '","start_permlink":"' + lastPermlink + '"}';
    console.log(url);
    wx.request({
      url: url,
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
          obj.total_payout_value = "$" + data[post].total_payout_value.replace("SBD", "");
          obj.curator_payout_value = "$" + data[post].curator_payout_value.replace("SBD", "");
          obj.promoted = "$" + data[post].promoted.replace("SBD", "");
          obj.reputation = that.getReputation(data[post].author_reputation);
          posts.push(obj);
        }
        console.log(posts);
        that.setData({
          postsData: that.data.hotPosts.concat(posts),
          hotPosts: that.data.hotPosts.concat(posts),
          loading: true
        })
        wx.hideNavigationBarLoading();
      }
    })

  },
// get promoted posts
  getPromotedPosts() {
    this.setData({
      loading: false
    })
    var that = this;
    var posts = [];
    var tag = this.data.curTag;
    wx.request({
      url: 'https://api.steemjs.com/get_discussions_by_promoted?query={"limit":"10","tag":"'+tag+'"}',
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
          obj.reputation = that.getReputation(data[post].author_reputation);
          obj.total_payout_value = "$" + data[post].total_payout_value.replace("SBD", "");
          obj.curator_payout_value = "$" + data[post].curator_payout_value.replace("SBD", "");
          obj.promoted = "$" + data[post].promoted.replace("SBD", "");
          posts.push(obj);
        }
        console.log(posts);
        that.setData({
          postsData: posts,
          promotedPosts: posts,
          loading: true
        })
        wx.hideNavigationBarLoading();
      }
    })

  },
// load more promoted posts
  loadMorePromoted() {
    var lastAuthor = this.data.promotedPosts[this.data.promotedPosts.length - 1].author;
    var lastPermlink = this.data.promotedPosts[this.data.promotedPosts.length - 1].permlink;
    console.log(lastAuthor);
    var that = this;
    var posts = [];
    var tag = this.data.curTag;
    var i = 0;
    var url = 'https://api.steemjs.com/get_discussions_by_promoted?query={"limit":"10","tag":"'+tag+'","start_author":"' + lastAuthor + '","start_permlink":"' + lastPermlink + '"}';
    console.log(url);
    wx.request({
      url: url,
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
          obj.total_payout_value = "$" + data[post].total_payout_value.replace("SBD", "");
          obj.curator_payout_value = "$" + data[post].curator_payout_value.replace("SBD", "");
          obj.promoted = "$" + data[post].promoted.replace("SBD", "");
          obj.reputation = that.getReputation(data[post].author_reputation);
          posts.push(obj);
        }
        console.log(posts);
        that.setData({
          postsData: that.data.promotedPosts.concat(posts),
          promotedPosts: that.data.promotedPosts.concat(posts),
          loading: true
        })
        wx.hideNavigationBarLoading();
      }
    })

  },
  showTags:function(e){
    var that =this;
    var tagsList = [];
    if (!this.data.open){
      wx.request({
        url: 'https://api.steemjs.com/get_trending_tags?limit=15',
        method: 'GET',
        success: function(res) {
          if(res.statusCode == '200'){
            var tagsDatas = res.data;
            for (var tagsData in tagsDatas){
              if (tagsData == 0){
                continue;
              }
              var obj = new Object();
              obj.tag = tagsDatas[tagsData].name;
              tagsList.push(obj);
            }
            console.log(tagsList);
            that.setData({ tagsList: tagsList})
          }
        },
        complete: function(res) {},
      })
    }
    this.data.open ? this.setData({ open: false }) : this.setData({ open: true });
  },
  searchTags:function(e){
    wx.navigateTo({
      url: '../search/search'
    })
  },
  clickTags:function(e){
    var clickTag = e.currentTarget.dataset.tag;
    console.log("clickTag");
    console.log(clickTag);
    app.globalData.tag = clickTag;
    this.onLoad();
    this.setData({ open: false })
  },
  off_canvas:function(e){
    this.setData({ open: false })
  },
  touchMove:function(e){
    this.setData({ open: false })
  },
  clickCategory:function(e){
    var clickCategory = e.currentTarget.dataset.category;
    app.globalData.tag = clickCategory;
    this.onLoad();
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
  clickAuthor:function(e){
    var account = e.currentTarget.dataset.author;
    wx.navigateTo({
      url: '../profile/profile?account=' + account
    })
  }
})

