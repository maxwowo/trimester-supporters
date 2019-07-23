import React, { Component } from "react";
import "./Map.css";

const API_KEY = "AIzaSyA5cX1edh_feJSMAR34_yyRGioahhbCZTg";
class EmbeddedMap extends Component {
  state = {};

  //Call renderMap when page loads
  componentDidMount() {
    this.renderMap();
  }

  renderMap = () => {
    loadScript(
      "https://maps.googleapis.com/maps/api/js?key=" +
        API_KEY +
        "&callback=initMap"
    );
    //Initialise window.initMap as this.initMap because JS will be looking for window.initMap when script loads
    window.initMap = this.initMap;
  };

  initMap = () => {
    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8
    });
  };
  render() {
    return (
      <main>
        <div id="map" />
      </main>
    );
  }
}

/*    <script
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA5cX1edh_feJSMAR34_yyRGioahhbCZTg&callback=initMap"
      async
      defer
    ></script>*/
function loadScript(url) {
  //Select first script tag on the page
  var index = window.document.getElementsByTagName("script")[0];
  // Create script tag: <script></script>
  var script = window.document.createElement("script");
  // Get <script src=""> and other attributes
  script.src = url;
  script.async = true;
  script.defer = true;
  //Inserts the customised script tag before the other <script> tags on the page
  index.parentNode.insertBefore(script, index);
}

export default EmbeddedMap;
