/* Load packages */
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");

/* App initialization */
const API_PORT = 3001;
const app = express();
const router = express.Router();

/* App configurations */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

router.get("/test", (req, res) => {
  res.send({test: "hello world"})
});

/* Append /api for HTTP requests */
app.use("/api", router);

/* Launch backend into a port */
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));