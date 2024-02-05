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
    this.app = APP_NAME
    this.port = GRPC_PORT
    this.enableCertificates = TLS_SUPPORTED
    process.on("SIGINT", () => {
      console.log("Caught interrupt signal");
      this.shutdown();
    });
  }

  generateCred(){
    if (this.creds !== null){
      throw new Error('gRPC server credentials are set during intialization only')
    }
    if (this.enableCertificates) {
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
  async start() {
    if (!this.creds){
      this.generateCred()
    }
    if (!this.server) {
      this.server = new grpc.Server();
      this.server.addService(
        customersProto.CustomerService.service,
        customerService
      );
      await this.bindAndStartServer();
    } else {
      console.log(`${APP_NAME} app is already running on port ${GRPC_PORT}`);
    }
  }

  async bindAndStartServer() {
    return new Promise((resolve, reject) => {
      this.server.bindAsync(this.port, this.creds, (err, _) => {
        if (!err) {
          console.log(`${this.app} app is listening to grpc at port ${this.port}`);
          resolve();
        } else {
          console.error(err);
          reject(err);
        }
      });
    }).then(() => this.server.start());
  }

  shutdown() {
    console.log("Cleanup");
    if (this.server) {
      this.server.forceShutdown();
      this.server = null;
      console.log(`${this.app} app has been shut down`);
    } else {
      console.log(`${this.app} app is not currently running`);
    }
  }
}

// Create a singleton instance
const grpcServer = new GrpcServerSingleton();

// Export the singleton instance
module.exports = grpcServer;
