var {
  request
} = require('../../api/main.js');

// page/add_address/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gender: 'male',
    name: '',
    phone: '',
    houseNumber: '',
    addressInfo: {
      province: '',
      title: '选择地址',
      city: '',

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  inputname (e) {
    var value = e.detail.value;
    this.setData({
      name: value
    });
  },

  inputphone (e) {
    var value = e.detail.value;
    this.setData({
      phone: value
    });
  },

  inputHouseNumber (e) {
    var value = e.detail.value;
    this.setData({
      houseNumber: value
    });
  },


  handleSubmit () {
    var vm = this;
    let data = this.data;
    request({
      url: '/admin/address',
      method: 'post',
      data: {
        phone: data.phone,
        name: data.name,
        title: data.addressInfo.title,
        address: data.addressInfo.address,
        gender: data.gender,
        house_number: this.data.houseNumber,
        lng: data.addressInfo.location && data.addressInfo.location.lng,
        lat: data.addressInfo.location && data.addressInfo.location.lat,
      }
    }).then(res=>{
        if (res.status === 200) {
          wx.navigateBack();   //返回上一个页面
        }
    });
  }
  
})