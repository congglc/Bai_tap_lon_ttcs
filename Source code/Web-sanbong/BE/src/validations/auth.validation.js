const Joi = require("joi")

/**
 * Register validation schema
 */
const register = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    password: Joi.string().min(6).required(),
  }),
}

/**
 * Login validation schema
 */
const login = {
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      phone: Joi.string(),
      password: Joi.string().required(),
    })
    .xor("email", "phone"),
}

/**
 * Logout validation schema
 */
const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
}

/**
 * Refresh tokens validation schema
 */
const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
}

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
}
