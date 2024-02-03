const grpc = require("@grpc/grpc-js");
const { GRPC_PORT, APP_NAME } = require("./config");
const { loadProtoFile } = require("./utilities");
const customersProto = loadProtoFile("customers.proto");
const customer_impl = require("./grpc/service_impl");

class GrpcServerSingleton {
  constructor() {
    this.server = null;
    this.start = this.start.bind(this);
    this.shutdown = this.shutdown.bind(this);

    process.on("SIGINT", () => {
      console.log("Caught interrupt signal");
      this.shutdown();
    });
  }

  start() {
    if (!this.server) {
      this.server = new grpc.Server();
      this.server.addService(
        customersProto.CustomerService.service,
        customer_impl
      );

      this.server.bindAsync(
        GRPC_PORT,
        grpc.ServerCredentials.createInsecure(),
        (err, _) => {
          if (!err) {
            console.log(
              `${APP_NAME} app is listening to grpc at port ${GRPC_PORT}`
            );
            this.server.start();
          } else {
            console.error(err);
          }
        }
      );
    } else {
      console.log(`${APP_NAME} app is already running on port ${GRPC_PORT}`);
    }
  }

  shutdown() {
    console.log("Cleanup");
    if (this.server) {
      this.server.forceShutdown();
      this.server = null;
      console.log(`${APP_NAME} app has been shut down`);
    } else {
      console.log(`${APP_NAME} app is not currently running`);
    }
  }
}

// Create a singleton instance
const grpcServer = new GrpcServerSingleton();

// Export the singleton instance
module.exports = grpcServer;