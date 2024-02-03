const mongoose = require('mongoose')
const { DB_URL, DEBUG_QUERIES=false } = require('../config')
const logs = console.log

module.exports = async () => {
  const methodName = '[DB connection]'
  try {
    if (!DB_URL) {
      throw new Error('Missing Database Connection URL')
    }
    logs('info', methodName, `Connecting to db ${DB_URL}`)
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    mongoose.set('debug', (collectionName, method, query, doc) => {
      DEBUG_QUERIES &&
        logs(
          'info',
          '[MongoDb]',
          `${collectionName}-${method} info ${JSON.stringify({
            query,
            doc,
          })}`
        )
    })
    logs('info', methodName, 'Db Connected')
  } catch (error) {
    logs('info', methodName, 'Error in DB Connection')
    logs('error', methodName, `${error.stack || error}`)
    process.exit(1)
  }
}
