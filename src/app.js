const express = require("express");
const http = require("http");
const path = require("path");
const server = require("./server");
const grpcServer = require('./grpc_server')
const bodyParser = require("body-parser");

const { PORT, APP_NAME } = require("./config");
require('./common/models/customers')
const app = express();
app.set("port", PORT);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

const httpserver = http.createServer(app);
server(app);
const { databaseConnection } = require('./database')

databaseConnection().then(() => {
  httpserver
  .listen(PORT, () => {
    grpcServer.start()
    console.log(`${APP_NAME} app is listening to port ${PORT}`);
  })
  .on("error", (err) => {
    console.log(`Error: ${err.stack || err}`);
    grpcServer.shutdown()
    process.exit(1);
  });
})

module.exports = app;
