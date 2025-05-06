const jwt = require("jsonwebtoken")
const config = require("../config")
const userService = require("../services/user.service")
const { apiResponse } = require("../utils/apiResponse")

/**
 * Authentication middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return apiResponse(res, 401, "Authentication required")
    }

    const token = authHeader.split(" ")[1]

    if (!token) {
      return apiResponse(res, 401, "Authentication required")
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret)

      const user = await userService.getUserById(decoded.sub)

      if (!user) {
        return apiResponse(res, 401, "Invalid token")
      }

      req.user = user
      next()
    } catch (error) {
      return apiResponse(res, 401, "Invalid token")
    }
  } catch (error) {
    next(error)
  }
}

/**
 * Authorization middleware
 * @param {...string} roles - Allowed roles
 * @returns {Function} - Express middleware function
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return apiResponse(res, 401, "Authentication required")
    }

    if (!roles.includes(req.user.role)) {
      return apiResponse(res, 403, "Forbidden - Insufficient permissions")
    }

    next()
  }
}

module.exports = {
  authenticate,
  authorize,
}
