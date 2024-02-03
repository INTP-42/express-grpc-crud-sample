const Customer = require('../models/customers')

const PROJECTION = {
  ALL: {},
  VIEW: {
    name: 1,
    age: 1,
  },
  ID: {
    _id: 1,
  },
}

/**
 * get single object of Customer.
 * @property {object} customerInfo- match condition
 * @property {object} condition- update condition
 * @returns {object} Customer instance on success and error on failure
 */

const getCustomerInstance = async (query, projection) =>
  Customer.findOne(query, projection ? PROJECTION[projection] : PROJECTION.ALL)
    .lean()
    .exec()

const updateCustomerInstance = async (query, update) =>
  Customer.findOneAndUpdate(query, update, { new: true })

const saveCustomer = async (CustomerObj) => new Customer(CustomerObj).save()

const getMultipleCustomerInstance = async (query, projection) =>
  Customer.find(query, projection || PROJECTION.ALL)

const updateMultipleCustomerInstance = async (query, update) =>
  Customer.updateMany(query, update)

const removeCustomer = (query) => Customer.deleteOne(query)

module.exports = {
  getCustomerInstance,
  updateCustomerInstance,
  saveCustomer,
  getMultipleCustomerInstance,
  updateMultipleCustomerInstance,
  removeCustomer,
}
