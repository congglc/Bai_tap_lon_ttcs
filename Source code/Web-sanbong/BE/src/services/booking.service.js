const bookingModel = require("../models/booking.model")
const fieldStatusService = require("./fieldStatus.service")
const constants = require("../config/constants")
const { ObjectId } = require("mongodb")

/**
 * Helper function to format time string from "HH:mm-HH:mm" to "Hh-Hhmm"
 * @param {string} timeString - Time string in "HH:mm-HH:mm" format
 * @returns {string} Formatted time string in "Hh-Hhmm" format
 */
const formatTimeForFieldStatus = (timeString) => {
    if (!timeString) return timeString;
    const parts = timeString.split('-');
    if (parts.length !== 2) return timeString; // Return original if format is unexpected

    const formatPart = (part) => {
        const [hours, minutes] = part.split(':');
        let formattedPart = parseInt(hours, 10) + 'h';
        if (parseInt(minutes, 10) > 0) {
            formattedPart += minutes;
        }
        return formattedPart;
    };

    return `${formatPart(parts[0])}-${formatPart(parts[1])}`;
};

/**
 * Get all bookings
 * @param {Object} filter - Filter criteria
 * @param {number} limit - Maximum number of results
 * @param {number} skip - Number of documents to skip
 * @returns {Promise<Array>} List of bookings
 */
const getBookings = async (filter = {}, limit = 10, skip = 0) => {
  return bookingModel.getBookings(filter, limit, skip)
}

/**
 * Count bookings based on filter
 * @param {Object} filter - Filter criteria
 * @returns {Promise<number>} Count of bookings
 */
const countBookings = async (filter = {}) => {
  return bookingModel.countBookings(filter)
}

/**
 * Get booking by ID
 * @param {string} id - Booking ID
 * @returns {Promise<Object>} Booking object
 */
const getBookingById = async (id) => {
  return bookingModel.getBookingById(id)
}

/**
 * Get bookings by user ID
 * @param {string} userId - User ID
 * @param {number} limit - Maximum number of results
 * @param {number} skip - Number of documents to skip
 * @param {string} status - Booking status
 * @returns {Promise<Array>} List of bookings
 */
const getBookingsByUser = async (userId, limit = 10, skip = 0, status = null) => {
  const filter = { userId: new ObjectId(userId) }
  if (status) filter.status = status
  return bookingModel.getBookings(filter, limit, skip)
}

/**
 * Create a new booking
 * @param {Object} bookingData - Booking data
 * @returns {Promise<Object>} Created booking
 */
const createBooking = async (bookingData) => {
  // Lấy field-status theo ngày/sân
  const fieldStatus = await fieldStatusService.getFieldStatusByFieldAndDate(toHexId(bookingData.fieldId), bookingData.date)
  if (fieldStatus && Array.isArray(fieldStatus.timeSlots)) {
    // Nếu bookingData.time không khớp với slot.time, map lại cho đúng
    const slot = fieldStatus.timeSlots.find(s => s.time === bookingData.time)
    if (!slot) {
      // Thử map theo giờ phút nếu FE truyền kiểu 20:00-21:30
      const normalize = str => str.replace(/h/g, ':').replace(/\s/g, '').replace(/-/g, '').replace(/:/g, '')
      const bookingTimeNorm = normalize(bookingData.time)
      const foundSlot = fieldStatus.timeSlots.find(s => normalize(s.time) === bookingTimeNorm)
      if (foundSlot) bookingData.time = foundSlot.time
    }
  }
  // Check for existing confirmed bookings for the same field, date, and time
  const existingBookings = await bookingModel.getBookings({
    fieldId: bookingData.fieldId,
    date: bookingData.date,
    time: bookingData.time,
    status: constants.bookingStatus.CONFIRMED, // Only check confirmed bookings
  });

  // If any confirmed booking exists for this slot, throw an error
  if (existingBookings && existingBookings.length > 0) {
    throw new Error('Khung giờ đã có người đặt. Vui lòng chọn khung giờ khác.');
  }

  // **NEW:** Ensure the field status document exists for this date and field
  // This will create the document with default slots if it doesn't exist yet.
  try {
      await fieldStatusService.createOrUpdateFieldStatus(toHexId(bookingData.fieldId), bookingData.date, undefined); // Không truyền mảng rỗng
      console.log(`Ensured FieldStatus document exists for field ${bookingData.fieldId} on date ${bookingData.date}`);
  } catch (fsError) {
      console.error(`Error ensuring FieldStatus document exists: ${fsError.message}`);
      // Decide how to handle this error - maybe prevent booking or just log and proceed?
      // For now, we'll log and proceed, as booking itself can still be created.
  }

  // Convert userId to ObjectId if it's a string
  if (bookingData.userId && typeof bookingData.userId === "string") {
    bookingData.userId = new ObjectId(bookingData.userId)
  }

  // Convert fieldId to ObjectId if it's a string
  if (bookingData.fieldId && typeof bookingData.fieldId === "string") {
    bookingData.fieldId = new ObjectId(bookingData.fieldId)
  }

  // Create booking
  const booking = await bookingModel.createBooking(bookingData)

  // Update field status if time slot is provided
  // REMOVED: We will update status only when confirming booking

  return booking
}

/**
 * Update booking
 * @param {string} id - Booking ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated booking
 */
const updateBooking = async (id, updateData) => {
  return bookingModel.updateBooking(id, updateData)
}

/**
 * Confirm booking
 * @param {string} id - Booking ID
 * @returns {Promise<Object>} Confirmed booking
 */
const confirmBooking = async (id) => {
  console.log('=== ĐÃ VÀO confirmBooking ===', id);
  const bookingResult = await bookingModel.updateBooking(id, {
    status: constants.bookingStatus.CONFIRMED,
    confirmedAt: new Date(),
  });
  const booking = bookingResult.value;
  console.log('DEBUG booking:', booking);

  if (booking && booking.date && booking.time && booking.fieldId) {
    console.log('DEBUG Passed booking info check');
    const dateStr = new Date(booking.date).toISOString().split("T")[0];
    try {
      const fieldStatusDocument = await fieldStatusService.getFieldStatusByFieldAndDate(toHexId(booking.fieldId), dateStr);
      console.log('DEBUG fieldStatusDocument:', fieldStatusDocument);

        if (fieldStatusDocument && fieldStatusDocument.timeSlots) {
        const bookingTimeNorm = normalizeTimeString(booking.time);
        console.log('DEBUG booking.time:', booking.time, 'bookingTimeNorm:', bookingTimeNorm);
        fieldStatusDocument.timeSlots.forEach(slot => {
          console.log('DEBUG slot.time:', slot.time, 'slot.id:', slot.id, 'slotNorm:', normalizeTimeString(slot.time));
        });
        const targetSlot = fieldStatusDocument.timeSlots.find(slot =>
          normalizeTimeString(slot.time) === bookingTimeNorm
        );
        console.log('DEBUG targetSlot:', targetSlot);

            if (targetSlot && targetSlot.id) {
          try {
                const updatedFieldStatus = await fieldStatusService.updateTimeSlotStatus(
              toHexId(booking.fieldId),
                    dateStr,
              targetSlot.id,
              {
                      status: constants.fieldStatus.BOOKED,
                      bookedBy: booking.teamName,
                bookingId: booking._id,
                    }
                );
            console.log('DEBUG Updated field status:', updatedFieldStatus);
          } catch (err) {
            console.error('ERROR khi updateTimeSlotStatus:', err);
            }
        } else {
          console.warn('Không tìm thấy slot phù hợp với time =', booking.time, 'trong field-status!');
        }
      } else {
        console.warn('Field status document not found hoặc timeSlots array missing cho field', booking.fieldId, 'date', dateStr);
        }
    } catch (fsUpdateError) {
      console.error('Error updating field status for confirmed booking', booking._id, ':', fsUpdateError);
    }
  } else {
    console.warn('Booking info thiếu trường date/time/fieldId:', booking);
  }

  return booking;
}

/**
 * Cancel booking
 * @param {string} id - Booking ID
 * @param {string} reason - Cancellation reason
 * @returns {Promise<Object>} Cancelled booking
 */
const cancelBooking = async (id, reason) => {
  const booking = await bookingModel.updateBooking(id, {
    status: constants.bookingStatus.CANCELLED,
    cancelledAt: new Date(),
    cancelReason: reason,
  })

  // Update field status if booking was confirmed
  if (booking.date && booking.time && booking.fieldId) {
    const dateStr = new Date(booking.date).toISOString().split("T")[0]

    // Get field status
    const fieldStatus = await fieldStatusService.getFieldStatusByFieldAndDate(booking.fieldId, dateStr)

    if (fieldStatus) {
      // Find the time slot
      const timeSlotIndex = fieldStatus.timeSlots.findIndex((slot) => slot.time === booking.time)

      if (timeSlotIndex !== -1) {
        // Update time slot status
        await fieldStatusService.updateTimeSlotStatus(
          booking.fieldId,
          dateStr,
          fieldStatus.timeSlots[timeSlotIndex].id,
          {
            status: constants.fieldStatus.AVAILABLE,
            bookedBy: null,
          },
        )
      }
    }
  }

  return booking
}

/**
 * Delete booking
 * @param {string} id - Booking ID
 * @returns {Promise<boolean>} True if deleted
 */
const deleteBooking = async (id) => {
  return bookingModel.deleteBooking(id)
}

const toHexId = (id) => (typeof id === 'object' && id._bsontype === 'ObjectId' && id.toHexString) ? id.toHexString() : id.toString();

// Thêm hàm chuẩn hóa time slot
function normalizeTimeString(str) {
  if (!str) return '';
  const parts = str.split(/-|–/);
  if (parts.length !== 2) return str.replace(/[^0-9]/g, ''); // fallback: chỉ lấy số

  const norm = (s) => {
    const match = s.match(/(\d{1,2})[:h]?(\d{0,2})/i);
    if (!match) return '';
    let h = match[1];
    let m = match[2] || '';
    if (m.length === 1) m = '0' + m;
    return h + (m ? m : '');
  };
  return norm(parts[0]) + '–' + norm(parts[1]);
}

module.exports = {
  getBookings,
  countBookings,
  getBookingById,
  getBookingsByUser,
  createBooking,
  updateBooking,
  confirmBooking,
  cancelBooking,
  deleteBooking,
}
