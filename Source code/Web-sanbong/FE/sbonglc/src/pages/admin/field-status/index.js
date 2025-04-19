"use client"

import { memo, useState, useEffect } from "react"
import "./style.scss"
import AdminSidebar from "../components/Sidebar"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa"
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

const FieldStatus = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [fields, setFields] = useState([])
  const [editingSlot, setEditingSlot] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Khung giờ mặc định
  const defaultTimeSlots = [
    "8h-9h30",
    "9h30-11h",
    "14h-15h30",
    "15h30-17h",
    "17h-18h30",
    "18h30-20h",
    "20h-21h30",
    "21h30-23h",
  ]

  // Lấy dữ liệu sân bóng từ localStorage và tạo dữ liệu trạng thái sân
  useEffect(() => {
    setIsLoading(true)

    // Lấy danh sách sân từ localStorage
    const storedFields = JSON.parse(localStorage.getItem("fields") || "[]")

    // Tạo dữ liệu mẫu cho các sân mặc định
    const defaultFields = [
      {
        id: 1,
        name: "Sân số 1",
        type: "5v5",
      },
      {
        id: 2,
        name: "Sân số 2",
        type: "7v7",
      },
      {
        id: 3,
        name: "Sân số 3",
        type: "5v5",
      },
    ]

    // Kết hợp sân mặc định với sân từ localStorage
    let combinedFields = [...defaultFields]

    // Thêm các sân từ localStorage mà không trùng ID với sân mặc định
    storedFields.forEach((field) => {
      if (!combinedFields.some((f) => f.id === field.id)) {
        combinedFields.push({
          id: field.id,
          name: field.name || field.title,
          type: field.type || "7v7",
        })
      }
    })

    // Lấy dữ liệu trạng thái sân từ localStorage hoặc tạo mới nếu chưa có
    const dateKey = formatDateKey(selectedDate)
    const storedStatus = JSON.parse(localStorage.getItem(`fieldStatus_${dateKey}`) || "null")

    if (storedStatus) {
      // Cập nhật dữ liệu sân với trạng thái đã lưu
      combinedFields = combinedFields.map((field) => {
        const fieldStatus = storedStatus.find((s) => s.fieldId === field.id)
        if (fieldStatus) {
          return {
            ...field,
            timeSlots: fieldStatus.timeSlots,
          }
        } else {
          // Nếu không có dữ liệu trạng thái cho sân này, tạo mới
          return {
            ...field,
            timeSlots: generateDefaultTimeSlots(field.id),
          }
        }
      })
    } else {
      // Tạo dữ liệu trạng thái mặc định cho tất cả các sân
      combinedFields = combinedFields.map((field) => ({
        ...field,
        timeSlots: generateDefaultTimeSlots(field.id),
      }))
    }

    setFields(combinedFields)
    setIsLoading(false)
  }, [selectedDate])

  // Tạo khóa ngày để lưu vào localStorage
  const formatDateKey = (date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  }

  // Tạo dữ liệu trạng thái mặc định cho các khung giờ
  const generateDefaultTimeSlots = (fieldId) => {
    return defaultTimeSlots.map((time, index) => {
      // Tạo trạng thái ngẫu nhiên cho dữ liệu mẫu
      const randomStatus = Math.random() > 0.6 ? "available" : Math.random() > 0.5 ? "booked" : "available"
      const basePrice = time.includes("17h") || time.includes("18h") ? 500000 : 300000

      return {
        id: fieldId * 100 + index,
        time,
        status: randomStatus,
        price: basePrice,
        bookedBy: randomStatus === "booked" ? `Đội FC ${Math.floor(Math.random() * 10) + 1}` : "",
        note: "",
      }
    })
  }

  const handleDateChange = (date) => {
    setSelectedDate(date)
  }

  const handleEditSlot = (fieldId, slotId) => {
    const field = fields.find((f) => f.id === fieldId)
    const slot = field.timeSlots.find((s) => s.id === slotId)
    setEditingSlot({ ...slot, fieldId })
  }

  const handleUpdateSlot = () => {
    if (!editingSlot) return

    const updatedFields = fields.map((field) => {
      if (field.id === editingSlot.fieldId) {
        return {
          ...field,
          timeSlots: field.timeSlots.map((slot) => (slot.id === editingSlot.id ? { ...slot, ...editingSlot } : slot)),
        }
      }
      return field
    })

    setFields(updatedFields)

    // Lưu trạng thái sân vào localStorage
    saveFieldStatus(updatedFields)

    setEditingSlot(null)
  }

  const handleCancelEdit = () => {
    setEditingSlot(null)
  }

  const handleChangeSlotStatus = (fieldId, slotId, newStatus) => {
    const updatedFields = fields.map((field) => {
      if (field.id === fieldId) {
        return {
          ...field,
          timeSlots: field.timeSlots.map((slot) => {
            if (slot.id === slotId) {
              return {
                ...slot,
                status: newStatus,
                // Nếu trạng thái là bảo trì, thêm ghi chú mặc định
                note: newStatus === "maintenance" ? "Bảo trì sân" : slot.note,
              }
            }
            return slot
          }),
        }
      }
      return field
    })

    setFields(updatedFields)

    // Lưu trạng thái sân vào localStorage
    saveFieldStatus(updatedFields)
  }

  // Lưu trạng thái sân vào localStorage
  const saveFieldStatus = (updatedFields) => {
    const dateKey = formatDateKey(selectedDate)

    // Chuyển đổi dữ liệu để lưu trữ
    const statusData = updatedFields.map((field) => ({
      fieldId: field.id,
      timeSlots: field.timeSlots,
    }))

    localStorage.setItem(`fieldStatus_${dateKey}`, JSON.stringify(statusData))
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "available":
        return "status-available"
      case "booked":
        return "status-booked"
      case "maintenance":
        return "status-maintenance"
      default:
        return ""
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "available":
        return "Còn trống"
      case "booked":
        return "Đã đặt"
      case "maintenance":
        return "Bảo trì"
      default:
        return status
    }
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1>Quản lý trạng thái sân bóng</h1>
          <div className="date-picker-container">
            <label>Chọn ngày: </label>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              className="date-picker"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="field-status-container">
            {fields.map((field) => (
              <div key={field.id} className="field-card">
                <div className="field-header">
                  <h2>{field.name}</h2>
                  <span className="field-type">Loại: {field.type}</span>
                </div>

                <div className="time-slots">
                  <table className="time-slot-table">
                    <thead>
                      <tr>
                        <th>Khung giờ</th>
                        <th>Trạng thái</th>
                        <th>Giá</th>
                        <th>Thông tin</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {field.timeSlots.map((slot) => (
                        <tr key={slot.id}>
                          <td>{slot.time}</td>
                          <td>
                            <span className={`status-badge ${getStatusClass(slot.status)}`}>
                              {getStatusText(slot.status)}
                            </span>
                          </td>
                          <td>{formater(slot.price)}</td>
                          <td>
                            {slot.status === "booked" && slot.bookedBy}
                            {slot.status === "maintenance" && slot.note}
                          </td>
                          <td className="action-buttons">
                            <button className="edit-button" onClick={() => handleEditSlot(field.id, slot.id)}>
                              <FaEdit />
                            </button>
                            {slot.status !== "available" && (
                              <button
                                className="available-button"
                                onClick={() => handleChangeSlotStatus(field.id, slot.id, "available")}
                                title="Đánh dấu là còn trống"
                              >
                                <FaCheck />
                              </button>
                            )}
                            {slot.status !== "maintenance" && (
                              <button
                                className="maintenance-button"
                                onClick={() => handleChangeSlotStatus(field.id, slot.id, "maintenance")}
                                title="Đánh dấu là bảo trì"
                              >
                                <FaTimes />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {editingSlot && (
          <div className="edit-slot-modal">
            <div className="modal-content">
              <h3>Chỉnh sửa khung giờ</h3>

              <div className="form-group">
                <label>Khung giờ</label>
                <input type="text" value={editingSlot.time} readOnly />
              </div>

              <div className="form-group">
                <label>Trạng thái</label>
                <select
                  value={editingSlot.status}
                  onChange={(e) => setEditingSlot({ ...editingSlot, status: e.target.value })}
                >
                  <option value="available">Còn trống</option>
                  <option value="booked">Đã đặt</option>
                  <option value="maintenance">Bảo trì</option>
                </select>
              </div>

              <div className="form-group">
                <label>Giá</label>
                <input
                  type="number"
                  value={editingSlot.price}
                  onChange={(e) => setEditingSlot({ ...editingSlot, price: Number.parseInt(e.target.value) })}
                />
              </div>

              {editingSlot.status === "booked" && (
                <div className="form-group">
                  <label>Đội đặt sân</label>
                  <input
                    type="text"
                    value={editingSlot.bookedBy || ""}
                    onChange={(e) => setEditingSlot({ ...editingSlot, bookedBy: e.target.value })}
                  />
                </div>
              )}

              {editingSlot.status === "maintenance" && (
                <div className="form-group">
                  <label>Ghi chú</label>
                  <input
                    type="text"
                    value={editingSlot.note || ""}
                    onChange={(e) => setEditingSlot({ ...editingSlot, note: e.target.value })}
                  />
                </div>
              )}

              <div className="modal-actions">
                <Button variant="secondary" onClick={handleCancelEdit}>
                  Hủy
                </Button>
                <Button variant="primary" onClick={handleUpdateSlot}>
                  Cập nhật
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(FieldStatus)

