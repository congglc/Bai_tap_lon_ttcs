"use client"

import { memo, useEffect, useState } from "react"
import "./style.scss"
import { ROUTERS } from "utils/router"
import { Link, useNavigate } from "react-router-dom"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { formater } from "utils/formater"
import { fieldAPI, fieldStatusAPI } from "../../../services/api"
import { formatDate, formatDateForAPI } from "../../../utils/formatDate"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8081/api"
const getImageUrl = (src) => {
  if (!src) return "/placeholder.svg"
  if (src.startsWith("http")) return src
  return API_URL.replace("/api", "") + src
}

const Order = () => {
  // State cho các bộ lọc và dữ liệu
  const [fieldData, setFieldData] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedType, setSelectedType] = useState("all")
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("all")
  const [filteredFields, setFilteredFields] = useState([])
  const [bookingInfo, setBookingInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Khung giờ có sẵn
  const timeSlots = [
    { value: "all", label: "Tất cả khung giờ" },
    { value: "8h-9h30", label: "8h-9h30" },
    { value: "9h30-11h", label: "9h30-11h" },
    { value: "14h-15h30", label: "14h-15h30" },
    { value: "15h30-17h", label: "15h30-17h" },
    { value: "17h-18h30", label: "17h-18h30" },
    { value: "18h30-20h", label: "18h30-20h" },
    { value: "20h-21h30", label: "20h-21h30" },
    { value: "21h30-23h", label: "21h30-23h" },
  ]

  // Loại sân
  const fieldTypes = [
    { value: "all", label: "Tất cả loại sân" },
    { value: "5v5", label: "Sân 5 người" },
    { value: "7v7", label: "Sân 7 người" },
    { value: "11v11", label: "Sân 11 người" },
  ]

  // Fetch fields and their availability
  const fetchFieldsAndAvailability = async (date) => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch all fields
      const fieldsResponse = await fieldAPI.getFields()
      const allFields = fieldsResponse.data.data.fields

      // Fetch field status for the selected date
      const formattedDate = formatDateForAPI(date)
      const statusResponse = await fieldStatusAPI.getFieldStatusByDate(formattedDate)
      const fieldStatuses = statusResponse.data.data.fieldStatus || []

      // Combine field data with availability data
      const fieldsWithAvailability = allFields.map((field) => {
        const fieldStatus = fieldStatuses.find((status) => status.fieldId === field._id)

        if (fieldStatus) {
          // Extract available time slots
          const availableSlots = fieldStatus.timeSlots
            .filter((slot) => slot.status === "available")
            .map((slot) => slot.time)

          return {
            ...field,
            availableSlots,
          }
        } else {
          // If no status found, assume all slots are available
          return {
            ...field,
            availableSlots: [
              "8h-9h30",
              "9h30-11h",
              "14h-15h30",
              "15h30-17h",
              "17h-18h30",
              "18h30-20h",
              "20h-21h30",
              "21h30-23h",
            ],
          }
        }
      })

      setFieldData(fieldsWithAvailability)
      setFilteredFields(fieldsWithAvailability)
    } catch (err) {
      console.error("Error fetching fields and availability:", err)
      setError("Không thể tải dữ liệu sân bóng. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFieldsAndAvailability(selectedDate)
    window.scrollTo(0, 0)
  }, [])

  // Lọc sân bóng dựa trên các bộ lọc
  useEffect(() => {
    if (isLoading) return

    let filtered = [...fieldData]

    // Lọc theo loại sân
    if (selectedType !== "all") {
      filtered = filtered.filter((field) => field.type === selectedType)
    }

    // Lọc theo khung giờ
    if (selectedTimeSlot !== "all") {
      filtered = filtered.filter((field) => field.availableSlots && field.availableSlots.includes(selectedTimeSlot))
    }

    setFilteredFields(filtered)
  }, [fieldData, selectedType, selectedTimeSlot, isLoading])

  // Xử lý khi chọn ngày
  const handleDateChange = (date) => {
    setSelectedDate(date)
    fetchFieldsAndAvailability(date)
  }

  // Xử lý khi chọn loại sân
  const handleTypeChange = (e) => {
    setSelectedType(e.target.value)
  }

  // Xử lý khi chọn khung giờ
  const handleTimeSlotChange = (e) => {
    setSelectedTimeSlot(e.target.value)
  }

  // Xử lý khi nhấn nút đặt sân
  const handleBookField = (field) => {
    // Tính giá dựa trên khung giờ và ngày
    let price = field.price || 300000

    // Tăng giá vào giờ cao điểm
    if (selectedTimeSlot !== "all" && (selectedTimeSlot === "17h-18h30" || selectedTimeSlot === "18h30-20h")) {
      price = price * 1.5
    }

    // Tăng giá vào cuối tuần
    const dayOfWeek = selectedDate.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      // 0 là Chủ nhật, 6 là Thứ 7
      price += 100000
    }

    // Lưu thông tin đặt sân
    setBookingInfo({
      field: field,
      date: selectedDate,
      timeSlot: selectedTimeSlot !== "all" ? selectedTimeSlot : field.availableSlots[0],
      price: price,
    })
  }

  // Xử lý khi đóng modal đặt sân
  const handleCloseBooking = () => {
    setBookingInfo(null)
  }

  // Xử lý khi tiếp tục đặt sân
  const handleContinueBooking = () => {
    // Chuyển hướng đến trang thanh toán với thông tin đặt sân
    navigate(ROUTERS.USER.PAYMENT, { state: { bookingInfo } })
  }

  return (
    <div className="order-content">
      <div className="price-section">
        <div className="container">
          <div className="heading-content">
            <div className="highlight-text">GIÁ THUÊ SÂN</div>
            <div className="sub-heading">Giá cả hợp lí với mọi đối tượng</div>
          </div>
          <div className="time-slots">
            <button className="time-slot-button">Thời gian</button>
            <button className="time-slot-button">1h30p</button>
          </div>
          <div className="price-row">
            <div className="price-box">
              <h3>Ngày thường</h3>
              <p className="time-description">Khung giờ chung</p>
              <h2>
                300,000 <span>đ /ca</span>
              </h2>
              <ul>
                <li>1 quả bóng</li>
                <li>
                  2 xô nước <span className="info-icon">ℹ</span>
                </li>
              </ul>
              <Link to={ROUTERS.USER.PAYMENT}>
                <button>Đặt ngay</button>
              </Link>
            </div>

            <div className="price-box special">
              <h3>
                Ngày thường <span className="new-tag">HOT</span>
              </h3>
              <p className="time-description">Giờ vàng 17h00 - 20h00</p>
              <h2>
                500,000 <span>đ /ca</span>
              </h2>
              <ul>
                <li>1 quả bóng</li>
                <li>
                  2 xô nước <span className="info-icon">ℹ</span>
                </li>
                <li>áo pit</li>
              </ul>
              <Link to={ROUTERS.USER.PAYMENT}>
                <button>Đặt ngay</button>
              </Link>
            </div>

            <div className="price-box">
              <h3>Cuối tuần</h3>
              <p className="time-description">Thứ 7 và chủ nhật</p>
              <h2>
                100,000 <span>đ /ca</span>
              </h2>
              <p className="extra-fee">
                <span className="info-icon">ℹ</span> Tăng thêm so với ngày thường.
              </p>
              <Link to={ROUTERS.USER.PAYMENT}>
                <button>Đặt ngay</button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="field-section">
        <div className="container">
          <div className="field-filters">
            <h2>Tìm kiếm sân bóng</h2>
            <div className="filters-row">
              <div className="filter-group">
                <label>Chọn ngày:</label>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date()}
                  className="date-picker"
                />
              </div>

              <div className="filter-group">
                <label>Loại sân:</label>
                <select value={selectedType} onChange={handleTypeChange}>
                  {fieldTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Khung giờ:</label>
                <select value={selectedTimeSlot} onChange={handleTimeSlotChange}>
                  {timeSlots.map((slot) => (
                    <option key={slot.value} value={slot.value}>
                      {slot.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="field-results">
            <h3>Kết quả tìm kiếm ({filteredFields.length} sân bóng)</h3>

            {isLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Đang tải dữ liệu...</p>
              </div>
            ) : error ? (
              <div className="error-message">
                <p>{error}</p>
                <button className="retry-button" onClick={() => fetchFieldsAndAvailability(selectedDate)}>
                  Thử lại
                </button>
              </div>
            ) : filteredFields.length === 0 ? (
              <div className="no-fields">
                <p>Không tìm thấy sân bóng phù hợp với tiêu chí tìm kiếm.</p>
              </div>
            ) : (
              <div className="field-row">
                {filteredFields.map((field) => (
                  <div className="field-box" key={field._id}>
                    <img src={getImageUrl(field.src) || getImageUrl(field.imageUrl)} alt={field.name} />
                    <h4>{field.name}</h4>
                    <p>Loại sân: {field.type || "7v7"}</p>
                    <p>Thời gian: 90 phút</p>
                    <p>Địa điểm: {field.location}</p>
                    <div className="contact">
                      <span>Quản lý</span>
                      <span>{field.manager}</span>
                    </div>
                    <button
                      className="book-now-button"
                      onClick={() => handleBookField(field)}
                      disabled={
                        selectedTimeSlot !== "all" &&
                        (!field.availableSlots || !field.availableSlots.includes(selectedTimeSlot))
                      }
                    >
                      Đặt sân ngay
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {bookingInfo && (
        <div className="booking-modal">
          <div className="booking-content">
            <button className="close-button" onClick={handleCloseBooking}>
              ×
            </button>
            <h2>Xác nhận đặt sân</h2>

            <div className="booking-details">
              <div className="booking-field-image">
                <img
                  src={getImageUrl(bookingInfo.field.src) || getImageUrl(bookingInfo.field.imageUrl)}
                  alt={bookingInfo.field.name}
                />
              </div>

              <div className="booking-info">
                <h3>{bookingInfo.field.name}</h3>
                <p>
                  <strong>Loại sân:</strong> {bookingInfo.field.type}
                </p>
                <p>
                  <strong>Ngày đặt:</strong> {formatDate(bookingInfo.date)}
                </p>
                <p>
                  <strong>Khung giờ:</strong> {bookingInfo.timeSlot}
                </p>
                <p>
                  <strong>Địa điểm:</strong> {bookingInfo.field.location}
                </p>
                <p className="booking-price">
                  <strong>Giá tiền:</strong> {formater(bookingInfo.price)}
                </p>
              </div>
            </div>

            <div className="booking-actions">
              <button className="cancel-button" onClick={handleCloseBooking}>
                Hủy
              </button>
              <button className="confirm-button" onClick={handleContinueBooking}>
                Tiếp tục đặt sân
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(Order)
