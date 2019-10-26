var {
  request
} = require('../api/main.js');

const key = 'sessionId';

function wxlogin () {
  wx.login({
    success: function (res) {
      login(res.code);
    }
  });
}

 function login(code) {
  request({
    url: '/admin/wechat_login',
    data: {
      code
    },
    method: 'post'
  }).then((res) => {
    if (res.status === 201) {
      getUserInfo();
    }
  })
}

function getUserInfo () {
  wx.getUserInfo({
    success: function (res) {
      setUserInfo(res.userInfo);
      wx.setStorageSync('user', res.userInfo && res.userInfo.nickName);
    }
  });
}

// 设置用户信息
function setUserInfo(data) {
  request({
    url: '/admin/user_info',
    data,
    method: 'post'
  }).then((res) => {
    if (res.status === 201) {
      getUserInfo();
    }
  })
}

module.exports = {
  wxlogin
}