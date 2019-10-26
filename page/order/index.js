var {request} = require('../../api/main.js');

// page/order/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getOrders();
  },

  getOrders: function() {
    var vm = this;

    request({
      url: '/v1/orders'
    }).then(res=>{
      console.log('res', res.data);
      vm.setData({
        orderList: res.data
      })
    });
  }
})