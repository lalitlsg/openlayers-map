import React, { Component } from "react";
import "ol/ol.css";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import VectorSource from "ol/source/Vector";
import { fromLonLat, transform } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import Style from "ol/style/Style";
import Circle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import { Map } from "ol";
import Tile from "ol/layer/Tile";
import { View } from "ol";
import OSM from "ol/source/OSM";
import Timeline from "./Timeline";
import { Overlay } from "ol";
import locator from "./images/locator.png";

const deviceLocationPoints = [
  {
    id: 1,
    date: "July 12, 2020 12:24:30",
    coords: [76.0729, 27.8969],
    address: "Vishal Book Depot, Narnaul, Mahendragarh, Haryana, 123001, India",
    noOfDays: 6,
  },
  {
    id: 2,
    date: "July 18, 2020 09:28:30",
    coords: [71.0729, 30.8969],
    address: "Vishal Book Depot, Narnaul, Mahendragarh, Haryana, 123001, India",
    noOfDays: 1,
  },
  {
    id: 3,
    date: "July 19, 2020 09:28:30",
    coords: [70.0729, 31.8969],
    address: "Vishal Book Depot, Narnaul, Mahendragarh, Haryana, 123001, India",
    noOfDays: 1,
  },
  {
    id: 4,
    date: "July 20, 2020 09:28:30",
    coords: [72.0729, 32.8969],
    address: "Vishal Book Depot, Narnaul, Mahendragarh, Haryana, 123001, India",
    noOfDays: 1,
  },
  {
    id: 5,
    date: "July 21, 2020 09:28:30",
    coords: [73.0729, 32.8969],
    address: "Vishal Book Depot, Narnaul, Mahendragarh, Haryana, 123001, India",
    noOfDays: 1,
  },
  {
    id: 6,
    date: "July 22, 2020 09:28:30",
    coords: [74.0729, 33.8969],
    address: "Vishal Book Depot, Narnaul, Mahendragarh, Haryana, 123001, India",
    noOfDays: 1,
  },
  {
    id: 7,
    date: "July 20, 2020 09:28:30",
    coords: [75.0729, 34.8969],
    address: "Vishal Book Depot, Narnaul, Mahendragarh, Haryana, 123001, India",
    noOfDays: 1,
  },
  {
    id: 8,
    date: "July 21, 2020 09:28:30",
    coords: [76.0729, 35.8969],
    address: "Vishal Book Depot, Narnaul, Mahendragarh, Haryana, 123001, India",
    noOfDays: 1,
  },
  {
    id: 9,
    date: "July 22, 2020 09:28:30",
    coords: [77.0729, 36.8969],
    address: "Vishal Book Depot, Narnaul, Mahendragarh, Haryana, 123001, India",
    noOfDays: 1,
  },
];

const currentLocation = [76.07298430919218, 27.89691807442266];

let overlayLayer;

export default class LocationHistory extends Component {
  constructor(props) {
    super(props);
    this.timelineRef = React.createRef();
  }

  state = {
    currentCoords: [],
  };

  componentDidMount() {
    this.initMap();
  }

  setCurrentCoords = (currentCoords) => {
    this.setState({ currentCoords });
  };

  initMap = () => {
    const features = [];
    // creating features
    for (let point of deviceLocationPoints) {
      features.push(
        new Feature({
          geometry: new Point(fromLonLat([...point.coords])),
          info: point,
        })
      );
    }

    // create the source and layer for random features
    const vectorSource = new VectorSource({ features });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new Circle({
          radius: 3,
          fill: new Fill({ color: "red" }),
        }),
      }),
    });

    // create map and add layers
    const map = new Map({
      target: "map",
      layers: [new Tile({ source: new OSM() }), vectorLayer],
      view: new View({
        center: fromLonLat([...currentLocation]),
        zoom: 2,
      }),
    });

    // Overlay location symbol
    overlayLayer = new Overlay({
      element: document.querySelector(".overlay-info"),
    });

    map.addOverlay(overlayLayer);

    // Display info on hover : pointermove
    map.on("pointermove", (e) => {
      overlayLayer.setPosition(undefined);
      this.setCurrentCoords([]);
      map.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
        const currentLogLat = feature.get("info").coords;
        overlayLayer.setPosition(e.coordinate);
        this.setCurrentCoords(currentLogLat);
        this.timelineRef.current.scrollTop =
          100 * Math.floor(feature.get("info").id / 3.1);
      });
    });
  };

  locatePointHandler = (coords) => {
    const xyCoords = fromLonLat(coords);
    if (coords.length > 0) {
      overlayLayer.setPosition(xyCoords);
    } else {
      overlayLayer.setPosition(undefined);
    }
  };

  render() {
    return (
      <div className="map-container">
        <div id="map" className="map"></div>
        <Timeline
          timelineRef={this.timelineRef}
          locationPoints={deviceLocationPoints}
          currentCoords={this.state.currentCoords}
          locatePoint={this.locatePointHandler}
        />
        <img src={locator} alt="locator" className="overlay-info" />
      </div>
    );
  }
}
