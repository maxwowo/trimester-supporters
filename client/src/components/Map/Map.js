import React, {Component} from 'react';
import ReactMapGL from 'react-map-gl';

class Map extends Component {

  state = {
    viewport: {
      width: "100%",
      height: 600,
      latitude: 37.7577,
      longitude: -122.4376,
      zoom: 8
    }
  };

  render() {
    return (
      <ReactMapGL
        mapboxApiAccessToken="pk.eyJ1IjoibWF4d293byIsImEiOiJjankwdmNkMmswMXFsM2luem1ncGgxeHpoIn0.Djlh8L7Ux6y0sE_pYssJ6g"
        {...this.state.viewport}
        onViewportChange={(viewport) => this.setState({viewport})}
      />
    );
  }
}

export default Map;