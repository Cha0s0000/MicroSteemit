//app.js
App({
  onLaunch: function () {
    // get local storage
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // login with wechat account 
    wx.login({
      success: res => {
        // get data "res" after login success
      }
    })
    // get wechat account info 
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // Already authorized, you can call getUserInfo directly to get the avatar name, not the box.
          wx.getUserInfo({
            success: res => {
              // You can send the res to the background to decode the unionId.
              this.globalData.userInfo = res.userInfo

              //Since getUserInfo is a network request, it might be returned after page.onload.
              // So add a callback here to prevent this.
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    tag:''
  }
})