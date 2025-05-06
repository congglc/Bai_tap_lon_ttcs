const jwt = require("jsonwebtoken")
const config = require("../config")

/**
 * Generate JWT token
 * @param {Object} payload - Token payload
 * @param {string} secret - JWT secret
 * @param {Object} options - JWT options
 * @returns {string} JWT token
 */
const generateToken = (payload, secret = config.jwt.secret, options = {}) => {
  return jwt.sign(payload, secret, options)
}

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @param {string} secret - JWT secret
 * @returns {Object} Decoded token
 */
const verifyToken = (token, secret = config.jwt.secret) => {
  return jwt.verify(token, secret)
}

module.exports = {
  generateToken,
  verifyToken,
}
