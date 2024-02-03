const express = require("express");
const http = require("http");
const path = require("path");
const server = require("./server");
const bodyParser = require("body-parser");

const { PORT, APP_NAME } = require("./config");

const app = express();
app.set("port", PORT);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

const httpserver = http.createServer(app);
server(app);

httpserver
  .listen(PORT, () => {
    console.log(`${APP_NAME} app is listening to port ${PORT}`);
  })
  .on("error", (err) => {
    console.log(`Error: ${err.stack || err}`);
    process.exit(1);
  });

module.exports = app;
