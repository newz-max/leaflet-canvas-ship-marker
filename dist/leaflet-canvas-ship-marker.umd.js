var u=Object.defineProperty;var p=(o,t,s)=>t in o?u(o,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):o[t]=s;var d=(o,t,s)=>(p(o,typeof t!="symbol"?t+"":t,s),s);(function(o){typeof define=="function"&&define.amd?define(o):o()})(function(){"use strict";(function(t){typeof define=="function"&&define.amd?define(t):t()})(function(){L.Canvas.CustomCanvas=L.Layer.extend({initialize(t={}){L.setOptions(this,t)},onAdd(t){this.tiles={},this._container=t.getContainer(),this._map=t;const s=this._initCanvas();(this.options.pane?t.getPanes()[this.options.pane]:t._panes.overflowPane).appendChild(s),t.on(this.getEvents(),this),this._update()},onRemove(){const{_map:t,_ctx:s,_canvas:n}=this;n.remove()},_initCanvas(){const t=L.DomUtil.create("canvas","leaflet-ship"),s=t.getContext("2d");t.style.zIndex=this.options.zIndex||"500",this._canvas=t,this._ctx=s,this._onLayerDidResize();var n=this._map.options.zoomAnimation&&L.Browser.any3d;return L.DomUtil.addClass(this._canvas,"leaflet-zoom-"+(n?"animated":"hide")),t},_onAnimZoom(t){var s=this._map.getZoomScale(t.zoom),n=this._map._latLngBoundsToNewLayerBounds(this._map.getBounds(),t.zoom,t.center).min;L.Browser.any3d?L.DomUtil.setTransform(this._canvas,n,s):L.DomUtil.setPosition(this._canvas,n)},_onLayerDidResize:function(){const{x:t,y:s}=this._map.getSize(),n=2;this._canvas.style.width=`${t}px`,this._canvas.style.height=`${s}px`,this._canvas.width=t*n,this._canvas.height=s*n},_onLayerDidMove:function(){this._update()},getEvents(){var t={resize:this._onLayerDidResize,moveend:this._onLayerDidMove};return this._zoomAnimated&&(t.zoomanim=this._onAnimZoom),t},_update(){const{_ctx:t,_map:s,_canvas:n}=this,r=s.containerPointToLayerPoint([0,0]);L.DomUtil.setPosition(n,r),this.clearCavnas(t,n),this.drawLayer()},drawLayer:function(){console.warn("\u5982\u81EA\u5B9A\u4E49\u65B0\u7684\u7EE7\u627F\u7C7B\uFF0C\u8BF7\u5B9E\u73B0\u6B64\u65B9\u6CD5")},clearCavnas(t,s){t.restore();const{width:n,height:r}=s;t.clearRect(0,0,n,r)}})});class o extends L.Canvas.CustomCanvas{constructor(){super(...arguments);d(this,"_instance",null)}drawLayer(){const{options:{latlngs:s},_map:n}=this,r=s.map(l=>{const h={};return l.latlng||(h.lat=l.lat,h.lng=l.lng),{latlng:n.latLngToContainerPoint(h),deg:l.deg||0,type:l.type}});this.drawShip(r)}drawShip(s){const{_ctx:n}=this,r="#ffff54",l=(e,i,a,c)=>{e.restore(),e.translate(0,0),e.save(),e.translate(i,a),e.rotate(c*Math.PI/180)},h={base(e,i){let{x:a,y:c}=e.latlng;a=a*2,c=c*2,l(n,a,c,e.deg),n.beginPath(),n.lineWidth=2,n.moveTo(0,-20),n.lineTo(0,-20),n.lineTo(7,-10),n.lineTo(7,20),n.lineTo(-7,20),n.lineTo(-7,-10),n.lineTo(0,-20)},running(e){this.base(e),n.lineTo(0,-35)},turn(e){this.base(e),n.lineTo(0,-35),n.lineTo(10,-35)},lost(e){this.base(e),e.color="#e9e9e9"},storage(e){let{x:i,y:a}=e.latlng;i=i*2,a=a*2,n.beginPath(),n.arc(i,a,18,0,2*Math.PI),n.stroke(),n.moveTo(i+10,a),n.arc(i,a,11,0,2*Math.PI),n.stroke(),e.color=!0},end(e){n.fillStyle=e.color||r,n.fill(),n.stroke()}};s.forEach(e=>{h[e.type](e),e.type!=="storage"&&h.end(e)})}}L.canvas.CanvasShip=t=>new o(t)});
