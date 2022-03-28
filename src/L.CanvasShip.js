import lodash from "lodash";

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

    this._ctxs = [];

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
        color: item.color,
        sourceObj: item,
      };

      result.latlng.x *= 2;
      result.latlng.y *= 2;
      return result;
    });

    this._ctxPoints = res;
    if (!Array.isArray(this._prevEvent)) this._prevEvent = [];

    this.drawShip(res);
    this._initEvents();
  }

  /**
   * 画船
   * @param {Array} latlngs 船舶坐标点
   * @param {Object} point 鼠标点击位置 非必填 已 * 2
   * @param {Number} point.x 鼠标 x 位置
   * @param {Number} point.y 鼠标 y 位置
   */
  drawShip(latlngs, point) {
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
        // x = x * 2;
        // y = y * 2;

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
      lost(item) {
        this.base(item);

        item.color = "#e9e9e9";
      },

      // 浮式存储
      storage(item) {
        let { x, y } = item.latlng;

        // x = x * 2;
        // y = y * 2;

        ctx.beginPath();
        ctx.arc(x, y, 18, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.moveTo(x + 10, y);
        ctx.arc(x, y, 11, 0, 2 * Math.PI);
        ctx.stroke();
        // ctx.strokeStyle="blue";//将线条颜色设置为蓝色
        item.color = true;

        return ctx;
      },

      end(item) {
        ctx.fillStyle = item.color || defaultColor;
        ctx.fill(); // 以填充方式绘制 默认黑色
        ctx.stroke(); // 闭合形状并且以填充方式绘制出来

        return ctx;
      },
    };

    let res = null;
    latlngs.forEach((item) => {
      let ctxItem = shapes[item.type](item);
      /**
       * 检测鼠标是否在形状哪
       */
      const inRectFn = (ctx) => {
        return ctx.isPointInPath(point.x, point.y);
      };

      if (item.type === "storage") {
        if (point !== undefined) {
          if (inRectFn(ctxItem)) {
            res = [point, item];
          }
        }
        return;
      }

      ctxItem = shapes.end(item);
      if (point !== undefined) {
        if (inRectFn(ctxItem)) {
          res = [point, item];
        }
      }
    });

    return res;
  }

  /**
   * canvas 元素事件触发默认函数
   * @param {Function} callBack 注册的事件函数
   * @param {Object} event 出发事件坐标
   */
  canvasDomEvent(callBack, event) {
    const { _ctxPoints, _canvas } = this;

    let { offsetX: x, offsetY: y } = event;
    x *= 2;
    y *= 2;

    const w = _canvas.width;
    const h = _canvas.height;
    _canvas.width = w;
    _canvas.height = h;

    const res = this.drawShip(_ctxPoints, { x, y });
    if (res !== null) {
      return callBack(...res);
    }
  }

  /**
   * 初始化元素事件
   */
  _initEvents() {
    const {
      _ctxs,
      _ctx: ctx,
      options: { events = {} },
      _canvas,
    } = this;

    const eventItems = Object.entries(events);

    if (eventItems.length === 0) {
      // return;
    }

    // 删除之前注册的事件
    if (this._prevEvent.length !== 0) {
      this._prevEvent.forEach((item) => {
        _canvas.removeEventListener(item.key, item.fn);
      });

      this._prevEvent = [];
    }

    eventItems.forEach((item) => {
      const eventKey = item[0];
      const eventHandle = item[1];

      const currentEvent = lodash.debounce(
        this.canvasDomEvent.bind(this, eventHandle),
        150
      );

      this._prevEvent.push({ key: eventKey, fn: currentEvent });

      _canvas.addEventListener(eventKey, currentEvent);
    });
  }
}

/**
 * 船位、 航线、 航迹、 时间点 Canvas 绘制
 * @param {Object} options 初始化选项
 * @param {Array} options.latlngs 经纬度数组 [{lat : 纬度, lng:经度, deg : 旋转角度 , color : 图标颜色}]
 * @param {Number | String} options.latlngs.deg 旋转角度 0-360
 * @param {String} options.latlngs.type base 基础形状 running 航行中 turn 转向 lost 信号延迟 > 6h storage 浮式存储
 * @param {Object} options.events 要注册的事件 example : {click( point , sourceObj ){ xxx }}； point 代表鼠标坐标在 图标内时的 鼠标坐标 * 2 sourceObj 选中的对象的初始对象
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
