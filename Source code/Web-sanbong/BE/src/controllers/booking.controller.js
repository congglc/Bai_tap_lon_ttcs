const bookingService = require("../services/booking.service")
const userService = require("../services/user.service")
const { apiResponse } = require("../utils/apiResponse")

/**
 * Get all bookings
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query
    const filter = status ? { status } : {}
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    const bookings = await bookingService.getBookings(filter, Number.parseInt(limit), skip)
    const total = await bookingService.countBookings(filter)
    const totalPages = Math.ceil(total / Number.parseInt(limit))

    return apiResponse(res, 200, "Bookings retrieved successfully", {
      bookings,
      pagination: {
        total,
        limit: Number.parseInt(limit),
        totalPages,
        currentPage: Number.parseInt(page),
        hasNextPage: Number.parseInt(page) < totalPages,
        hasPrevPage: Number.parseInt(page) > 1,
      },
    })
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
    const { page = 1, limit = 10, status } = req.query
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    const bookings = await bookingService.getBookingsByUser(req.params.userId, Number.parseInt(limit), skip, status)
    const filter = { userId: req.params.userId }
    if (status) filter.status = status

    const total = await bookingService.countBookings(filter)
    const totalPages = Math.ceil(total / Number.parseInt(limit))

    return apiResponse(res, 200, "User bookings retrieved successfully", {
      bookings,
      pagination: {
        total,
        limit: Number.parseInt(limit),
        totalPages,
        currentPage: Number.parseInt(page),
        hasNextPage: Number.parseInt(page) < totalPages,
        hasPrevPage: Number.parseInt(page) > 1,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get bookings by email or phone
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getBookingsByEmailOrPhone = async (req, res, next) => {
  try {
    const { email, phone, page = 1, limit = 10, status } = req.query

    if (!email && !phone) {
      return apiResponse(res, 400, "Email or phone is required")
    }

    // Find user by email or phone
    const user = await userService.getUserByEmailOrPhone(email, phone)

    if (!user) {
      return apiResponse(res, 404, "User not found")
    }

    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    // Get bookings for the user
    const bookings = await bookingService.getBookingsByUser(user._id, Number.parseInt(limit), skip, status)

    const filter = { userId: user._id }
    if (status) filter.status = status

    const total = await bookingService.countBookings(filter)
    const totalPages = Math.ceil(total / Number.parseInt(limit))

    return apiResponse(res, 200, "Bookings retrieved successfully", {
      bookings,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      pagination: {
        total,
        limit: Number.parseInt(limit),
        totalPages,
        currentPage: Number.parseInt(page),
        hasNextPage: Number.parseInt(page) < totalPages,
        hasPrevPage: Number.parseInt(page) > 1,
      },
    })
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
  getBookingsByEmailOrPhone,
  createBooking,
  updateBooking,
  confirmBooking,
  cancelBooking,
  deleteBooking,
}
