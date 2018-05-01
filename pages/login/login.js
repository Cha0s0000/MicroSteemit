// pages/login/login.js
var fun_aes = require('../../utils/aes.js')
var key = fun_aes.CryptoJS.enc.Utf8.parse("3454345434543454");  
var iv = fun_aes.CryptoJS.enc.Utf8.parse('6666666666666666');  
Page({

  /**
   * initial page
   */
  data: {
    hidden:true
  
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
   * input name function
   */
  nameInput: function (e) {
    console.log(e.detail.value);
    this.setData({ name: e.detail.value});
    if(e.detail.value && this.data.password){
      this.setData({ disabled: false });
    }
    else{
      this.setData({ disabled: true });
    }
    
  }, 

  /**
   * input password function
   */
  passwordInput:function(e){
    this.setData({ password: e.detail.value });
    if (e.detail.value && this.data.name) {
      this.setData({ disabled: false });
    }
    else {
      this.setData({ disabled: true });
    }
  },

  /**
   * login function
   */
  login: function () {
    if (!this.data.name || !this.data.password) {
      wx.showToast({
        title: 'Invalid',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.setData({ hidden:false});
      var str_aes_encode = this.Encrypt(this.data.password);
      console.log("After Encrypt: " + str_aes_encode);
       var that = this;
      wx.request({
        url: 'http://192.168.137.138:3000/operation/wif_is_valid?account=' + that.data.name + '&key=' + str_aes_encode,
        method:'GET',
        success:function(res){
          console.log(res.data);
          that.setData({ hidden: true });
          if(res.statusCode == '200' && res.data.message == 'success'){
            wx.showToast({
              title: 'Login Success',
              icon: 'success',
              duration: 2000
            })
            wx.setStorageSync('name', that.data.name);
            wx.setStorageSync('pass', str_aes_encode);
            wx.switchTab({
              url: '../info/info',
              success: function (e) {
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onLoad();
              }
            })
          }
          else{
            wx.showToast({
              title: 'Login Fail',
              icon: 'none',
              duration: 2000
            })
            that.onLoad();
          }
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
  },

  // AES Encrypt function
  Encrypt: function (word) {
    var srcs = fun_aes.CryptoJS.enc.Utf8.parse(word);
    var encrypted = fun_aes.CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: fun_aes.CryptoJS.mode.CBC, padding: fun_aes.CryptoJS.pad.Pkcs7 });
    return encrypted.ciphertext.toString().toUpperCase();
  },

  // click to scan the QR code to get private key
  scanLogin:function(e){
    wx.scanCode({
      success: (res) => {
        console.log(res);
        this.setData({ privateKey: res.result, disabled: false, password:res.result})
      },
      fail: (res) => {
        console.log(res);
      }
    })  
  }
})