const Joi = require("joi")
const { objectId } = require("./custom.validation")

/**
 * Get booking by ID validation schema
 */
const getBookingById = {
  params: Joi.object().keys({
    bookingId: Joi.string().custom(objectId).required(),
  }),
}

/**
 * Get bookings by user validation schema
 */
const getBookingsByUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
}

/**
 * Create booking validation schema
 */
const createBooking = {
  body: Joi.object().keys({
    teamName: Joi.string().required(),
    teamLeaderName: Joi.string().required(),
    contact: Joi.string().required(),
    fieldId: Joi.string().custom(objectId).required(),
    fieldName: Joi.string().required(),
    date: Joi.date().required(),
    time: Joi.string().required(),
    price: Joi.number().required(),
    notes: Joi.string(),
    userId: Joi.string().custom(objectId).required(),
  }),
}

/**
 * Update booking validation schema
 */
const updateBooking = {
  params: Joi.object().keys({
    bookingId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    teamName: Joi.string(),
    teamLeaderName: Joi.string(),
    contact: Joi.string(),
    fieldId: Joi.string().custom(objectId),
    fieldName: Joi.string(),
    date: Joi.date(),
    time: Joi.string(),
    price: Joi.number(),
    notes: Joi.string(),
    status: Joi.string().valid("pending", "confirmed", "cancelled"),
  }),
}

/**
 * Confirm booking validation schema
 */
const confirmBooking = {
  params: Joi.object().keys({
    bookingId: Joi.string().custom(objectId).required(),
  }),
}

/**
 * Cancel booking validation schema
 */
const cancelBooking = {
  params: Joi.object().keys({
    bookingId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    reason: Joi.string().required(),
  }),
}

/**
 * Delete booking validation schema
 */
const deleteBooking = {
  params: Joi.object().keys({
    bookingId: Joi.string().custom(objectId).required(),
  }),
}

module.exports = {
  getBookingById,
  getBookingsByUser,
  createBooking,
  updateBooking,
  confirmBooking,
  cancelBooking,
  deleteBooking,
}
