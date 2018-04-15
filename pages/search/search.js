// pages/search/search.js
var WxSearch = require('wxSearchView.js');
var app = getApp();
Page({

  /**
   * initial data of the page.
   */
  data: {
  
  },

  /**
   * Life cycle function - listen to page loading.
   */
  onLoad: function () {
    var that = this;
    var tagsList = [];
    wx.request({
      url: 'https://api.steemjs.com/get_trending_tags?limit=30',
      method: 'GET',
      success: function (res) {
        if (res.statusCode == '200') {
          var tagsDatas = res.data;
          for (var tagsData in tagsDatas) {
            if (tagsData == 0) {
              continue;
            }
            tagsList.push(tagsDatas[tagsData].name);
          }
        }
      },
      complete: function (res) {
        // init the Wxsearch
        WxSearch.init(
          that, 
          tagsList, 
          [],
          that.mySearchFunction, 
          that.myGobackFunction 
        );
       },
    })
    
  },
  // transpond functions
  wxSearchInput: WxSearch.wxSearchInput,  
  wxSearchKeyTap: WxSearch.wxSearchKeyTap,  
  wxSearchDeleteAll: WxSearch.wxSearchDeleteAll, 
  wxSearchConfirm: WxSearch.wxSearchConfirm,  
  wxSearchClear: WxSearch.wxSearchClear, 

  // The callback function of the searching
  mySearchFunction: function (value) {
    app.globalData.tag = value;
    console.log(app.globalData.tag);
    // navigate back the post page
    wx.switchTab({
      url: '../post/post',
      success: function (e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      } 
    })
  },

  //  The callback function when  searching nothing
  myGobackFunction: function () {
   // navigate back the post page
    wx.switchTab({
      url: '../post/post',
    })
  },

  /**
   * Life cycle function - the first rendering of the listening page.
   */
  onReady: function () {
  
  },

  /**
   * Life cycle function - monitor page displaying.
   */
  onShow: function () {
  
  },

  /**
   *Life cycle function -  monitor page  hidden.
   */
  onHide: function () {
  
  },

  /**
   * Life cycle function - monitor page uninstall.
   */
  onUnload: function () {
  
  },

  /**
   * Page correlation event handler - monitor the user pulling down.
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * Page correlation event handler - monitor the touching bottom.
   */
  onReachBottom: function () {
  
  },

  /**
   * Users click the top right corner to share.
   */
  onShareAppMessage: function () {
  
  }
})