const express = require("express")
const fieldController = require("../controllers/field.controller")
const { authenticate, authorize } = require("../middlewares/auth.middleware")
const validate = require("../middlewares/validate.middleware")
const fieldValidation = require("../validations/field.validation")
const constants = require("../config/constants")

const router = express.Router()

/**
 * @route GET /api/fields
 * @desc Get all fields
 * @access Public
 */
router.get("/", fieldController.getFields)

/**
 * @route GET /api/fields/:fieldId
 * @desc Get field by ID
 * @access Public
 */
router.get("/:fieldId", validate(fieldValidation.getFieldById), fieldController.getFieldById)

/**
 * @route POST /api/fields
 * @desc Create a new field
 * @access Private (Admin only)
 */
router.post(
  "/",
  authenticate,
  authorize(constants.roles.ADMIN),
  validate(fieldValidation.createField),
  fieldController.createField,
)

/**
 * @route PUT /api/fields/:fieldId
 * @desc Update field
 * @access Private (Admin only)
 */
router.put(
  "/:fieldId",
  authenticate,
  authorize(constants.roles.ADMIN),
  validate(fieldValidation.updateField),
  fieldController.updateField,
)

/**
 * @route DELETE /api/fields/:fieldId
 * @desc Delete field
 * @access Private (Admin only)
 */
router.delete(
  "/:fieldId",
  authenticate,
  authorize(constants.roles.ADMIN),
  validate(fieldValidation.deleteField),
  fieldController.deleteField,
)

module.exports = router
