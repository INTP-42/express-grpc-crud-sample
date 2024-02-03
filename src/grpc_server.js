const grpc = require("@grpc/grpc-js");
const { GRPC_PORT, APP_NAME, TLS_SUPPORTED } = require("./config");
const { loadProtoFile } = require("./utilities");
const customersProto = loadProtoFile("customers.proto");
const {customerService} = require("./grpc/impl");
const fs = require('fs')

class GrpcServerSingleton {
  constructor() {
    this.server = null;
    this.start = this.start.bind(this);
    this.shutdown = this.shutdown.bind(this);
    this.creds = null
    process.on("SIGINT", () => {
      console.log("Caught interrupt signal");
      this.shutdown();
    });
  }

  generateCred(){
    if (this.creds !== null){
      throw new Error('gRPC server credentials are set during intialization only')
    }
    if (TLS_SUPPORTED) {
      const rootCert = fs.readFileSync('./ssl/ca.crt');
      const certChain = fs.readFileSync('./ssl/server.crt');
      const privateKey = fs.readFileSync('./ssl/server.pem');

      this.creds = grpc.ServerCredentials.createSsl(rootCert, [{
        cert_chain: certChain,
        private_key: privateKey,
      }]);
    } else {
      this.creds = grpc.ServerCredentials.createInsecure();
    }
  }
  
  start() {
    if (!this.creds){
      this.generateCred()
    }
    if (!this.server) {
      this.server = new grpc.Server();
      this.server.addService(
        customersProto.CustomerService.service,
        customerService
      );

      this.server.bindAsync(
        GRPC_PORT,
        this.creds,
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
