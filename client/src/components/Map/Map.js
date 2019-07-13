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
      latitude: -33.9173,
      longitude: 151.2313,
      zoom: 10
    },
    searchResultLayer: null,
    startCoord: null,
    endCoord: null,
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
          res => {
            const returned_array = [...res.data.route];

            if (res.data.freakout) {
              alert("There is a segment which is too steep, we suggest using public transport.");
              return;
            }

            const route = [];
            for (let i = 1; i < returned_array.length; i += 2) {
              const a = returned_array[i - 1];
              const b = returned_array[i];
              route.push([b, a]);
            }

            this.setState({ points: route });
          });
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
          res => {
            const returned_array = [...res.data.route];

            if (res.data.freakout) {
              alert("There is a segment which is too steep, we suggest using public transport.");
              return;
            }

            const route = [];
            for (let i = 1; i < returned_array.length; i += 2) {
              const a = returned_array[i - 1];
              const b = returned_array[i];
              route.push([b, a]);
            }

            this.setState({ points: route });
          });
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

          <PolylineOverlay points={this.state.points}/>
          <DeckGL {...viewport} layers={[searchResultLayer]}/>
        </MapGL>
      </div>
    );
  }
}

export default Map;
