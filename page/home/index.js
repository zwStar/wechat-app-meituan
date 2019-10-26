var {
  request
} = require('../../api/main.js');
const app = getApp();

Page({
  data: {
    "funList": [{
        "id": 1,
        "icon": "/images/order.png",
        "name": "我的订单",
        "path": "/page/order/index"
      },
      {
        "id": 2,
        "icon": "/images/location.png",
        "name": "地址管理",
        "path": "/page/address/index"
      }
    ]
  }
})