const fieldStatusModel = require("../models/fieldStatus.model")
const { v4: uuidv4 } = require("uuid")
const fieldModel = require("../models/field.model")
const { ObjectId } = require("mongodb")
const constants = require("../config/constants")
const { getDefaultTimeSlots } = require("../utils/timeSlot.util")

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
  const existing = await fieldStatusModel.getFieldStatusByFieldAndDate(fieldId, date);
  if (existing) {
    // Nếu đã có document, chỉ cập nhật timeSlots khi mảng này có phần tử
    if (Array.isArray(timeSlots) && timeSlots.length > 0) {
  const slotsWithIds = timeSlots.map((slot) => {
    if (!slot.id) {
      return { ...slot, id: uuidv4() }
    }
    return slot
  })
      return fieldStatusModel.createOrUpdateFieldStatus(fieldId, date, slotsWithIds)
    }
    // Nếu không muốn cập nhật timeSlots, trả về document hiện tại
    return existing;
  } else {
    // Nếu chưa có document, tạo mới với timeSlots truyền vào hoặc mặc định
    const slotsWithIds = (Array.isArray(timeSlots) && timeSlots.length > 0)
      ? timeSlots.map((slot) => {
          if (!slot.id) {
            return { ...slot, id: uuidv4() }
          }
          return slot
        })
      : getDefaultTimeSlots();
  return fieldStatusModel.createOrUpdateFieldStatus(fieldId, date, slotsWithIds)
  }
}

/**
 * Update time slot status
 * @param {string} fieldId - Field ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} slotId - Time slot ID (this is the ID of the slot within the FieldStatus document)
 * @param {Object} updateData - Data to update for the time slot (e.g., { status: "booked", bookedBy: "Team Name" })
 * @returns {Promise<Object>} Updated field status document
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
