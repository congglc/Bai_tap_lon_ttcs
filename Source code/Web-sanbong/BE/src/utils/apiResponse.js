/**
 * API response formatter
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Response message
 * @param {Object} data - Response data
 * @returns {Object} Formatted API response
 */
const apiResponse = (res, statusCode, message, data = {}) => {
  const response = {
    success: statusCode >= 200 && statusCode < 400,
    message,
  }

  if (Object.keys(data).length > 0) {
    response.data = data
  }

  return res.status(statusCode).json(response)
}

module.exports = {
  apiResponse,
}
