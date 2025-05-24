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
    const { page = 1, limit = 10 } = req.query
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)
    const users = await userService.getUsers({}, Number.parseInt(limit), skip)
    const total = await userService.countUsers({})
    const totalPages = Math.ceil(total / Number.parseInt(limit))

    return apiResponse(res, 200, "Users retrieved successfully", {
      users,
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
 * Get user by email or phone
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getUserByEmailOrPhone = async (req, res, next) => {
  try {
    const { email, phone } = req.query

    if (!email && !phone) {
      return apiResponse(res, 400, "Email or phone is required")
    }

    const user = await userService.getUserByEmailOrPhone(email, phone)

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

/**
 * Upload user avatar
 * @route PUT /api/users/:userId/avatar
 */
const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return apiResponse(res, 400, "No file uploaded")
    }
    const avatarUrl = require("../config/upload").getUserAvatarUrl(req.file.filename)
    const user = await userService.updateUser(req.params.userId, { avatar: avatarUrl })
    return apiResponse(res, 200, "Avatar uploaded successfully", { user })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getUsers,
  getUserById,
  getUserByEmailOrPhone,
  createUser,
  updateUser,
  deleteUser,
  uploadAvatar,
}
