const paymentService = require("../services/payment.service")
const bookingService = require("../services/booking.service")
const { apiResponse } = require("../utils/apiResponse")

/**
 * Get all payments
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getPayments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, type, method } = req.query

    // Create filter
    const filter = {}
    if (status) filter.status = status
    if (type) filter.type = type
    if (method) filter.method = method

    // Calculate pagination
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    // Get payments with pagination
    const payments = await paymentService.getPayments(filter, Number.parseInt(limit), skip)

    // Get total count
    const total = await paymentService.countPayments(filter)

    // Calculate total pages
    const totalPages = Math.ceil(total / Number.parseInt(limit))

    return apiResponse(res, 200, "Payments retrieved successfully", {
      payments,
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
 * Get payment by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getPaymentById = async (req, res, next) => {
  try {
    const payment = await paymentService.getPaymentById(req.params.paymentId)

    if (!payment) {
      return apiResponse(res, 404, "Payment not found")
    }

    return apiResponse(res, 200, "Payment retrieved successfully", { payment })
  } catch (error) {
    next(error)
  }
}

/**
 * Get payments by booking ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getPaymentsByBookingId = async (req, res, next) => {
  try {
    // Check if booking exists
    const booking = await bookingService.getBookingById(req.params.bookingId)

    if (!booking) {
      return apiResponse(res, 404, "Booking not found")
    }

    const payments = await paymentService.getPaymentsByBookingId(req.params.bookingId)

    return apiResponse(res, 200, "Payments retrieved successfully", {
      booking: {
        _id: booking._id,
        fieldName: booking.fieldName,
        date: booking.date,
        time: booking.time,
        price: booking.price,
        status: booking.status,
      },
      payments,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Create a deposit payment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const createDepositPayment = async (req, res, next) => {
  try {
    const { bookingId, method, metadata } = req.body
    const userId = req.user._id

    const payment = await paymentService.createDepositPayment(bookingId, userId, method, metadata)

    return apiResponse(res, 201, "Deposit payment created successfully", { payment })
  } catch (error) {
    if (error.message === "Booking not found") {
      return apiResponse(res, 404, "Booking not found")
    }
    if (error.message === "Deposit already paid for this booking") {
      return apiResponse(res, 400, "Deposit already paid for this booking")
    }
    next(error)
  }
}

/**
 * Create a full payment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const createFullPayment = async (req, res, next) => {
  try {
    const { bookingId, method, metadata } = req.body
    const userId = req.user._id

    const payment = await paymentService.createFullPayment(bookingId, userId, method, metadata)

    return apiResponse(res, 201, "Full payment created successfully", { payment })
  } catch (error) {
    if (error.message === "Booking not found") {
      return apiResponse(res, 404, "Booking not found")
    }
    if (error.message === "Booking is already fully paid") {
      return apiResponse(res, 400, "Booking is already fully paid")
    }
    next(error)
  }
}

/**
 * Complete payment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const completePayment = async (req, res, next) => {
  try {
    const { transactionId } = req.body

    const payment = await paymentService.completePayment(req.params.paymentId, transactionId)

    return apiResponse(res, 200, "Payment completed successfully", { payment })
  } catch (error) {
    if (error.message === "Payment not found") {
      return apiResponse(res, 404, "Payment not found")
    }
    if (error.message === "Payment is already completed") {
      return apiResponse(res, 400, "Payment is already completed")
    }
    next(error)
  }
}

/**
 * Cancel payment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const cancelPayment = async (req, res, next) => {
  try {
    const { reason } = req.body

    const payment = await paymentService.cancelPayment(req.params.paymentId, reason)

    return apiResponse(res, 200, "Payment cancelled successfully", { payment })
  } catch (error) {
    if (error.message === "Payment not found") {
      return apiResponse(res, 404, "Payment not found")
    }
    if (error.message.startsWith("Cannot cancel payment with status")) {
      return apiResponse(res, 400, error.message)
    }
    next(error)
  }
}

/**
 * Refund payment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const refundPayment = async (req, res, next) => {
  try {
    const { reason } = req.body

    const payment = await paymentService.refundPayment(req.params.paymentId, reason)

    return apiResponse(res, 200, "Payment refunded successfully", { payment })
  } catch (error) {
    if (error.message === "Payment not found") {
      return apiResponse(res, 404, "Payment not found")
    }
    if (error.message === "Only completed payments can be refunded") {
      return apiResponse(res, 400, "Only completed payments can be refunded")
    }
    next(error)
  }
}

module.exports = {
  getPayments,
  getPaymentById,
  getPaymentsByBookingId,
  createDepositPayment,
  createFullPayment,
  completePayment,
  cancelPayment,
  refundPayment,
}
