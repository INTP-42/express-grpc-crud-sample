require('dotenv').config()
const { env } = process
const { PROTO_FOLDER_PATH, PROTOLOADER_CONFIG } = require('./constant')
const IS_TESTING = env.IS_TESTING==='true'? true: false

const config = {
  PORT: parseInt(env.PORT) || 8020,
  APP_NAME: env.APP_NAME || 'GRPC-EXPRESS-SAMPLE',
  EXEC_ENV: env.EXEC_ENV || 'dev',
  GRPC_PORT: '0.0.0.0:' + parseInt(env.GRPC_PORT) || 30043,
  TLS_SUPPORTED: env.TLS_SUPPORTED==='true' ? true: false,
  IS_TESTING,
  PROTOLOADER_CONFIG,
  PROTO_FOLDER_PATH,
  DB_URL: IS_TESTING ? env.TEST_MONGODB_URI : env.MONGODB_URI
}

module.exports = config
