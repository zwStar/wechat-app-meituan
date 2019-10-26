const {
  baseURL
} = require('../util/config.js');

var { wxlogin } = require('../util/login.js');

const key = 'sessionId';

const request = function(obj) {
  return new Promise((resolve, reject) => {
    wx.request({ 
      url: baseURL + obj.url,
      method: obj.method || 'get',
      data: obj.data || {},
      header: {
        cookie: wx.getStorageSync(key),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if ('Set-Cookie' in res.header || 'set-cookie' in res.header) {
          wx.setStorageSync(key, res.header['Set-Cookie'] || res.header['set-cookie']);
        }
        if (res.data.status === 403) {
            wxlogin();
            throw 'err';
        }
        resolve(res.data)
      },
      fail(error) {
        reject(error)
      },
    })
  });
}

module.exports = {
  request: request
};