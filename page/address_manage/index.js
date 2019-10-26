var {
  adminBaseURL
} = require('../../util/config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  getAddressList: function() {
    var vm = this;
    wx.request({
      url: adminBaseURL + 'all_address/',
      data: {},
      success: function(res) {
        console.log('res', res);
        vm.setTitle(res.data.data.name)
        vm.setData({
          restaurantInfo: res.data.data,
          restaurantId: id
        })
      }
    });
  }
})