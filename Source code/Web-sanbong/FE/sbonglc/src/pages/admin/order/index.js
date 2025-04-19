"use client"

import { memo, useState, useEffect } from "react"
import "./style.scss"
import AdminSidebar from "../components/Sidebar"
import { FaEye, FaCheck, FaTimes } from "react-icons/fa"
import { formater } from "utils/formater"

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

  // Lấy dữ liệu đặt sân từ localStorage
  useEffect(() => {
    setIsLoading(true)

    // Lấy dữ liệu từ localStorage
    let storedBookings = JSON.parse(localStorage.getItem("bookings") || "[]")

    // Nếu không có dữ liệu, tạo dữ liệu mẫu
    if (storedBookings.length === 0) {
      const sampleBookings = [
        {
          id: 1001,
          teamName: "FC Hà Nội",
          teamLeaderName: "Nguyễn Văn A",
          contact: "0987654321",
          fieldId: 1,
          fieldName: "Sân số 1",
          date: new Date().toISOString(),
          time: "17h-18h30",
          price: 500000,
          notes: "Cần chuẩn bị thêm nước uống",
          status: "confirmed",
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 ngày trước
          confirmedAt: new Date(Date.now() - 43200000).toISOString(), // 12 giờ trước
        },
        {
          id: 1002,
          teamName: "FC Thăng Long",
          teamLeaderName: "Trần Văn B",
          contact: "0912345678",
          fieldId: 2,
          fieldName: "Sân số 2",
          date: new Date(Date.now() + 86400000).toISOString(), // 1 ngày sau
          time: "18h30-20h",
          price: 600000,
          notes: "",
          status: "pending",
          createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 giờ trước
        },
        {
          id: 1003,
          teamName: "FC Cầu Giấy",
          teamLeaderName: "Lê Văn C",
          contact: "0978123456",
          fieldId: 3,
          fieldName: "Sân số 3",
          date: new Date(Date.now() - 172800000).toISOString(), // 2 ngày trước
          time: "14h-15h30",
          price: 300000,
          notes: "Đặt sân cho buổi tập đội trẻ",
          status: "cancelled",
          createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 ngày trước
          cancelledAt: new Date(Date.now() - 172800000).toISOString(), // 2 ngày trước
          cancelReason: "Thời tiết xấu",
        },
        {
          id: 1004,
          teamName: "FC Đống Đa",
          teamLeaderName: "Phạm Văn D",
          contact: "0965432109",
          fieldId: 1,
          fieldName: "Sân số 1",
          date: new Date(Date.now() + 172800000).toISOString(), // 2 ngày sau
          time: "20h-21h30",
          price: 300000,
          notes: "",
          status: "pending",
          createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 giờ trước
        },
        {
          id: 1005,
          teamName: "FC Thanh Xuân",
          teamLeaderName: "Hoàng Văn E",
          contact: "0932109876",
          fieldId: 2,
          fieldName: "Sân số 2",
          date: new Date(Date.now() + 259200000).toISOString(), // 3 ngày sau
          time: "17h-18h30",
          price: 600000,
          notes: "Đặt sân cho trận giao hữu",
          status: "confirmed",
          createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 ngày trước
          confirmedAt: new Date(Date.now() - 172800000).toISOString(), // 2 ngày trước
        },
      ]

      storedBookings = sampleBookings
      localStorage.setItem("bookings", JSON.stringify(sampleBookings))
    }

    // Sắp xếp theo thời gian tạo, mới nhất lên đầu
    storedBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    setBookings(storedBookings)
    setIsLoading(false)
  }, [])

  // Lọc đơn đặt sân theo trạng thái
  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true
    return booking.status === filter
  })

  // Xử lý khi xem chi tiết đơn đặt sân
  const handleViewBooking = (booking) => {
    setSelectedBooking(booking)
  }

  // Xử lý khi xác nhận đơn đặt sân
  const handleConfirmBooking = (id) => {
    const updatedBookings = bookings.map((booking) => {
      if (booking.id === id) {
        return {
          ...booking,
          status: "confirmed",
          confirmedAt: new Date().toISOString(),
        }
      }
      return booking
    })

    setBookings(updatedBookings)
    localStorage.setItem("bookings", JSON.stringify(updatedBookings))

    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking({
        ...selectedBooking,
        status: "confirmed",
        confirmedAt: new Date().toISOString(),
      })
    }

    alert("Đã xác nhận đơn đặt sân thành công!")
  }

  // Xử lý khi hủy đơn đặt sân
  const handleCancelBooking = (id, reason = "Không đáp ứng yêu cầu") => {
    const updatedBookings = bookings.map((booking) => {
      if (booking.id === id) {
        return {
          ...booking,
          status: "cancelled",
          cancelledAt: new Date().toISOString(),
          cancelReason: reason,
        }
      }
      return booking
    })

    setBookings(updatedBookings)
    localStorage.setItem("bookings", JSON.stringify(updatedBookings))

    // Cập nhật trạng thái sân (đánh dấu là còn trống)
    const booking = bookings.find((b) => b.id === id)
    if (booking) {
      updateFieldStatus(booking.fieldId, booking.time, "available")
    }

    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking({
        ...selectedBooking,
        status: "cancelled",
        cancelledAt: new Date().toISOString(),
        cancelReason: reason,
      })
    }

    alert("Đã hủy đơn đặt sân thành công!")
  }

  // Cập nhật trạng thái sân trong localStorage
  const updateFieldStatus = (fieldId, timeSlot, status) => {
    // Lấy ngày từ booking
    const booking = bookings.find((b) => b.fieldId === fieldId && b.time === timeSlot)
    if (!booking) return

    const bookingDate = new Date(booking.date)
    const dateKey = formatDateKey(bookingDate)
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

  // Tạo khóa ngày để lưu vào localStorage
  const formatDateKey = (date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  }

  // Xử lý khi đóng modal chi tiết
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

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="bookings-container">
            {filteredBookings.length === 0 ? (
              <div className="no-bookings">
                <p>Không có đơn đặt sân nào {filter !== "all" ? `với trạng thái "${getStatusText(filter)}"` : ""}</p>
              </div>
            ) : (
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
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>#{booking.id.toString().slice(-4)}</td>
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
                        <button className="view-button" onClick={() => handleViewBooking(booking)} title="Xem chi tiết">
                          <FaEye />
                        </button>

                        {booking.status === "pending" && (
                          <>
                            <button
                              className="confirm-button"
                              onClick={() => handleConfirmBooking(booking.id)}
                              title="Xác nhận đơn"
                            >
                              <FaCheck />
                            </button>
                            <button
                              className="cancel-button"
                              onClick={() => {
                                const reason = window.prompt("Nhập lý do hủy đơn:")
                                if (reason) handleCancelBooking(booking.id, reason)
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

                {selectedBooking.status === "pending" && (
                  <div className="action-buttons">
                    <Button
                      variant="danger"
                      onClick={() => {
                        const reason = window.prompt("Nhập lý do hủy đơn:")
                        if (reason) {
                          handleCancelBooking(selectedBooking.id, reason)
                        }
                      }}
                    >
                      Hủy đơn
                    </Button>
                    <Button variant="primary" onClick={() => handleConfirmBooking(selectedBooking.id)}>
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

