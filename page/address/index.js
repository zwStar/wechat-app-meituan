var {
  request
} = require('../../api/main.js');


// page/address/index.js
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
  onShow: function(options) {
    this.getAddressList();
  },

  getAddressList: function() {
    var vm = this;
    request({
      url: '/admin/all_address'
    }).then(res => {
      console.log('res', res);
      vm.setData({
        addressList: res.address
      })
    });
  },

  selectAddress: function(e) {
    var item = e.currentTarget.dataset.item;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    if (prevPage.route === 'page/comfirm_order/index') {
      prevPage.setData({
        addressInfo: item
      })
      wx.navigateBack();
    }
  },

  // 删除地址
  deleteAddress(e) {
    let index = e.target.dataset.index;
    this.data.addressList;
    request({
      url: '/admin/address',
      method: 'delete', 
      data: {
        address_id: this.data.addressList[index].id 
      }
    }).then(res => {
        this.data.addressList.splice(index, 1);
        this.setData({
          addressList: this.data.addressList  
        })
    });
  }
})