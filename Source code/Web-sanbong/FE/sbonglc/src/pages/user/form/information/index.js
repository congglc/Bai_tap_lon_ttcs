"use client"

import { memo, useEffect } from "react"
import "./style.scss"
import { FaUserCircle } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { MdOutlineDisabledByDefault } from "react-icons/md"

const Info = () => {
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleExitClick = () => {
    navigate(-1) // Quay lại trang trước
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <button className="exit-button" onClick={handleExitClick}>
          <MdOutlineDisabledByDefault />
        </button>
        <h2>Thông tin cá nhân</h2>

        <div className="avatar-section">
          <div className="avatar-placeholder">
            <FaUserCircle className="avatar-icon" />
          </div>
          <div className="avatar-actions">
            <p>Tải ảnh lên</p>
            <button className="upload-button">Chọn ảnh</button>
            <button className="remove-button">Xóa</button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="fullName">Họ và tên</label>
          <input type="text" id="fullName" placeholder="Your full name" />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="Your email" />
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Số điện thoại</label>
          <input type="tel" id="phoneNumber" placeholder="Your phone number" />
        </div>

        <div className="form-group">
          <label htmlFor="address">Địa chỉ</label>
          <input type="text" id="address" placeholder="Location" />
        </div>

        <div className="form-group">
          <label htmlFor="bio">Giới thiệu bản thân</label>
          <textarea id="bio" placeholder="Tell something about yourself" />
        </div>

        <div className="form-group">
          <label htmlFor="footballSkill">Tự đánh giá khả năng chơi bóng bản thân hiện tại</label>
          <textarea id="footballSkill" placeholder="Tell something about yourself" />
        </div>

        <div className="form-actions">
          <button className="cancel-button" onClick={handleExitClick}>
            Cancel
          </button>
          <button className="submit-button">Nộp đơn</button>
        </div>
      </div>
    </div>
  )
}

export default memo(Info)

