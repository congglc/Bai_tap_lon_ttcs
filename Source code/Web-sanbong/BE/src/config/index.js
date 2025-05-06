require("dotenv").config()

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  mongodb: {
    uri: process.env.MONGODB_URI ,
    dbName: process.env.MONGODB_DB_NAME ,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION_DAYS,
  },
}
