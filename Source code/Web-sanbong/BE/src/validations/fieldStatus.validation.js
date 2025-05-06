const Joi = require("joi")
const { objectId } = require("./custom.validation")

/**
 * Get field status by date validation schema
 */
const getFieldStatusByDate = {
  params: Joi.object().keys({
    date: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .required(),
  }),
}

/**
 * Get field status by field and date validation schema
 */
const getFieldStatusByFieldAndDate = {
  params: Joi.object().keys({
    fieldId: Joi.string().custom(objectId).required(),
    date: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .required(),
  }),
}

/**
 * Create or update field status validation schema
 */
const createOrUpdateFieldStatus = {
  params: Joi.object().keys({
    fieldId: Joi.string().custom(objectId).required(),
    date: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .required(),
  }),
  body: Joi.object().keys({
    timeSlots: Joi.array()
      .items(
        Joi.object().keys({
          id: Joi.string(),
          time: Joi.string().required(),
          status: Joi.string().valid("available", "booked", "maintenance").required(),
          price: Joi.number().required(),
          bookedBy: Joi.string().allow(null),
          note: Joi.string().allow(null),
        }),
      )
      .required(),
  }),
}

/**
 * Update time slot status validation schema
 */
const updateTimeSlotStatus = {
  params: Joi.object().keys({
    fieldId: Joi.string().custom(objectId).required(),
    date: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .required(),
    slotId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    status: Joi.string().valid("available", "booked", "maintenance").required(),
    bookedBy: Joi.string().allow(null),
    note: Joi.string().allow(null),
    price: Joi.number(),
  }),
}

module.exports = {
  getFieldStatusByDate,
  getFieldStatusByFieldAndDate,
  createOrUpdateFieldStatus,
  updateTimeSlotStatus,
}
