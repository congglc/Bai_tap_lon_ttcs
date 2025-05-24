"use client"

import { memo, useState, useEffect } from "react"
import "./style.scss"
import { useNavigate } from "react-router-dom"
import { MdOutlineDisabledByDefault } from "react-icons/md"
import { formater } from "utils/formater"
import { bookingAPI } from "../../../services/api"
import { formatDate, formatDateTime } from "../../../utils/formatDate"

const MyBookings = () => {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [userInfo, setUserInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedBooking, setSelectedBooking] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)

    // Check if user is logged in
    const storedUserInfo = localStorage.getItem("userInfo")
    if (!storedUserInfo) {
      navigate("/dang-nhap")
      return
    }

    const userInfoObj = JSON.parse(storedUserInfo)
    setUserInfo(userInfoObj)

    // Fetch user's bookings
    fetchUserBookings(userInfoObj)
  }, [navigate])

  // Fetch user's bookings by email or phone
  const fetchUserBookings = async (user) => {
    try {
      setIsLoading(true)
      setError(null)

      // Use email or phone to find bookings
      const response = await bookingAPI.getBookingsByEmailOrPhone(user.email, user.phone)

      // Sort bookings by creation date, newest first
      const sortedBookings = response.data.data.bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

      setBookings(sortedBookings)
    } catch (err) {
      console.error("Error fetching user bookings:", err)
      setError("Không thể tải danh sách đơn đặt sân. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleExitClick = () => {
    navigate(-1) // Go back to previous page
  }

  const handleViewBooking = async (bookingId) => {
    try {
      setIsLoading(true)
      const response = await bookingAPI.getBookingById(bookingId)
      setSelectedBooking(response.data.data.booking)
    } catch (err) {
      console.error("Error fetching booking details:", err)
      alert("Không thể tải chi tiết đơn đặt sân. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseDetail = () => {
    setSelectedBooking(null)
  }

  // Get CSS class for status
  const getStatusClass = (status) => {
    switch (status) {
      case "confirmed":
        return "status-confirmed"
      case "pending":
        return "status-pending"
      case "cancelled":
        return "status-cancelled"
      default:
        return ""
    }
  }

  // Get text for status
  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận"
      case "pending":
        return "Chờ xác nhận"
      case "cancelled":
        return "Đã hủy"
      default:
        return status
    }
  }

  return (
    <div className="my-bookings-container">
      <div className="my-bookings-header">
        <h1>Đơn đặt sân của tôi</h1>
        <button className="exit-button" onClick={handleExitClick}>
          <MdOutlineDisabledByDefault />
        </button>
      </div>

      {isLoading && !selectedBooking ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button className="retry-button" onClick={() => fetchUserBookings(userInfo)}>
            Thử lại
          </button>
        </div>
      ) : (
        <div className="bookings-content">
          {bookings.length === 0 ? (
            <div className="no-bookings">
              <p>Bạn chưa có đơn đặt sân nào.</p>
              <button className="book-now-button" onClick={() => navigate("/dat-san")}>
                Đặt sân ngay
              </button>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.map((booking) => (
                <div className="booking-card" key={booking._id}>
                  <div className="booking-header">
                    <h3>{booking.fieldName}</h3>
                    <span className={`status-badge ${getStatusClass(booking.status)}`}>
                      {getStatusText(booking.status)}
                    </span>
                  </div>
                  <div className="booking-details">
                    <p>
                      <strong>Ngày đặt:</strong> {formatDate(booking.date)}
                    </p>
                    <p>
                      <strong>Khung giờ:</strong> {booking.time}
                    </p>
                    <p>
                      <strong>Giá tiền:</strong> {formater(booking.price)}
                    </p>
                    <p>
                      <strong>Thời gian tạo đơn:</strong> {formatDateTime(booking.createdAt)}
                    </p>
                  </div>
                  <div className="booking-actions">
                    <button className="view-details-button" onClick={() => handleViewBooking(booking._id)}>
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedBooking && (
        <div className="booking-detail-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Chi tiết đơn đặt sân #{selectedBooking._id.slice(-4)}</h3>
              <button className="close-button" onClick={handleCloseDetail}>
                ×
              </button>
            </div>

            <div className="booking-detail">
              <div className="detail-section">
                <h4>Thông tin đội bóng</h4>
                <p>
                  <strong>Tên đội:</strong> {selectedBooking.teamName}
                </p>
                <p>
                  <strong>Đội trưởng:</strong> {selectedBooking.teamLeaderName}
                </p>
                <p>
                  <strong>Liên hệ:</strong> {selectedBooking.contact}
                </p>
              </div>

              <div className="detail-section">
                <h4>Thông tin đặt sân</h4>
                <p>
                  <strong>Sân:</strong> {selectedBooking.fieldName}
                </p>
                <p>
                  <strong>Ngày đặt:</strong> {formatDate(selectedBooking.date)}
                </p>
                <p>
                  <strong>Khung giờ:</strong> {selectedBooking.time}
                </p>
                <p>
                  <strong>Giá tiền:</strong> {formater(selectedBooking.price)}
                </p>
                <p>
                  <strong>Ghi chú:</strong> {selectedBooking.notes || "Không có"}
                </p>
              </div>

              <div className="detail-section">
                <h4>Trạng thái đơn</h4>
                <p>
                  <strong>Trạng thái:</strong>
                  <span className={`status-badge ${getStatusClass(selectedBooking.status)}`}>
                    {getStatusText(selectedBooking.status)}
                  </span>
                </p>
                <p>
                  <strong>Thời gian tạo đơn:</strong> {formatDateTime(selectedBooking.createdAt)}
                </p>

                {selectedBooking.status === "confirmed" && (
                  <p>
                    <strong>Thời gian xác nhận:</strong> {formatDateTime(selectedBooking.confirmedAt)}
                  </p>
                )}

                {selectedBooking.status === "cancelled" && (
                  <>
                    <p>
                      <strong>Thời gian hủy:</strong> {formatDateTime(selectedBooking.cancelledAt)}
                    </p>
                    <p>
                      <strong>Lý do hủy:</strong> {selectedBooking.cancelReason || "Không có"}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(MyBookings)
