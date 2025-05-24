const express = require("express")
const clubApplicationController = require("../controllers/clubApplication.controller")
const { authenticate, authorize } = require("../middlewares/auth.middleware")
const validate = require("../middlewares/validate.middleware")
const clubApplicationValidation = require("../validations/clubApplication.validation")
const constants = require("../config/constants")
const { uploadClubAvatar } = require("../config/upload")

const router = express.Router()

/**
 * @route GET /api/club-applications
 * @desc Get all club applications
 * @access Private (Admin/Manager)
 */
router.get(
  "/",
  authenticate,
  authorize(constants.roles.ADMIN, constants.roles.MANAGER),
  clubApplicationController.getClubApplications,
)

/**
 * @route GET /api/club-applications/:applicationId
 * @desc Get club application by ID
 * @access Private
 */
router.get(
  "/:applicationId",
  authenticate,
  validate(clubApplicationValidation.getClubApplicationById),
  clubApplicationController.getClubApplicationById,
)

/**
 * @route GET /api/club-applications/user/:userId
 * @desc Get club applications by user ID
 * @access Private
 */
router.get(
  "/user/:userId",
  authenticate,
  validate(clubApplicationValidation.getClubApplicationsByUser),
  clubApplicationController.getClubApplicationsByUser,
)

/**
 * @route POST /api/club-applications
 * @desc Create a new club application
 * @access Private
 */
router.post(
  "/",
  authenticate,
  validate(clubApplicationValidation.createClubApplication),
  clubApplicationController.createClubApplication,
)

/**
 * @route PUT /api/club-applications/:applicationId
 * @desc Update club application
 * @access Private
 */
router.put(
  "/:applicationId",
  authenticate,
  validate(clubApplicationValidation.updateClubApplication),
  clubApplicationController.updateClubApplication,
)

/**
 * @route PUT /api/club-applications/:applicationId/approve
 * @desc Approve club application
 * @access Private (Admin/Manager)
 */
router.put(
  "/:applicationId/approve",
  authenticate,
  authorize(constants.roles.ADMIN, constants.roles.MANAGER),
  validate(clubApplicationValidation.approveClubApplication),
  clubApplicationController.approveClubApplication,
)

/**
 * @route PUT /api/club-applications/:applicationId/reject
 * @desc Reject club application
 * @access Private (Admin/Manager)
 */
router.put(
  "/:applicationId/reject",
  authenticate,
  authorize(constants.roles.ADMIN, constants.roles.MANAGER),
  validate(clubApplicationValidation.rejectClubApplication),
  clubApplicationController.rejectClubApplication,
)

/**
 * @route DELETE /api/club-applications/:applicationId
 * @desc Delete club application
 * @access Private (Admin only)
 */
router.delete(
  "/:applicationId",
  authenticate,
  authorize(constants.roles.ADMIN),
  validate(clubApplicationValidation.deleteClubApplication),
  clubApplicationController.deleteClubApplication,
)

/**
 * @route PUT /api/club-applications/:applicationId/avatar
 * @desc Upload club application avatar
 * @access Private (chủ đơn hoặc admin)
 */
router.put(
  "/:applicationId/avatar",
  authenticate,
  uploadClubAvatar.single("avatar"),
  clubApplicationController.uploadAvatar,
)

module.exports = router
