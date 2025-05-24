// Create a new file for upload routes
const express = require("express")
const uploadController = require("../controllers/upload.controller")
const { authenticate, authorize } = require("../middlewares/auth.middleware")
const constants = require("../config/constants")
const { upload } = require("../config/upload")

const router = express.Router()

/**
 * @route POST /api/uploads/fields
 * @desc Upload field image
 * @access Private (Admin/Manager)
 */
router.post(
  "/fields",
  authenticate,
  authorize(constants.roles.ADMIN, constants.roles.MANAGER),
  upload.single("image"),
  uploadController.uploadFieldImage,
)

/**
 * @route POST /api/uploads/fields/multiple
 * @desc Upload multiple field images
 * @access Private (Admin/Manager)
 */
router.post(
  "/fields/multiple",
  authenticate,
  authorize(constants.roles.ADMIN, constants.roles.MANAGER),
  upload.array("images", 10), // Allow up to 10 images
  uploadController.uploadMultipleFieldImages,
)

/**
 * @route DELETE /api/uploads/fields/:filename
 * @desc Delete field image
 * @access Private (Admin/Manager)
 */
router.delete(
  "/fields/:filename",
  authenticate,
  authorize(constants.roles.ADMIN, constants.roles.MANAGER),
  uploadController.deleteFieldImage,
)

module.exports = router
