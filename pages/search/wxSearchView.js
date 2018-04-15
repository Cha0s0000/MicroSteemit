// tips key
var __tipKeys = [];
// callback function of searching
var __searchFunction = null;
// callback function of searching nothing
var __goBackFunction = null;
var __that = null;

// init 
function init(that, hotKeys, tipKeys, searchFunction, goBackFunction) {

  __that = that;
  __tipKeys = tipKeys;
  __searchFunction = searchFunction;
  __goBackFunction = goBackFunction;

  var temData = {};
  var barHeight = 43;
  var view = {
    barHeight: barHeight
  }
  temData.hotKeys = hotKeys;

  wx.getSystemInfo({
    success: function (res) {
      var wHeight = res.windowHeight;
      view.seachHeight = wHeight - barHeight;
      temData.view = view;
      __that.setData({
        wxSearchData: temData
      });
    }
  });

  getHisKeys(__that);
}

// deal with the input operation
function wxSearchInput(e) {
  var inputValue = e.detail.value;
  // page data
  var temData = __that.data.wxSearchData;
  // search the tips key tags by request to teh api
  var tipKeys = [];
  var tagsList = [];
  console.log(inputValue);
  wx.request({
    url: 'https://api.steemjs.com/get_trending_tags?afterTag=' + inputValue +'&limit=5',
    method: 'GET',
    success: function (res) {
      if (res.statusCode == '200') {
        var tagsDatas = res.data;
        console.log(tagsDatas);
        for (var tagsData in tagsDatas) {
          tagsList.push(tagsDatas[tagsData].name);
        }
        console.log(tagsList);
      }
    },
    complete: function (res) { 
      if (inputValue && inputValue.length > 0) {
        for (var i = 0; i < tagsList.length; i++) {
          var mindKey = tagsList[i];
          console.log(mindKey);
          // if the string in the same tags
          if (mindKey.indexOf(inputValue) != -1) {
            tipKeys.push(mindKey);
          }
        }
      }
      // update the data to show
      temData.value = inputValue;
      temData.tipKeys = tipKeys;
      // update the view
      __that.setData({
        wxSearchData: temData
      });
    },
  })

  
}

// deal with the clear of the input box
function wxSearchClear() {
  var temData = __that.data.wxSearchData;
  // update the data
  temData.value = "";
  temData.tipKeys = [];
  //update the view
  __that.setData({
    wxSearchData: temData
  });
}

// click on the tips key tags 
function wxSearchKeyTap(e) {
  search(e.target.dataset.key);
}

// clicking the search button of enter the "ENTER"
function wxSearchConfirm(e) {
  var key = e.target.dataset.key;
  if(key=='back'){
    __goBackFunction();
  }else{
    search(__that.data.wxSearchData.value);
  }
}

function search(inputValue) {
  if (inputValue && inputValue.length > 0) {
    // add to the record list
    wxSearchAddHisKey(inputValue);
    // update
    var temData = __that.data.wxSearchData;
    temData.value = inputValue;
    __that.setData({
      wxSearchData: temData
    });
    // callback for searching 
    __searchFunction(inputValue);
  }
}

// load the cache
function getHisKeys() {
  var value = [];
  try {
    value = wx.getStorageSync('wxSearchHisKeys')
    if (value) {
      // Do something with return value
      var temData = __that.data.wxSearchData;
      temData.his = value;
      __that.setData({
        wxSearchData: temData
      });
    }
  } catch (e) {
    // Do something when catch error
  }
}

// add to the cache
function wxSearchAddHisKey(inputValue) {
  if (!inputValue || inputValue.length == 0) {
    return;
  }
  var value = wx.getStorageSync('wxSearchHisKeys');
  if (value) {
    if (value.indexOf(inputValue) < 0) {
      value.unshift(inputValue);
    }
    wx.setStorage({
      key: "wxSearchHisKeys",
      data: value,
      success: function () {
        getHisKeys(__that);
      }
    })
  } else {
    value = [];
    value.push(inputValue);
    wx.setStorage({
      key: "wxSearchHisKeys",
      data: value,
      success: function () {
        getHisKeys(__that);
      }
    })
  }
}

// delete the cache
function wxSearchDeleteAll() {
  wx.removeStorage({
    key: 'wxSearchHisKeys',
    success: function (res) {
      var value = [];
      var temData = __that.data.wxSearchData;
      temData.his = value;
      __that.setData({
        wxSearchData: temData
      });
    }
  })
}

// export the function
module.exports = {
  init: init, 
  wxSearchInput: wxSearchInput,
  wxSearchKeyTap: wxSearchKeyTap, 
  wxSearchDeleteAll: wxSearchDeleteAll, 
  wxSearchConfirm: wxSearchConfirm, 
  wxSearchClear: wxSearchClear, 
}