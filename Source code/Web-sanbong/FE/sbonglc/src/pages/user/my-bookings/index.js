"use client"

import { memo, useState, useEffect } from "react"
import "./style.scss"
import { useNavigate } from "react-router-dom"
import { MdOutlineDisabledByDefault } from "react-icons/md"
import { formater } from "utils/formater"

const MyBookings = () => {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [userInfo, setUserInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)

    // Kiểm tra đăng nhập
    const storedUserInfo = localStorage.getItem("userInfo")
    if (!storedUserInfo) {
      navigate("/dang-nhap")
      return
    }

    setUserInfo(JSON.parse(storedUserInfo))

    // Lấy danh sách đơn đặt sân từ localStorage
    setIsLoading(true)
    const allBookings = JSON.parse(localStorage.getItem("bookings") || "[]")

    // Lọc đơn đặt sân của người dùng hiện tại (dựa vào số điện thoại)
    const userPhone = JSON.parse(storedUserInfo).phone
    const userBookings = allBookings.filter((booking) => booking.contact === userPhone)

    // Sắp xếp theo thời gian tạo, mới nhất lên đầu
    userBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    setBookings(userBookings)
    setIsLoading(false)
  }, [navigate])

  const handleExitClick = () => {
    navigate(-1) // Quay lại trang trước
  }

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking)
  }

  const handleCloseDetail = () => {
    setSelectedBooking(null)
  }

  // Format ngày giờ
  const formatDateTime = (dateString) => {
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

  // Format ngày
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Lấy class CSS cho trạng thái
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

  // Lấy text cho trạng thái
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

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải dữ liệu...</p>
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
                <div className="booking-card" key={booking.id}>
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
                    <button className="view-details-button" onClick={() => handleViewBooking(booking)}>
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
              <h3>Chi tiết đơn đặt sân #{selectedBooking.id.toString().slice(-4)}</h3>
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

