"use client"

import { memo, useState, useEffect } from "react"
import "./style.scss"
import { FaUserCircle } from "react-icons/fa"
import { MdOutlineDisabledByDefault } from "react-icons/md"
import { useNavigate } from "react-router-dom"
import { userAPI } from "../../../../services/api"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8081";
const getFullAvatarUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return API_URL.replace("/api", "") + url;
};

const Profile = () => {
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    _id: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState("")

  // Lấy thông tin người dùng từ localStorage khi component được mount
  useEffect(() => {
    const fetchUser = async () => {
      const storedUserInfo = localStorage.getItem("userInfo")
      let user = storedUserInfo ? JSON.parse(storedUserInfo) : null

      // Nếu có token và userId, luôn lấy user mới nhất từ backend
      if (user && user._id && localStorage.getItem("token")) {
        try {
          const res = await userAPI.getUserById(user._id)
          if (res.data && res.data.user) {
            user = res.data.user
            localStorage.setItem("userInfo", JSON.stringify(user))
          }
        } catch {}
      }

      if (user) {
        setUserInfo(user)
        setAvatarUrl(getFullAvatarUrl(user.avatar))
      } else {
        navigate("/dang-nhap")
      }
    }
    fetchUser()
  }, [navigate])

  // Thêm log kiểm tra avatarUrl và userInfo trước khi render
  console.log("avatarUrl:", avatarUrl, "userInfo:", userInfo);

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
        const user = JSON.parse(storedUserInfo)
        setUserInfo({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          _id: user._id || "",
        })
        setAvatarUrl(getFullAvatarUrl(user.avatar))
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

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      setAvatarUrl(URL.createObjectURL(file))
      if (userInfo._id) {
        const formData = new FormData()
        formData.append("avatar", file)
        try {
          const res = await userAPI.uploadAvatar(userInfo._id, formData)
          if (res.data && res.data.user && res.data.user.avatar) {
            setAvatarUrl(getFullAvatarUrl(res.data.user.avatar))
            // Lấy user mới nhất từ backend
            const userRes = await userAPI.getUserById(userInfo._id)
            if (userRes.data && userRes.data.user) {
              setUserInfo(userRes.data.user)
              localStorage.setItem("userInfo", JSON.stringify(userRes.data.user))
            }
          }
        } catch (err) {
          alert("Upload ảnh thất bại!")
        }
      }
    }
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
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className="avatar-img" />
            ) : (
              <FaUserCircle className="avatar-icon" />
            )}
          </div>
          <div className="avatar-actions">
            <p>Tải ảnh lên</p>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id="avatar-upload"
              onChange={handleAvatarChange}
              disabled={!isEditing}
            />
            <button
              type="button"
              className="upload-button"
              disabled={!isEditing}
              onClick={() => document.getElementById('avatar-upload').click()}
            >
              Chọn ảnh
            </button>
            <button
              className="remove-button"
              disabled={!isEditing || !avatarUrl}
              onClick={() => {
                setAvatarFile(null)
                setAvatarUrl("")
                // Có thể gọi API xóa avatar nếu muốn
              }}
            >
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

