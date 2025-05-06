const express = require("express")
const fieldStatusController = require("../controllers/fieldStatus.controller")
const { authenticate, authorize } = require("../middlewares/auth.middleware")
const validate = require("../middlewares/validate.middleware")
const fieldStatusValidation = require("../validations/fieldStatus.validation")
const constants = require("../config/constants")

const router = express.Router()

/**
 * @route GET /api/field-status/date/:date
 * @desc Get field status by date
 * @access Public
 */
router.get(
  "/date/:date",
  validate(fieldStatusValidation.getFieldStatusByDate),
  fieldStatusController.getFieldStatusByDate,
)

/**
 * @route GET /api/field-status/:fieldId/date/:date
 * @desc Get field status by field ID and date
 * @access Public
 */
router.get(
  "/:fieldId/date/:date",
  validate(fieldStatusValidation.getFieldStatusByFieldAndDate),
  fieldStatusController.getFieldStatusByFieldAndDate,
)

/**
 * @route PUT /api/field-status/:fieldId/date/:date
 * @desc Create or update field status
 * @access Private (Admin/Manager)
 */
router.put(
  "/:fieldId/date/:date",
  authenticate,
  authorize(constants.roles.ADMIN, constants.roles.MANAGER),
  validate(fieldStatusValidation.createOrUpdateFieldStatus),
  fieldStatusController.createOrUpdateFieldStatus,
)

/**
 * @route PUT /api/field-status/:fieldId/date/:date/slot/:slotId
 * @desc Update time slot status
 * @access Private (Admin/Manager)
 */
router.put(
  "/:fieldId/date/:date/slot/:slotId",
  authenticate,
  authorize(constants.roles.ADMIN, constants.roles.MANAGER),
  validate(fieldStatusValidation.updateTimeSlotStatus),
  fieldStatusController.updateTimeSlotStatus,
)

module.exports = router
