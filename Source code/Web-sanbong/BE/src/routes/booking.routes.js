const express = require("express")
const bookingController = require("../controllers/booking.controller")
const { authenticate, authorize } = require("../middlewares/auth.middleware")
const validate = require("../middlewares/validate.middleware")
const bookingValidation = require("../validations/booking.validation")
const constants = require("../config/constants")

const router = express.Router()

/**
 * @route GET /api/bookings
 * @desc Get all bookings
 * @access Private (Admin/Manager)
 */
router.get("/", authenticate, authorize(constants.roles.ADMIN, constants.roles.MANAGER), bookingController.getBookings)

/**
 * @route GET /api/bookings/:bookingId
 * @desc Get booking by ID
 * @access Private
 */
router.get("/:bookingId", authenticate, validate(bookingValidation.getBookingById), bookingController.getBookingById)

/**
 * @route GET /api/bookings/user/:userId
 * @desc Get bookings by user ID
 * @access Private
 */
router.get(
  "/user/:userId",
  authenticate,
  validate(bookingValidation.getBookingsByUser),
  bookingController.getBookingsByUser,
)

/**
 * @route POST /api/bookings
 * @desc Create a new booking
 * @access Private
 */
router.post("/", authenticate, validate(bookingValidation.createBooking), bookingController.createBooking)

/**
 * @route PUT /api/bookings/:bookingId
 * @desc Update booking
 * @access Private
 */
router.put("/:bookingId", authenticate, validate(bookingValidation.updateBooking), bookingController.updateBooking)

/**
 * @route PUT /api/bookings/:bookingId/confirm
 * @desc Confirm booking
 * @access Private (Admin/Manager)
 */
router.put(
  "/:bookingId/confirm",
  authenticate,
  authorize(constants.roles.ADMIN, constants.roles.MANAGER),
  validate(bookingValidation.confirmBooking),
  bookingController.confirmBooking,
)

/**
 * @route PUT /api/bookings/:bookingId/cancel
 * @desc Cancel booking
 * @access Private
 */
router.put(
  "/:bookingId/cancel",
  authenticate,
  validate(bookingValidation.cancelBooking),
  bookingController.cancelBooking,
)

/**
 * @route DELETE /api/bookings/:bookingId
 * @desc Delete booking
 * @access Private (Admin only)
 */
router.delete(
  "/:bookingId",
  authenticate,
  authorize(constants.roles.ADMIN),
  validate(bookingValidation.deleteBooking),
  bookingController.deleteBooking,
)

module.exports = router
