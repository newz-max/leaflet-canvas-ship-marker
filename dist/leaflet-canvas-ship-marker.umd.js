var u=Object.defineProperty;var p=(o,n,s)=>n in o?u(o,n,{enumerable:!0,configurable:!0,writable:!0,value:s}):o[n]=s;var d=(o,n,s)=>(p(o,typeof n!="symbol"?n+"":n,s),s);(function(o){typeof define=="function"&&define.amd?define(o):o()})(function(){"use strict";(function(n){typeof define=="function"&&define.amd?define(n):n()})(function(){L.Canvas.CustomCanvas=L.Layer.extend({initialize(n={}){L.setOptions(this,n)},onAdd(n){this.tiles={},this._container=n.getContainer(),this._map=n;const s=this._initCanvas();(this.options.pane?n.getPanes()[this.options.pane]:n._panes.overflowPane).appendChild(s),n.on(this.getEvents(),this),this._update()},onRemove(){const{_map:n,_ctx:s,_canvas:t}=this;t.remove()},_initCanvas(){const n=L.DomUtil.create("canvas","leaflet-ship"),s=n.getContext("2d");n.style.zIndex=this.options.zIndex||"500",this._canvas=n,this._ctx=s,this._onLayerDidResize();var t=this._map.options.zoomAnimation&&L.Browser.any3d;return L.DomUtil.addClass(this._canvas,"leaflet-zoom-"+(t?"animated":"hide")),n},_onAnimZoom(n){var s=this._map.getZoomScale(n.zoom),t=this._map._latLngBoundsToNewLayerBounds(this._map.getBounds(),n.zoom,n.center).min;L.Browser.any3d?L.DomUtil.setTransform(this._canvas,t,s):L.DomUtil.setPosition(this._canvas,t)},_onLayerDidResize:function(){const{x:n,y:s}=this._map.getSize(),t=2;this._canvas.style.width=`${n}px`,this._canvas.style.height=`${s}px`,this._canvas.width=n*t,this._canvas.height=s*t},_onLayerDidMove:function(){this._update()},getEvents(){var n={resize:this._onLayerDidResize,moveend:this._onLayerDidMove};return this._zoomAnimated&&(n.zoomanim=this._onAnimZoom),n},_update(){const{_ctx:n,_map:s,_canvas:t}=this,l=s.containerPointToLayerPoint([0,0]);L.DomUtil.setPosition(t,l),this.clearCavnas(n,t),this.drawLayer()},drawLayer:function(){console.warn("\u5982\u81EA\u5B9A\u4E49\u65B0\u7684\u7EE7\u627F\u7C7B\uFF0C\u8BF7\u5B9E\u73B0\u6B64\u65B9\u6CD5")},clearCavnas(n,s){n.restore();const{width:t,height:l}=s;n.clearRect(0,0,t,l)}})});class o extends L.Canvas.CustomCanvas{constructor(){super(...arguments);d(this,"_instance",null)}drawLayer(){const{options:{latlngs:s},_map:t}=this,l=s.map(i=>{const h={};return i.latlng||(h.lat=i.lat,h.lng=i.lng),{latlng:t.latLngToContainerPoint(h),deg:i.deg||0,type:i.type,color:i.color}});this.drawShip(l)}drawShip(s){const{_ctx:t}=this,l="#ffff54",i=(e,r,a,c)=>{e.restore(),e.translate(0,0),e.save(),e.translate(r,a),e.rotate(c*Math.PI/180)},h={base(e,r){let{x:a,y:c}=e.latlng;a=a*2,c=c*2,i(t,a,c,e.deg),t.beginPath(),t.lineWidth=2,t.moveTo(0,-20),t.lineTo(0,-20),t.lineTo(7,-10),t.lineTo(7,20),t.lineTo(-7,20),t.lineTo(-7,-10),t.lineTo(0,-20)},running(e){this.base(e),t.lineTo(0,-35)},turn(e){this.base(e),t.lineTo(0,-35),t.lineTo(10,-35)},lost(e){this.base(e),e.color="#e9e9e9"},storage(e){let{x:r,y:a}=e.latlng;r=r*2,a=a*2,t.beginPath(),t.arc(r,a,18,0,2*Math.PI),t.stroke(),t.moveTo(r+10,a),t.arc(r,a,11,0,2*Math.PI),t.stroke(),e.color=!0},end(e){t.fillStyle=e.color||l,t.fill(),t.stroke()}};s.forEach(e=>{console.log(e,"item"),h[e.type](e),e.type!=="storage"&&h.end(e)})}}L.canvas.CanvasShip=n=>new o(n)});
