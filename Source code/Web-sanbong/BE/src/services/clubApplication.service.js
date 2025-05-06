const clubApplicationModel = require("../models/clubApplication.model")
const userModel = require("../models/user.model")
const constants = require("../config/constants")
const { ObjectId } = require("mongodb")

/**
 * Get all club applications
 * @param {Object} filter - Filter criteria
 * @returns {Promise<Array>} List of applications
 */
const getClubApplications = async (filter = {}) => {
  return clubApplicationModel.getClubApplications(filter)
}

/**
 * Get club application by ID
 * @param {string} id - Application ID
 * @returns {Promise<Object>} Application object
 */
const getClubApplicationById = async (id) => {
  return clubApplicationModel.getClubApplicationById(id)
}

/**
 * Get club applications by user ID
 * @param {string} userId - User ID
 * @returns {Promise<Array>} List of applications
 */
const getClubApplicationsByUser = async (userId) => {
  return clubApplicationModel.getClubApplicationsByUser(userId)
}

/**
 * Create a new club application
 * @param {Object} applicationData - Application data
 * @returns {Promise<Object>} Created application
 */
const createClubApplication = async (applicationData) => {
  // Convert userId to ObjectId if it's a string
  if (applicationData.userId && typeof applicationData.userId === "string") {
    applicationData.userId = new ObjectId(applicationData.userId)
  }

  return clubApplicationModel.createClubApplication(applicationData)
}

/**
 * Update club application
 * @param {string} id - Application ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated application
 */
const updateClubApplication = async (id, updateData) => {
  return clubApplicationModel.updateClubApplication(id, updateData)
}

/**
 * Approve club application
 * @param {string} id - Application ID
 * @returns {Promise<Object>} Approved application
 */
const approveClubApplication = async (id) => {
  const application = await clubApplicationModel.updateClubApplication(id, {
    status: constants.applicationStatus.APPROVED,
    approvedAt: new Date(),
  })

  // Update user role to club member if application is approved
  if (application && application.userId) {
    await userModel.updateUser(application.userId, {
      role: constants.roles.MANAGER,
    })
  }

  return application
}

/**
 * Reject club application
 * @param {string} id - Application ID
 * @param {string} reason - Rejection reason
 * @returns {Promise<Object>} Rejected application
 */
const rejectClubApplication = async (id, reason) => {
  return clubApplicationModel.updateClubApplication(id, {
    status: constants.applicationStatus.REJECTED,
    rejectedAt: new Date(),
    rejectionReason: reason,
  })
}

/**
 * Delete club application
 * @param {string} id - Application ID
 * @returns {Promise<boolean>} True if deleted
 */
const deleteClubApplication = async (id) => {
  return clubApplicationModel.deleteClubApplication(id)
}

module.exports = {
  getClubApplications,
  getClubApplicationById,
  getClubApplicationsByUser,
  createClubApplication,
  updateClubApplication,
  approveClubApplication,
  rejectClubApplication,
  deleteClubApplication,
}
