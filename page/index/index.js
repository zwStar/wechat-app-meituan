var {
  request
} = require('../../api/main.js');

const app = getApp();

Page({
  data: {
    categoryList: [{
        name: '美食',
        url: 'http://p1.meituan.net/jungle/bd3ea637aeaa2fb6120b6938b5e468a13442.png',
        type: 'food'
      },
      {
        name: '超市',
        url: 'http://p0.meituan.net/94.0.100/jungle/6b93ee96be3df7cf2bb6e661280b047d3975.png',
        type: 'supermarket'
      },
      {
        name: '生鲜果蔬',
        url: 'http://p0.meituan.net/94.0.100/jungle/f33ed552c52b4466b6308a2c14dbc62d4882.png',
        type: 'fruit'
      },
      {
        name: '下午茶',
        url: 'http://p0.meituan.net/94.0.100/jungle/af6cf63a5dfeb3557bf3099b03002ec34124.png',
        type: 'tea'
      },
      {
        name: '正餐优选',
        url: 'http://p1.meituan.net/94.0.100/jungle/1543bbcb048218424e2420a6934e17b24236.png',
        type: 'dinner'
      },
      {
        name: '汉堡披萨',
        url: 'http://p1.meituan.net/94.0.100/jungle/0e63b86b4ff14d214c1999a979fd21d14273.png',
        type: 'pizza'
      },
      {
        name: '跑腿代购',
        url: 'http://p1.meituan.net/94.0.100/jungle/b40b7d72233f7a76dd9d97af40b4b8975414.png',
        type: 'buyOnSomebody'
      },
      {
        name: '快餐简餐',
        url: 'http://p0.meituan.net/94.0.100/jungle/deeea00bb23e4fae31ea154678c7a8003838.png',
        type: 'fastFood'
      },
      {
        name: '地方菜',
        url: 'http://p1.meituan.net/94.0.100/jungle/b6033c2f9aa26cdf37ea24fb1346d2dc4690.png',
        type: 'localDish'
      },
      {
        name: '炸鸡美食',
        url: 'http://p0.meituan.net/94.0.100/jungle/0ce9a33a4accc536ac9e2d8d91951c924673.png',
        type: 'chicken'
      },
      {
        name: '免配送费',
        url: 'http://p0.meituan.net/94.0.100/jungle/f5ef975cae40ecc1a21dae61f44575d59129.png',
        type: 'freeDeliver'
      }
    ],
    filterOptions: ["综合排序", "销量最高", "距离最近", "筛选"],

    categoryListSort: [],
    shopLists: [],

    address: '定位中...',
    pageIndex: 1,

    pageSize: 10,

    isHide: true
  },


  onLoad: function() {
    // // 对列表进行排序为2维数组 用于轮播图 每页轮播图有8个item
    let resArr = [...this.data.categoryList];
    for (let i = 0, j = 0; i < this.data.categoryList.length; i += 8, j++) {
      this.data.categoryListSort[j] = resArr.splice(0, 8);
    }
    this.setData({
      categoryListSort: this.data.categoryListSort
    });
    var vm = this;
    vm.getLocation();
  },

  getLocation() {
    let vm = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        vm.getDetailPosition(latitude, longitude);
      },
      fail(error) {
        console.log('error', error);
      }
    })
  },

  getDetailPosition(lat, lng) {
    let location = {
      lat,
      lng
    };
    let vm = this;
    request({
      url: '/v1/detailLocation',
      data: {
        location,
      }
    }).then(res => {
      vm.getRestaurants(lat,lng);
      vm.setData({
        location,
        address: res.data && res.data.address || '定位失败'
      })
    })
  },

  getRestaurants(lat,lng) {
    let vm = this;
    request({
      url: '/v1/restaurants',
      data: {
        lng: lng || this.data.location.lng,
        lat: lat || this.data.location.lat,
        offset: (this.data.pageIndex - 1) * this.data.pageSize,
        limit: this.data.pageSize
      }
    }).then(res => {
      let shopLists = vm.data.shopLists;

      let newShopLists = res.data.sort((a,b)=>{
        return Number(a.distance.slice(0, -2)) - Number(b.distance.slice(0, -2)) 
      });

      shopLists = shopLists.concat(res.data);
      vm.setData({
        shopLists
      })
    });
  },

  // 小程序分页加载onReachBottom上拉触底加载
  onReachBottom: function() {
    this.setData({
      pageIndex: ++this.data.pageIndex
    });
    this.getRestaurants();
  },

  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      console.log("用户的信息如下：");
      console.log(e.detail.userInfo);
      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      that.setData({
        isHide: false
      });
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  }
})