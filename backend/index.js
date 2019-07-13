// MapQuest API Key:zJpb9Bpr0ZKKnZhqfWvxoxj9hKKB6Sld

/* Load packages */
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const http = require("http");
const axios = require("axios");

/* App initialization */
const API_PORT = 3001;
const app = express();
const router = express.Router();

/* App configurations */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

function getUser() {
  return axios
    .get(
      "https://www.mapquestapi.com/directions/v2/alternateroutes?key=zJpb9Bpr0ZKKnZhqfWvxoxj9hKKB6Sld&from=-33.92403%2C+151.2226&to=-33.92301%2C+151.2255&outFormat=json&ambiguities=check&routeType=pedestrian&maxRoutes=10&timeOverage=200&doReverseGeocode=false&enhancedNarrative=false&avoidTimedConditions=false&unit=M"
    )
    .then(res => console.log(res.data));
}

router.get("/test", (req, res) => {
  res.send({ test: "hello world" });
});

function parseMain(str) {
  //var json = JSON.parse(str);
  return str.route;
}

function parseAlternate(str) {
  var json = JSON.parse(str);
  return json.route.shape.shapePoints;
}

router.get("/route", (req, res) => {
  // getUser();
  axios
    .get(
      "https://www.mapquestapi.com/directions/v2/alternateroutes?key=zJpb9Bpr0ZKKnZhqfWvxoxj9hKKB6Sld&from=-33.92403%2C+151.2226&to=-33.92301%2C+151.2255&outFormat=json&ambiguities=check&routeType=pedestrian&maxRoutes=10&timeOverage=200&doReverseGeocode=false&enhancedNarrative=false&avoidTimedConditions=false&unit=M"
    )
    .then(result => {
      let resp = result.data.route.shape.shapePoints;

      for (let i = 0; i < resp.length; i++) {
        console.log(resp[i]);
      }
      res.send(result.data);
    });

  // res.send({ route: getUser() });
});

/* Append /api for HTTP requests */
app.use("/api", router);

/* Launch backend into a port */
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
