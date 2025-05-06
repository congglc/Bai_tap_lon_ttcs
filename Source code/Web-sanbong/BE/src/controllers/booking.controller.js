const bookingService = require("../services/booking.service")
const { apiResponse } = require("../utils/apiResponse")

/**
 * Get all bookings
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getBookings = async (req, res, next) => {
  try {
    const filter = {}

    // Filter by status if provided
    if (req.query.status) {
      filter.status = req.query.status
    }

    // Filter by field if provided
    if (req.query.fieldId) {
      filter.fieldId = req.query.fieldId
    }

    // Filter by user if provided
    if (req.query.userId) {
      filter.userId = req.query.userId
    }

    const bookings = await bookingService.getBookings(filter)
    return apiResponse(res, 200, "Bookings retrieved successfully", { bookings })
  } catch (error) {
    next(error)
  }
}

/**
 * Get booking by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getBookingById = async (req, res, next) => {
  try {
    const booking = await bookingService.getBookingById(req.params.bookingId)
    if (!booking) {
      return apiResponse(res, 404, "Booking not found")
    }
    return apiResponse(res, 200, "Booking retrieved successfully", { booking })
  } catch (error) {
    next(error)
  }
}

/**
 * Get bookings by user ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getBookingsByUser = async (req, res, next) => {
  try {
    const bookings = await bookingService.getBookingsByUser(req.params.userId)
    return apiResponse(res, 200, "User bookings retrieved successfully", { bookings })
  } catch (error) {
    next(error)
  }
}

/**
 * Create a new booking
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const createBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.createBooking(req.body)
    return apiResponse(res, 201, "Booking created successfully", { booking })
  } catch (error) {
    next(error)
  }
}

/**
 * Update booking
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const updateBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.updateBooking(req.params.bookingId, req.body)
    return apiResponse(res, 200, "Booking updated successfully", { booking })
  } catch (error) {
    next(error)
  }
}

/**
 * Confirm booking
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const confirmBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.confirmBooking(req.params.bookingId)
    return apiResponse(res, 200, "Booking confirmed successfully", { booking })
  } catch (error) {
    next(error)
  }
}

/**
 * Cancel booking
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const cancelBooking = async (req, res, next) => {
  try {
    const { reason } = req.body
    const booking = await bookingService.cancelBooking(req.params.bookingId, reason)
    return apiResponse(res, 200, "Booking cancelled successfully", { booking })
  } catch (error) {
    next(error)
  }
}

/**
 * Delete booking
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const deleteBooking = async (req, res, next) => {
  try {
    await bookingService.deleteBooking(req.params.bookingId)
    return apiResponse(res, 200, "Booking deleted successfully")
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getBookings,
  getBookingById,
  getBookingsByUser,
  createBooking,
  updateBooking,
  confirmBooking,
  cancelBooking,
  deleteBooking,
}
