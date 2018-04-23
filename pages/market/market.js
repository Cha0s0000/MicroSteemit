// pages/market/market.js
var wxCharts = require("../../utils/wxcharts.js");
var lineChart = null; 
Page({

  /**
   * The initial data of the page
   */
  data: {
    hidden: false,
    currentTimeIndex:'day',
  
  },

  /**
   * Life cycle function - listen to page load.
   */
  onLoad: function (options) {
    this.showChart();
    this.showTable();
     
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
    this.setData({ hidden:false})
    this.onLoad();
  
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
    var nowTime = Date.now();
    console.log(nowTime);
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
      getTimeData += "时前";
      // console.log(getTimeData);
      return getTimeData;
    }
    else if (ago / 1000 / 60 >= 1) {
      var minNum = parseInt(ago / 1000 / 60);
      var getTimeData = minNum.toString();
      getTimeData += "分前";
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

  touchHandler: function (e) {
    console.log(lineChart.getCurrentDataIndex(e));
    lineChart.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  }, 

  //deal with the clicking on the chart 
  updateData:function(e){
    var that = this;
    var priceHistory = new Object();
    var priceMax = 1;
    var priceMin = 0;
    priceHistory.price = [];
    priceHistory.time = [];
    wx.request({
      url: 'https://min-api.cryptocompare.com/data/histo' + that.data.currentTimeIndex+'?fsym=STEEM&tsym=SBD&limit=20',
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
  },

  //get request for showing the chart  
  showChart:function(){
    var that = this;
    var priceHistory = new Object();
    var priceMax = 1;
    var priceMin = 0;
    priceHistory.price = [];
    priceHistory.time = [];
    wx.request({
      url: 'https://min-api.cryptocompare.com/data/histo' + that.data.currentTimeIndex+'?fsym=STEEM&tsym=SBD&limit=20',
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
          that.setData({ priceHistory: priceHistory});
          priceMax = Math.max.apply(null, priceHistory.price);
          priceMin = Math.min.apply(null, priceHistory.price);
        }
      },
      complete: function (res) {
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
            max: priceMax + 0.01
          },
          width: windowWidth,
          height: 200,
          dataLabel: false,
          dataPointShape: true,
          legend: true,
          extra: {
            lineStyle: 'curve'
          }
        });
      }
    })
  },

  //get request for showing the table  
  showTable:function(){
    var that = this;
    var steemPrice = new Object();
    steemPrice.price = [];
    steemPrice.time = [];
    var sbdPrice = new Object();
    sbdPrice.price = [];
    sbdPrice.time = [];
    wx.request({
      url: 'https://min-api.cryptocompare.com/data/histo' + that.data.currentTimeIndex+'?fsym=STEEM&tsym=USD&limit=20',
      method: 'GET',
      success: function (res) {
        if (res.statusCode == '200') {
          var data = res.data.Data;
          console.log(data);
          for (var i in data) {
            steemPrice.price.push(data[i].close);
            steemPrice.time.push(that.getTime(data[i].time * 1000));
          }
          console.log(steemPrice);
          that.setData({ steemPrice: steemPrice });
        }
      },
      complete:function(res){
        wx.request({
          url: 'https://min-api.cryptocompare.com/data/histo' + that.data.currentTimeIndex+'?fsym=STEEM&tsym=USD&limit=20',
          method: 'GET',
          success: function (res) {
            if (res.statusCode == '200') {
              var data = res.data.Data;
              console.log(data);
              for (var i in data) {
                sbdPrice.price.push(data[i].close);
                sbdPrice.time.push(that.getTime(data[i].time * 1000));
              }
              console.log(sbdPrice);
              that.setData({ sbdPrice: sbdPrice,hidden:true});
            }
          },
        })
        
      }

    })    
  },

  onPeriodSelectorClick:function(e){
    var currentIndex = e.currentTarget.dataset.index;
    console.log("currentIndex");
    console.log(currentIndex)
    this.setData({ hidden: false, currentTimeIndex:currentIndex})
    this.onLoad();
  }
})