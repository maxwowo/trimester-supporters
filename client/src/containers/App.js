import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Layout } from "antd";
import Routes from "../Routes";

import "./App.less";

function App() {
  return (
    <Router>
      <Layout id="app-layout">
        <Layout style={{ height: "100%" }}>
          <Routes />
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
