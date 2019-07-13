import React, { Component } from "react";
import ReactMapGL from "react-map-gl";
import PolylineOverlay from "./PolylineOverlay/PolylineOverlay";

class Map extends Component {

  state = {
    viewport: {
      width: "100%",
      height: 600,
      latitude: 3,
      longitude: 4,
      zoom: 8
    }
  };

  render() {
    return (
      <ReactMapGL
        mapboxApiAccessToken="pk.eyJ1IjoibWF4d293byIsImEiOiJjankwdmNkMmswMXFsM2luem1ncGgxeHpoIn0.Djlh8L7Ux6y0sE_pYssJ6g"
        {...this.state.viewport}
        onViewportChange={(viewport) => this.setState({ viewport })}
      >
        <PolylineOverlay points={[
          [
            2.98828125,
            60.58696734225869
          ],
          [
            -30.761718749999996,
            58.63121664342478
          ],
          [
            -66.62109375,
            43.96119063892024
          ],
          [
            -69.2578125,
            17.14079039331665
          ],
          [
            -41.1328125,
            7.18810087117902
          ],
          [
            -7.55859375,
            9.275622176792112
          ],
          [
            17.75390625,
            23.40276490540795
          ],
          [
            16.5234375,
            40.84706035607122
          ],
          [
            15.468749999999998,
            53.225768435790194
          ],
          [
            6.15234375,
            59.62332522313024
          ],
          [
            15.292968749999998,
            60.58696734225869
          ]
        ]}/>
      </ReactMapGL>
    );
  }
}

export default Map;