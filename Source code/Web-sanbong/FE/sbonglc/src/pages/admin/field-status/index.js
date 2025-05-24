"use client"

import { memo, useState, useEffect } from "react"
import "./style.scss"
import AdminSidebar from "../components/Sidebar"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa"
import { formater } from "utils/formater"
import { fieldAPI, fieldStatusAPI } from "../../../services/api"
import { formatDateForAPI } from "../../../utils/formatDate"

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
  const [error, setError] = useState(null)

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

  // Fetch fields and their status
  const fetchFieldsAndStatus = async (date) => {
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

      // Combine field data with status data
      const fieldsWithStatus = allFields.map((field) => {
        const fieldStatus = fieldStatuses.find((status) => status.fieldId === field._id)

        if (fieldStatus) {
          return {
            ...field,
            timeSlots: fieldStatus.timeSlots,
          }
        } else {
          // If no status found, create default time slots
          return {
            ...field,
            timeSlots: generateDefaultTimeSlots(field._id),
          }
        }
      })

      setFields(fieldsWithStatus)
    } catch (err) {
      console.error("Error fetching fields and status:", err)
      setError("Không thể tải dữ liệu sân bóng. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFieldsAndStatus(selectedDate)
  }, [selectedDate])

  // Tạo dữ liệu trạng thái mặc định cho các khung giờ
  const generateDefaultTimeSlots = (fieldId) => {
    return defaultTimeSlots.map((time, index) => {
      // Tạo trạng thái mặc định là available
      const basePrice = time.includes("17h") || time.includes("18h") ? 500000 : 300000

      return {
        id: `${fieldId}_${index}`,
        time,
        status: "available",
        price: basePrice,
        bookedBy: "",
        note: "",
      }
    })
  }

  const handleDateChange = (date) => {
    setSelectedDate(date)
  }

  const handleEditSlot = (fieldId, slotId) => {
    const field = fields.find((f) => f._id === fieldId)
    const slot = field.timeSlots.find((s) => s._id === slotId || s.id === slotId)
    setEditingSlot({ ...slot, fieldId })
  }

  const handleUpdateSlot = async () => {
    if (!editingSlot) return

    try {
      const formattedDate = formatDateForAPI(selectedDate)

      // Update the time slot status
      const updateSlotId = editingSlot._id || editingSlot.id; // Use _id if available, otherwise id

      const payload = {
        status: editingSlot.status,
        bookedBy: editingSlot.status === 'booked' ? editingSlot.bookedBy : null,
        note: editingSlot.status === 'maintenance' ? editingSlot.note : null,
        price: editingSlot.price,
      };

      console.log("Payload sent:", payload);

      await fieldStatusAPI.updateTimeSlotStatus(editingSlot.fieldId, formattedDate, updateSlotId, payload)

      // Refresh field status data
      fetchFieldsAndStatus(selectedDate)
      setEditingSlot(null)

      alert("Cập nhật trạng thái sân thành công!")
    } catch (err) {
      console.error("Error updating time slot:", err)
      alert("Không thể cập nhật trạng thái sân. Vui lòng thử lại sau.")
    }
  }

  const handleCancelEdit = () => {
    setEditingSlot(null)
  }

  const handleChangeSlotStatus = async (fieldId, slotId, newStatus) => {
    try {
      const formattedDate = formatDateForAPI(selectedDate)

      // Find the actual slot object to get its _id or id
      const field = fields.find(f => f._id === fieldId);
      const slot = field?.timeSlots.find(s => s._id === slotId || s.id === slotId);

      if (!slot) {
        throw new Error("Không tìm thấy khung giờ để cập nhật.");
      }

      const updateSlotId = slot._id || slot.id; // Use _id if available, otherwise id

      // Update the time slot status
      await fieldStatusAPI.updateTimeSlotStatus(fieldId, formattedDate, updateSlotId, {
        status: newStatus,
        note: newStatus === "maintenance" ? "Bảo trì sân" : "",
      })

      // Refresh field status data
      fetchFieldsAndStatus(selectedDate)

      alert("Cập nhật trạng thái sân thành công!")
    } catch (err) {
      console.error("Error changing slot status:", err)
      alert("Không thể cập nhật trạng thái sân. Vui lòng thử lại sau.")
    }
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
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <Button variant="primary" onClick={() => fetchFieldsAndStatus(selectedDate)}>
              Thử lại
            </Button>
          </div>
        ) : (
          <div className="field-status-container">
            {fields.map((field) => (
              <div key={field._id} className="field-card">
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
                            <button className="edit-button" onClick={() => handleEditSlot(field._id, slot.id)}>
                              <FaEdit />
                            </button>
                            {slot.status !== "available" && (
                              <button
                                className="available-button"
                                onClick={() => handleChangeSlotStatus(field._id, slot.id, "available")}
                                title="Đánh dấu là còn trống"
                              >
                                <FaCheck />
                              </button>
                            )}
                            {slot.status !== "maintenance" && (
                              <button
                                className="maintenance-button"
                                onClick={() => handleChangeSlotStatus(field._id, slot.id, "maintenance")}
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
