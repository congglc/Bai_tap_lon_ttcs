const fieldStatusModel = require("../models/fieldStatus.model")
const { v4: uuidv4 } = require("uuid")

/**
 * Get field status by date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Array>} List of field status documents
 */
const getFieldStatusByDate = async (date) => {
  return fieldStatusModel.getFieldStatusByDate(date)
}

/**
 * Get field status by field ID and date
 * @param {string} fieldId - Field ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Object>} Field status document
 */
const getFieldStatusByFieldAndDate = async (fieldId, date) => {
  return fieldStatusModel.getFieldStatusByFieldAndDate(fieldId, date)
}

/**
 * Create or update field status
 * @param {string} fieldId - Field ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {Array} timeSlots - Array of time slots
 * @returns {Promise<Object>} Field status document
 */
const createOrUpdateFieldStatus = async (fieldId, date, timeSlots) => {
  // Ensure each time slot has an ID
  const slotsWithIds = timeSlots.map((slot) => {
    if (!slot.id) {
      return { ...slot, id: uuidv4() }
    }
    return slot
  })

  return fieldStatusModel.createOrUpdateFieldStatus(fieldId, date, slotsWithIds)
}

/**
 * Update time slot status
 * @param {string} fieldId - Field ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} slotId - Time slot ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated field status
 */
const updateTimeSlotStatus = async (fieldId, date, slotId, updateData) => {
  return fieldStatusModel.updateTimeSlotStatus(fieldId, date, slotId, updateData)
}

module.exports = {
  getFieldStatusByDate,
  getFieldStatusByFieldAndDate,
  createOrUpdateFieldStatus,
  updateTimeSlotStatus,
}
