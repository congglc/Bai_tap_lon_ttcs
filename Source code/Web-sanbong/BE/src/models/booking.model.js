const { ObjectId } = require("mongodb")
const { getDb } = require("../config/database")
const constants = require("../config/constants")

/**
 * Booking schema
 * @typedef {Object} Booking
 * @property {string} teamName - Team name
 * @property {string} teamLeaderName - Team leader name
 * @property {string} contact - Contact information
 * @property {string} fieldId - Field ID
 * @property {string} fieldName - Field name
 * @property {Date} date - Booking date
 * @property {string} time - Time slot
 * @property {number} price - Booking price
 * @property {string} notes - Additional notes
 * @property {string} status - Booking status (pending, confirmed, cancelled)
 * @property {Date} createdAt - Creation date
 * @property {Date} confirmedAt - Confirmation date
 * @property {Date} cancelledAt - Cancellation date
 * @property {string} cancelReason - Cancellation reason
 * @property {string} userId - User ID
 */

/**
 * Get bookings collection
 * @returns {Collection} MongoDB collection
 */
const getBookingsCollection = () => {
  return getDb().collection(constants.collections.BOOKINGS)
}

/**
 * Create a new booking
 * @param {Booking} bookingData - Booking data
 * @returns {Promise<Booking>} Created booking
 */
const createBooking = async (bookingData) => {
  const collection = getBookingsCollection()

  const booking = {
    ...bookingData,
    _id: new ObjectId(),
    status: constants.bookingStatus.PENDING,
    createdAt: new Date(),
  }

  await collection.insertOne(booking)
  return booking
}

/**
 * Get all bookings
 * @param {Object} filter - Filter criteria
 * @param {number} limit - Maximum number of results
 * @param {number} skip - Number of documents to skip
 * @returns {Promise<Booking[]>} List of bookings
 */
const getBookings = async (filter = {}, limit = 10, skip = 0) => {
  const collection = getBookingsCollection()

  // Convert fieldId and userId to ObjectId if present
  if (filter.fieldId && typeof filter.fieldId === "string") {
    filter.fieldId = new ObjectId(filter.fieldId)
  }

  if (filter.userId && typeof filter.userId === "string") {
    filter.userId = new ObjectId(filter.userId)
  }

  return collection.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray()
}

/**
 * Count bookings based on filter
 * @param {Object} filter - Filter criteria
 * @returns {Promise<number>} Count of bookings
 */
const countBookings = async (filter = {}) => {
  const collection = getBookingsCollection()

  // Convert fieldId and userId to ObjectId if present
  if (filter.fieldId && typeof filter.fieldId === "string") {
    filter.fieldId = new ObjectId(filter.fieldId)
  }

  if (filter.userId && typeof filter.userId === "string") {
    filter.userId = new ObjectId(filter.userId)
  }

  return collection.countDocuments(filter)
}

/**
 * Get booking by ID
 * @param {string} id - Booking ID
 * @returns {Promise<Booking>} Booking document
 */
const getBookingById = async (id) => {
  const collection = getBookingsCollection()
  return collection.findOne({ _id: new ObjectId(id) })
}

/**
 * Get bookings by user ID
 * @param {string} userId - User ID
 * @returns {Promise<Booking[]>} List of bookings
 */
const getBookingsByUser = async (userId) => {
  const collection = getBookingsCollection()
  return collection
    .find({ userId: new ObjectId(userId) })
    .sort({ createdAt: -1 })
    .toArray()
}

/**
 * Update booking
 * @param {string} id - Booking ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Booking>} Updated booking
 */
const updateBooking = async (id, updateData) => {
  const collection = getBookingsCollection()

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateData },
    { returnDocument: "after" },
  )

  return result
}

/**
 * Delete booking
 * @param {string} id - Booking ID
 * @returns {Promise<boolean>} True if deleted
 */
const deleteBooking = async (id) => {
  const collection = getBookingsCollection()
  const result = await collection.deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount > 0
}

module.exports = {
  createBooking,
  getBookings,
  countBookings,
  getBookingById,
  getBookingsByUser,
  updateBooking,
  deleteBooking,
}
