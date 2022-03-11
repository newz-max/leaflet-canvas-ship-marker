/**
 * 船舶图标绘制
 */
class CanvasShip extends L.Canvas.CustomCanvas {
  _instance = null;

  drawLayer() {
    const {
      options: { latlngs },
      _map: map,
    } = this;

    // 数据处理部分（临时代码）
    const res = latlngs.map((item) => {
      const latlng = {};
      if (!item.latlng) {
        latlng.lat = item.lat;
        latlng.lng = item.lng;
      }
      const result = {
        latlng: map.latLngToContainerPoint(latlng),
        deg: item.deg || 0,
        type: item.type,
      };
      return result;
    });

    this.drawShip(res);
  }

  /**
   * 画船
   * @param {Array} latlngs 船舶坐标点
   */
  drawShip(latlngs) {
    const { _ctx: ctx } = this;

    // 船舶图标默认颜色
    const defaultColor = "#ffff54";

    /**
     * 船舶图标旋转
     * @param ctx canvas 实例
     * @param x x 像素坐标位置
     * @param y y 像素坐标位置
     * @param deg 旋转角度
     */
    const rotateShip = (ctx, x, y, deg) => {
      ctx.restore();
      ctx.translate(0, 0);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((deg * Math.PI) / 180);
    };

    // 船舶图标形状
    const shapes = {
      // 基础形状
      base(item, index) {
        let { x, y } = item.latlng;
        x = x * 2;
        y = y * 2;

        rotateShip(ctx, x, y, item.deg);

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(0, -20); // 从A（100,0）开始
        ctx.lineTo(0, -20);
        ctx.lineTo(7, -10);
        ctx.lineTo(7, 20);
        ctx.lineTo(-7, 20);
        ctx.lineTo(-7, -10);
        ctx.lineTo(0, -20);
        // index === 0 && ctx.rotate(0)
      },

      // 航行中
      running(item) {
        this.base(item);

        ctx.lineTo(0, -35);
      },

      // 转向
      turn(item) {
        this.base(item);

        ctx.lineTo(0, -35);
        ctx.lineTo(10, -35);
      },

      // 信号延迟 > 6小时
      lost(item){
        this.base(item)

        item.color = '#e9e9e9'
      },

      // 浮式存储
      storage(item){
        let { x, y } = item.latlng;

        x = x * 2;
        y = y * 2;

        ctx.beginPath()
        ctx.arc(x,y,18,0,2*Math.PI)
        ctx.stroke()
        ctx.moveTo(x + 10, y)
        ctx.arc(x,y,11,0,2*Math.PI)
        ctx.stroke()
        // ctx.strokeStyle="blue";//将线条颜色设置为蓝色
        item.color = true
      },

      end(item) {
        ctx.fillStyle = item.color || defaultColor;
        ctx.fill(); // 以填充方式绘制 默认黑色
        ctx.stroke(); // 闭合形状并且以填充方式绘制出来
      },
    };

    latlngs.forEach((item) => {
      shapes[item.type](item);

      if(item.type === 'storage') return

      shapes.end(item);
    });
  }
}

/**
 * 船位、 航线、 航迹、 时间点 Canvas 绘制
 * @params {Object} options 初始化选项
 * @param options.latlngs 经纬度数组 [{lat : 纬度, lng:经度, deg : 旋转角度}]
 * @param options.latlngs.deg 旋转角度 0-360
 * @param options.latlngs.shape 旋转角度 0-360
 * @return 创建的实例对象，将会是一个单例当重复创建时只会覆盖参数而不创建新的实例(暂未实现)
 */
L.canvas.CanvasShip = (options) => {
  // const { _instance } = CanvasShip
  // let result
  // if (_instance) {
  //   console.warn(
  //     '当前页面已存在一个 Leaflet CanvasShip 画布，将覆盖 Leaflet CanvasShip 画布参数'
  //   )
  //   result = _instance
  //   L.setOptions(_instance, options)
  // }

  // if (!_instance) result = new CanvasShip(options)
  const result = new CanvasShip(options);
  return result;
};
