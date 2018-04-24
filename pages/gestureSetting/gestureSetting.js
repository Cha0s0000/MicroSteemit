// pages/gestureSetting/gestureSetting.js
var wxlocker = require("../../utils/wxlocker.js");
Page({
  data: {
    title: '请设置手势密码',
    resetHidden: false,
    titleColor: "",
    lockSign:true
  },

  // pgae init
  onLoad: function (options) {
    wxlocker.lock.init();
    this.initState();
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {
  },

  onUnload: function () {

  },
  //Set the prompt and reset button.
  initState: function () {
    var resetHidden = wxlocker.lock.resetHidden;
    var title = wxlocker.lock.title;
    var titleColor = wxlocker.lock.titleColor;
    this.setData({
      resetHidden: resetHidden,
      title: title,
      titleColor: titleColor
    });
  },
  //touchstart bind
  touchS: function (e) {
    wxlocker.lock.bindtouchstart(e);
  },

  //touchmove bind
  touchM: function (e) {
    wxlocker.lock.bindtouchmove(e);
  },

  //touchend bind
  touchE: function (e) {
    wxlocker.lock.bindtouchend(e, this.lockSucc);
    this.initState();
  },

  //Unlock successfully callback function.
  lockSucc: function () {
    this.setData({lockSign:false});
    console.log("解锁成功！");
    //do something
  },
  lockreset: function () {
    wxlocker.lock.updatePassword();
    this.initState();
  }
})