// Create a new file for upload configuration
const path = require("path")
const fs = require("fs")
const multer = require("multer")

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../../public/uploads")
const fieldsDir = path.join(uploadsDir, "fields")
const usersDir = path.join(uploadsDir, "users")
const clubsDir = path.join(uploadsDir, "clubs")

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

if (!fs.existsSync(fieldsDir)) {
  fs.mkdirSync(fieldsDir, { recursive: true })
}

if (!fs.existsSync(usersDir)) {
  fs.mkdirSync(usersDir, { recursive: true })
}

if (!fs.existsSync(clubsDir)) {
  fs.mkdirSync(clubsDir, { recursive: true })
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, fieldsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, `field-${uniqueSuffix}${ext}`)
  },
})

// File filter
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("Only image files are allowed!"), false)
  }
  cb(null, true)
}

// Create multer upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: fileFilter,
})

// Get image URL
const getImageUrl = (filename) => {
  return `/uploads/fields/${filename}`
}

// Storage cho user avatar
const userAvatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, usersDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, `user-${uniqueSuffix}${ext}`)
  },
})

// Storage cho club avatar
const clubAvatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, clubsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, `club-${uniqueSuffix}${ext}`)
  },
})

const uploadUserAvatar = multer({
  storage: userAvatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter,
})

const uploadClubAvatar = multer({
  storage: clubAvatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter,
})

const getUserAvatarUrl = (filename) => `/uploads/users/${filename}`
const getClubAvatarUrl = (filename) => `/uploads/clubs/${filename}`

module.exports = {
  upload,
  getImageUrl,
  uploadUserAvatar,
  uploadClubAvatar,
  getUserAvatarUrl,
  getClubAvatarUrl,
}
