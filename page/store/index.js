var {
  request
} = require('../../api/main.js');

var app = getApp();

// page/store/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    restaurantId: null,
    restaurantInfo: {},
    tabList: [{
        name: '点菜',
        type: 'menu',

      },
      {
        name: '评价',
        type: 'comment',

      },
      {
        name: '商家',
        type: 'seller',
      }
    ],
    tabActive: 'menu',
    categoryActiveIndex: 0,
    hasLoadComment: false,
    shopLists: [],
    commentLists: [],
    categoryPosition: [],
    viewId: 'v10',
    scrollTop: 0,
    cartInfo: {},
    totalPrice: 0 // 总价格
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getCartInfo(options.id);
    this.getRestaurantInfo(options.id);
    this.getFoods(options.id);
    this.getComment(options.id);
    this.mappingScrolliThrottle = this.throttle(this.mappingScrolli, 500);
  },

  onHide: function() {
    app.globalData[this.data.restaurantId] = this.data.cartInfo;
    app.globalData[this.data.restaurantId].name = this.data.restaurantInfo.name;
    app.globalData[this.data.restaurantId].pic_url = this.data.restaurantInfo.pic_url;
    app.globalData[this.data.restaurantId].totalPrice = this.data.totalPrice;

  },

  // 获取购物车信息
  getCartInfo(id) {

    let cartInfo = app.globalData[id] || {}
    this.calcTotalPrice(cartInfo);
    this.setData({
      cartInfo
    })
  },

  // 获取餐馆信息
  getRestaurantInfo: function(id) {
    var vm = this;
    request({
      url: '/v1/restaurant/' + id,
      data: {}
    }).then(res => {
      vm.setTitle(res.data.name)
      vm.setData({
        restaurantInfo: res.data,
        restaurantId: id
      })
    })
  },

  getFoods: function(id) {
    var vm = this;
    request({
      url: '/v1/food/' + id,
      data: {},
    }).then(res => {
      vm.setData({
        shopLists: res.data
      });
      vm.calcPosition();
    });
  },

  calcTotalPrice(cartInfo) {
    let totalPrice = 0;
    Object.keys(cartInfo).forEach(item => {
      if (!isNaN(item)) {
        totalPrice += cartInfo[item].num * cartInfo[item].price; ///
      }
    });
    this.setData({
      totalPrice: totalPrice.toFixed(2)
    });
  },

  // 获取评论
  getComment: function(id) {
    var vm = this;
    request({
      url: '/v1/comment/',
      data: {
        restaurant_id: id,
        offset: 0,
        limit: 200
      }
    }).then(res => {
      let commentLists = res.data.map(item => {
        item.comment_time = item.comment_time.slice(0, 10);
        return item;
      });
      vm.setData({
        commentLists
      })
    })
  },

  // 设置title
  setTitle: function(title) {
    wx.setNavigationBarTitle({
      title
    })
  },

  // 切换tab
  switchtab(e) {
    var type = e.currentTarget.dataset.type;
    if (type !== this.tabActive) {
      if (type === 'comment' && !this.hasLoadComment) {
        
      }
    }
    this.setData({
      tabActive: type
    })
  },



  // 结算按钮点击
  goPay() {
    if (this.data.totalPrice > 0) {
      wx.navigateTo({
        url: '/page/comfirm_order/index?id=' + this.data.restaurantId
      });
    }

  },

  // 加入购物车
  addCart(e) {
    var item = e.currentTarget.dataset.item;
    let cartInfo = this.data.cartInfo;
    cartInfo[item.id] = cartInfo[item.id] ? cartInfo[item.id] : {};
    cartInfo[item.id].price = item.skus[0].price;
    cartInfo[item.id].name = item.name;
    cartInfo[item.id].pic_url = item.pic_url;
    cartInfo[item.id].num = cartInfo[item.id].num ? ++cartInfo[item.id].num : 1;
    this.calcTotalPrice(cartInfo);
    this.setData({
      cartInfo
    });
  },

  reduceCart(e) {
    var item = e.currentTarget.dataset.item;
    let cartInfo = this.data.cartInfo;

    cartInfo[item.id].num = cartInfo[item.id].num === 1 ? 0 : --cartInfo[item.id].num;
    if (!cartInfo[item.id].num) {
      delete cartInfo[item.id];
    }
    this.calcTotalPrice(cartInfo);
    this.setData({
      cartInfo
    });
  },

  // 查看评论图片
  showPreviewImage(e) {
    let imgUrl = e.currentTarget.dataset.item;
    wx.previewImage({
      urls: [imgUrl]
    })
  },

  // 计算位置
  calcPosition() {
    let vm = this;
    wx.createSelectorQuery().selectAll('.foods-item-wrap').boundingClientRect().exec(function(res) {
      let positionArr = [];
      let top = res[0][0].top;
      res[0].forEach((item, index) => {

        positionArr[index] = item.top - top;
      });
      vm.setData({
        categoryPosition: positionArr
      })
    })
  },

  // 滚动
  mappingScroll(e) {
    let index = e.currentTarget.dataset.item;
    this.setData({
      categoryActiveIndex: index,
      scrollTop: this.data.categoryPosition[index]
    });
  },

  // 页面滚动 
  scroll(e) {
    let scrollTop = e.detail.scrollTop;
    this.mappingScrolliThrottle(scrollTop);
  },

  //右侧滚动时  判断当前左侧是第几个分类
  mappingScrolli(pos) {
    console.log('pos', pos);
    let categoryPosition = this.data.categoryPosition;
    for (let i = 0; i < categoryPosition.length; i++) {
      if (categoryPosition[i] <= Math.ceil(Math.abs(pos)) && i === categoryPosition.length - 1 || categoryPosition[i + 1] > Math.ceil(Math.abs(pos))) {
        this.setData({
          categoryActiveIndex: i
        })
        break;
      }
    }
  },

  throttle(method, delay) {
    let timer = null;
    let begin = new Date();
    return function() {
      let context = this,
        args = arguments;
      let current = new Date();
      clearTimeout(timer);
      if (current - begin >= delay) {
        method.apply(context, args);
        begin = current;
      } else {
        timer = setTimeout(function() {
          method.apply(context, args);
        }, delay);
      }
    }
  }
})