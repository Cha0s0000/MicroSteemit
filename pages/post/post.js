var postsData=require('../../data/posts-data.js')
Page({
  data:{
    imgUrls: [
    ]
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    // this.data.postList=postsData.postList
    var posts = [];
    var posts_data = {};
    // this.setData({
    //   posts_key:postsData.postList
    // })
    var that = this;
    wx.request({
      url: 'https://api.steemjs.com/getState?path=/trending&scope=content',
      method:'GET',
      success:function(res){
        console.log(res.data)
        var data = res.data;
        for (var post in data){
          var obj = new Object();
          var images = [];
          obj.author = data[post].author,
          obj.avatar = "https://steemitimages.com/u/" + obj.author +"/avatar/small";
          obj.permlink = data[post].permlink;
          obj.category = data[post].category;
          obj.title = that.filterBody(data[post].title);
          obj.body = that.filterBody(data[post].body);
          obj.json_metadata = data[post].json_metadata;
          images = JSON.parse(obj.json_metadata).image;
          obj.image = that.getImage(images);
          if(!obj.image)
          {
            obj.image = 'https://steemitimages.com/640x480/' + JSON.parse(obj.json_metadata).thumbnail;
          }
          obj.time = that.getTime(data[post].created);
          obj.like_num = data[post].net_votes;
          obj.comment_num = data[post].children;
          obj.pending_payout_value = "$"+data[post].pending_payout_value.replace("SBD","");
          obj.reputation = that.getReputation(data[post].author_reputation); 
          posts.push(obj);
        }     
        that.setData({
          posts_key: posts
        })
        console.log(posts);
      }

    })
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
    var nowTime = Date.now();
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
    var filter4 = filter3.replace(/[\|\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\||\\|\[|\]|\{|\}|\<|\>|\?]/g, "").replace(/^\s*/g, "").replace(/[\r\n]/g, "");
    console.log(filter4);
    return filter4;
  },

  getImage(images){
    var imgurl = 'https://steemitimages.com/640x480/' + images[0];
    return imgurl;
  }
})

