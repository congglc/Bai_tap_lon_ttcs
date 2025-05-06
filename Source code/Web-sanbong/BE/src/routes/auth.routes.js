const express = require("express")
const authController = require("../controllers/auth.controller")
const validate = require("../middlewares/validate.middleware")
const authValidation = require("../validations/auth.validation")

const router = express.Router()

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post("/register", validate(authValidation.register), authController.register)

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post("/login", validate(authValidation.login), authController.login)

/**
 * @route POST /api/auth/logout
 * @desc Logout user
 * @access Public
 */
router.post("/logout", validate(authValidation.logout), authController.logout)

/**
 * @route POST /api/auth/refresh-tokens
 * @desc Refresh auth tokens
 * @access Public
 */
router.post("/refresh-tokens", validate(authValidation.refreshTokens), authController.refreshTokens)

module.exports = router
