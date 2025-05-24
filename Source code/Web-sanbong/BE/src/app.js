const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const { connectToDatabase } = require("./config/database")
const routes = require("./routes")
const errorMiddleware = require("./middlewares/error.middleware")
const logger = require("./utils/logger")
const path = require("path")

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

// Cập nhật cấu hình CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL ,
  credentials: true,
  optionsSuccessStatus: 200,
}

// Thay thế dòng app.use(cors()) hiện tại
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan("dev"))
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../public/uploads"), {
    setHeaders: (res, filePath) => {
      res.set("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "*");
      res.set("Cross-Origin-Resource-Policy", "cross-origin");
      if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) {
        res.set("Content-Type", "image/jpeg");
      }
      if (filePath.endsWith(".png")) {
        res.set("Content-Type", "image/png");
      }
    },
  })
)

// Routes
app.use("/api", routes)

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" })
})

// Error handling middleware
app.use(errorMiddleware)

module.exports = app
