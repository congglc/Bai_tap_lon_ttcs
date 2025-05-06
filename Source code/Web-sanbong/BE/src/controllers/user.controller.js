const userService = require("../services/user.service")
const { apiResponse } = require("../utils/apiResponse")

/**
 * Get all users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getUsers = async (req, res, next) => {
  try {
    const users = await userService.getUsers()
    return apiResponse(res, 200, "Users retrieved successfully", { users })
  } catch (error) {
    next(error)
  }
}

/**
 * Get user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.userId)
    if (!user) {
      return apiResponse(res, 404, "User not found")
    }
    return apiResponse(res, 200, "User retrieved successfully", { user })
  } catch (error) {
    next(error)
  }
}

/**
 * Create a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body)
    return apiResponse(res, 201, "User created successfully", { user })
  } catch (error) {
    next(error)
  }
}

/**
 * Update user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.userId, req.body)
    return apiResponse(res, 200, "User updated successfully", { user })
  } catch (error) {
    next(error)
  }
}

/**
 * Delete user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.userId)
    return apiResponse(res, 200, "User deleted successfully")
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}
