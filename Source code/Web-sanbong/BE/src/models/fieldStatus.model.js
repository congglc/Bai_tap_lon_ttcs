const { ObjectId } = require("mongodb")
const { getDb } = require("../config/database")
const constants = require("../config/constants")
const fieldModel = require("./field.model")
const { v4: uuidv4 } = require("uuid")

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
 * @param {Array} timeSlots - Array of time slots to update/set.
 * @returns {Promise<FieldStatus>} Field status document
 */
const createOrUpdateFieldStatus = async (fieldId, date, timeSlots) => {
  const collection = getFieldStatusCollection()

  const filter = {
    fieldId: (typeof fieldId === 'object' && fieldId._bsontype === 'ObjectId' && fieldId.toHexString) ? fieldId.toHexString() : fieldId.toString(),
    date: (typeof date === 'string' && date.length === 10) ? new Date(date + 'T00:00:00.000Z') : new Date(date),
  }

  // Try to find the existing document first
  let fieldStatus = await collection.findOne(filter)

  if (!fieldStatus) {
    console.log(`FieldStatus document not found for field ${fieldId} on date ${date}. Attempting to create new one.`)
    // If document does not exist, create a new one with default time slots
    const field = await fieldModel.getFieldById(fieldId)

    if (!field) {
      console.warn(`Field ${fieldId} not found when creating FieldStatus. Creating with empty timeSlots.`)
    }

    if (!field || !field.defaultTimeSlots || field.defaultTimeSlots.length === 0) {
      // Handle case where field or its default slots are missing - perhaps create with empty slots or throw error
      if (field) console.warn(`Field ${fieldId} found, but defaultTimeSlots missing or empty (length: ${field.defaultTimeSlots ? field.defaultTimeSlots.length : 'N/A'}). Creating FieldStatus with empty timeSlots.`)
      const newFieldStatusDoc = {
        fieldId: (typeof fieldId === 'object' && fieldId._bsontype === 'ObjectId' && fieldId.toHexString) ? fieldId.toHexString() : fieldId.toString(),
        date: (typeof date === 'string' && date.length === 10) ? new Date(date + 'T00:00:00.000Z') : new Date(date),
        timeSlots: [], // Create with empty array if defaults are missing
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      await collection.insertOne(newFieldStatusDoc)
      console.log(`Created FieldStatus document with empty timeSlots for field ${fieldId} on date ${date}.`)
      return newFieldStatusDoc // Return the newly created empty document
    }

    // Generate default slots with consistent UUIDs
    const defaultSlotsWithIds = field.defaultTimeSlots.map(slot => ({
      id: uuidv4(), // Generate consistent UUIDs
      time: slot.time,
      status: constants.fieldStatus.AVAILABLE,
      price: slot.price,
      bookedBy: null,
      note: null,
    }))

    const newFieldStatusDoc = {
      fieldId: (typeof fieldId === 'object' && fieldId._bsontype === 'ObjectId' && fieldId.toHexString) ? fieldId.toHexString() : fieldId.toString(),
      date: (typeof date === 'string' && date.length === 10) ? new Date(date + 'T00:00:00.000Z') : new Date(date),
      timeSlots: defaultSlotsWithIds, // Populate with default slots
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Insert the new document
    await collection.insertOne(newFieldStatusDoc)
    console.log(`Created FieldStatus document with default timeSlots for field ${fieldId} on date ${date}.`)
    return newFieldStatusDoc // Return the newly created document
  } else {
    // If document exists, update its time slots with the provided timeSlots array
    console.log(`FieldStatus document found for field ${fieldId} on date ${date}. Updating timeSlots.`)
    const update = {
      $set: {
        timeSlots: timeSlots, // Overwrite with provided timeSlots array (from service)
        updatedAt: new Date(),
      },
    }
    const options = { returnDocument: "after" }
    const result = await collection.findOneAndUpdate(filter, update, options)
    console.log(`Updated FieldStatus document for field ${fieldId} on date ${date}.`)
    return result.value // Return the updated document
  }
}

/**
 * Get field status by date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<FieldStatus[]>} List of field status documents
 */
const getFieldStatusByDate = async (date) => {
  const collection = getFieldStatusCollection()
  let dateQuery = date
  if (typeof date === 'string' && date.length === 10) {
    dateQuery = new Date(date + 'T00:00:00.000Z')
  } else if (typeof date === 'string') {
    dateQuery = new Date(date)
  }
  return collection.find({ date: dateQuery }).toArray()
}

/**
 * Get field status by field ID and date
 * @param {string} fieldId - Field ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<FieldStatus>} Field status document
 */
const getFieldStatusByFieldAndDate = async (fieldId, date) => {
  const collection = getFieldStatusCollection()
  let idStr = fieldId
  if (typeof fieldId === 'object' && fieldId._bsontype === 'ObjectId' && fieldId.toHexString) {
    idStr = fieldId.toHexString()
  } else if (typeof fieldId === 'object' && fieldId.toString) {
    idStr = fieldId.toString()
  }
  // Đảm bảo date là Date object
  let dateQuery = date
  if (typeof date === 'string' && date.length === 10) {
    dateQuery = new Date(date + 'T00:00:00.000Z')
  } else if (typeof date === 'string') {
    dateQuery = new Date(date)
  }
  return collection.findOne({
    fieldId: idStr,
    date: dateQuery,
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
    if (slot.id === slotId || (slot._id && slot._id.toString() === slotId)) {
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
