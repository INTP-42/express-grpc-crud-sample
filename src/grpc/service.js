const grpc = require("@grpc/grpc-js");
const { loadProtoFile } = require("../utilities");
const { GRPC_PORT } = require("../config");
const { CustomerService } = loadProtoFile("customers.proto");

const service = new CustomerService(
  GRPC_PORT,
  grpc.credentials.createInsecure()
);

module.exports = service;
