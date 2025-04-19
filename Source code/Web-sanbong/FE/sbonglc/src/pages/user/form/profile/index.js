"use client"

import { memo, useState, useEffect } from "react"
import "./style.scss"
import { FaUserCircle } from "react-icons/fa"
import { MdOutlineDisabledByDefault } from "react-icons/md"
import { useNavigate } from "react-router-dom"

const Profile = () => {
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // Lấy thông tin người dùng từ localStorage khi component được mount
  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo")
    if (storedUserInfo) {
      setUserInfo({ ...JSON.parse(storedUserInfo), bio: JSON.parse(storedUserInfo).bio || "" })
    } else {
      // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập
      navigate("/dang-nhap")
    }
  }, [navigate])

  const handleExitClick = () => {
    navigate(-1) // Sử dụng navigate(-1) để quay lại trang trước đó
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUserInfo({
      ...userInfo,
      [name]: value,
    })
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
    // Nếu đang chỉnh sửa và bấm Cancel, khôi phục dữ liệu từ localStorage
    if (isEditing) {
      const storedUserInfo = localStorage.getItem("userInfo")
      if (storedUserInfo) {
        setUserInfo({ ...JSON.parse(storedUserInfo), bio: JSON.parse(storedUserInfo).bio || "" })
      }
    }
  }

  const handleSubmit = () => {
    // Lưu thông tin người dùng vào localStorage
    localStorage.setItem("userInfo", JSON.stringify({ ...userInfo, isLoggedIn: true }))
    setIsEditing(false)
    setSuccessMessage("Thông tin đã được cập nhật thành công!")

    // Ẩn thông báo sau 3 giây
    setTimeout(() => {
      setSuccessMessage("")
    }, 3000)
  }

  const handleLogout = () => {
    // Xóa thông tin người dùng khỏi localStorage
    localStorage.removeItem("userInfo")

    // Chuyển hướng về trang chủ
    navigate("/")
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <button className="exit-button" onClick={handleExitClick}>
          <MdOutlineDisabledByDefault />
        </button>
        <h2>Thông tin cá nhân</h2>

        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="avatar-section">
          <div className="avatar-placeholder">
            <FaUserCircle className="avatar-icon" />
          </div>
          <div className="avatar-actions">
            <p>Tải ảnh lên</p>
            <button className="upload-button" disabled={!isEditing}>
              Chọn ảnh
            </button>
            <button className="remove-button" disabled={!isEditing}>
              Xóa
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="name">Họ và tên</label>
          <input
            type="text"
            id="name"
            name="name"
            value={userInfo.name}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={!isEditing ? "readonly" : ""}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userInfo.email}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={!isEditing ? "readonly" : ""}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Số điện thoại</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={userInfo.phone}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={!isEditing ? "readonly" : ""}
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Địa chỉ</label>
          <input
            type="text"
            id="address"
            name="address"
            value={userInfo.address}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={!isEditing ? "readonly" : ""}
          />
        </div>

        <div className="form-group">
          <label htmlFor="bio">Giới thiệu bản thân</label>
          <textarea
            id="bio"
            name="bio"
            value={userInfo.bio}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={!isEditing ? "readonly" : ""}
          />
        </div>

        <div className="form-actions">
          {isEditing ? (
            <>
              <button className="cancel-button" onClick={handleEditToggle}>
                Hủy
              </button>
              <button className="confirm-button" onClick={handleSubmit}>
                Lưu thay đổi
              </button>
            </>
          ) : (
            <>
              <button className="edit-button" onClick={handleEditToggle}>
                Chỉnh sửa
              </button>
              <button className="logout-button" onClick={handleLogout}>
                Đăng xuất
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default memo(Profile)

