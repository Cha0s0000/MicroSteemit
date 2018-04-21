// pages/market/market.js
var wxCharts = require("../../utils/wxcharts.js");
Page({

  /**
   * The initial data of the page
   */
  data: {
  
  },

  /**
   * Life cycle function - listen to page load.
   */
  onLoad: function (options) {
    var that = this;
    var priceHistory = new Object();
    priceHistory.price = [];
    priceHistory.time = [];
    wx.request({
      url: 'https://min-api.cryptocompare.com/data/histohour?fsym=STEEM&tsym=SBD&limit=6',
      method: 'GET',
      success: function (res) {
        if(res.statusCode == '200'){
          var data = res.data.Data;
          console.log(data);
          for(var i in data){
            priceHistory.price.push(data[i].close);    
            priceHistory.time.push(data[i].time);     
          }
          console.log(priceHistory);
          
        }
      },

    })
  
  },

  /**
   * Life cycle function - the first rendering of the listening page.
   */
  onReady: function () {
  
  },

  /**
   * Life cycle function - monitor page display.
   */
  onShow: function () {
  
  },

  /**
   * Life cycle function - the listening page is hidden.
   */
  onHide: function () {
  
  },

  /**
   *Life cycle function - monitor page uninstall.
   */
  onUnload: function () {
  
  },

  /**
   * Page correlation event handler - listen to the user to pull.
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * The handle function of the bottom event on the page.
   */
  onReachBottom: function () {
  
  },

  /**
   * users click the top right corner to share.
   */
  onShareAppMessage: function () {
  
  }
})