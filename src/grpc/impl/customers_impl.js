const grpc = require("@grpc/grpc-js");
const customerDao = require('../../common/dao/customerDao');

module.exports = {
  getAll: async (_, callback) => {
    try {
      const customers = await customerDao.getMultipleCustomerInstance({});
      callback(null, { customers });
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        details: "Error fetching customers",
      });
    }
  },

  get: async (call, callback) => {
    try {
      const customer = await customerDao.getCustomerInstance({ _id: call.request._id});
      if (customer) {
        callback(null, customer);
      } else {
        callback({
          code: grpc.status.NOT_FOUND,
          details: "Not found",
        });
      }
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        details: "Error fetching customer",
      });
    }
  },

  insert: async (call, callback) => {
    try {
      let customer = call.request;
      await customerDao.saveCustomer(customer);
      callback(null, customer);
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        details: "Error inserting customer",
      });
    }
  },

  update: async (call, callback) => {
    try {
      const existingCustomer = await customerDao.getCustomerInstance({ _id: call.request._id });
      if (existingCustomer) {
        existingCustomer.name = call.request.name;
        existingCustomer.age = call.request.age;
        existingCustomer.address = call.request.address;
        await customerDao.updateCustomerInstance({ _id: call.request._id }, existingCustomer);
        callback(null, existingCustomer);
      } else {
        callback({
          code: grpc.status.NOT_FOUND,
          details: "Not found",
        });
      }
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        details: "Error updating customer",
      });
    }
  },

  remove: async (call, callback) => {
    try {
      const existingCustomer = await customerDao.getCustomerInstance({ _id: call.request._id });
      if (existingCustomer) {
        await customerDao.removeCustomer({ _id: call.request._id });
        callback(null, {});
      } else {
        callback({
          code: grpc.status.NOT_FOUND,
          details: "Not found",
        });
      }
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        details: "Error removing customer",
      });
    }
  },
};
