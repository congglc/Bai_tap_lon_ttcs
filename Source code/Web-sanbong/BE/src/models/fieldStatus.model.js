const { ObjectId } = require("mongodb")
const { getDb } = require("../config/database")
const constants = require("../config/constants")

/**
 * Field Status schema
 * @typedef {Object} FieldStatus
 * @property {string} fieldId - Field ID
 * @property {string} date - Date in YYYY-MM-DD format
 * @property {Array} timeSlots - Array of time slots
 * @property {string} timeSlots.id - Time slot ID
 * @property {string} timeSlots.time - Time slot (e.g., "8h-9h30")
 * @property {string} timeSlots.status - Status (available, booked, maintenance)
 * @property {number} timeSlots.price - Price for this time slot
 * @property {string} timeSlots.bookedBy - Team name that booked this slot
 * @property {string} timeSlots.note - Additional notes
 */

/**
 * Get field status collection
 * @returns {Collection} MongoDB collection
 */
const getFieldStatusCollection = () => {
  return getDb().collection(constants.collections.FIELD_STATUS)
}

/**
 * Create or update field status
 * @param {string} fieldId - Field ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {Array} timeSlots - Array of time slots
 * @returns {Promise<FieldStatus>} Field status document
 */
const createOrUpdateFieldStatus = async (fieldId, date, timeSlots) => {
  const collection = getFieldStatusCollection()

  const filter = {
    fieldId: new ObjectId(fieldId),
    date,
  }

  const update = {
    $set: {
      fieldId: new ObjectId(fieldId),
      date,
      timeSlots,
      updatedAt: new Date(),
    },
    $setOnInsert: {
      createdAt: new Date(),
    },
  }

  const options = {
    upsert: true,
    returnDocument: "after",
  }

  const result = await collection.findOneAndUpdate(filter, update, options)
  return result
}

/**
 * Get field status by date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<FieldStatus[]>} List of field status documents
 */
const getFieldStatusByDate = async (date) => {
  const collection = getFieldStatusCollection()
  return collection.find({ date }).toArray()
}

/**
 * Get field status by field ID and date
 * @param {string} fieldId - Field ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<FieldStatus>} Field status document
 */
const getFieldStatusByFieldAndDate = async (fieldId, date) => {
  const collection = getFieldStatusCollection()
  return collection.findOne({
    fieldId: new ObjectId(fieldId),
    date,
  })
}

/**
 * Update time slot status
 * @param {string} fieldId - Field ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} slotId - Time slot ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<FieldStatus>} Updated field status
 */
const updateTimeSlotStatus = async (fieldId, date, slotId, updateData) => {
  const collection = getFieldStatusCollection()

  // First, get the current field status
  const fieldStatus = await getFieldStatusByFieldAndDate(fieldId, date)

  if (!fieldStatus) {
    throw new Error("Field status not found")
  }

  // Update the specific time slot
  const updatedTimeSlots = fieldStatus.timeSlots.map((slot) => {
    if (slot.id === slotId) {
      return { ...slot, ...updateData }
    }
    return slot
  })

  // Update the field status document
  return createOrUpdateFieldStatus(fieldId, date, updatedTimeSlots)
}

module.exports = {
  createOrUpdateFieldStatus,
  getFieldStatusByDate,
  getFieldStatusByFieldAndDate,
  updateTimeSlotStatus,
}
