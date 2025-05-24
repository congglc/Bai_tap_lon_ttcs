const { apiResponse } = require("../utils/apiResponse")
const { getImageUrl } = require("../config/upload")
const path = require("path")
const fs = require("fs")

/**
 * Upload field image
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const uploadFieldImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return apiResponse(res, 400, "No file was uploaded")
    }

    // Get the URL of the uploaded image
    const imageUrl = getImageUrl(req.file.filename)

    return apiResponse(res, 200, "Image uploaded successfully", {
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: imageUrl,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Upload multiple field images
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const uploadMultipleFieldImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return apiResponse(res, 400, "No files were uploaded")
    }

    // Get the URLs of the uploaded images
    const uploadedImages = req.files.map((file) => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: getImageUrl(file.filename),
    }))

    return apiResponse(res, 200, "Images uploaded successfully", {
      count: uploadedImages.length,
      images: uploadedImages,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Delete field image
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const deleteFieldImage = async (req, res, next) => {
  try {
    const { filename } = req.params

    if (!filename) {
      return apiResponse(res, 400, "Filename not provided")
    }

    // Path to the file to be deleted
    const filePath = path.join(__dirname, "../../public/uploads/fields", filename)

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return apiResponse(res, 404, "File not found")
    }

    // Delete the file
    fs.unlinkSync(filePath)

    return apiResponse(res, 200, "Image deleted successfully")
  } catch (error) {
    next(error)
  }
}

module.exports = {
  uploadFieldImage,
  uploadMultipleFieldImages,
  deleteFieldImage,
}
