"use client"

import { memo, useState, useEffect } from "react"
import "./style.scss"
import { useNavigate } from "react-router-dom"
import AdminSidebar from "../components/Sidebar"
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa"
import san_1 from "../../../assets/user/order/image.jpg"
import san_2 from "../../../assets/user/order/image (2).png"
import san_3 from "../../../assets/user/order/image (1).png"

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

const AddField = () => {
  const navigate = useNavigate()
  const [fields, setFields] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingField, setEditingField] = useState(null)
  const [fieldData, setFieldData] = useState({
    name: "",
    location: "",
    manager: "",
    description: "",
    type: "7v7",
    image: null,
    imagePreview: null,
  })

  // Mẫu dữ liệu sân bóng mặc định
  const defaultFields = [
    {
      id: 1,
      name: "Sân số 1",
      location: "Khu đô thị Nguyễn Trãi Hà Đông",
      manager: "0123456789",
      description: "Sân cỏ nhân tạo chất lượng cao, có đèn chiếu sáng",
      type: "5v5",
      src: san_1,
      alt: "Sân 1",
      title: "Sân số 1",
      time: "90 phút",
      price: 300000,
    },
    {
      id: 2,
      name: "Sân số 2",
      location: "Khu đô thị Nguyễn Trãi Hà Đông",
      manager: "0123456789",
      description: "Sân cỏ nhân tạo phù hợp cho đội 7 người, có hệ thống chiếu sáng tốt",
      type: "7v7",
      src: san_2,
      alt: "Sân 2",
      title: "Sân số 2",
      time: "90 phút",
      price: 400000,
    },
    {
      id: 3,
      name: "Sân số 3",
      location: "Khu đô thị Nguyễn Trãi Hà Đông",
      manager: "0123456789",
      description: "Sân cỏ nhân tạo cao cấp, phù hợp cho các trận đấu chính thức",
      type: "11v11",
      src: san_3,
      alt: "Sân 3",
      title: "Sân số 3",
      time: "Trận đấu",
      price: 500000,
    },
  ]

  // Lấy danh sách sân bóng từ localStorage khi component được mount
  useEffect(() => {
    const storedFields = JSON.parse(localStorage.getItem("fields") || "[]")

    // Kết hợp sân mặc định với sân từ localStorage
    const combinedFields = [...defaultFields]

    // Thêm các sân từ localStorage mà không trùng ID với sân mặc định
    storedFields.forEach((field) => {
      if (!combinedFields.some((f) => f.id === field.id)) {
        combinedFields.push(field)
      }
    })

    setFields(combinedFields)

    // Lưu lại danh sách kết hợp vào localStorage
    localStorage.setItem("fields", JSON.stringify(combinedFields))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFieldData({
      ...fieldData,
      [name]: value,
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFieldData({
        ...fieldData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      })
    }
  }

  const resetForm = () => {
    setFieldData({
      name: "",
      location: "",
      manager: "",
      description: "",
      type: "7v7",
      image: null,
      imagePreview: null,
    })
    setEditingField(null)
  }

  const handleAddNewClick = () => {
    resetForm()
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    resetForm()
  }

  const handleEditField = (field) => {
    setFieldData({
      name: field.name,
      location: field.location,
      manager: field.manager,
      description: field.description || "",
      type: field.type || "7v7",
      image: null,
      imagePreview: field.src,
    })
    setEditingField(field.id)
    setShowForm(true)
  }

  const handleDeleteField = (fieldId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sân bóng này?")) {
      const updatedFields = fields.filter((field) => field.id !== fieldId)
      setFields(updatedFields)
      localStorage.setItem("fields", JSON.stringify(updatedFields))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingField) {
      // Cập nhật sân bóng ��ã tồn tại
      const updatedFields = fields.map((field) => {
        if (field.id === editingField) {
          return {
            ...field,
            name: fieldData.name,
            location: fieldData.location,
            manager: fieldData.manager,
            description: fieldData.description,
            type: fieldData.type,
            src: fieldData.imagePreview || field.src,
            alt: fieldData.name,
            title: fieldData.name,
          }
        }
        return field
      })
      setFields(updatedFields)
      localStorage.setItem("fields", JSON.stringify(updatedFields))
      alert("Cập nhật sân bóng thành công!")
    } else {
      // Thêm sân bóng mới
      const newField = {
        id: Date.now(),
        name: fieldData.name,
        location: fieldData.location,
        manager: fieldData.manager,
        description: fieldData.description,
        type: fieldData.type,
        src: fieldData.imagePreview || "/placeholder.svg?height=200&width=300",
        alt: fieldData.name,
        title: fieldData.name,
        time: "90 phút",
        price: fieldData.type === "5v5" ? 300000 : fieldData.type === "7v7" ? 400000 : 500000,
      }

      const updatedFields = [...fields, newField]
      setFields(updatedFields)
      localStorage.setItem("fields", JSON.stringify(updatedFields))
      alert("Thêm sân bóng thành công!")
    }

    setShowForm(false)
    resetForm()
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1>Quản lý sân bóng</h1>
          <Button variant="primary" onClick={handleAddNewClick}>
            <FaPlus className="icon-margin-right" /> Thêm sân bóng mới
          </Button>
        </div>

        {showForm ? (
          <div className="add-field-container">
            <div className="form-header">
              <h2>{editingField ? "Cập nhật sân bóng" : "Thêm sân bóng mới"}</h2>
              <button className="close-button" onClick={handleCloseForm}>
                <FaTimes />
              </button>
            </div>
            <form className="add-field-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Tên sân bóng</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={fieldData.name}
                  onChange={handleChange}
                  placeholder="Nhập tên sân bóng"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Địa điểm</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={fieldData.location}
                  onChange={handleChange}
                  placeholder="Nhập địa chỉ sân bóng"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="manager">Số điện thoại quản lý</label>
                <input
                  type="tel"
                  id="manager"
                  name="manager"
                  value={fieldData.manager}
                  onChange={handleChange}
                  placeholder="Nhập số điện thoại quản lý"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Loại sân</label>
                <select id="type" name="type" value={fieldData.type} onChange={handleChange} required>
                  <option value="5v5">Sân 5 người</option>
                  <option value="7v7">Sân 7 người</option>
                  <option value="11v11">Sân 11 người</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="description">Mô tả</label>
                <textarea
                  id="description"
                  name="description"
                  value={fieldData.description}
                  onChange={handleChange}
                  placeholder="Nhập mô tả về sân bóng"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label htmlFor="image">Hình ảnh sân bóng</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  required={!editingField && !fieldData.imagePreview}
                />
                {fieldData.imagePreview && (
                  <div className="image-preview">
                    <img src={fieldData.imagePreview || "/placeholder.svg"} alt="Preview" />
                  </div>
                )}
              </div>

              <div className="form-actions">
                <Button type="button" variant="secondary" onClick={handleCloseForm}>
                  Hủy
                </Button>
                <Button type="submit" variant="primary">
                  {editingField ? "Cập nhật" : "Thêm sân bóng"}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="fields-list-container">
            {fields.length === 0 ? (
              <div className="no-fields">
                <p>Chưa có sân bóng nào. Hãy thêm sân bóng mới!</p>
              </div>
            ) : (
              <div className="fields-grid">
                {fields.map((field) => (
                  <div className="field-card" key={field.id}>
                    <div className="field-image">
                      <img src={field.src || "/placeholder.svg"} alt={field.alt} />
                    </div>
                    <div className="field-content">
                      <h3>{field.name}</h3>
                      <p className="field-type">Loại: {field.type || "7v7"}</p>
                      <p className="field-location">Địa điểm: {field.location}</p>
                      <p className="field-manager">Quản lý: {field.manager}</p>
                      {field.description && <p className="field-description">{field.description}</p>}
                    </div>
                    <div className="field-actions">
                      <button className="edit-button" onClick={() => handleEditField(field)}>
                        <FaEdit />
                      </button>
                      <button className="delete-button" onClick={() => handleDeleteField(field.id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(AddField)

