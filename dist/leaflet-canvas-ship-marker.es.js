var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class t extends L.Canvas.CustomCanvas {
  constructor() {
    super(...arguments);
    __publicField(this, "_instance", null);
  }
  drawLayer() {
    const { options: { latlngs: t2 }, _map: a } = this, n = t2.map((t3) => {
      const n2 = {};
      t3.latlng || (n2.lat = t3.lat, n2.lng = t3.lng);
      return { latlng: a.latLngToContainerPoint(n2), deg: t3.deg || 0 };
    });
    this.drawShip(n);
  }
  drawShip(t2) {
    const { _ctx: a } = this;
    t2.forEach((t3, n) => {
      let { x: e, y: s } = t3.latlng;
      e *= 2, s *= 2, ((t4, a2, n2, e2) => {
        t4.restore(), t4.translate(0, 0), t4.save(), t4.translate(a2, n2), t4.rotate(e2 * Math.PI / 180);
      })(a, e, s, t3.deg), a.beginPath(), a.lineWidth = 2, a.moveTo(0, -20), a.lineTo(0, -20), a.lineTo(7, -10), a.lineTo(7, 20), a.lineTo(-7, 20), a.lineTo(-7, -10), a.lineTo(0, -20), a.fillStyle = "#ffff54", a.fill(), a.stroke();
    });
  }
}
L.canvas.CanvasShip = (a) => new t(a), L.Canvas.CustomCanvas = L.Layer.extend({ initialize(t2 = {}) {
  L.setOptions(this, t2);
}, onAdd(t2) {
  this.tiles = {}, this._container = t2.getContainer(), this._map = t2;
  const a = this._initCanvas();
  (this.options.pane ? t2.getPanes()[this.options.pane] : t2._panes.overflowPane).appendChild(a), t2.on(this.getEvents(), this), this._update();
}, onRemove() {
  const { _map: t2, _ctx: a, _canvas: n } = this;
  n.remove();
}, _initCanvas() {
  const t2 = L.DomUtil.create("canvas", "leaflet-ship"), a = t2.getContext("2d");
  t2.style.zIndex = "500", this._canvas = t2, this._ctx = a, this._onLayerDidResize();
  var n = this._map.options.zoomAnimation && L.Browser.any3d;
  return L.DomUtil.addClass(this._canvas, "leaflet-zoom-" + (n ? "animated" : "hide")), t2;
}, _onAnimZoom(t2) {
  var a = this._map.getZoomScale(t2.zoom), n = this._map._latLngBoundsToNewLayerBounds(this._map.getBounds(), t2.zoom, t2.center).min;
  L.Browser.any3d ? L.DomUtil.setTransform(this._canvas, n, a) : L.DomUtil.setPosition(this._canvas, n);
}, _onLayerDidResize: function() {
  const { x: t2, y: a } = this._map.getSize();
  this._canvas.style.width = `${t2}px`, this._canvas.style.height = `${a}px`, this._canvas.width = 2 * t2, this._canvas.height = 2 * a;
}, _onLayerDidMove: function() {
  this._update();
}, getEvents() {
  var t2 = { resize: this._onLayerDidResize, moveend: this._onLayerDidMove };
  return this._zoomAnimated && (t2.zoomanim = this._onAnimZoom), t2;
}, _update() {
  const { _ctx: t2, _map: a, _canvas: n } = this, e = a.containerPointToLayerPoint([0, 0]);
  L.DomUtil.setPosition(n, e), this.clearCavnas(t2, n), this.drawLayer();
}, drawLayer: function() {
  console.warn("\u5982\u81EA\u5B9A\u4E49\u65B0\u7684\u7EE7\u627F\u7C7B\uFF0C\u8BF7\u5B9E\u73B0\u6B64\u65B9\u6CD5");
}, clearCavnas(t2, a) {
  t2.restore();
  const { width: n, height: e } = a;
  t2.clearRect(0, 0, n, e);
} });
//# sourceMappingURL=leaflet-canvas-ship-marker.es.js.map
