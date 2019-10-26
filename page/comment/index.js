var {
  qiniuDomain
} = require('../../util/config.js');

let {
  request
} = require('../../api/main.js');
let qiniuUploadDomain = 'https://upload-z2.qiniup.com/';
// page/search/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id: '',
    commentData: '',
    restaurantInfo: {},
    images: [],
    uploadToken: '',
    food_score: 3
  },

  onLoad(options) {
    this.loadOrder(options.id);
    this.getUploadToken();
  },

  getUploadToken() {
    request({
      url: '/service/uploadtoken'
    }).then(res => {
      console.log('uploadToken', res);
      this.setData({
        uploadToken: res.uptoken
      })
    });
  },

  loadOrder(id) {
    var vm = this;

    request({
      url: '/v1/order/' + id
    }).then(res => {
      console.log('res', res);
      vm.setData({
        order_id: id,
        restaurantInfo: res.data && res.data.restaurant
      })
    });
  },

  inputcomment: function(e) {
    var value = e.detail.value;
    this.setData({
      commentData: value
    });
  },

  chooseImage() {
    let vm = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {

        // console.log('res', res);
        // const images = this.data.images.concat(res.tempFilePaths)
        // // 限制最多只能留下3张照片
        // this.data.images = images.length <= 3 ? images : images.slice(0, 3)

        var tempFilePaths = res.tempFilePaths;
        //启动上传等待中...
        wx.showLoading({
          title: '正在上传...',
          icon: 'loading',
          mask: true
        })
        var uploadImgCount = 0;
        for (var i = 0, h = tempFilePaths.length; i < h; i++) {
          wx.uploadFile({
            url: qiniuUploadDomain,
            filePath: tempFilePaths[i],
            name: 'file',
            formData: {
              token: vm.data.uploadToken
            },
            header: {
              "Content-Type": "multipart/form-data"
            },
            success: function(res) {
              wx.hideLoading();
              let resData = JSON.parse(res.data);
              vm.data.images.push(qiniuDomain + resData.key);
              vm.setData({
                images: vm.data.images
              })
              //如果是最后一张,则隐藏等待中
              if (uploadImgCount == tempFilePaths.length) {
                wx.hideToast();

              }
            },
            fail: function(res) {
              wx.hideLoading();
              wx.showModal({
                title: '错误提示',
                content: '上传图片失败',
                showCancel: false,
                success: function(res) {}
              })
            }
          });
        }
      }
    })
  },

  submitComment() {
    let data = this.data;
    request({
      url: '/v1/comment',
      method: 'post',
      data: {
        order_id: data.order_id,
        comment_data: data.commentData,
        food_score: this.data.food_score,
        pic_url: JSON.stringify(data.images)
      }
    }).then(res => {
      if (res.status === 200) {
        wx.reLaunch({
          url: '/page/order/index'
        });
      }
    })
  },

  // 评分
  makeScore(e) {
    let foods_score = e.detail;
    this.setData({
      food_score: foods_score
    });
  },

  // 删除图片
  deleteImages (e) {
    var index = e.currentTarget.dataset.index;
    this.data.images.splice(index,1);
    this.setData({
      images: this.data.images 
    })
  }
})