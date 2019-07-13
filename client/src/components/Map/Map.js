import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import React, { Component } from "react";
import MapGL from "react-map-gl";
import DeckGL, { GeoJsonLayer } from "deck.gl";
import Geocoder from "react-map-gl-geocoder";
import Axios from "axios";
import PolylineOverlay from "./PolylineOverlay/PolylineOverlay";

// Please be a decent human and don't abuse my Mapbox API token.
// If you fork this sandbox, replace my API token with your own.
// Ways to set Mapbox token: https://uber.github.io/react-map-gl/#/Documentation/getting-started/about-mapbox-tokens
const MAPBOX_TOKEN =
  "pk.eyJ1IjoibWF4d293byIsImEiOiJjankwdmNkMmswMXFsM2luem1ncGgxeHpoIn0.Djlh8L7Ux6y0sE_pYssJ6g";

class Map extends Component {
  state = {
    viewport: {
      latitude: 37.7577,
      longitude: -122.4376,
      zoom: 8
    },
    searchResultLayer: null,
    startCoord: [-33.92403, 151.22263],
    endCoord: [-33.92301, 151.22595],
    points: []
  };

  mapRef = React.createRef();

  handleViewportChange = viewport => {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
  };

  // if you are happy with Geocoder default settings, you can just use handleViewportChange directly
  handleGeocoderViewportChange = viewport => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 };

    return this.handleViewportChange({
      ...viewport,
      ...geocoderDefaultOverrides
    });
  };

  handleOnStartResult = event => {
    this.setState({ startCoord: event.result.geometry.coordinates });
    if (this.state.startCoord !== null && this.state.endCoord !== null) {
      Axios.get("/api/route", {
        params: {
          start: this.state.startCoord,
          end: this.state.endCoord
        }
      })
        .then(
          res => this.setState({ points: res.data.route }
          ));
    }
    this.setState({
      searchResultLayer: new GeoJsonLayer({
        id: "search-result",
        data: event.result.geometry,
        getFillColor: [255, 0, 0, 128],
        getRadius: 1000,
        pointRadiusMinPixels: 10,
        pointRadiusMaxPixels: 10
      })
    });
  };

  handleOnEndResult = event => {
    this.setState({ endCoord: event.result.geometry.coordinates });
    if (this.state.startCoord !== null && this.state.endCoord !== null) {
      Axios.get("/api/route", {
        params: {
          start: this.state.startCoord,
          end: this.state.endCoord
        }
      })
        .then(
          res => this.setState({ points: res.data.route }
          ));
    }
    this.setState({
      searchResultLayer: new GeoJsonLayer({
        id: "search-result",
        data: event.result.geometry,
        getFillColor: [255, 0, 0, 128],
        getRadius: 1000,
        pointRadiusMinPixels: 10,
        pointRadiusMaxPixels: 10
      })
    });
  };

  render() {
    const { viewport, searchResultLayer } = this.state;

    return (
      <div style={{ height: "100vh" }}>
        <MapGL
          ref={this.mapRef}
          {...viewport}
          width="100%"
          height="100%"
          onViewportChange={this.handleViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}
        >
          <Geocoder
            mapRef={this.mapRef}
            onResult={this.handleOnStartResult}
            onViewportChange={this.handleGeocoderViewportChange}
            mapboxApiAccessToken={MAPBOX_TOKEN}
            placeholder="Start location"
            position="top-left"
          />
          <Geocoder
            mapRef={this.mapRef}
            onResult={this.handleOnEndResult}
            onViewportChange={this.handleGeocoderViewportChange}
            mapboxApiAccessToken={MAPBOX_TOKEN}
            placeholder="End location"
            position="top-left"
          />

          <PolylineOverlay points={[...this.state.points]}/>

          {/*<PolylineOverlay points={[*/}
          {/*  [*/}
          {/*    2.98828125,*/}
          {/*    60.58696734225869*/}
          {/*  ],*/}
          {/*  [*/}
          {/*    -30.761718749999996,*/}
          {/*    58.63121664342478*/}
          {/*  ],*/}
          {/*  [*/}
          {/*    -66.62109375,*/}
          {/*    43.96119063892024*/}
          {/*  ],*/}
          {/*  [*/}
          {/*    -69.2578125,*/}
          {/*    17.14079039331665*/}
          {/*  ],*/}
          {/*  [*/}
          {/*    -41.1328125,*/}
          {/*    7.18810087117902*/}
          {/*  ],*/}
          {/*  [*/}
          {/*    -7.55859375,*/}
          {/*    9.275622176792112*/}
          {/*  ],*/}
          {/*  [*/}
          {/*    17.75390625,*/}
          {/*    23.40276490540795*/}
          {/*  ],*/}
          {/*  [*/}
          {/*    16.5234375,*/}
          {/*    40.84706035607122*/}
          {/*  ],*/}
          {/*  [*/}
          {/*    15.468749999999998,*/}
          {/*    53.225768435790194*/}
          {/*  ],*/}
          {/*  [*/}
          {/*    6.15234375,*/}
          {/*    59.62332522313024*/}
          {/*  ],*/}
          {/*  [*/}
          {/*    15.292968749999998,*/}
          {/*    60.58696734225869*/}
          {/*  ]*/}
          {/*]}/>*/}
          <DeckGL {...viewport} layers={[searchResultLayer]}/>
        </MapGL>
      </div>
    );
  }
}

export default Map;
