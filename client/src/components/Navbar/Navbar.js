/* React */
import React from "react";

/* React Router */
import { Link } from "react-router-dom";

/* Ant Design components */
import { Col, Icon, Layout, Row } from "antd";
import { Typography } from "antd";

/* Styles */
import "./Navbar.less";
import "../../custom.less";

const { Header } = Layout;

const Navbar = () => (
  <Header id="navbar">
    <Row
      type="flex"
      align="middle"
      justify="space-between"
      className="container-width"
    >

      <Col>
        <Link to="/">
          App Title
        </Link>
      </Col>

      <Col>
        <Icon className="icon" type="github" onClick={() => {
          window.open("https://github.com/maxwowo/trimester-supporters", "_blank");
        }}/>
      </Col>

    </Row>
  </Header>
);

export default Navbar;