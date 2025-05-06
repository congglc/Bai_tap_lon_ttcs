const fieldModel = require("../models/field.model")

/**
 * Get all fields
 * @param {Object} filter - Filter criteria
 * @returns {Promise<Array>} List of fields
 */
const getFields = async (filter = {}) => {
  return fieldModel.getFields(filter)
}

/**
 * Get field by ID
 * @param {string} id - Field ID
 * @returns {Promise<Object>} Field object
 */
const getFieldById = async (id) => {
  return fieldModel.getFieldById(id)
}

/**
 * Create a new field
 * @param {Object} fieldData - Field data
 * @returns {Promise<Object>} Created field
 */
const createField = async (fieldData) => {
  return fieldModel.createField(fieldData)
}

/**
 * Update field
 * @param {string} id - Field ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated field
 */
const updateField = async (id, updateData) => {
  return fieldModel.updateField(id, updateData)
}

/**
 * Delete field
 * @param {string} id - Field ID
 * @returns {Promise<boolean>} True if deleted
 */
const deleteField = async (id) => {
  return fieldModel.deleteField(id)
}

module.exports = {
  getFields,
  getFieldById,
  createField,
  updateField,
  deleteField,
}
