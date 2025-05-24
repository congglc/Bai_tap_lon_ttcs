const Joi = require("joi")
const { objectId } = require("./custom.validation")

const getUserById = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
}

const getUserByEmailOrPhone = {
  query: Joi.object()
    .keys({
      email: Joi.string().email(),
      phone: Joi.string(),
    })
    .min(1),
}

const createUser = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    password: Joi.string().required(),
    address: Joi.string(),
    role: Joi.string().valid("admin", "manager", "user"),
    status: Joi.string().valid("active", "inactive"),
    bio: Joi.string(),
  }),
}

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      email: Joi.string().email(),
      phone: Joi.string(),
      password: Joi.string(),
      address: Joi.string(),
      role: Joi.string().valid("admin", "manager", "user"),
      status: Joi.string().valid("active", "inactive"),
      bio: Joi.string(),
    })
    .min(1),
}

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
}

module.exports = {
  getUserById,
  getUserByEmailOrPhone,
  createUser,
  updateUser,
  deleteUser,
}
