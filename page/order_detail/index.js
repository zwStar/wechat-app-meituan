

var {
  request
} = require('../../api/main.js');

// page/search/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    restaurantInfo: {},
    foodsList: [],
    address: {},
    orderInfo: {}
  },

  onLoad(options) {
    this.loadOrder(options.id);
  },

  loadOrder(id) {
    var vm = this;
    request({
      url: '/v1/order/'+ id
    }).then(res => {
      
      vm.setData({
        restaurantInfo: res.data && res.data.restaurant,
        foodsList: res.data && res.data.foods,
        address: res.data && res.data.address,
        orderInfo: res.data
      })
    });
  }
})