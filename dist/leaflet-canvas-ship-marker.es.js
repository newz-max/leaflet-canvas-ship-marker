var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function(t) {
  typeof define == "function" && define.amd ? define(t) : t();
})(function() {
  L.Canvas.CustomCanvas = L.Layer.extend({ initialize(t = {}) {
    L.setOptions(this, t);
  }, onAdd(t) {
    this.tiles = {}, this._container = t.getContainer(), this._map = t;
    const e = this._initCanvas();
    (this.options.pane ? t.getPanes()[this.options.pane] : t._panes.overflowPane).appendChild(e), t.on(this.getEvents(), this), this._update();
  }, onRemove() {
    const { _map: t, _ctx: e, _canvas: n } = this;
    n.remove();
  }, _initCanvas() {
    const t = L.DomUtil.create("canvas", "leaflet-ship"), e = t.getContext("2d");
    t.style.zIndex = this.options.zIndex || "500", this._canvas = t, this._ctx = e, this._onLayerDidResize();
    var n = this._map.options.zoomAnimation && L.Browser.any3d;
    return L.DomUtil.addClass(this._canvas, "leaflet-zoom-" + (n ? "animated" : "hide")), t;
  }, _onAnimZoom(t) {
    var e = this._map.getZoomScale(t.zoom), n = this._map._latLngBoundsToNewLayerBounds(this._map.getBounds(), t.zoom, t.center).min;
    L.Browser.any3d ? L.DomUtil.setTransform(this._canvas, n, e) : L.DomUtil.setPosition(this._canvas, n);
  }, _onLayerDidResize: function() {
    const { x: t, y: e } = this._map.getSize(), n = 2;
    this._canvas.style.width = `${t}px`, this._canvas.style.height = `${e}px`, this._canvas.width = t * n, this._canvas.height = e * n;
  }, _onLayerDidMove: function() {
    this._update();
  }, getEvents() {
    var t = { resize: this._onLayerDidResize, moveend: this._onLayerDidMove };
    return this._zoomAnimated && (t.zoomanim = this._onAnimZoom), t;
  }, _update() {
    const { _ctx: t, _map: e, _canvas: n } = this, s = e.containerPointToLayerPoint([0, 0]);
    L.DomUtil.setPosition(n, s), this.clearCavnas(t, n), this.drawLayer();
  }, drawLayer: function() {
    console.warn("\u5982\u81EA\u5B9A\u4E49\u65B0\u7684\u7EE7\u627F\u7C7B\uFF0C\u8BF7\u5B9E\u73B0\u6B64\u65B9\u6CD5");
  }, clearCavnas(t, e) {
    t.restore();
    const { width: n, height: s } = e;
    t.clearRect(0, 0, n, s);
  } });
});
class CanvasShip extends L.Canvas.CustomCanvas {
  constructor() {
    super(...arguments);
    __publicField(this, "_instance", null);
  }
  drawLayer() {
    const {
      options: { latlngs },
      _map: map
    } = this;
    this._ctxs = [];
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
        color: item.color
      };
      return result;
    });
    const _ctxPoints = res.map((item) => {
      const res2 = __spreadProps(__spreadValues({}, item), {
        latlng: {
          x: item.latlng.x * 2,
          y: item.latlng.y * 2
        }
      });
      return res2;
    });
    this._ctxPoints = _ctxPoints;
    this.drawShip(_ctxPoints);
    this._initEvents();
  }
  drawShip(latlngs) {
    const { _ctx: ctx } = this;
    const defaultColor = "#ffff54";
    const rotateShip = (ctx2, x, y, deg) => {
      ctx2.restore();
      ctx2.translate(0, 0);
      ctx2.save();
      ctx2.translate(x, y);
      ctx2.rotate(deg * Math.PI / 180);
    };
    const shapes = {
      base(item, index) {
        let { x, y } = item.latlng;
        rotateShip(ctx, x, y, item.deg);
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(0, -20);
        ctx.lineTo(0, -20);
        ctx.lineTo(7, -10);
        ctx.lineTo(7, 20);
        ctx.lineTo(-7, 20);
        ctx.lineTo(-7, -10);
        ctx.lineTo(0, -20);
      },
      running(item) {
        this.base(item);
        ctx.lineTo(0, -35);
      },
      turn(item) {
        this.base(item);
        ctx.lineTo(0, -35);
        ctx.lineTo(10, -35);
      },
      lost(item) {
        this.base(item);
        item.color = "#e9e9e9";
      },
      storage(item) {
        let { x, y } = item.latlng;
        ctx.beginPath();
        ctx.arc(x, y, 18, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.moveTo(x + 10, y);
        ctx.arc(x, y, 11, 0, 2 * Math.PI);
        ctx.stroke();
        item.color = true;
        return ctx;
      },
      end(item) {
        ctx.fillStyle = item.color || defaultColor;
        ctx.fill();
        ctx.stroke();
        return ctx;
      }
    };
    latlngs.forEach((item) => {
      shapes[item.type](item);
      if (item.type === "storage") {
        const ctxItem2 = shapes[item.type](item);
        this._ctxs.push(ctxItem2);
        return;
      }
      const ctxItem = shapes.end(item);
      this._ctxs.push(ctxItem);
    });
  }
  canvasDomEvent(callBack) {
    const { _ctxs, _ctxPoints } = this;
    console.log(_ctxPoints, "_ctxPoints");
    return callBack();
  }
  _initEvents() {
    const { _ctxs, _ctx: ctx, options: { events = {} }, _canvas } = this;
    const eventItems = Object.entries(events);
    if (eventItems.length === 0)
      ;
    eventItems.forEach((item) => {
      const eventKey = item[0];
      const eventHandle = item[1];
      console.log(eventKey, "eventKey");
      _canvas.removeEventListener(eventKey, this.canvasDomEvent);
      _canvas.addEventListener(eventKey, this.canvasDomEvent(eventHandle));
    });
  }
}
L.canvas.CanvasShip = (options) => {
  const result = new CanvasShip(options);
  return result;
};
