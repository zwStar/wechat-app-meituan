var {
  request
} = require('../../api/main.js');

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressInfo: {},
    orderInfo: {},
    restaurantInfo: {},
    totalPrice: 0,
    foodsList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setOrderInfo(options);
    this.getAddress();
  },

  // 获取订单信息
  setOrderInfo(options) {
    let cartInfo = app.globalData[options.id] || {};
    let restaurantInfo = {
      id: options.id,
      name: cartInfo.name,
      picUrl: cartInfo.pic_url
    }
    let foodsList = [];
    Object.keys(cartInfo).forEach(item => {
      if (!isNaN(item)) {
        foodsList.push({ ...cartInfo[item],
          id: item
        });
      }
    })
    this.setData({
      restaurantInfo,
      totalPrice: cartInfo.totalPrice,
      foodsList
    })
  },

  // 获取用户地址
  getAddress: function() {
    var vm = this;

    request({
      url: '/admin/all_address',

    }).then(res => {
      vm.setData({
        addressInfo: res.address[0]
      })
    });
  },

  // 提交订单
  submitOrder: function() {
    let data = this.data;
    if (!data.addressInfo.id) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
      return false;
    }
    request({
      url: '/v1/wxorder',
      method: 'post',
      data: {
        restaurant_id: data.restaurantInfo.id,
        foods: JSON.stringify(data.foodsList),
        address_id: data.addressInfo.id
      }
    }).then(res => {
      if (res.status === 200) {
        wx.switchTab({
          url: '/page/order/index'
        });
      }
    });
  }
})