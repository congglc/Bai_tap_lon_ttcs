const fieldService = require("../services/field.service")
const { apiResponse } = require("../utils/apiResponse")

/**
 * Get all fields
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getFields = async (req, res, next) => {
  try {
    const fields = await fieldService.getFields()
    return apiResponse(res, 200, "Fields retrieved successfully", { fields })
  } catch (error) {
    next(error)
  }
}

/**
 * Get field by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getFieldById = async (req, res, next) => {
  try {
    const field = await fieldService.getFieldById(req.params.fieldId)
    if (!field) {
      return apiResponse(res, 404, "Field not found")
    }
    return apiResponse(res, 200, "Field retrieved successfully", { field })
  } catch (error) {
    next(error)
  }
}

/**
 * Create a new field
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const createField = async (req, res, next) => {
  try {
    const field = await fieldService.createField(req.body)
    return apiResponse(res, 201, "Field created successfully", { field })
  } catch (error) {
    next(error)
  }
}

/**
 * Update field
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const updateField = async (req, res, next) => {
  try {
    const field = await fieldService.updateField(req.params.fieldId, req.body)
    return apiResponse(res, 200, "Field updated successfully", { field })
  } catch (error) {
    next(error)
  }
}

/**
 * Delete field
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const deleteField = async (req, res, next) => {
  try {
    await fieldService.deleteField(req.params.fieldId)
    return apiResponse(res, 200, "Field deleted successfully")
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getFields,
  getFieldById,
  createField,
  updateField,
  deleteField,
}
