// pages/market/market.js
var wxCharts = require("../../utils/wxcharts.js");
var lineChart = null;
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
    var priceMax = 1;
    var priceMin = 0;
    priceHistory.price = [];
    priceHistory.time = [];
    wx.request({
      url: 'https://min-api.cryptocompare.com/data/histoday?fsym=STEEM&tsym=SBD&limit=20',
      method: 'GET',
      success: function (res) {
        if(res.statusCode == '200'){
          var data = res.data.Data;
          console.log(data);
          for(var i in data){
            priceHistory.price.push(data[i].close);    
            priceHistory.time.push(that.getTime(data[i].time*1000));     
          }
          console.log(priceHistory);
          priceMax= Math.max.apply(null, priceHistory.price);
          priceMin = Math.min.apply(null, priceHistory.price);
        }
      },
      complete:function(res){
        var windowWidth = 320;
        try {
          var res = wx.getSystemInfoSync();
          windowWidth = res.windowWidth;
        } catch (e) {
          console.error('getSystemInfoSync failed!');
        }
        lineChart = new wxCharts({
          canvasId: 'priceHistory',
          type: 'line',
          categories: priceHistory.time,
          animation: true,
          // background: '#f5f5f5',
          series: [{
            name: 'STEEM/SBD',
            data: priceHistory.price,
            format: function (val, name) {
              return val.toFixed(4);
            }
          }],
          xAxis: {
            disableGrid: true
          },
          yAxis: {
            title: 'STEEM/SBD',
            format: function (val) {
              return val.toFixed(2);
            },
            min: priceMin - 0.01,
            max: priceMax+0.01
          },
          width: windowWidth,
          height: 200,
          dataLabel: false,
          dataPointShape: true,
          legend:true,
          extra: {
            lineStyle: 'curve'
          }
        });
      }
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
      getTimeData += "days ago";
      // console.log(getTimeData);
      return getTimeData;
    }
    else if (ago / 1000 / 60 / 60 >= 1) {
      var hourNum = parseInt(ago / 1000 / 60 / 60);
      var getTimeData = hourNum.toString();
      getTimeData += "hours ago";
      // console.log(getTimeData);
      return getTimeData;
    }
    else if (ago / 1000 / 60 >= 1) {
      var minNum = parseInt(ago / 1000 / 60);
      var getTimeData = minNum.toString();
      getTimeData += "mins ago";
      // console.log(getTimeData);
      return getTimeData;
    }
    else if (ago / 1000 >= 1) {
      var secNum = parseInt(ago / 1000);
      var getTimeData = secNum.toString();
      getTimeData += "secs ago";
      // console.log(getTimeData);
      return getTimeData;
    }
    else {
      var getTimeData = "1sec ago";
      return getTimeData;
    }
  },

  touchHandler: function (e) {
    console.log(lineChart.getCurrentDataIndex(e));
    lineChart.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {
        return category + '\r\n ' + item.name + ':' + item.data
      }
    });
  },  

  updateData:function(e){
    var that = this;
    var priceHistory = new Object();
    var priceMax = 1;
    var priceMin = 0;
    priceHistory.price = [];
    priceHistory.time = [];
    wx.request({
      url: 'https://min-api.cryptocompare.com/data/histoday?fsym=STEEM&tsym=SBD&limit=20',
      method: 'GET',
      success: function (res) {
        if (res.statusCode == '200') {
          var data = res.data.Data;
          console.log(data);
          for (var i in data) {
            priceHistory.price.push(data[i].close);
            priceHistory.time.push(that.getTime(data[i].time * 1000));
          }
          console.log(priceHistory);
          priceMax = Math.max.apply(null, priceHistory.price);
          priceMin = Math.min.apply(null, priceHistory.price);
        }
      },
      complete:function(res){
        var updateSeries = [{
            name: 'STEEM/SBD',
            data: priceHistory.price,
            format: function (val, name) {
              return val.toFixed(4);
            }
          }];
        lineChart.updateData({
          categories: priceHistory.time,
          series: updateSeries
        });
      }
    })
  }
})