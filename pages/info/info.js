// pages/info/info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    steemitname:"",
    about:"'",
    location:"",
    avatar: "",
    reputation:"",
    balance:"",
    sbd_balance:"",
    vesting_shares:"",
    voting_power:"",
    created:"",
    postkey:"",
    activekey:"",
    ownerkey:"",
    memokey:"",
    account_auths:[],
    hidden:false,
    steem_power:"",
    delegated_steem_power:"",
    post_button:"show",
    active_button: "show",
    memo_button: "show",
    owner_button: "show",
    post_key_hid:true,
    active_key_hid: true,
    owner_key_hid: true,
    memo_key_hid: true,
    average_market_bandwidth:0,
    available_bandwidth:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.steem_per_mvests();
    var that = this;
    wx.request({
      // 由于没有域名，这行先注释，测试域名
      url: 'https://steemit.com/@cha0s0000.json',
      method: 'GET',
      success: function (res) {
        console.log(res);
        if(res.data.status == '200')
        {
          that.vests_to_sp(parseFloat(res.data.user.vesting_shares), parseFloat(res.data.user.delegated_vesting_shares));
          that.get_follower_following();
          that.setData({
            avatar: res.data.user.json_metadata.profile.profile_image,
            balance: res.data.user.balance,
            created: res.data.user.created,
            post_count : res.data.user.post_count,
            sbd_balance: res.data.user.sbd_balance,
            vesting_shares: parseInt(res.data.user.vesting_shares),
            voting_power: String(res.data.user.voting_power).substr(0,2),
            reputation: that.getReputation(res.data.user.reputation),
            average_market_bandwidth: res.data.user.average_market_bandwidth,
            steemitname: res.data.user.json_metadata.profile.name,
            about: res.data.user.json_metadata.profile.about,
            location: res.data.user.json_metadata.profile.location,
            postkey: res.data.user.posting.key_auths[0][0],
            activekey: res.data.user.active.key_auths[0][0],
            ownerkey: res.data.user.owner.key_auths[0][0],
            memokey: res.data.user.memo_key,
            account_auths: res.data.user.posting.account_auths,
            witness_votes: res.data.user.witness_votes,
            hidden:true



          })
        }
        that.calc_bandwidth();
      } 
    })
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  getReputation(rep) {
    if (rep == 0) {
      return 25
    }
    var score = (Math.log10(Math.abs(rep)) - 9) * 9 + 25;
    if (rep < 0) {
      score = 50 - score;
    }
    return Math.round(score);
  },

  vests_to_sp(vests,dvests){
    var that =this;
    var total_vesting_fund_steem=0;
    var total_vesting_shares=0;
    var sp=0;
    var d_sp=0;
    console.log(vests);
    wx.request({
      url: 'https://api.steemjs.com/get_state?path=/@cha0s0000',
      method: 'GET',
      success: function (res) {
        console.log(res);
        if (res.statusCode == '200') {
             total_vesting_fund_steem= parseFloat(res.data.props.total_vesting_fund_steem);
             total_vesting_shares=  parseFloat(res.data.props.total_vesting_shares);
             sp= vests / 1000000 * total_vesting_fund_steem / (total_vesting_shares / 1000000);
             d_sp = dvests / 1000000 * total_vesting_fund_steem / (total_vesting_shares / 1000000);
        }      
        console.log(total_vesting_shares);
        that.setData({ steem_power: sp.toFixed(2), delegated_steem_power:d_sp.toFixed(2)})
      }
    })
    
  },
  
  show_hid:function(e){
    var type_key = e.currentTarget.dataset.type;
    console.log(type_key);
    switch(type_key){
      case "post":
        var button_state = this.data.post_button;
        var key_state = this.data.post_key_hid;
        this.setData({ post_button: button_state =='show' ? 'hidden' : 'show' , post_key_hid: !key_state});
        break;
      case "active":
        var button_state = this.data.active_button;
        var key_state = this.data.active_key_hid;
        this.setData({ active_button: button_state == 'show' ? 'hidden' : 'show', active_key_hid: !key_state });
        break;
      case "owner":
        var button_state = this.data.owner_button;
        var key_state = this.data.owner_key_hid;
        this.setData({ owner_button: button_state == 'show' ? 'hidden' : 'show', owner_key_hid: !key_state });
        break;
      case "memo":
        var button_state = this.data.memo_button;
        var key_state = this.data.memo_key_hid;
        this.setData({ memo_button: button_state == 'show' ? 'hidden' : 'show', memo_key_hid: !key_state });
        break;
    }
  },
  get_follower_following() {
    var that = this;
    wx.request({
      url: 'https://api.steemjs.com/get_follow_count?account=cha0s0000',
      method: 'GET',
      success: function (res) {
        console.log(res);
        if (res.statusCode == '200') {
          that.setData({ follower: res.data.follower_count, following: res.data.following_count })
        }        
      }
    })

  },
  calc_bandwidth(){
    var that = this;
    var max_virtual_bandwidth = 0;
    var available_bandwidth= 0;
    wx.request({
      url: 'https://api.steemjs.com/get_dynamic_global_properties',
      method: 'GET',
      success: function (res) {
        console.log(res);
        console.log(that.data.average_market_bandwidth);
        if (res.statusCode == '200') {
          max_virtual_bandwidth = res.data.max_virtual_bandwidth;
          available_bandwidth = parseInt((max_virtual_bandwidth - that.data.average_market_bandwidth) / max_virtual_bandwidth *100) ;
          that.setData({ available_bandwidth: available_bandwidth})
        }
      }
    })
  }
})