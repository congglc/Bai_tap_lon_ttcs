const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")

/**
 * Get all users
 * @param {Object} filter - Filter criteria
 * @param {number} limit - Maximum number of results
 * @param {number} skip - Number of documents to skip
 * @returns {Promise<Array>} List of users
 */
const getUsers = async (filter = {}, limit = 10, skip = 0) => {
  const users = await userModel.getUsers(filter, limit, skip)
  return users.map((user) => {
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  })
}

/**
 * Count users based on filter
 * @param {Object} filter - Filter criteria
 * @returns {Promise<number>} Count of users
 */
const countUsers = async (filter = {}) => {
  return userModel.countUsers(filter)
}

/**
 * Get user by ID
 * @param {string} id - User ID
 * @returns {Promise<Object>} User object
 */
const getUserById = async (id) => {
  const user = await userModel.getUserById(id)
  if (!user) return null

  const { password, ...userWithoutPassword } = user
  return userWithoutPassword
}

/**
 * Get user by email or phone
 * @param {string} email - User email
 * @param {string} phone - User phone
 * @returns {Promise<Object>} User object
 */
const getUserByEmailOrPhone = async (email, phone) => {
  let user = null

  if (email) {
    user = await userModel.getUserByEmail(email)
  }

  if (!user && phone) {
    user = await userModel.getUserByPhone(phone)
  }

  if (!user) return null

  const { password, ...userWithoutPassword } = user
  return userWithoutPassword
}

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user
 */
const createUser = async (userData) => {
  // Hash password if provided
  if (userData.password) {
    const salt = await bcrypt.genSalt(10)
    userData.password = await bcrypt.hash(userData.password, salt)
  }

  const user = await userModel.createUser(userData)
  const { password, ...userWithoutPassword } = user
  return userWithoutPassword
}

/**
 * Update user
 * @param {string} id - User ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated user
 */
const updateUser = async (id, updateData) => {
  // Hash password if provided
  if (updateData.password) {
    const salt = await bcrypt.genSalt(10)
    updateData.password = await bcrypt.hash(updateData.password, salt)
  }

  const user = await userModel.updateUser(id, updateData)
  const { password, ...userWithoutPassword } = user
  return userWithoutPassword
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {Promise<boolean>} True if deleted
 */
const deleteUser = async (id) => {
  return userModel.deleteUser(id)
}

module.exports = {
  getUsers,
  countUsers,
  getUserById,
  getUserByEmailOrPhone,
  createUser,
  updateUser,
  deleteUser,
}
