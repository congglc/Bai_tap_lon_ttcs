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
  // Store the original time format from frontend
  const originalTime = bookingData.time;
  
  // Lấy field-status theo ngày/sân
  const fieldStatus = await fieldStatusService.getFieldStatusByFieldAndDate(toHexId(bookingData.fieldId), bookingData.date);
  
  // Find the matching field status time slot
  let matchingSlot = null;
  if (fieldStatus && Array.isArray(fieldStatus.timeSlots)) {
    // Try direct matching first
    matchingSlot = fieldStatus.timeSlots.find(s => timeSlotMatches(originalTime, s.time));
    
    // If no direct match, try other methods
    if (!matchingSlot) {
      // Try normalized time matching
      const bookingTimeNorm = normalizeTimeString(originalTime);
      console.log('Normalized booking time:', bookingTimeNorm);
      
      // Find matching slot with normalized time
      matchingSlot = fieldStatus.timeSlots.find(s => 
        normalizeTimeString(s.time) === bookingTimeNorm
      );
      
      if (!matchingSlot) {
        // Try matching by hour only
        try {
          const bookingHour = originalTime.match(/^(\d{1,2})/)[1];
          matchingSlot = fieldStatus.timeSlots.find(s => {
            const slotHour = s.time.match(/^(\d{1,2})/)[1];
            return parseInt(bookingHour, 10) === parseInt(slotHour, 10);
          });
        } catch (err) {
          console.error('Error matching by hour:', err);
        }
      }
    }
  }
  
  // If we found a matching slot, use its exact time format
  if (matchingSlot) {
    console.log('Found matching slot:', matchingSlot.time, 'for original time:', originalTime);
    // Store both the original time and the field status time format
    bookingData.time = originalTime; // Keep the original time for the booking
    bookingData.originalTimeSlot = matchingSlot.time; // Store the field status time format
  }
  
  // Check for existing confirmed bookings for the same field, date, and time
  const existingBookings = await bookingModel.getBookings({
    fieldId: bookingData.fieldId,
    date: bookingData.date,
    time: bookingData.time,
    status: constants.bookingStatus.CONFIRMED,
  });

  // If any confirmed booking exists for this slot, throw an error
  if (existingBookings && existingBookings.length > 0) {
    throw new Error('Khung giờ đã có người đặt. Vui lòng chọn khung giờ khác.');
  }

  // Ensure the field status document exists
  try {
    await fieldStatusService.createOrUpdateFieldStatus(toHexId(bookingData.fieldId), bookingData.date, undefined);
    console.log(`Ensured FieldStatus document exists for field ${bookingData.fieldId} on date ${bookingData.date}`);
  } catch (fsError) {
    console.error(`Error ensuring FieldStatus document exists: ${fsError.message}`);
  }

  // Convert userId to ObjectId if it's a string
  if (bookingData.userId && typeof bookingData.userId === "string") {
    bookingData.userId = new ObjectId(bookingData.userId);
  }

  // Convert fieldId to ObjectId if it's a string
  if (bookingData.fieldId && typeof bookingData.fieldId === "string") {
    bookingData.fieldId = new ObjectId(bookingData.fieldId);
  }

  // Create booking
  const booking = await bookingModel.createBooking(bookingData);
  return booking;
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
        // Instead of trying to match the booking time to a field status time slot,
        // we'll use the originalTimeSlot field that should be stored during booking creation
        let targetSlot = null;
        
        // If booking has originalTimeSlot field, use it directly
        if (booking.originalTimeSlot) {
          targetSlot = fieldStatusDocument.timeSlots.find(slot => 
            slot.time === booking.originalTimeSlot
          );
        }
        
        // If no originalTimeSlot or no match found, fall back to matching algorithms
        if (!targetSlot) {
          // Try direct matching first
          targetSlot = fieldStatusDocument.timeSlots.find(slot => 
            timeSlotMatches(booking.time, slot.time)
          );
          
          // If still no match, try by hour
          if (!targetSlot) {
            try {
              const bookingHour = booking.time.match(/^(\d{1,2})/)[1];
              targetSlot = fieldStatusDocument.timeSlots.find(slot => {
                const slotHour = slot.time.match(/^(\d{1,2})/)[1];
                return parseInt(bookingHour, 10) === parseInt(slotHour, 10);
              });
            } catch (err) {
              console.error('Error matching by hour:', err);
            }
          }
        }
        
        console.log('DEBUG targetSlot:', targetSlot);

        if (targetSlot && (targetSlot._id || targetSlot.id)) {
          try {
            const slotId = targetSlot._id || targetSlot.id;
            const updatedFieldStatus = await fieldStatusService.updateTimeSlotStatus(
              toHexId(booking.fieldId),
              dateStr,
              slotId,
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

// Improved normalizeTimeString function to handle different formats consistently
function normalizeTimeString(str) {
  if (!str) return '';
  
  // First try to split by dash or en-dash
  const parts = str.split(/-|–/);
  if (parts.length !== 2) return str.replace(/[^0-9]/g, '');
  
  const norm = (s) => {
    // Extract hours and minutes, handling formats like "9h30", "09:30", "9:30", etc.
    const match = s.trim().match(/(\d{1,2})[:h]?(\d{0,2})/i);
    if (!match) return '';
    
    let h = match[1];
    let m = match[2] || '00'; // Default to '00' if no minutes
    
    // Ensure consistent format
    h = h.padStart(2, '0'); // Ensure 2 digits for hours
    m = m.padStart(2, '0'); // Ensure 2 digits for minutes
    
    return h + m;
  };
  
  return norm(parts[0]) + '–' + norm(parts[1]);
}

// Helper function to directly compare time slots regardless of format
function timeSlotMatches(bookingTime, fieldStatusTime) {
  // Direct string comparison first
  if (bookingTime === fieldStatusTime) return true;
  
  // Try to extract and compare hours and minutes
  const extractTimeParts = (timeStr) => {
    // Handle formats like "14:00-15:30" or "14h-15h30"
    const parts = timeStr.split(/-|–/);
    if (parts.length !== 2) return null;
    
    const startMatch = parts[0].trim().match(/(\d{1,2})[:h]?(\d{0,2})/i);
    const endMatch = parts[1].trim().match(/(\d{1,2})[:h]?(\d{0,2})/i);
    
    if (!startMatch || !endMatch) return null;
    
    return {
      startHour: parseInt(startMatch[1], 10),
      startMinute: parseInt(startMatch[2] || '0', 10),
      endHour: parseInt(endMatch[1], 10),
      endMinute: parseInt(endMatch[2] || '0', 10)
    };
  };
  
  const bookingParts = extractTimeParts(bookingTime);
  const fieldParts = extractTimeParts(fieldStatusTime);
  
  if (!bookingParts || !fieldParts) return false;
  
  // Compare start and end times
  return (
    bookingParts.startHour === fieldParts.startHour &&
    bookingParts.startMinute === fieldParts.startMinute &&
    bookingParts.endHour === fieldParts.endHour &&
    bookingParts.endMinute === fieldParts.endMinute
  );
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








