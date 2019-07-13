import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import React, { Component } from "react";
import MapGL from "react-map-gl";
import DeckGL, { GeoJsonLayer } from "deck.gl";
import Geocoder from "react-map-gl-geocoder";
import Axios from "axios";
import PolylineOverlay from "./PolylineOverlay/PolylineOverlay";
import { Button } from "antd";
import { List, Typography, Layout } from "antd";
import "./Map.less";

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
    startName: null,
    endName: null,
    endCoord: null,
    points: [],
    favourite_routes: []
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
    console.log(event);
    this.setState({ startCoord: event.result.geometry.coordinates });
    this.setState({ startName: event.result.place_name });
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
    if (event.result === undefined) {
      this.setState({ endCoord: event.ok });
    } else {
      this.setState({ endCoord: event.result.geometry.coordinates });
      this.setState({ endName: event.result.place_name });
    }
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

          <PolylineOverlay points={this.state.points} style={{}}/>
          <DeckGL {...viewport} layers={[searchResultLayer]}/>

          <div style={{
            backgroundColor: "white",
            width: "20%",
            height: "100vh",
            textAlign: "center",
            paddingTop: 120,
            position: "absolute",
            zIndex: 0
          }}>
            {this.state.startCoord && this.state.endCoord &&
            <Button
              style={{ marginBottom: 20, display: "block", margin: "auto", width: "90%" }}
              onClick={() => {
                this.setState({
                  favourite_routes: [...this.state.favourite_routes, {
                    from: this.state.startName,
                    to: this.state.endName,
                    fromCoord: this.state.startCoord,
                    toCoord: this.state.endCoord
                  }]
                });
              }}
            >Save this
              trip
            </Button>
            }
            {this.state.favourite_routes.length !== 0 &&
            <Typography.Title level={3} style={{marginTop: 20}}>Favourite routes</Typography.Title>
            }
            {this.state.favourite_routes.map((route, i) => (
              <div style={{
                width: "80%",
                borderBottom: "1px solid lightgray",
                margin: "auto",
                position: "relative",
                zIndex: 0
              }}
                   className="linkDiv"
                   key={i}
                   onClick={() => {
                     this.handleOnEndResult({ ok: [route.fromCoord, route.endCoord] });
                   }}
              >
                <Typography.Paragraph>From: {route.from}</Typography.Paragraph>
                <Typography.Paragraph>To: {route.to}</Typography.Paragraph>
              </div>
            ))}
          </div>
        </MapGL>
      </div>
    );
  }
}

export default Map;
