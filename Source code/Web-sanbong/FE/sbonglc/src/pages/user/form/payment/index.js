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
  const [notes, setNotes] = useState("")
  const [availableTimeSlots, setAvailableTimeSlots] = useState([])
  const navigate = useNavigate()
  const location = useLocation()

  // Lấy dữ liệu từ localStorage khi component được mount
  useEffect(() => {
    // Lấy danh sách sân từ localStorage
    const storedFields = JSON.parse(localStorage.getItem("fields") || "[]")

    // Tạo dữ liệu mẫu cho các sân mặc định
    const defaultFields = [
      { id: 1, name: "Sân 1", type: "5v5", price: 300000 },
      { id: 2, name: "Sân 2", type: "7v7", price: 400000 },
      { id: 3, name: "Sân 3", type: "5v5", price: 300000 },
    ]

    // Kết hợp sân mặc định với sân từ localStorage
    const combinedFields = [...defaultFields]

    // Thêm các sân từ localStorage mà không trùng ID với sân mặc định
    storedFields.forEach((field) => {
      if (!combinedFields.some((f) => f.id === field.id)) {
        combinedFields.push({
          id: field.id,
          name: field.name || field.title,
          type: field.type || "7v7",
          price: field.price || 300000,
        })
      }
    })

    setFields(combinedFields)

    // Nếu có sân, chọn sân đầu tiên mặc định
    if (combinedFields.length > 0) {
      setSelectedField(combinedFields[0].id)
    }

    // Kiểm tra xem có dữ liệu booking được truyền qua location state không
    if (location.state && location.state.bookingInfo) {
      const { field, date, timeSlot, price } = location.state.bookingInfo
      setSelectedField(field.id)
      setSelectedDate(new Date(date))
      setSelectedTime(timeSlot)
      setPrice(price)
    }
  }, [location.state])

  // Cập nhật danh sách khung giờ có sẵn khi thay đổi ngày hoặc sân
  useEffect(() => {
    if (selectedDate && selectedField) {
      // Lấy trạng thái sân từ localStorage
      const dateKey = formatDateKey(selectedDate)
      const storedStatus = JSON.parse(localStorage.getItem(`fieldStatus_${dateKey}`) || "null")

      if (storedStatus) {
        // Tìm trạng thái của sân đã chọn
        const fieldStatus = storedStatus.find((s) => s.fieldId === selectedField)
        if (fieldStatus) {
          // Lọc ra các khung giờ còn trống
          const availableSlots = fieldStatus.timeSlots
            .filter((slot) => slot.status === "available")
            .map((slot) => slot.time)

          setAvailableTimeSlots(availableSlots)

          // Nếu khung giờ đã chọn không còn trống, reset lựa chọn
          if (selectedTime && !availableSlots.includes(selectedTime)) {
            setSelectedTime(null)
          }

          return
        }
      }

      // Nếu không có dữ liệu trạng thái, sử dụng tất cả khung giờ mặc định
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
  }, [selectedDate, selectedField])

  // Tạo khóa ngày để lưu vào localStorage
  const formatDateKey = (date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  }

  const handleDateChange = (date) => {
    setSelectedDate(date)
  }

  const handleFieldChange = (event) => {
    setSelectedField(Number.parseInt(event.target.value))
  }

  const handleTimeChange = (time) => {
    setSelectedTime(time)
  }

  // Cập nhật giá khi thay đổi sân, khung giờ hoặc ngày
  useEffect(() => {
    if (!selectedField || !selectedTime) {
      setPrice(0)
      return
    }

    const field = fields.find((f) => f.id === selectedField)
    if (!field) {
      setPrice(0)
      return
    }

    let basePrice = field.price || 300000

    // Tăng giá vào giờ cao điểm
    if (selectedTime === "17h-18h30" || selectedTime === "18h30-20h") {
      basePrice = basePrice * 1.5
    }

    // Tăng giá vào cuối tuần
    if (selectedDate) {
      const dayOfWeek = selectedDate.getDay()
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        // 0 là Chủ nhật, 6 là Thứ 7
        basePrice += 100000
      }
    }

    setPrice(basePrice)
  }, [selectedField, selectedTime, selectedDate, fields])

  const handleCheckboxChange = (event) => {
    setConfirmed(event.target.checked)
  }

  const handleExitClick = () => {
    navigate(-1) // Quay lại trang trước
  }

  const handleBooking = () => {
    if (!confirmed || !selectedField || !selectedTime) {
      alert("Vui lòng điền đầy đủ thông tin và xác nhận!")
      return
    }

    // Lưu thông tin đặt sân vào localStorage
    const booking = {
      id: Date.now(),
      teamName,
      teamLeaderName,
      contact,
      fieldId: selectedField,
      fieldName: fields.find((f) => f.id === selectedField)?.name || "",
      date: selectedDate.toISOString(),
      time: selectedTime,
      price,
      notes,
      status: "pending", // pending, confirmed, cancelled
      createdAt: new Date().toISOString(),
    }

    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]")
    bookings.push(booking)
    localStorage.setItem("bookings", JSON.stringify(bookings))

    // Cập nhật trạng thái sân
    updateFieldStatus(selectedField, selectedTime, "booked", teamName)

    // Hiển thị thông báo và chuyển hướng
    alert("Đặt sân thành công! Vui lòng chờ xác nhận từ quản lý sân.")
    navigate(ROUTERS.USER.HOME)
  }

  // Cập nhật trạng thái sân trong localStorage
  const updateFieldStatus = (fieldId, timeSlot, status, bookedBy) => {
    const dateKey = formatDateKey(selectedDate)
    const storedStatus = JSON.parse(localStorage.getItem(`fieldStatus_${dateKey}`) || "null")

    if (storedStatus) {
      // Tìm và cập nhật trạng thái của sân
      const updatedStatus = storedStatus.map((field) => {
        if (field.fieldId === fieldId) {
          return {
            ...field,
            timeSlots: field.timeSlots.map((slot) => {
              if (slot.time === timeSlot) {
                return {
                  ...slot,
                  status,
                  bookedBy: status === "booked" ? bookedBy : slot.bookedBy,
                }
              }
              return slot
            }),
          }
        }
        return field
      })

      localStorage.setItem(`fieldStatus_${dateKey}`, JSON.stringify(updatedStatus))
    }
  }

  return (
    <div className="field-booking-form-container">
      <div className="field-booking-form">
        <button className="exit-button" onClick={handleExitClick}>
          <MdOutlineDisabledByDefault />
        </button>
        <h2>Đơn Đặt Sân</h2>

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
              <option key={field.id} value={field.id}>
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
            disabled={!confirmed || !selectedField || !selectedTime}
            onClick={handleBooking}
          >
            Đặt sân
          </button>
        </div>
      </div>
    </div>
  )
}

export default memo(Payment)

