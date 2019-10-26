Component({
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    score: { // 星星总数
      type: Number, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: 3, // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function(val) { // 重要！！ 数据改变时调用的方法
        this.triggerEvent('makeScore', val);
      }
    }
  },

  methods: {
    makeScore(e) {
      let score = e.currentTarget.dataset.value;
      this.setData({
        score
      });
    }
  }  
})