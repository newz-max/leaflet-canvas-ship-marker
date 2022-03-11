/**
 * 船舶图标绘制
 */
class CanvasShip extends L.Canvas.CustomCanvas {
  _instance = null;

  drawLayer() {
    const {
      options: { latlngs },
      _map: map
    } = this

    // 数据处理部分（临时代码）
    const res = latlngs.map((item) => {
      const latlng = {}
      if (!item.latlng) {
        latlng.lat = item.lat
        latlng.lng = item.lng
      }
      const result = {
        latlng: map.latLngToContainerPoint(latlng),
        deg: item.deg || 0
      }
      return result
    })

    this.drawShip(res)
  }

  /**
   * 画船
   * @param {Array} latlngs 船舶坐标点
   */
  drawShip(latlngs) {
    const { _ctx: ctx } = this

    /**
     * 船舶图标旋转
     * @param ctx canvas 实例
     * @param x x 像素坐标位置
     * @param y y 像素坐标位置
     * @param deg 旋转角度
     */
    const rotateShip = (ctx, x, y, deg) => {
      ctx.restore()
      ctx.translate(0, 0)
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate((deg * Math.PI) / 180)
    }

    // 绘制船舶图标
    latlngs.forEach((item, index) => {
      let { x, y } = item.latlng
      x = x * 2
      y = y * 2

      rotateShip(ctx, x, y, item.deg)

      ctx.beginPath()
      ctx.lineWidth = 2
      ctx.moveTo(0, -20) // 从A（100,0）开始
      ctx.lineTo(0, -20)
      ctx.lineTo(7, -10)
      ctx.lineTo(7, 20)
      ctx.lineTo(-7, 20)
      ctx.lineTo(-7, -10)
      ctx.lineTo(0, -20)
      ctx.fillStyle = '#ffff54'
      ctx.fill() // 以填充方式绘制 默认黑色
      // index === 0 && ctx.rotate(0)
      ctx.stroke() // 闭合形状并且以填充方式绘制出来
    })
  }
}

/**
 * 船位、 航线、 航迹、 时间点 Canvas 绘制
 * @params {Object} options 初始化选项
 * @param options.latlngs 经纬度数组 [{lat : 纬度, lng:经度}]
 * @param options.deg 船舶航向 0-360
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
  const result = new CanvasShip(options)
  return result
}
