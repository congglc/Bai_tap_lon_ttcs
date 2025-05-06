const bookingModel = require("../models/booking.model")
const fieldStatusService = require("./fieldStatus.service")
const constants = require("../config/constants")
const { ObjectId } = require("mongodb")

/**
 * Get all bookings
 * @param {Object} filter - Filter criteria
 * @returns {Promise<Array>} List of bookings
 */
const getBookings = async (filter = {}) => {
  return bookingModel.getBookings(filter)
}

/**
 * Get booking by ID
 * @param {string} id - Booking ID
 * @returns {Promise<Object>} Booking object
 */
const getBookingById = async (id) => {
  return bookingModel.getBookingById(id)
}

/**
 * Get bookings by user ID
 * @param {string} userId - User ID
 * @returns {Promise<Array>} List of bookings
 */
const getBookingsByUser = async (userId) => {
  return bookingModel.getBookingsByUser(userId)
}

/**
 * Create a new booking
 * @param {Object} bookingData - Booking data
 * @returns {Promise<Object>} Created booking
 */
const createBooking = async (bookingData) => {
  // Convert userId to ObjectId if it's a string
  if (bookingData.userId && typeof bookingData.userId === "string") {
    bookingData.userId = new ObjectId(bookingData.userId)
  }

  // Convert fieldId to ObjectId if it's a string
  if (bookingData.fieldId && typeof bookingData.fieldId === "string") {
    bookingData.fieldId = new ObjectId(bookingData.fieldId)
  }

  // Create booking
  const booking = await bookingModel.createBooking(bookingData)

  // Update field status if time slot is provided
  if (booking.date && booking.time && booking.fieldId) {
    const dateStr = new Date(booking.date).toISOString().split("T")[0]

    // Get field status
    const fieldStatus = await fieldStatusService.getFieldStatusByFieldAndDate(booking.fieldId, dateStr)

    if (fieldStatus) {
      // Find the time slot
      const timeSlotIndex = fieldStatus.timeSlots.findIndex((slot) => slot.time === booking.time)

      if (timeSlotIndex !== -1) {
        // Update time slot status
        await fieldStatusService.updateTimeSlotStatus(
          booking.fieldId,
          dateStr,
          fieldStatus.timeSlots[timeSlotIndex].id,
          {
            status: constants.fieldStatus.BOOKED,
            bookedBy: booking.teamName,
          },
        )
      }
    }
  }

  return booking
}

/**
 * Update booking
 * @param {string} id - Booking ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated booking
 */
const updateBooking = async (id, updateData) => {
  return bookingModel.updateBooking(id, updateData)
}

/**
 * Confirm booking
 * @param {string} id - Booking ID
 * @returns {Promise<Object>} Confirmed booking
 */
const confirmBooking = async (id) => {
  const booking = await bookingModel.updateBooking(id, {
    status: constants.bookingStatus.CONFIRMED,
    confirmedAt: new Date(),
  })

  return booking
}

/**
 * Cancel booking
 * @param {string} id - Booking ID
 * @param {string} reason - Cancellation reason
 * @returns {Promise<Object>} Cancelled booking
 */
const cancelBooking = async (id, reason) => {
  const booking = await bookingModel.updateBooking(id, {
    status: constants.bookingStatus.CANCELLED,
    cancelledAt: new Date(),
    cancelReason: reason,
  })

  // Update field status if booking was confirmed
  if (booking.date && booking.time && booking.fieldId) {
    const dateStr = new Date(booking.date).toISOString().split("T")[0]

    // Get field status
    const fieldStatus = await fieldStatusService.getFieldStatusByFieldAndDate(booking.fieldId, dateStr)

    if (fieldStatus) {
      // Find the time slot
      const timeSlotIndex = fieldStatus.timeSlots.findIndex((slot) => slot.time === booking.time)

      if (timeSlotIndex !== -1) {
        // Update time slot status
        await fieldStatusService.updateTimeSlotStatus(
          booking.fieldId,
          dateStr,
          fieldStatus.timeSlots[timeSlotIndex].id,
          {
            status: constants.fieldStatus.AVAILABLE,
            bookedBy: null,
          },
        )
      }
    }
  }

  return booking
}

/**
 * Delete booking
 * @param {string} id - Booking ID
 * @returns {Promise<boolean>} True if deleted
 */
const deleteBooking = async (id) => {
  return bookingModel.deleteBooking(id)
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
