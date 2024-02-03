require('dotenv').config()
const { env } = process

const config = {
  PORT: parseInt(env.PORT) || 8020,
  APP_NAME: env.APP_NAME || 'GRPC-EXPRESS-SAMPLE',
  EXEC_ENV: env.EXEC_ENV || 'dev',
  GRPC_PORT: parseInt(env.GRPC_PORT) || 30043,
  TLS_SUPPORTED: env.TLS_SUPPORTED==='true' ? true: false,
  IS_TESTING: env.IS_TESTING==='true'? true: false
}

module.exports = config
