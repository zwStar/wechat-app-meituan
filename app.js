var { wxlogin} = require('./util/login.js');

App({
  onLaunch: function() {
    wxlogin();
  },

  globalData: {
    cartInfo: {} // 存放购物车信息
  },

 
})