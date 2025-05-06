const Joi = require("joi")
const { objectId } = require("./custom.validation")

/**
 * Get user by ID validation schema
 */
const getUserById = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
}

/**
 * Create user validation schema
 */
const createUser = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("admin", "manager", "user"),
    address: Joi.string(),
    bio: Joi.string(),
  }),
}

/**
 * Update user validation schema
 */
const updateUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string(),
    password: Joi.string().min(6),
    role: Joi.string().valid("admin", "manager", "user"),
    address: Joi.string(),
    bio: Joi.string(),
    status: Joi.string().valid("active", "inactive"),
  }),
}

/**
 * Delete user validation schema
 */
const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
}

module.exports = {
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}
