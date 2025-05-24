const { ObjectId } = require("mongodb")
const { getDb } = require("../config/database")
const constants = require("../config/constants")

/**
 * Payment schema
 * @typedef {Object} Payment
 * @property {string} bookingId - Booking ID
 * @property {string} userId - User ID
 * @property {string} type - Payment type (deposit, full)
 * @property {number} amount - Payment amount
 * @property {string} method - Payment method (cash, bank_transfer, credit_card)
 * @property {string} status - Payment status (pending, completed, failed, refunded)
 * @property {string} transactionId - External transaction ID
 * @property {Object} metadata - Additional payment metadata
 * @property {Date} createdAt - Creation date
 * @property {Date} updatedAt - Last update date
 */

/**
 * Get payments collection
 * @returns {Collection} MongoDB collection
 */
const getPaymentsCollection = () => {
  return getDb().collection(constants.collections.PAYMENTS)
}

/**
 * Create a new payment
 * @param {Payment} paymentData - Payment data
 * @returns {Promise<Payment>} Created payment
 */
const createPayment = async (paymentData) => {
  const collection = getPaymentsCollection()

  const payment = {
    ...paymentData,
    _id: new ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  await collection.insertOne(payment)
  return payment
}

/**
 * Get all payments
 * @param {Object} filter - Filter criteria
 * @param {number} limit - Maximum number of results
 * @param {number} skip - Number of documents to skip
 * @returns {Promise<Payment[]>} List of payments
 */
const getPayments = async (filter = {}, limit = 10, skip = 0) => {
  const collection = getPaymentsCollection()

  // Convert bookingId and userId to ObjectId if present
  if (filter.bookingId && typeof filter.bookingId === "string") {
    filter.bookingId = new ObjectId(filter.bookingId)
  }

  if (filter.userId && typeof filter.userId === "string") {
    filter.userId = new ObjectId(filter.userId)
  }

  return collection.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray()
}

/**
 * Get payment by ID
 * @param {string} id - Payment ID
 * @returns {Promise<Payment>} Payment document
 */
const getPaymentById = async (id) => {
  const collection = getPaymentsCollection()
  return collection.findOne({ _id: new ObjectId(id) })
}

/**
 * Get payments by booking ID
 * @param {string} bookingId - Booking ID
 * @returns {Promise<Payment[]>} List of payments
 */
const getPaymentsByBookingId = async (bookingId) => {
  const collection = getPaymentsCollection()
  return collection
    .find({ bookingId: new ObjectId(bookingId) })
    .sort({ createdAt: -1 })
    .toArray()
}

/**
 * Update payment
 * @param {string} id - Payment ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Payment>} Updated payment
 */
const updatePayment = async (id, updateData) => {
  const collection = getPaymentsCollection()

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...updateData,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" },
  )

  return result
}

/**
 * Count payments based on filter
 * @param {Object} filter - Filter criteria
 * @returns {Promise<number>} Count of payments
 */
const countPayments = async (filter = {}) => {
  const collection = getPaymentsCollection()

  // Convert bookingId and userId to ObjectId if present
  if (filter.bookingId && typeof filter.bookingId === "string") {
    filter.bookingId = new ObjectId(filter.bookingId)
  }

  if (filter.userId && typeof filter.userId === "string") {
    filter.userId = new ObjectId(filter.userId)
  }

  return collection.countDocuments(filter)
}

module.exports = {
  createPayment,
  getPayments,
  getPaymentById,
  getPaymentsByBookingId,
  updatePayment,
  countPayments,
}
