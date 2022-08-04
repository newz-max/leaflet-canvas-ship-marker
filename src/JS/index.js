import json from "@/JSON/data.json";
// console.log(json,'json');
import { createCanvasShip } from '../L.CanvasShip'

var map = L.map("map").setView([51.505, -0.09], 2);

L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    accessToken:
      "pk.eyJ1IjoieGlhb3poaTAiLCJhIjoiY2twNjV6Z3EwMHN5aTJvczF2NzBva2t4dSJ9.Z034dTvEDAMkvgrMu0tVlA",
  }
).addTo(map);

// const points = json.points.split(',').map(item => item.split(' '))
// const point = points[0]

const ship = createCanvasShip({
  // latlngs : [{ lat : point[0] , lng : point[1] , deg : 45 , type : 'base' , color : '#ffffff'}],
  latlngs: json,
  zIndex: "0",
  events: {
    click(point, source) {
      console.log(point, source, "click");
    },

    mousemove(point) {
      console.log(point, "point");
    },
  },
})
  .addTo(map);

// map.panTo(point)
