var postsData=require('../../data/posts-data.js')
Page({
  data:{
    loading:false ,
    trendingPosts:[],
    createdPosts:[],
    promotedPosts:[],
    hotPosts:[],
    postsData:[],
    categoryTabs: ['流行','最新','热门','推广'],
    scrollTop:0,
    postsSelect :'流行',
    scrollTop:0
  },
  onLoad:function(options){
    this.getTrendingPosts();
  },

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

  scroll: function (event) {
    this.setData({
      scrollTop: event.detail.scrollTop
    });
    // console.log(event.detail.scrollTop);
  },

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
  
  onShareAppMessage: function() {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  },
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

  filterBody(body){
    var str = body;
    var filter1 = str.replace(/\([^\)]*\)/g, ""); 
    var filter2 = filter1.replace(/\[[^\]]*\]/g, ""); 
    var filter3 = filter2.replace(/\<[^\>]*\>/g, ""); 
    var filter4 = filter3.replace(/[\|\~|\`|\-|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\||\\|\[|\]|\{|\}|\<|\>|\?]/g, "").replace(/^\s*/g, "").replace(/[\r\n]/g, "");
    // console.log(filter4);
    return filter4;
  },

  getImage(images){
    var imgurl = 'https://steemitimages.com/640x480/' + images[0];
    return imgurl;
  },

  getTrendingPosts(){
    this.setData({
      loading: false
    })
    var that = this;
    var posts = [];
    wx.request({
      url: 'https://api.steemjs.com/get_discussions_by_trending?query={"limit":"10","tag":""}',
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
  loadMoreTrending(){
    var lastAuthor = this.data.trendingPosts[this.data.trendingPosts.length-1].author;
    var lastPermlink = this.data.trendingPosts[this.data.trendingPosts.length - 1].permlink;
    console.log(lastAuthor);
    var that = this;
    var posts = [];
    var i=0;
    var url = 'https://api.steemjs.com/get_discussions_by_trending?query={"limit":"10","tag":"","start_author":"' + lastAuthor + '","start_permlink":"' + lastPermlink + '"}';
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
  getCreatedPosts() {
    this.setData({
      loading: false
    })
    var that = this;
    var posts = [];
    wx.request({
      url: 'https://api.steemjs.com/get_discussions_by_created?query={"limit":"10","tag":""}',
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
  loadMoreCreated() {
    var lastAuthor = this.data.createdPosts[this.data.createdPosts.length - 1].author;
    var lastPermlink = this.data.createdPosts[this.data.createdPosts.length - 1].permlink;
    console.log(lastAuthor);
    var that = this;
    var posts = [];
    var i = 0;
    var url = 'https://api.steemjs.com/get_discussions_by_created?query={"limit":"10","tag":"","start_author":"' + lastAuthor + '","start_permlink":"' + lastPermlink + '"}';
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

  getHotPosts(){
    this.setData({
      loading: false
    })
    var that = this;
    var posts = [];
    wx.request({
      url: 'https://api.steemjs.com/get_discussions_by_hot?query={"limit":"10","tag":""}',
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
  loadMoreHot() {
    var lastAuthor = this.data.hotPosts[this.data.hotPosts.length - 1].author;
    var lastPermlink = this.data.hotPosts[this.data.hotPosts.length - 1].permlink;
    console.log(lastAuthor);
    var that = this;
    var posts = [];
    var i = 0;
    var url = 'https://api.steemjs.com/get_discussions_by_hot?query={"limit":"10","tag":"","start_author":"' + lastAuthor + '","start_permlink":"' + lastPermlink + '"}';
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

  getPromotedPosts() {
    this.setData({
      loading: false
    })
    var that = this;
    var posts = [];
    wx.request({
      url: 'https://api.steemjs.com/get_discussions_by_promoted?query={"limit":"10","tag":""}',
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

  loadMorePromoted() {
    var lastAuthor = this.data.promotedPosts[this.data.promotedPosts.length - 1].author;
    var lastPermlink = this.data.promotedPosts[this.data.promotedPosts.length - 1].permlink;
    console.log(lastAuthor);
    var that = this;
    var posts = [];
    var i = 0;
    var url = 'https://api.steemjs.com/get_discussions_by_promoted?query={"limit":"10","tag":"","start_author":"' + lastAuthor + '","start_permlink":"' + lastPermlink + '"}';
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

  }
})

