// pages/steemitWorld/steemitWorld.js
var interval;
var varName;
var ctx = wx.createCanvasContext('canvasArcCir');

Page({

  /**
   * The initial data of the page.
   */
  data: {
    hidden:true,
    loadingProgress:false
  
  },

  /**
   * Life cycle function - listen to page load.
   */
  onLoad: function (options) {
    this.drawCircle();
    var account = wx.getStorageSync('name');
    var that = this;
    var operations = [];
    wx.request({
      url: 'https://api.steemjs.com/get_account_history?account=' + account+'&from=-1&limit=300',
      method: 'GET',
      success: function (res) {
        if (res.statusCode == '200') {
          var data = res.data;
          for (var d in data){
            var obj = new Object();
            var opDetail = data[d][1].op[1];
            var opCategory = data[d][1].op[0];
            var timestamp = data[d][1].timestamp;
            obj.category = opCategory;
            obj.detail = opDetail;
            obj.timestamp = timestamp;
            operations.push(obj);
           
          }
          that.setData({ operations: operations.reverse()})
          console.log(operations);
        }
      },
      complete: function (res) {
        
      },
    })
  
  },

  /**
   *Life cycle function - the first rendering of the listening page.
   */
  onReady: function () {
    // draw the blank circle in the canvas
    var cxt_arc = wx.createCanvasContext('canvasCircle');
    cxt_arc.setLineWidth(6);
    cxt_arc.setStrokeStyle('#eaeaea');
    cxt_arc.setLineCap('round');
    cxt_arc.beginPath();
    cxt_arc.arc(100, 100, 96, 0, 2 * Math.PI, false);
    cxt_arc.stroke();
    cxt_arc.draw();
  
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
   * Life cycle function - monitor page uninstall.
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
   * Users click the top right corner to share.
   */
  onShareAppMessage: function () {
  
  },

  /**
   * filter operation name
   */
  filterName:function(name){
    return name.replace('_','-');
  },

  /**
   * draw the progress circle
   */
  drawCircle: function () {
    var that = this;
    clearInterval(varName);
    function drawArc(s, e) {
      ctx.setFillStyle('white');
      ctx.clearRect(0, 0, 200, 200);
      ctx.draw();
      var x = 100, y = 100, radius = 96;
      ctx.setLineWidth(5);
      ctx.setStrokeStyle('#d81e06');
      ctx.setLineCap('round');
      ctx.beginPath();
      ctx.arc(x, y, radius, s, e, false);
      ctx.stroke()
      ctx.draw()
    }
    var step = 1, startAngle = 1.5 * Math.PI, endAngle = 0;
    var animation_interval = 100, n = 100;
    var animation = function () {
      if (step <= n) {
        endAngle = step * 2 * Math.PI / n + 1.5 * Math.PI;
        drawArc(startAngle, endAngle);
        step++;
      } else {
        clearInterval(varName);
        that.setData({ loadingProgress: true});
        
      }
      that.setData({ circleProgress: ((step-1)*100/n).toFixed(0)});
    };
    varName = setInterval(animation, animation_interval);
  }

})