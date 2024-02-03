const { createOrUseExistingModel } = require('../../utilities/mongoutils')
const mongoose = require('mongoose')
const { Schema } = mongoose

function createModel() {
  // Define the user schema
  const userSchema = new Schema({
    name: {
      type: String,
      required: true,
      unique: true,
    },
    age: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
  })
  return createOrUseExistingModel('customers', userSchema)
}

// Create the User model
const model = createModel()
module.exports = model
