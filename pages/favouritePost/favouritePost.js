// pages/favouritePost/favouritePost.js
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
            info_title: "Favourite posts",
            hidden: true
          })
        }
      },
      complete: function (res) {
        var authorPosts = [];
        // var that = this;
        var cacheList = wx.getStorageSync('favouritePosts');
        console.log(cacheList);
        that.setData({
          postsData: cacheList,
          loading: true
        })
        wx.hideNavigationBarLoading();


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
  },
  click: function (e) {
    var author = e.currentTarget.dataset.block.author;
    var permlink = e.currentTarget.dataset.block.permlink;
    console.log("click");
    console.log(author);
    wx.navigateTo({
      url: '../detail/detail?author=' + author + '&permlink=' + permlink,
    })

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
})