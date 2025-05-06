const fieldStatusService = require("../services/fieldStatus.service")
const { apiResponse } = require("../utils/apiResponse")

/**
 * Get field status by date
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getFieldStatusByDate = async (req, res, next) => {
  try {
    const { date } = req.params
    const fieldStatus = await fieldStatusService.getFieldStatusByDate(date)
    return apiResponse(res, 200, "Field status retrieved successfully", { fieldStatus })
  } catch (error) {
    next(error)
  }
}

/**
 * Get field status by field ID and date
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getFieldStatusByFieldAndDate = async (req, res, next) => {
  try {
    const { fieldId, date } = req.params
    const fieldStatus = await fieldStatusService.getFieldStatusByFieldAndDate(fieldId, date)
    return apiResponse(res, 200, "Field status retrieved successfully", { fieldStatus })
  } catch (error) {
    next(error)
  }
}

/**
 * Create or update field status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const createOrUpdateFieldStatus = async (req, res, next) => {
  try {
    const { fieldId, date } = req.params
    const { timeSlots } = req.body

    const fieldStatus = await fieldStatusService.createOrUpdateFieldStatus(fieldId, date, timeSlots)
    return apiResponse(res, 200, "Field status updated successfully", { fieldStatus })
  } catch (error) {
    next(error)
  }
}

/**
 * Update time slot status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const updateTimeSlotStatus = async (req, res, next) => {
  try {
    const { fieldId, date, slotId } = req.params
    const { status, bookedBy, note, price } = req.body

    const fieldStatus = await fieldStatusService.updateTimeSlotStatus(fieldId, date, slotId, {
      status,
      bookedBy,
      note,
      price,
    })

    return apiResponse(res, 200, "Time slot status updated successfully", { fieldStatus })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getFieldStatusByDate,
  getFieldStatusByFieldAndDate,
  createOrUpdateFieldStatus,
  updateTimeSlotStatus,
}
