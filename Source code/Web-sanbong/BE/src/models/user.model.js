const { ObjectId } = require("mongodb")
const { getDb } = require("../config/database")
const constants = require("../config/constants")

/**
 * User schema
 * @typedef {Object} User
 * @property {string} name - User's name
 * @property {string} email - User's email
 * @property {string} phone - User's phone number
 * @property {string} password - User's password (hashed)
 * @property {string} address - User's address
 * @property {string} role - User's role (admin, manager, user)
 * @property {string} status - User's status (active, inactive)
 * @property {string} bio - User's bio
 * @property {Date} registeredAt - Registration date
 */

/**
 * Get users collection
 * @returns {Collection} MongoDB collection
 */
const getUsersCollection = () => {
  return getDb().collection(constants.collections.USERS)
}

/**
 * Create a new user
 * @param {User} userData - User data
 * @returns {Promise<User>} Created user
 */
const createUser = async (userData) => {
  const collection = getUsersCollection()

  const user = {
    ...userData,
    registeredAt: new Date(),
    _id: new ObjectId(),
  }

  await collection.insertOne(user)
  return user
}

/**
 * Get all users
 * @param {Object} filter - Filter criteria
 * @returns {Promise<User[]>} List of users
 */
const getUsers = async (filter = {}) => {
  const collection = getUsersCollection()
  return collection.find(filter).toArray()
}

/**
 * Get user by ID
 * @param {string} id - User ID
 * @returns {Promise<User>} User document
 */
const getUserById = async (id) => {
  const collection = getUsersCollection()
  return collection.findOne({ _id: new ObjectId(id) })
}

/**
 * Get user by email
 * @param {string} email - User email
 * @returns {Promise<User>} User document
 */
const getUserByEmail = async (email) => {
  const collection = getUsersCollection()
  return collection.findOne({ email })
}

/**
 * Get user by phone
 * @param {string} phone - User phone
 * @returns {Promise<User>} User document
 */
const getUserByPhone = async (phone) => {
  const collection = getUsersCollection()
  return collection.findOne({ phone })
}

/**
 * Update user
 * @param {string} id - User ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<User>} Updated user
 */
const updateUser = async (id, updateData) => {
  const collection = getUsersCollection()

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateData },
    { returnDocument: "after" },
  )

  return result
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {Promise<boolean>} True if deleted
 */
const deleteUser = async (id) => {
  const collection = getUsersCollection()
  const result = await collection.deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount > 0
}

module.exports = {
  createUser,
  getUsers,
  getUserById,
  getUserByEmail,
  getUserByPhone,
  updateUser,
  deleteUser,
}
