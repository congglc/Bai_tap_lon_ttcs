const Joi = require("joi")
const { objectId } = require("./custom.validation")

/**
 * Get field by ID validation schema
 */
const getFieldById = {
  params: Joi.object().keys({
    fieldId: Joi.string().custom(objectId).required(),
  }),
}

/**
 * Create field validation schema
 */
const createField = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    location: Joi.string().required(),
    manager: Joi.string().required(),
    description: Joi.string().required(),
    type: Joi.string().required(),
    src: Joi.string(),
    alt: Joi.string(),
    title: Joi.string(),
    time: Joi.string(),
    price: Joi.number().required(),
  }),
}

/**
 * Update field validation schema
 */
const updateField = {
  params: Joi.object().keys({
    fieldId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    location: Joi.string(),
    manager: Joi.string(),
    description: Joi.string(),
    type: Joi.string(),
    src: Joi.string(),
    alt: Joi.string(),
    title: Joi.string(),
    time: Joi.string(),
    price: Joi.number(),
  }),
}

/**
 * Delete field validation schema
 */
const deleteField = {
  params: Joi.object().keys({
    fieldId: Joi.string().custom(objectId).required(),
  }),
}

module.exports = {
  getFieldById,
  createField,
  updateField,
  deleteField,
}
