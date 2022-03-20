var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
L.Canvas.CustomCanvas = L.Layer.extend({
  initialize(options = {}) {
    L.setOptions(this, options);
  },
  onAdd(map) {
    this.tiles = {};
    this._container = map.getContainer();
    this._map = map;
    const canvas = this._initCanvas();
    const pane = this.options.pane ? map.getPanes()[this.options.pane] : map._panes.overflowPane;
    pane.appendChild(canvas);
    map.on(this.getEvents(), this);
    this._update();
  },
  onRemove() {
    const { _map: map, _ctx: ctx, _canvas: canvas } = this;
    canvas.remove();
  },
  _initCanvas() {
    const canvas = L.DomUtil.create("canvas", "leaflet-ship");
    const ctx = canvas.getContext("2d");
    canvas.style.zIndex = this.options.zIndex || "500";
    this._canvas = canvas;
    this._ctx = ctx;
    this._onLayerDidResize();
    var animated = this._map.options.zoomAnimation && L.Browser.any3d;
    L.DomUtil.addClass(this._canvas, "leaflet-zoom-" + (animated ? "animated" : "hide"));
    return canvas;
  },
  _onAnimZoom(ev) {
    var scale = this._map.getZoomScale(ev.zoom);
    var offset = this._map._latLngBoundsToNewLayerBounds(this._map.getBounds(), ev.zoom, ev.center).min;
    if (L.Browser.any3d) {
      L.DomUtil.setTransform(this._canvas, offset, scale);
    } else {
      L.DomUtil.setPosition(this._canvas, offset);
    }
  },
  _onLayerDidResize: function() {
    const { x, y } = this._map.getSize();
    const pixelRatio = 2;
    this._canvas.style.width = `${x}px`;
    this._canvas.style.height = `${y}px`;
    this._canvas.width = x * pixelRatio;
    this._canvas.height = y * pixelRatio;
  },
  _onLayerDidMove: function() {
    this._update();
  },
  getEvents() {
    var events = {
      resize: this._onLayerDidResize,
      moveend: this._onLayerDidMove
    };
    if (this._zoomAnimated) {
      events.zoomanim = this._onAnimZoom;
    }
    return events;
  },
  _update() {
    const { _ctx: ctx, _map: map, _canvas: canvas } = this;
    const topLeft = map.containerPointToLayerPoint([0, 0]);
    L.DomUtil.setPosition(canvas, topLeft);
    this.clearCavnas(ctx, canvas);
    this.drawLayer();
  },
  drawLayer: function() {
    console.warn("\u5982\u81EA\u5B9A\u4E49\u65B0\u7684\u7EE7\u627F\u7C7B\uFF0C\u8BF7\u5B9E\u73B0\u6B64\u65B9\u6CD5");
  },
  clearCavnas(ctx, canvas) {
    ctx.restore();
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
  }
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
    const res = latlngs.map((item) => {
      const latlng = {};
      if (!item.latlng) {
        latlng.lat = item.lat;
        latlng.lng = item.lng;
      }
      const result = {
        latlng: map.latLngToContainerPoint(latlng),
        deg: item.deg || 0,
        type: item.type
      };
      return result;
    });
    this.drawShip(res);
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
        x = x * 2;
        y = y * 2;
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
        x = x * 2;
        y = y * 2;
        ctx.beginPath();
        ctx.arc(x, y, 18, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.moveTo(x + 10, y);
        ctx.arc(x, y, 11, 0, 2 * Math.PI);
        ctx.stroke();
        item.color = true;
      },
      end(item) {
        ctx.fillStyle = item.color || defaultColor;
        ctx.fill();
        ctx.stroke();
      }
    };
    latlngs.forEach((item) => {
      shapes[item.type](item);
      if (item.type === "storage")
        return;
      shapes.end(item);
    });
  }
}
L.canvas.CanvasShip = (options) => {
  const result = new CanvasShip(options);
  return result;
};
