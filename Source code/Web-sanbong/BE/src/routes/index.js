const express = require("express")
const authRoutes = require("./auth.routes")
const userRoutes = require("./user.routes")
const fieldRoutes = require("./field.routes")
const bookingRoutes = require("./booking.routes")
const clubApplicationRoutes = require("./clubApplication.routes")
const fieldStatusRoutes = require("./fieldStatus.routes")

const router = express.Router()

/**
 * API Routes
 */
router.use("/auth", authRoutes)
router.use("/users", userRoutes)
router.use("/fields", fieldRoutes)
router.use("/bookings", bookingRoutes)
router.use("/club-applications", clubApplicationRoutes)
router.use("/field-status", fieldStatusRoutes)

module.exports = router
