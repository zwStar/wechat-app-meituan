var {
  baseURL
} = require('../../util/config.js');

// page/location/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      keyword: '',
      addressList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 搜索
  handleSearch () {
    let vm = this;
    wx.request({
      url: baseURL + '/v1/suggestion',
      data: {keyword: this.data.keyword},
      success: function (res) {
        console.log('address-res', res.data.data.data);
        vm.setData({
          addressList: res.data.data.data
        })
      }
    });
  },

  inputext: function (e) {
    var value = e.detail.value;
    this.setData({
      keyword: value
    });
  },

  selectAddress: function (e) {
    var item = e.currentTarget.dataset.item;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    
    if (prevPage.route === "page/index/index") {
      prevPage.setData({
        shopLists: [],
        pageIndex:1
      });

      setTimeout(function () {
        prevPage.setData({
          address: item.title
        });  
      }, 1000);
      prevPage.getDetailPosition(item.location.lat, item.location.lng);
    }else {
      prevPage.setData({
        addressInfo: item
      })
    }
    
    wx.navigateBack();   //返回上一个页面
  }
})