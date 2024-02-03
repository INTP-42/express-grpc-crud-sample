const grpc = require("@grpc/grpc-js");

const {GRPC_PORT,APP_NAME} = require('../config')
const {loadProtoFile} = require('./utilities')
const customersProto = loadProtoFile('customers.proto')
const { v4: uuidv4 } = require("uuid");

const customers = [
    {
        id: "a68b823c-7ca6-44bc-b721-fb4d5312cafc",
        name: "John Bolton",
        age: 23,
        address: "Address 1"
    },
    {
        id: "34415c7c-f82d-4e44-88ca-ae2a1aaa92b7",
        name: "Mary Anne",
        age: 45,
        address: "Address 2"
    }
];
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
    
    server.addService(customersProto.CustomerService.service, {
        getAll: (_, callback) => {
            callback(null, { customers });
        },

        get: (call, callback) => {
            let customer = customers.find(n => n.id == call.request.id);

            if (customer) {
                callback(null, customer);
            } else {
                callback({
                    code: grpc.status.NOT_FOUND,
                    details: "Not found"
                });
            }
        },

        insert: (call, callback) => {
            let customer = call.request;
            
            customer.id = uuidv4();
            customers.push(customer);
            callback(null, customer);
        },

        update: (call, callback) => {
            let existingCustomer = customers.find(n => n.id == call.request.id);

            if (existingCustomer) {
                existingCustomer.name = call.request.name;
                existingCustomer.age = call.request.age;
                existingCustomer.address = call.request.address;
                callback(null, existingCustomer);
            } else {
                callback({
                    code: grpc.status.NOT_FOUND,
                    details: "Not found"
                });
            }
        },

        remove: (call, callback) => {
            let existingCustomerIndex = customers.findIndex(
                n => n.id == call.request.id
            );

            if (existingCustomerIndex != -1) {
                customers.splice(existingCustomerIndex, 1);
                callback(null, {});
            } else {
                callback({
                    code: grpc.status.NOT_FOUND,
                    details: "Not found"
                });
            }
        }
    });

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