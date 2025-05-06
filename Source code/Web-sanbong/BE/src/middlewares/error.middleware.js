const logger = require("../utils/logger")
const { apiResponse } = require("../utils/apiResponse")

/**
 * Error handling middleware
 * @param {Object} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const errorMiddleware = (err, req, res, next) => {
  logger.error(err)

  // Default error status and message
  let statusCode = 500
  let message = "Internal Server Error"

  // Handle specific error types
  if (err.name === "ValidationError") {
    statusCode = 400
    message = err.message
  } else if (err.name === "UnauthorizedError") {
    statusCode = 401
    message = "Unauthorized"
  } else if (err.name === "ForbiddenError") {
    statusCode = 403
    message = "Forbidden"
  } else if (err.name === "NotFoundError") {
    statusCode = 404
    message = err.message || "Resource not found"
  }

  // Return error response
  return apiResponse(res, statusCode, message)
}

module.exports = errorMiddleware
