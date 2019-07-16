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

router.get("/route", (req, res) => {
  // getUser();
  const { start, end } = req.query;
  axios
    .get(
      `https://www.mapquestapi.com/directions/v2/alternateroutes?key=zJpb9Bpr0ZKKnZhqfWvxoxj9hKKB6Sld&from=${start[1]}%2C+${start[0]}&to=${end[1]}%2C+${end[0]}&outFormat=json&ambiguities=check&routeType=pedestrian&maxRoutes=10&timeOverage=200&doReverseGeocode=false&enhancedNarrative=false&avoidTimedConditions=false&unit=M`
    )
    .then(result => {
      const everything = [];
      everything.push(result.data.route.shape.shapePoints);

      if (result.data.route.alternateRoutes !== undefined) {
        for (let i = 0; i < result.data.route.alternateRoutes.length; i++) {
          everything.push(result.data.route.alternateRoutes[i].route.shape.shapePoints);
        }
      }

      everything.sort((a, b) => {
        axios.get("http://open.mapquestapi.com/elevation/v1/profile?key=zJpb9Bpr0ZKKnZhqfWvxoxj9hKKB6Sld&shapeFormat=raw&latLngCollection=" + a.join(",")).then(result2 => {
          axios.get("http://open.mapquestapi.com/elevation/v1/profile?key=zJpb9Bpr0ZKKnZhqfWvxoxj9hKKB6Sld&shapeFormat=raw&latLngCollection=" + b.join(",")).then(result3 => {
            const ep1 = result2.data.elevationProfile;
            const ep2 = result3.data.elevationProfile;
            let alpha1 = 0;
            let alpha2 = 0;

            for (let i = 1; i < ep1.length; i++) {
              alpha1 = Math.max((ep1[i].distance - ep1[i - 1].distance) * (ep1[i].height - ep1[i - 1].height));
            }

            for (let i = 1; i < ep2.length; i++) {
              alpha2 = Math.max((ep2[i].distance - ep2[i - 1].distance) * (ep2[i].height - ep2[i - 1].height));
            }

            return alpha1 - alpha2;
          });
        });
      });

      axios.get("http://open.mapquestapi.com/elevation/v1/profile?key=zJpb9Bpr0ZKKnZhqfWvxoxj9hKKB6Sld&shapeFormat=raw&latLngCollection=" + everything[0].join(",")).then(result2 => {
        const ep = result2.data.elevationProfile;
        let max_instantaneous_change = 0;

        for (let i = 1; i < ep.length; i++) {
          max_instantaneous_change = Math.max(max_instantaneous_change, ep[i - 1].height - ep[i].height);
        }

        if (max_instantaneous_change > 15) {
          res.send({ route: everything[0], freakout: true });
        } else {
          res.send({ route: everything[0], freakout: false });
        }
      });
    });
  // res.send({ route: getUser() });
});

/* Append /api for HTTP requests */
app.use("/api", router);

/* Launch backend into a port */
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
