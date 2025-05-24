"use client"

import { memo, useState, useEffect } from "react"
import "./style.scss"
import { useNavigate } from "react-router-dom"
import AdminSidebar from "../components/Sidebar"
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa"
import { fieldAPI, uploadAPI } from "../../../services/api"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8081/api"
const getImageUrl = (src) => {
  if (!src) return "/placeholder.svg"
  if (src.startsWith("http")) return src
  return API_URL.replace("/api", "") + src
}

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
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [fieldData, setFieldData] = useState({
    name: "",
    location: "",
    manager: "",
    description: "",
    type: "7v7",
    image: null,
    imagePreview: null,
    time: "8:00-23:00",
    price: 400000,
    title: "",
  })

  // Fetch fields from API
  const fetchFields = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fieldAPI.getFields()
      setFields(response.data.data.fields)
    } catch (err) {
      console.error("Error fetching fields:", err)
      setError("Không thể tải danh sách sân bóng. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFields()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    let newData = {
      ...fieldData,
      [name]: value,
    }
    if (name === "type") {
      newData.price = value === "5v5" ? 300000 : value === "7v7" ? 400000 : 500000
    }
    setFieldData(newData)
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      // Upload ngay khi chọn ảnh
      const formData = new FormData()
      formData.append("image", file)
      try {
        const uploadResponse = await uploadAPI.uploadFile(formData)
        const backendUrl = uploadResponse.data.data.url
        setFieldData({
          ...fieldData,
          image: null, // đã upload xong, không cần giữ file local nữa
          imagePreview: backendUrl,
        })
      } catch (err) {
        alert("Upload ảnh thất bại!")
      setFieldData({
        ...fieldData,
          image: null,
          imagePreview: null,
      })
      }
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
      time: "8:00-23:00",
      price: 400000,
      title: "",
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

  const handleEditField = async (fieldId) => {
    try {
      setIsLoading(true)
      const response = await fieldAPI.getFieldById(fieldId)
      const field = response.data.data.field

      setFieldData({
        name: field.name,
        location: field.location,
        manager: field.manager,
        description: field.description || "",
        type: field.type || "7v7",
        image: null,
        imagePreview: field.src || field.imageUrl,
        time: field.time || "8:00-23:00",
        price: field.price || 400000,
        title: field.title || "",
      })
      setEditingField(fieldId)
      setShowForm(true)
    } catch (err) {
      console.error("Error fetching field details:", err)
      alert("Không thể tải thông tin sân bóng. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteField = async (fieldId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sân bóng này?")) {
      try {
        await fieldAPI.deleteField(fieldId)
        // Refresh field list
        fetchFields()
        alert("Xóa sân bóng thành công!")
      } catch (err) {
        console.error("Error deleting field:", err)
        alert("Không thể xóa sân bóng. Vui lòng thử lại sau.")
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // Khi submit, chỉ cho phép nếu imagePreview là link backend
      let src = null;
      if (fieldData.imagePreview && typeof fieldData.imagePreview === 'string' && !fieldData.imagePreview.startsWith('blob:')) {
        src = fieldData.imagePreview
      }
      if (!src) {
        alert("Bạn phải upload hình ảnh sân bóng!")
        return
      }

      const name = fieldData.name
      const fieldPayload = {
        name: name,
        location: fieldData.location,
        manager: fieldData.manager,
        description: fieldData.description,
        type: fieldData.type,
        src: src,
        alt: `${name} image`,
        title: fieldData.title || `${name} - Professional Football Venue`,
        time: "8:00-23:00",
        price: Number(fieldData.price),
      }

      if (editingField) {
        await fieldAPI.updateField(editingField, fieldPayload)
        alert("Cập nhật sân bóng thành công!")
      } else {
        await fieldAPI.createField(fieldPayload)
        alert("Thêm sân bóng thành công!")
      }

      // Refresh field list
      fetchFields()
      setShowForm(false)
      resetForm()
    } catch (err) {
      console.error("Error saving field:", err)
      alert("Không thể lưu thông tin sân bóng. Vui lòng thử lại sau.")
    }
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

              <div className="form-group">
                <label>Khung giờ hoạt động</label>
                <div style={{ padding: '8px 0', fontWeight: 500 }}>8:00-23:00</div>
              </div>

              <div className="form-group">
                <label htmlFor="price">Giá mặc định (VNĐ/ca)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={fieldData.price}
                  onChange={handleChange}
                  placeholder="Nhập giá mặc định"
                  required
                  min={0}
                />
              </div>

              <div className="form-group">
                <label htmlFor="title">Tiêu đề (title)</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={fieldData.title}
                  onChange={handleChange}
                  placeholder="Nhập tiêu đề cho sân bóng (nếu để trống sẽ tự sinh)"
                />
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
            {isLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Đang tải dữ liệu...</p>
              </div>
            ) : error ? (
              <div className="error-message">
                <p>{error}</p>
                <Button variant="primary" onClick={fetchFields}>
                  Thử lại
                </Button>
              </div>
            ) : fields.length === 0 ? (
              <div className="no-fields">
                <p>Chưa có sân bóng nào. Hãy thêm sân bóng mới!</p>
              </div>
            ) : (
              <div className="fields-grid">
                {fields.map((field) => (
                  <div className="field-card" key={field._id}>
                    <div className="field-image">
                      <img src={getImageUrl(field.src) || getImageUrl(field.imageUrl)} alt={field.name} />
                    </div>
                    <div className="field-content">
                      <h3>{field.name}</h3>
                      <p className="field-type">Loại: {field.type || "7v7"}</p>
                      <p className="field-location">Địa điểm: {field.location}</p>
                      <p className="field-manager">Quản lý: {field.manager}</p>
                      {field.description && <p className="field-description">{field.description}</p>}
                    </div>
                    <div className="field-actions">
                      <button className="edit-button" onClick={() => handleEditField(field._id)}>
                        <FaEdit />
                      </button>
                      <button className="delete-button" onClick={() => handleDeleteField(field._id)}>
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
