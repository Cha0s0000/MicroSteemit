// pages/login/login.js
Page({

  /**
   * initial page
   */
  data: {
  
  },

  /**
   *  Life cycle function - listen to page load
   */
  onLoad: function (options) {
    this.setData({ disabled: true })
  
  },

  /**
   *  Life cycle function - the first rendering of the listening page.
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
   *  The handle function of the bottom event on the page.
   */
  onReachBottom: function () {
  
  },

  /**
   * Users click the top right corner to share.
   */
  onShareAppMessage: function () {
  
  },

  /**
   * input name funcion
   */
  nameInput: function (e) {
    console.log(e.detail.value);
    if(e.detail.value){
      this.setData({ disabled: false });
      this.setData({
        name: e.detail.value
      })
    }
    else{
      this.setData({ disabled: true });
    }
    
  }, 

  /**
   * login function
   */
  login: function () {
    if (!this.data.name) {
      wx.showToast({
        title: 'Invalid',
        icon: 'none',
        duration: 2000
      })
    } else {
      // 这里修改成跳转的页面 
      wx.showToast({
        title: 'Success',
        icon: 'success',
        duration: 2000
      })
      wx.setStorageSync('name', this.data.name);
      wx.switchTab({
        url: '../info/info',
        success: function (e) {
          var page = getCurrentPages().pop();
          if (page == undefined || page == null) return;
          page.onLoad();
        }
      })
    }
  },

  /**
   * back function
   */
  back:function(){
    wx.switchTab({
      url: '../post/post',
      success: function (e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    })    
  }
})