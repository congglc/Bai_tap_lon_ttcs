const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("../config")
const userModel = require("../models/user.model")
const constants = require("../config/constants")

/**
 * Register a new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user
 */
const register = async (userData) => {
  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(userData.password, salt)

  // Create user with hashed password
  const user = await userModel.createUser({
    ...userData,
    password: hashedPassword,
    role: constants.roles.USER,
    status: "active",
  })

  // Remove password from response
  const { password, ...userWithoutPassword } = user

  return userWithoutPassword
}

/**
 * Login with email or phone
 * @param {string} email - User email
 * @param {string} phone - User phone
 * @param {string} password - User password
 * @returns {Promise<Object>} User object
 */
const loginWithEmailOrPhone = async (email, phone, password) => {
  let user

  // Find user by email or phone
  if (email) {
    user = await userModel.getUserByEmail(email)
  } else if (phone) {
    user = await userModel.getUserByPhone(phone)
  }

  if (!user) {
    throw new Error("Invalid credentials")
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    throw new Error("Invalid credentials")
  }

  // Remove password from response
  const { password: userPassword, ...userWithoutPassword } = user

  return userWithoutPassword
}

/**
 * Generate auth tokens
 * @param {Object} user - User object
 * @returns {Promise<Object>} Access and refresh tokens
 */
const generateAuthTokens = async (user) => {
  // Generate access token
  const accessToken = jwt.sign(
    {
      sub: user._id,
      role: user.role,
    },
    config.jwt.secret,
    {
      expiresIn: `${config.jwt.accessExpirationMinutes}m`,
    },
  )

  // Generate refresh token
  const refreshToken = jwt.sign(
    {
      sub: user._id,
    },
    config.jwt.secret,
    {
      expiresIn: `${config.jwt.refreshExpirationDays}d`,
    },
  )

  return {
    access: {
      token: accessToken,
      expires: new Date(Date.now() + config.jwt.accessExpirationMinutes * 60 * 1000),
    },
    refresh: {
      token: refreshToken,
      expires: new Date(Date.now() + config.jwt.refreshExpirationDays * 24 * 60 * 60 * 1000),
    },
  }
}

/**
 * Logout user
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<boolean>} True if successful
 */
const logout = async (refreshToken) => {
  // In a real-world scenario, you would invalidate the token
  // For example, add it to a blacklist in Redis
  return true
}

/**
 * Refresh auth tokens
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Object>} New access and refresh tokens
 */
const refreshAuth = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, config.jwt.secret)
    const user = await userModel.getUserById(decoded.sub)

    if (!user) {
      throw new Error("Invalid token")
    }

    return generateAuthTokens(user)
  } catch (error) {
    throw new Error("Invalid token")
  }
}

module.exports = {
  register,
  loginWithEmailOrPhone,
  generateAuthTokens,
  logout,
  refreshAuth,
}
