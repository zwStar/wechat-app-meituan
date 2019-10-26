Component({
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    score: { // 星星总数
    type: Number, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: 0, // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (val) { // 重要！！ 数据改变时调用的方法
        var on = parseInt(val);
        var half = val - on >= 0.5 ? 1 : 0;
        var off = 5 - on - half;
        this.setData({
          on,
          half,
          off
        })
      }
    }
    },
    num: { // 点亮的星星个数
      type: Number,
      value: 1,
      
  },

  /**
   * 组件的初始数据
   * 可用于模版渲染
   */
  data: {
    Anum1: null,
    Anum2: null,
    on: 0,
    half: 0,
    off: 0
  },

  ready: function () {

  }

})