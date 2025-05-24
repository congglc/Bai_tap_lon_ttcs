/**
 * Format date to dd/mm/yyyy
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return ""
  const date = new Date(dateString)
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

/**
 * Format date and time to dd/mm/yyyy hh:mm
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return ""
  const date = new Date(dateString)
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

/**
 * Format date to yyyy-mm-dd for API requests
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
export const formatDateForAPI = (date) => {
  if (!date) return ""
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

/**
 * Format date key for localStorage
 * @param {Date} date - Date object
 * @returns {string} Formatted date key
 */
export const formatDateKey = (date) => {
  if (!date) return ""
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}
