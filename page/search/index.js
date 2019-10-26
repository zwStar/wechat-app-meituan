var {
  baseURL
} = require('../../util/config.js');

// page/search/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword: '',
    shopLists: []
  },
  handleSearch: function() {
    var value = this.data.keyword;
    if (!value) {
      return;
    }
    var vm = this;
    wx.request({
      url: baseURL + '/v1/search/restaurant',
      data: {
        keyword: value
      },
      success: function(res) {
        console.log('res', res);
        vm.setData({
          shopLists: res.data.data
        })
        console.log('data',res.data.data)
      }
    });
  },

  inputext: function(e) {
    var value = e.detail.value;
    this.setData({
      keyword: value
    });
  },

})