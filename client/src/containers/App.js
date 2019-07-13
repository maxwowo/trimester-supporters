import React from "react";
import Axios from "axios";
import Navbar from "../components/Navbar/Navbar";
import { BrowserRouter as Router } from "react-router-dom";
import { Layout } from "antd";
import Routes from "../Routes";

import "./App.less";

function App() {
  Axios.get("/api/test").then(res => console.log(res));
  return (
    <Router>
      <Layout id="app-layout">
        <Navbar/>
        <Layout>
          <Routes/>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
