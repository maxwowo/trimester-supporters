/* React */
import React from "react";
import "./HomePage.less";
import Map from "../../components/Map/Map";
import { InputNumber } from "antd";

const HomePage = props => (
  <div style={{ height: "100%" }}>
    <Map/>
  </div>
);

export default HomePage;