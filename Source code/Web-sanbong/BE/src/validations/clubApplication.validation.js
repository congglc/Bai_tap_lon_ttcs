const Joi = require("joi")
const { objectId } = require("./custom.validation")

/**
 * Get club application by ID validation schema
 */
const getClubApplicationById = {
  params: Joi.object().keys({
    applicationId: Joi.string().custom(objectId).required(),
  }),
}

/**
 * Get club applications by user validation schema
 */
const getClubApplicationsByUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
}

/**
 * Create club application validation schema
 */
const createClubApplication = {
  body: Joi.object().keys({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    bio: Joi.string().required(),
    footballSkill: Joi.string().required(),
    userId: Joi.string().custom(objectId).required(),
    avatar: Joi.string(),
  }),
}

/**
 * Update club application validation schema
 */
const updateClubApplication = {
  params: Joi.object().keys({
    applicationId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    fullName: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string(),
    address: Joi.string(),
    bio: Joi.string(),
    footballSkill: Joi.string(),
    status: Joi.string().valid("pending", "approved", "rejected"),
    avatar: Joi.string(),
  }),
}

/**
 * Approve club application validation schema
 */
const approveClubApplication = {
  params: Joi.object().keys({
    applicationId: Joi.string().custom(objectId).required(),
  }),
}

/**
 * Reject club application validation schema
 */
const rejectClubApplication = {
  params: Joi.object().keys({
    applicationId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    reason: Joi.string().required(),
  }),
}

/**
 * Delete club application validation schema
 */
const deleteClubApplication = {
  params: Joi.object().keys({
    applicationId: Joi.string().custom(objectId).required(),
  }),
}

module.exports = {
  getClubApplicationById,
  getClubApplicationsByUser,
  createClubApplication,
  updateClubApplication,
  approveClubApplication,
  rejectClubApplication,
  deleteClubApplication,
}
