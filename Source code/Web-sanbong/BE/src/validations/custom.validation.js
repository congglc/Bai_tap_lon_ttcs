const { ObjectId } = require("mongodb")

/**
 * Custom validation for MongoDB ObjectId
 * @param {string} value - Value to validate
 * @param {Object} helpers - Joi helpers
 * @returns {string|Object} Value or error
 */
const objectId = (value, helpers) => {
  if (!ObjectId.isValid(value)) {
    return helpers.message('"{{#label}}" must be a valid MongoDB ObjectId')
  }
  return value
}

module.exports = {
  objectId,
}
