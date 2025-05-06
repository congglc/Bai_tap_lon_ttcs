const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const { connectToDatabase } = require("./config/database")
const routes = require("./routes")
const errorMiddleware = require("./middlewares/error.middleware")
const logger = require("./utils/logger")

// Initialize express app
const app = express()

// Connect to MongoDB
connectToDatabase()
  .then(() => logger.info("Connected to MongoDB"))
  .catch((err) => {
    logger.error("MongoDB connection error:", err)
    process.exit(1)
  })

// Middlewares
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan("dev"))

// Routes
app.use("/api", routes)

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" })
})

// Error handling middleware
app.use(errorMiddleware)

module.exports = app
