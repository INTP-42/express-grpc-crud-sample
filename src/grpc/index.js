const grpc = require("@grpc/grpc-js");

const {GRPC_PORT,APP_NAME} = require('../config')
const {loadProtoFile} = require('./utilities')
const customersProto = loadProtoFile('customers.proto')
const customer_impl = require('./service_impl')

const cleanup = (server) => {
    console.log('Cleanup');
    if (server) {
      server.forceShutdown();
    }
}

const grpcServer = () => {
    const server = new grpc.Server();
    process.on('SIGINT', () => {
        console.log('Caught interrupt signal');
        cleanup(server);
    });
    
    server.addService(customersProto.CustomerService.service, customer_impl);

    server.bindAsync(GRPC_PORT, grpc.ServerCredentials.createInsecure(),(err,_)=>{
        if (!err){
            console.log(`${APP_NAME} app is listening to grpc at port ${GRPC_PORT}`);
            server.start();
        }else{
            console.log(err)
        }
    });

}

grpcServer()