// pages/steemitWorld/steemitWorld.js

/**
    * Initial canvas.
 */
var interval;
var varName;
var ctx = wx.createCanvasContext('canvasArcCir');

Page({

  /**
   * The initial data of the page.
   */
  data: {
    hidden:true,
    loadingProgress:false,
    typeID: 0,
    isLoading: true,
    loadOver: false,
    dateList: [],
    typeList:[],
    filterList:[],
    dateChioceIcon: "/images/icon/icon-go-black.png",
    typeChioceIcon: "/images/icon/icon-go-black.png",
    chioceDate: false,
    chioceType: false,
    chioceFilter: false,
    activeDateName: "Date",
    scrollTop: 0,
    scrollIntoView: 0,
    activeTypeIndex: -1,
    activeTypeName: "Category"
  
  },

  /**
   * Life cycle function - listen to page load.
   */
  onLoad: function (options) {
    // Showing the loading progress before finish dealing with the acount data
    this.drawCircle();
    var account = wx.getStorageSync('name');
    var that = this;
    var operations = [];
    var requestDateList =[];
    var requestTypeList = [];
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
            var timestampDate = new Date(timestamp);
            var filterDate = timestampDate.toLocaleDateString();
            obj.category = opCategory;
            obj.detail = opDetail;
            obj.timestamp = timestamp;
            obj.filterDate = filterDate;
            operations.push(obj);
            requestDateList.push(filterDate);
            requestTypeList.push(opCategory);
          }
          operations.reverse();
          that.setData({ operations: operations, savedOperations: operations})
          console.log(operations);
          
        }
      },
      complete: function (res) {
        var dateListSet = new Set(requestDateList);
        var operationDateList = Array.from(dateListSet);
        console.log(operationDateList)
        var typeListSet = new Set(requestTypeList);
        var operationTypeList = Array.from(typeListSet);
        console.log(operationTypeList)
        that.setData({ operationDateList: operationDateList, operationTypeList: operationTypeList})
        
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

    // draw into the canvas according to the current progress
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
    // start drawing from 1.5 Math.PI.
    var step = 1, startAngle = 1.5 * Math.PI, endAngle = 0;
    var animation_interval = 100, n = 100;

    // dynamic drawing
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
    // set interval to continously draw
    varName = setInterval(animation, animation_interval);
  },

  /**
   * show filter item list
   */
  choiceItem: function (e) {
    switch (e.currentTarget.dataset.item) {
      case "1":
        if (this.data.chioceDate) {
          this.setData({
            dateChioceIcon: "/images/icon/icon-go-black.png",
            typeChioceIcon: "/images/icon/icon-go-black.png",
            chioceDate: false,
            chioceType: false,
            chioceFilter: false,
          });
        }
        else {
          var baseDateList= ['ALL'];
          baseDateList = baseDateList.concat(this.data.operationDateList);
          this.setData({
            dateChioceIcon: "/images/icon/icon-down-black.png",
            typeChioceIcon: "/images/icon/icon-go-black.png",
            chioceDate: true,
            chioceType: false,
            chioceFilter: false,
            dateList: baseDateList
          });
        }
        break;
      case "2":
        if (this.data.chioceType) {
          this.setData({
            dateChioceIcon: "/images/icon/icon-go-black.png",
            typeChioceIcon: "/images/icon/icon-go-black.png",
            chioceDate: false,
            chioceType: false,
            chioceFilter: false,
          });
        }
        else {
          var baseTypeList = ['ALL'];
          baseTypeList = baseTypeList.concat(this.data.operationTypeList);
          this.setData({
            dateChioceIcon: "/images/icon/icon-go-black.png",
            typeChioceIcon: "/images/icon/icon-down-black.png",
            chioceDate: false,
            chioceType: true,
            chioceFilter: false,
            typeList: baseTypeList
          });
        }
        break;
      case "3":
        if (this.data.chioceFilter) {
          this.setData({
            dateChioceIcon: "/images/icon/icon-go-black.png",
            typeChioceIcon: "/images/icon/icon-go-black.png",
            chioceDate: false,
            chioceType: false,
            chioceFilter: false,
          });
        }
        else {
          this.setData({
            dateChioceIcon: "/images/icon/icon-go-black.png",
            typeChioceIcon: "/images/icon/icon-go-black.png",
            chioceDate: false,
            chioceType: false,
            chioceFilter: true,
          });
        }
        break;
    }
  },

  /**
   * hide the filter list when click on the mask
   */
  hideAllChioce: function () {
    this.setData({
      dateChioceIcon: "/images/icon/icon-go-black.png",
      typeChioceIcon: "/images/icon/icon-go-black.png",
      chioceDate: false,
      chioceType: false,
      chioceFilter: false,
    });
  },

  /**
   * select the type of operations
   */
  selectType: function (e) {
    var index = e.currentTarget.dataset.index;
    var activeTypeName = this.data.typeList[index];
    var activeDateName = this.data.activeDateName;
    this.setData({
      typeChioceIcon: "/images/icon/icon-go-black.png",
      chioceType: false,
      activeTypeIndex: index,
      activeTypeName: activeTypeName,
      typeList: [],
    })
    var currentOperations = this.data.savedOperations;
    var newOperations = [];
    for(var item in currentOperations){
      if (activeTypeName !='ALL'){
        if (currentOperations[item].category == activeTypeName){
          if (activeDateName != 'Date' && activeDateName != 'ALL' ){
            if (currentOperations[item].filterDate == activeDateName) {
              newOperations.push(currentOperations[item])
            }
          }
          else{
            newOperations.push(currentOperations[item])
          }
          
          
        }
      }
      else{
        if (activeDateName != 'Date' && activeDateName != 'ALL') {
          if (currentOperations[item].filterDate == activeDateName) {
            newOperations.push(currentOperations[item])
          }
        }
        else{
          newOperations = currentOperations
        }
      }
    }
    this.setData({ operations: newOperations})
  },

  /**
 * select the date of operations
 */
  selectDate: function (e) {
    var index = e.currentTarget.dataset.index;
    var activeDateName = this.data.dateList[index];
    var activeTypeName = this.data.activeTypeName;
    this.setData({
      dateChioceIcon: "/images/icon/icon-go-black.png",
      chioceDate: false,
      activeDateIndex: index,
      activeDateName: activeDateName,
      dateList: [],
    })
    var currentOperations = this.data.savedOperations;
    var newOperations = [];
    for (var item in currentOperations) {
      if (activeDateName != 'ALL'){
        if (currentOperations[item].filterDate == activeDateName) {
          if (activeTypeName != 'Category' && activeTypeName != 'ALL') {
            if (currentOperations[item].category == activeTypeName) {
              newOperations.push(currentOperations[item])
            }
          }
          else {
            newOperations.push(currentOperations[item])
          }


        }
      }
      else {
        if (activeTypeName != 'Date' && activeTypeName != 'ALL') {
          if (currentOperations[item].category == activeTypeName) {
            newOperations.push(currentOperations[item])
          }
        }
        else {
          newOperations = currentOperations
        }
      }
    }
    this.setData({ operations: newOperations })
  },
})