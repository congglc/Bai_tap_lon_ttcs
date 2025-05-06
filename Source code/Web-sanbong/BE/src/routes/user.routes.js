const express = require("express")
const userController = require("../controllers/user.controller")
const { authenticate, authorize } = require("../middlewares/auth.middleware")
const validate = require("../middlewares/validate.middleware")
const userValidation = require("../validations/user.validation")
const constants = require("../config/constants")

const router = express.Router()

/**
 * @route GET /api/users
 * @desc Get all users
 * @access Private (Admin only)
 */
router.get("/", authenticate, authorize(constants.roles.ADMIN), userController.getUsers)

/**
 * @route GET /api/users/:userId
 * @desc Get user by ID
 * @access Private
 */
router.get("/:userId", authenticate, validate(userValidation.getUserById), userController.getUserById)

/**
 * @route POST /api/users
 * @desc Create a new user
 * @access Private (Admin only)
 */
router.post(
  "/",
  authenticate,
  authorize(constants.roles.ADMIN),
  validate(userValidation.createUser),
  userController.createUser,
)

/**
 * @route PUT /api/users/:userId
 * @desc Update user
 * @access Private
 */
router.put("/:userId", authenticate, validate(userValidation.updateUser), userController.updateUser)

/**
 * @route DELETE /api/users/:userId
 * @desc Delete user
 * @access Private (Admin only)
 */
router.delete(
  "/:userId",
  authenticate,
  authorize(constants.roles.ADMIN),
  validate(userValidation.deleteUser),
  userController.deleteUser,
)

module.exports = router
