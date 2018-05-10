// pages/postEditor/postEditor.js
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * The initial data of the page.
   */
  data: {
    tags: [],
    hidden:true

  },

  /**
   * Life cycle function - listen to page load.
   */
  onLoad: function (options) {


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
   *Users click the top right corner to share.
   */
  onShareAppMessage: function () {
    return {
      title: 'MicroSteemit',
      desc: "Steemit",
      path: '/pages/post/post'
    }

  },

  /**
   *dynamically get the content of the post title
    */
  inputTitle: function (e) {
    var content = e.detail.value;
    if (content) {
      console.log(content);
      this.setData({ postTitle: content })
    }
    else {
      // no content in the title box OR delete all content 
      this.setData({ postTitle: "" })

    }
  },

  /**
   *dynamically get the content of the post content box
    */
  inputContent: function (e) {
    var content = e.detail.value;
    if (content) {
      console.log(content);
      WxParse.wxParse('postContentPreview', 'md', content, this, 5);
      this.setData({ postContent: content })
    }
    else {
      this.setData({ postContent: "" })
    }
  },
  /**
   *input the tag
    */
  inputTag: function (e) {
    var content = e.detail.value;
    if (content) {
      console.log(content);
      this.setData({ postTag: content })
    }
    else {

    }
  },
  /**
    *add the specified tag to tags box
     */
  addTag: function (e) {
    var tag = this.data.postTag;
    var newTags = [];
    if (tag) {
      var firstStr = /[a-z]/;
      var endStr = /[0-9a-z]/;
      if (firstStr.test(tag.substring(0, 1)) && endStr.test(tag.substring(tag.length - 1, tag.length))) {
        if (this.data.tags.length == 0) {
          newTags.push(tag);
        }
        else {
          newTags = this.data.tags;
          newTags.push(tag);
        }
        this.setData({ tags: newTags });
      }
      else {
        wx.showModal({
          title: 'Error',
          content: 'Wrong tag',
        })

      }
    }
    else {
      wx.showModal({
        title: 'Error',
        content: 'Tag can`t be NULL',
      })
    }
    this.setData({ newTag: "", postTag: "" })
  },
  /**
     *delete the tag from current tags
      */
  deleteTag: function (e) {
    var tagIndex = e.currentTarget.dataset.tagindex;
    var currentTags = this.data.tags;
    currentTags.splice(tagIndex, 1)
    this.setData({ tags: currentTags })
  },
  /**
       *submit the post
        */
  submitPost: function (e) {
    var postTitle = this.data.postTitle;
    var postContent = this.data.postContent;
    var tags = this.data.tags;
    if (postTitle && postContent && (tags.length>0)) {
      // all the necessary items have been with content.
      this.setData({ hidden:false});
      var name = wx.getStorageSync('name');
      var key = wx.getStorageSync('pass');
      var that = this;
      wx.request({
        url: 'https://openjoy.club/operation/post',
        method: 'POST',
        data: {
          account: name,
          tags:tags,
          key: key,
          title: postTitle,
          body: postContent,
        },
        success: function (res) {
          console.log(res);
          that.setData({ hidden: true })
          if (res.statusCode == '200' && res.data.message == 'success') {
            wx.showToast({
              title: 'Post Success',
              icon: 'success',
              duration: 2000
            })
          }
          else {
            wx.showModal({
              title: 'Error',
              content: 'Something error!',
              success: function (res) {
                if (res.confirm) {
                  console.log('Something error!')
                } else if (res.cancel) {
                  console.log('Something error!')
                }
              }
            })

          }
        }
      })
    }
    else{
      wx.showModal({
        title: 'Error',
        content: 'Pls fill in all contents',
      })
    }
  }
})