const { ObjectId } = require("mongodb")
const { getDb } = require("../config/database")
const constants = require("../config/constants")

/**
 * Field schema
 * @typedef {Object} Field
 * @property {string} name - Field name
 * @property {string} location - Field location
 * @property {string} manager - Field manager contact
 * @property {string} description - Field description
 * @property {string} type - Field type (5v5, 7v7, 11v11)
 * @property {string} src - Field image source
 * @property {string} alt - Field image alt text
 * @property {string} title - Field title
 * @property {string} time - Field time slot duration
 * @property {number} price - Field price
 */

/**
 * Get fields collection
 * @returns {Collection} MongoDB collection
 */
const getFieldsCollection = () => {
  return getDb().collection(constants.collections.FIELDS)
}

/**
 * Create a new field
 * @param {Field} fieldData - Field data
 * @returns {Promise<Field>} Created field
 */
const createField = async (fieldData) => {
  const collection = getFieldsCollection()

  const field = {
    ...fieldData,
    _id: new ObjectId(),
    createdAt: new Date(),
  }

  await collection.insertOne(field)
  return field
}

/**
 * Get all fields
 * @param {Object} filter - Filter criteria
 * @returns {Promise<Field[]>} List of fields
 */
const getFields = async (filter = {}) => {
  const collection = getFieldsCollection()
  return collection.find(filter).toArray()
}

/**
 * Get field by ID
 * @param {string} id - Field ID
 * @returns {Promise<Field>} Field document
 */
const getFieldById = async (id) => {
  const collection = getFieldsCollection()
  return collection.findOne({ _id: new ObjectId(id) })
}

/**
 * Update field
 * @param {string} id - Field ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Field>} Updated field
 */
const updateField = async (id, updateData) => {
  const collection = getFieldsCollection()

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateData },
    { returnDocument: "after" },
  )

  return result
}

/**
 * Delete field
 * @param {string} id - Field ID
 * @returns {Promise<boolean>} True if deleted
 */
const deleteField = async (id) => {
  const collection = getFieldsCollection()
  const result = await collection.deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount > 0
}

module.exports = {
  createField,
  getFields,
  getFieldById,
  updateField,
  deleteField,
}
