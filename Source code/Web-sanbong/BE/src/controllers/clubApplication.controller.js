const clubApplicationService = require("../services/clubApplication.service")
const { apiResponse } = require("../utils/apiResponse")

/**
 * Get all club applications
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getClubApplications = async (req, res, next) => {
  try {
    const filter = {}

    // Filter by status if provided
    if (req.query.status) {
      filter.status = req.query.status
    }

    const applications = await clubApplicationService.getClubApplications(filter)
    return apiResponse(res, 200, "Club applications retrieved successfully", { applications })
  } catch (error) {
    next(error)
  }
}

/**
 * Get club application by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getClubApplicationById = async (req, res, next) => {
  try {
    const application = await clubApplicationService.getClubApplicationById(req.params.applicationId)
    if (!application) {
      return apiResponse(res, 404, "Club application not found")
    }
    return apiResponse(res, 200, "Club application retrieved successfully", { application })
  } catch (error) {
    next(error)
  }
}

/**
 * Get club applications by user ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getClubApplicationsByUser = async (req, res, next) => {
  try {
    const applications = await clubApplicationService.getClubApplicationsByUser(req.params.userId)
    return apiResponse(res, 200, "User club applications retrieved successfully", { applications })
  } catch (error) {
    next(error)
  }
}

/**
 * Create a new club application
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const createClubApplication = async (req, res, next) => {
  try {
    const application = await clubApplicationService.createClubApplication(req.body)
    return apiResponse(res, 201, "Club application created successfully", { application })
  } catch (error) {
    next(error)
  }
}

/**
 * Update club application
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const updateClubApplication = async (req, res, next) => {
  try {
    const application = await clubApplicationService.updateClubApplication(req.params.applicationId, req.body)
    return apiResponse(res, 200, "Club application updated successfully", { application })
  } catch (error) {
    next(error)
  }
}

/**
 * Approve club application
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const approveClubApplication = async (req, res, next) => {
  try {
    const application = await clubApplicationService.approveClubApplication(req.params.applicationId)
    return apiResponse(res, 200, "Club application approved successfully", { application })
  } catch (error) {
    next(error)
  }
}

/**
 * Reject club application
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const rejectClubApplication = async (req, res, next) => {
  try {
    const { reason } = req.body
    const application = await clubApplicationService.rejectClubApplication(req.params.applicationId, reason)
    return apiResponse(res, 200, "Club application rejected successfully", { application })
  } catch (error) {
    next(error)
  }
}

/**
 * Delete club application
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const deleteClubApplication = async (req, res, next) => {
  try {
    await clubApplicationService.deleteClubApplication(req.params.applicationId)
    return apiResponse(res, 200, "Club application deleted successfully")
  } catch (error) {
    next(error)
  }
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
