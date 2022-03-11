/**
 * 船位、 航线、 航迹、 时间点 Canvas 绘制
 * @params {latlngs : [{lat : 纬度, lng:经度}]} options
 */
L.Canvas.CustomCanvas = L.Layer.extend({
  initialize(options = {}) {
    L.setOptions(this, options)
  },

  onAdd(map) {
    this.tiles = {}
    this._container = map.getContainer()
    this._map = map

    // 创建 canvas dom 及实例
    const canvas = this._initCanvas()

    const pane = this.options.pane
      ? map.getPanes()[this.options.pane]
      : map._panes.overflowPane

    // 插入 canvas dom
    pane.appendChild(canvas)

    // 注册事件
    map.on(this.getEvents(), this)

    // 绘制 canvas
    this._update()
  },

  onRemove(){
    const { _map:map , _ctx:ctx , _canvas:canvas} = this
    canvas.remove()
  },

  // 初始化 canvas 实例
  _initCanvas() {
    const canvas = L.DomUtil.create('canvas', 'leaflet-ship')
    const ctx = canvas.getContext('2d')

    canvas.style.zIndex = '500'

    this._canvas = canvas
    this._ctx = ctx

    this._onLayerDidResize()

    // leaflet类名 可以在缩放过程中增加过渡动画
    var animated = this._map.options.zoomAnimation && L.Browser.any3d
    L.DomUtil.addClass(
      this._canvas,
      'leaflet-zoom-' + (animated ? 'animated' : 'hide')
    )

    return canvas
  },

  _onAnimZoom(ev) {
    // 缩放倍率
    var scale = this._map.getZoomScale(ev.zoom)

    // 缩放时地图产生的 css 像素偏移量
    var offset = this._map._latLngBoundsToNewLayerBounds(
      this._map.getBounds(),
      ev.zoom,
      ev.center
    ).min

    // 增加 canvas dom css 像素偏移量 及 缩放倍率
    if (L.Browser.any3d) {
      L.DomUtil.setTransform(this._canvas, offset, scale)
    } else {
      L.DomUtil.setPosition(this._canvas, offset)
    }
  },

  /**
   * 保证窗口大小变化时 canvas 标签始终可以覆盖地图
   */
  _onLayerDidResize: function() {
    const { x, y } = this._map.getSize()
    // 浏览器绘制 css像素 与 显示器物理像素 的比例
    // const pixelRatio = window.devicePixelRatio || 2
    const pixelRatio = 2

    // canvas dom 在 document 中的实际像素大小
    this._canvas.style.width = `${x}px`
    this._canvas.style.height = `${y}px`

    // canvas API 绘制图形画布像素大小
    this._canvas.width = x * pixelRatio
    this._canvas.height = y * pixelRatio
  },

  /**
   * 地图移动触发
   */
  _onLayerDidMove: function() {
    // 重绘 canvas
    this._update()
  },

  /**
   * 触发事件执行对应函数 onAdd 时初始化
   */
  getEvents() {
    var events = {
      resize: this._onLayerDidResize, // 浏览器视口大小变化
      moveend: this._onLayerDidMove // 地图移动
    }

    // 当开启 地图 css3 动画过渡时增加此事件
    if (this._zoomAnimated) {
      events.zoomanim = this._onAnimZoom
    }

    return events
  },

  _update() {
    const { _ctx: ctx, _map: map, _canvas: canvas } = this

    // 固定 canvas 位置在地图左上角
    const topLeft = map.containerPointToLayerPoint([0, 0])
    L.DomUtil.setPosition(canvas, topLeft)
    this.clearCavnas(ctx, canvas)

    this.drawLayer()
  },

  /**
   * canvas 绘制
   */
  drawLayer: function() {
    console.warn('如自定义新的继承类，请实现此方法')
  },

  /**
   * 清空自定义 canvas 绘制内容
   */
  clearCavnas(ctx, canvas) {
    ctx.restore()
    const { width, height } = canvas
    ctx.clearRect(0, 0, width, height)
  }
})
