const { MongoClient } = require("mongodb")
const config = require("./index")
const logger = require("../utils/logger")

let db = null

/**
 * Connect to MongoDB
 * @returns {Promise<object>} MongoDB connection
 */
const connectToDatabase = async () => {
  try {
    const client = new MongoClient(config.mongodb.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    await client.connect()
    db = client.db(config.mongodb.dbName)
    logger.info("Connected to MongoDB successfully")
    return db
  } catch (error) {
    logger.error("MongoDB connection error:", error)
    throw error
  }
}

/**
 * Get MongoDB connection
 * @returns {object} MongoDB connection
 */
const getDb = () => {
  if (!db) {
    throw new Error("Database not initialized")
  }
  return db
}

module.exports = {
  connectToDatabase,
  getDb,
}
