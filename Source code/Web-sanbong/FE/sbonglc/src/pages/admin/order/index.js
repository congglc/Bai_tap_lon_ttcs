"use client"

import { memo, useState, useEffect } from "react"
import "./style.scss"
import AdminSidebar from "../components/Sidebar"
import { FaEye, FaCheck, FaTimes } from "react-icons/fa"
import { formater } from "utils/formater"
import { bookingAPI, fieldStatusAPI } from "../../../services/api"
import { formatDate, formatDateTime, formatDateForAPI } from "../../../utils/formatDate"

const Button = ({ children, variant = "primary", type = "button", onClick, disabled = false }) => {
  return (
    <button
      type={type}
      className={`admin-button ${variant} ${disabled ? "disabled" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

const OrderManagement = () => {
  const [bookings, setBookings] = useState([])
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [filter, setFilter] = useState("all") // all, pending, confirmed, cancelled
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 10,
    total: 0,
  })

  // Fetch bookings from API
  const fetchBookings = async (page = 1, status = null) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await bookingAPI.getBookings(page, pagination.limit, status !== "all" ? status : null)
      setBookings(response.data.data.bookings)
      setPagination(response.data.data.pagination)
    } catch (err) {
      console.error("Error fetching bookings:", err)
      setError("Không thể tải danh sách đơn đặt sân. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings(1, filter)
  }, [filter])

  // Xử lý khi xem chi tiết đơn đặt sân
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

  // Xử lý khi xác nhận đơn đặt sân
  const handleConfirmBooking = async (id) => {
    try {
      await bookingAPI.confirmBooking(id)

      // Refresh booking list
      fetchBookings(pagination.currentPage, filter)

      // Update selected booking if it's the one being confirmed
      if (selectedBooking && selectedBooking._id === id) {
        const response = await bookingAPI.getBookingById(id)
        setSelectedBooking(response.data.data.booking)
      }

      alert("Đã xác nhận đơn đặt sân thành công!")
    } catch (err) {
      console.error("Error confirming booking:", err)
      alert("Không thể xác nhận đơn đặt sân. Vui lòng thử lại sau.")
    }
  }

  // Xử lý khi hủy đơn đặt sân
  const handleCancelBooking = async (id, reason = "Không đáp ứng yêu cầu") => {
    try {
      await bookingAPI.cancelBooking(id, reason)

      // Refresh booking list
      fetchBookings(pagination.currentPage, filter)

      // Update selected booking if it's the one being cancelled
      if (selectedBooking && selectedBooking._id === id) {
        const response = await bookingAPI.getBookingById(id)
        setSelectedBooking(response.data.data.booking)
      }

      // Cập nhật trạng thái sân (đánh dấu là còn trống)
      const booking = bookings.find((b) => b._id === id)
      if (booking) {
        updateFieldStatus(booking.fieldId, booking.date, booking.time, "available")
      }

      alert("Đã hủy đơn đặt sân thành công!")
    } catch (err) {
      console.error("Error cancelling booking:", err)
      alert("Không thể hủy đơn đặt sân. Vui lòng thử lại sau.")
    }
  }

  // Cập nhật trạng thái sân trong API
  const updateFieldStatus = async (fieldId, date, timeSlot, status) => {
    try {
      const formattedDate = formatDateForAPI(new Date(date))

      // Lấy trạng thái hiện tại của sân
      const response = await fieldStatusAPI.getFieldStatusByFieldAndDate(fieldId, formattedDate)
      const fieldStatus = response.data.data.fieldStatus

      if (fieldStatus) {
        // Tìm slot ID cần cập nhật
        const slot = fieldStatus.timeSlots.find((slot) => slot.time === timeSlot)

        if (slot) {
          // Cập nhật trạng thái của slot
          await fieldStatusAPI.updateTimeSlotStatus(fieldId, formattedDate, slot._id, {
            status: status,
          })
        }
      }
    } catch (err) {
      console.error("Error updating field status:", err)
    }
  }

  // Xử lý khi đóng modal chi tiết
  const handleCloseDetail = () => {
    setSelectedBooking(null)
  }

  // Xử lý khi thay đổi trang
  const handlePageChange = (page) => {
    fetchBookings(page, filter)
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
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1>Quản lý đơn đặt sân</h1>
          <div className="filter-buttons">
            <button className={`filter-button ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
              Tất cả
            </button>
            <button
              className={`filter-button ${filter === "pending" ? "active" : ""}`}
              onClick={() => setFilter("pending")}
            >
              Chờ xác nhận
            </button>
            <button
              className={`filter-button ${filter === "confirmed" ? "active" : ""}`}
              onClick={() => setFilter("confirmed")}
            >
              Đã xác nhận
            </button>
            <button
              className={`filter-button ${filter === "cancelled" ? "active" : ""}`}
              onClick={() => setFilter("cancelled")}
            >
              Đã hủy
            </button>
          </div>
        </div>

        {isLoading && !selectedBooking ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <Button variant="primary" onClick={() => fetchBookings(1, filter)}>
              Thử lại
            </Button>
          </div>
        ) : (
          <div className="bookings-container">
            {bookings.length === 0 ? (
              <div className="no-bookings">
                <p>Không có đơn đặt sân nào {filter !== "all" ? `với trạng thái "${getStatusText(filter)}"` : ""}</p>
              </div>
            ) : (
              <>
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tên đội</th>
                      <th>Sân</th>
                      <th>Ngày đặt</th>
                      <th>Khung giờ</th>
                      <th>Giá tiền</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking._id}>
                        <td>#{booking._id.slice(-4)}</td>
                        <td>{booking.teamName}</td>
                        <td>{booking.fieldName}</td>
                        <td>{formatDate(booking.date)}</td>
                        <td>{booking.time}</td>
                        <td>{formater(booking.price)}</td>
                        <td>
                          <span className={`status-badge ${getStatusClass(booking.status)}`}>
                            {getStatusText(booking.status)}
                          </span>
                        </td>
                        <td className="action-buttons">
                          <button
                            className="view-button"
                            onClick={() => handleViewBooking(booking._id)}
                            title="Xem chi tiết"
                          >
                            <FaEye />
                          </button>

                          {booking.status === "pending" && (
                            <>
                              <button
                                className="confirm-button"
                                onClick={() => handleConfirmBooking(booking._id)}
                                title="Xác nhận đơn"
                              >
                                <FaCheck />
                              </button>
                              <button
                                className="cancel-button"
                                onClick={() => {
                                  const reason = window.prompt("Nhập lý do hủy đơn:")
                                  if (reason) handleCancelBooking(booking._id, reason)
                                }}
                                title="Hủy đơn"
                              >
                                <FaTimes />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {pagination.totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="pagination-button"
                      disabled={pagination.currentPage === 1}
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                    >
                      &laquo; Trước
                    </button>

                    {[...Array(pagination.totalPages)].map((_, index) => (
                      <button
                        key={index}
                        className={`pagination-button ${pagination.currentPage === index + 1 ? "active" : ""}`}
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      className="pagination-button"
                      disabled={pagination.currentPage === pagination.totalPages}
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                    >
                      Sau &raquo;
                    </button>
                  </div>
                )}
              </>
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

                {selectedBooking.status === "pending" && (
                  <div className="action-buttons">
                    <Button
                      variant="danger"
                      onClick={() => {
                        const reason = window.prompt("Nhập lý do hủy đơn:")
                        if (reason) {
                          handleCancelBooking(selectedBooking._id, reason)
                        }
                      }}
                    >
                      Hủy đơn
                    </Button>
                    <Button variant="primary" onClick={() => handleConfirmBooking(selectedBooking._id)}>
                      Xác nhận đơn
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(OrderManagement)
