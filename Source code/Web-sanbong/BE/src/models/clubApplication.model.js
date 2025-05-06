const { ObjectId } = require("mongodb")
const { getDb } = require("../config/database")
const constants = require("../config/constants")

/**
 * Club Application schema
 * @typedef {Object} ClubApplication
 * @property {string} fullName - Applicant's full name
 * @property {string} email - Applicant's email
 * @property {string} phone - Applicant's phone number
 * @property {string} address - Applicant's address
 * @property {string} bio - Applicant's bio
 * @property {string} footballSkill - Applicant's football skills
 * @property {string} status - Application status (pending, approved, rejected)
 * @property {Date} submittedAt - Submission date
 * @property {Date} approvedAt - Approval date
 * @property {Date} rejectedAt - Rejection date
 * @property {string} rejectionReason - Rejection reason
 * @property {string} userId - User ID
 * @property {string} avatar - Avatar URL
 */

/**
 * Get club applications collection
 * @returns {Collection} MongoDB collection
 */
const getClubApplicationsCollection = () => {
  return getDb().collection(constants.collections.CLUB_APPLICATIONS)
}

/**
 * Create a new club application
 * @param {ClubApplication} applicationData - Application data
 * @returns {Promise<ClubApplication>} Created application
 */
const createClubApplication = async (applicationData) => {
  const collection = getClubApplicationsCollection()

  const application = {
    ...applicationData,
    _id: new ObjectId(),
    status: constants.applicationStatus.PENDING,
    submittedAt: new Date(),
  }

  await collection.insertOne(application)
  return application
}

/**
 * Get all club applications
 * @param {Object} filter - Filter criteria
 * @returns {Promise<ClubApplication[]>} List of applications
 */
const getClubApplications = async (filter = {}) => {
  const collection = getClubApplicationsCollection()

  // Convert userId to ObjectId if present
  if (filter.userId) {
    filter.userId = new ObjectId(filter.userId)
  }

  return collection.find(filter).sort({ submittedAt: -1 }).toArray()
}

/**
 * Get club application by ID
 * @param {string} id - Application ID
 * @returns {Promise<ClubApplication>} Application document
 */
const getClubApplicationById = async (id) => {
  const collection = getClubApplicationsCollection()
  return collection.findOne({ _id: new ObjectId(id) })
}

/**
 * Get club applications by user ID
 * @param {string} userId - User ID
 * @returns {Promise<ClubApplication[]>} List of applications
 */
const getClubApplicationsByUser = async (userId) => {
  const collection = getClubApplicationsCollection()
  return collection
    .find({ userId: new ObjectId(userId) })
    .sort({ submittedAt: -1 })
    .toArray()
}

/**
 * Update club application
 * @param {string} id - Application ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<ClubApplication>} Updated application
 */
const updateClubApplication = async (id, updateData) => {
  const collection = getClubApplicationsCollection()

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateData },
    { returnDocument: "after" },
  )

  return result
}

/**
 * Delete club application
 * @param {string} id - Application ID
 * @returns {Promise<boolean>} True if deleted
 */
const deleteClubApplication = async (id) => {
  const collection = getClubApplicationsCollection()
  const result = await collection.deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount > 0
}

module.exports = {
  createClubApplication,
  getClubApplications,
  getClubApplicationById,
  getClubApplicationsByUser,
  updateClubApplication,
  deleteClubApplication,
}
