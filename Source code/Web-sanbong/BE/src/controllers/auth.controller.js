const authService = require("../services/auth.service")
const userService = require("../services/user.service")
const { apiResponse } = require("../utils/apiResponse")

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body

    // Check if user already exists
    const existingUser = await userService.getUserByEmailOrPhone(email, phone)
    if (existingUser) {
      return apiResponse(res, 400, "User already exists with this email or phone")
    }

    // Create user
    const user = await authService.register({ name, email, phone, password })

    // Generate tokens
    const tokens = await authService.generateAuthTokens(user)

    return apiResponse(res, 201, "User registered successfully", { user, tokens })
  } catch (error) {
    next(error)
  }
}

/**
 * Login user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const login = async (req, res, next) => {
  try {
    const { email, phone, password } = req.body

    // Login with email or phone
    const user = await authService.loginWithEmailOrPhone(email, phone, password)

    // Generate tokens
    const tokens = await authService.generateAuthTokens(user)

    return apiResponse(res, 200, "Login successful", { user, tokens })
  } catch (error) {
    next(error)
  }
}

/**
 * Logout user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const logout = async (req, res, next) => {
  try {
    await authService.logout(req.body.refreshToken)
    return apiResponse(res, 200, "Logged out successfully")
  } catch (error) {
    next(error)
  }
}

/**
 * Refresh auth tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const refreshTokens = async (req, res, next) => {
  try {
    const tokens = await authService.refreshAuth(req.body.refreshToken)
    return apiResponse(res, 200, "Tokens refreshed successfully", { tokens })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
}
