"use client"

import { useState, memo, useEffect } from "react"
import "./style.scss"
import { FaPhone } from "react-icons/fa"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { ROUTERS } from "utils/router"
import { useNavigate, useLocation } from "react-router-dom"
import { MdOutlineDisabledByDefault } from "react-icons/md"
import { formater } from "utils/formater"
import { fieldAPI, fieldStatusAPI, bookingAPI } from "../../../../services/api"
import { formatDateForAPI } from "../../../../utils/formatDate"

// Helper function to format time slot string to HH:mm-HH:mm
const formatTimeSlotForBackend = (timeSlotString) => {
  if (!timeSlotString) return "";
  try {
    // Split the string by "-" to get start and end times
    const [startTime, endTime] = timeSlotString.split('-');

    // Helper to format a single time part (e.g., "15h30" -> "15:30", "17h" -> "17:00")
    const formatTimePart = (timePart) => {
      if (!timePart) return "";
      // Replace 'h' with ':'
      let formatted = timePart.replace('h', ':');
      // If it ends with ':', add "00" for minutes (e.g., "17:" -> "17:00")
      if (!formatted.includes(':')) { // If no minutes were present (e.g., "17")
        formatted += ':00';
      } else if (formatted.endsWith(':')) { // If minutes were '00' (e.g., "17h" -> "17:")
        formatted += '00';
      }

      // Ensure hour and minute are two digits
      const [hour, minute] = formatted.split(':');
      const formattedHour = hour.padStart(2, '0');
      const formattedMinute = minute.padStart(2, '0');

      return `${formattedHour}:${formattedMinute}`;
    };

    const formattedStartTime = formatTimePart(startTime);
    const formattedEndTime = formatTimePart(endTime);

    return `${formattedStartTime}-${formattedEndTime}`;

  } catch (e) {
    console.error("Error formatting time slot string:", timeSlotString, e);
    return timeSlotString; // Return original if formatting fails
  }
};

const Payment = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [fields, setFields] = useState([])
  const [selectedField, setSelectedField] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [price, setPrice] = useState(0)
  const [confirmed, setConfirmed] = useState(false)
  const [teamName, setTeamName] = useState("")
  const [teamLeaderName, setTeamLeaderName] = useState("")
  const [contact, setContact] = useState("")
  const [userId, setUserId] = useState(null)
  const [notes, setNotes] = useState("")
  const [availableTimeSlots, setAvailableTimeSlots] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Fetch fields from API
  const fetchFields = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fieldAPI.getFields()
      setFields(response.data.data.fields)

      // If there are fields, select the first one by default
      if (response.data.data.fields.length > 0) {
        setSelectedField(response.data.data.fields[0]._id)
      }
    } catch (err) {
      console.error("Error fetching fields:", err)
      setError("Không thể tải danh sách sân bóng. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch available time slots for selected field and date
  const fetchAvailableTimeSlots = async (fieldId, date) => {
    if (!fieldId || !date) return

    try {
      setIsLoading(true)
      const formattedDate = formatDateForAPI(date)
      const response = await fieldStatusAPI.getFieldStatusByFieldAndDate(fieldId, formattedDate)

      if (response.data.data.fieldStatus) {
        // Filter available time slots
        const availableSlots = response.data.data.fieldStatus.timeSlots
          .filter((slot) => slot.status === "available")
          .map((slot) => slot.time)

        setAvailableTimeSlots(availableSlots)

        // If current selected time is not available, reset it
        if (selectedTime && !availableSlots.includes(selectedTime)) {
          setSelectedTime(null)
        }
      } else {
        // If no field status found, use default time slots
        setAvailableTimeSlots([
          "8h-9h30",
          "9h30-11h",
          "14h-15h30",
          "15h30-17h",
          "17h-18h30",
          "18h30-20h",
          "20h-21h30",
          "21h30-23h",
        ])
      }
    } catch (err) {
      console.error("Error fetching available time slots:", err)
      setError("Không thể tải khung giờ trống. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }

  // Load user info from localStorage if available
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}")
    if (userInfo) {
      setTeamLeaderName(userInfo.name || "")
      setContact(userInfo.phone || "")
      setUserId(userInfo._id)
    }

    fetchFields()

    // Check if booking info is passed from previous page
    if (location.state && location.state.bookingInfo) {
      const { field, date, timeSlot, price } = location.state.bookingInfo
      setSelectedField(field._id)
      setSelectedDate(new Date(date))
      setSelectedTime(timeSlot)
      setPrice(price)
    }
  }, [location.state])

  // Update available time slots when field or date changes
  useEffect(() => {
    if (selectedField && selectedDate) {
      fetchAvailableTimeSlots(selectedField, selectedDate)
    }
  }, [selectedField, selectedDate])

  // Update price when field, time or date changes
  useEffect(() => {
    if (!selectedField || !selectedTime) {
      setPrice(0)
      return
    }

    const field = fields.find((f) => f._id === selectedField)
    if (!field) {
      setPrice(0)
      return
    }

    let basePrice = field.price || 300000

    // Increase price during peak hours
    if (selectedTime === "17h-18h30" || selectedTime === "18h30-20h") {
      basePrice = basePrice * 1.5
    }

    // Increase price on weekends
    if (selectedDate) {
      const dayOfWeek = selectedDate.getDay()
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        // 0 is Sunday, 6 is Saturday
        basePrice += 100000
      }
    }

    setPrice(basePrice)
  }, [selectedField, selectedTime, selectedDate, fields])

  const handleDateChange = (date) => {
    setSelectedDate(date)
  }

  const handleFieldChange = (event) => {
    setSelectedField(event.target.value)
  }

  const handleTimeChange = (time) => {
    setSelectedTime(time)
  }

  const handleCheckboxChange = (event) => {
    setConfirmed(event.target.checked)
  }

  const handleExitClick = () => {
    navigate(-1) // Go back to previous page
  }

  const handleBooking = async () => {
    if (!confirmed || !selectedField || !selectedTime) {
      alert("Vui lòng điền đầy đủ thông tin và xác nhận!")
      return
    }

    try {
      setIsLoading(true)

      // Create booking object
      const bookingData = {
        teamName,
        teamLeaderName,
        contact,
        fieldId: selectedField,
        fieldName: fields.find(f => f._id === selectedField)?.name || "",
        date: formatDateForAPI(selectedDate),
        time: formatTimeSlotForBackend(selectedTime),
        price,
        notes,
        userId,
      }

      console.log("Payload sent:", bookingData)

      // Send booking request to API
      const response = await bookingAPI.createBooking(bookingData)

      // Update field status to booked
      const formattedDate = formatDateForAPI(selectedDate)
      const fieldStatusResponse = await fieldStatusAPI.getFieldStatusByFieldAndDate(selectedField, formattedDate)

      if (fieldStatusResponse.data.data.fieldStatus) {
        const slot = fieldStatusResponse.data.data.fieldStatus.timeSlots.find((slot) => slot.time === selectedTime)

        if (slot) {
          await fieldStatusAPI.updateTimeSlotStatus(selectedField, formattedDate, slot._id, {
            status: "booked",
            bookedBy: teamName,
          })
        }
      }

      alert("Đặt sân thành công! Vui lòng chờ xác nhận từ quản lý sân.")
      navigate(ROUTERS.USER.HOME)
    } catch (err) {
      console.error("Error creating booking:", err)
      alert("Không thể đặt sân. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="field-booking-form-container">
      <div className="field-booking-form">
        <button className="exit-button" onClick={handleExitClick}>
          <MdOutlineDisabledByDefault />
        </button>
        <h2>Đơn Đặt Sân</h2>

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button className="retry-button" onClick={fetchFields}>
              Thử lại
            </button>
          </div>
        ) : (
          <>
            <div className="form-group">
              <label htmlFor="teamName">Tên đội</label>
              <input
                type="text"
                id="teamName"
                placeholder="Nhập tên đội bóng"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="teamLeaderName">Tên đội trưởng</label>
              <input
                type="text"
                id="teamLeaderName"
                placeholder="Nhập tên đội trưởng"
                value={teamLeaderName}
                onChange={(e) => setTeamLeaderName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact">Liên Hệ</label>
              <div className="contact-input">
                <FaPhone className="phone-icon" />
                <input
                  type="tel"
                  id="contact"
                  placeholder="Nhập số điện thoại liên hệ"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="date">Chọn ngày</label>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                minDate={new Date()}
                placeholderText="Chọn ngày"
                className="date-picker"
              />
            </div>

            <div className="form-group">
              <label htmlFor="field">Chọn sân</label>
              <select id="field" value={selectedField || ""} onChange={handleFieldChange} required>
                <option value="">-- Chọn sân --</option>
                {fields.map((field) => (
                  <option key={field._id} value={field._id}>
                    {field.name} ({field.type})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="time">Chọn khung giờ</label>
              <select
                id="time"
                value={selectedTime || ""}
                onChange={(e) => handleTimeChange(e.target.value)}
                required
                disabled={availableTimeSlots.length === 0}
              >
                <option value="">-- Chọn khung giờ --</option>
                {availableTimeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              {availableTimeSlots.length === 0 && (
                <p className="no-slots-message">Không có khung giờ trống cho ngày và sân đã chọn</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="price">Thành tiền</label>
              <input type="text" id="price" value={formater(price)} readOnly />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" id="confirm" checked={confirmed} onChange={handleCheckboxChange} />
                Xác nhận đúng thông tin
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Thông tin khác</label>
              <textarea
                id="notes"
                placeholder="Thêm ghi chú (nếu có)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>

            <div className="form-actions">
              <button className="cancel-button" onClick={handleExitClick}>
                Quay lại
              </button>
              <button
                className="book-button"
                disabled={!confirmed || !selectedField || !selectedTime || isLoading}
                onClick={handleBooking}
              >
                {isLoading ? "Đang xử lý..." : "Đặt sân"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default memo(Payment)
