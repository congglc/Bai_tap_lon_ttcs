"use client"

import { memo, useState } from "react"
import "./style.scss"
import { ROUTERS } from "utils/router"
import { useNavigate } from "react-router-dom" // Import useNavigate
import { FaTimes } from "react-icons/fa"

const Signup = () => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const navigate = useNavigate() // Khởi tạo hook useNavigate

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  const handleExitClick = () => {
    navigate(ROUTERS.USER.HOME) // Chuyển hướng đến trang chủ
  }

  return (
    <div className="signup-page">
      <div className="signup-form">
        <button className="exit-button" onClick={handleExitClick}>
          <FaTimes />
        </button>
        <h1>Welcome.</h1>
        <p>Tạo một tài khoản.</p>

        <form>
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input type="tel" id="phone" placeholder="Enter your phone" />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                placeholder="Enter at least 8+ characters"
              />
              <button type="button" className="toggle-password" onClick={togglePasswordVisibility}>
                <i className={`fas ${passwordVisible ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
          </div>

          <div className="terms-agreement">
            <input type="checkbox" id="terms" />
            <label htmlFor="terms">Tôi đồng í với điều khoản</label>
          </div>

          <button type="button" className="signup-button" onClick={() => navigate(ROUTERS.USER.INFO)}>
            Đăng kí
          </button>
        </form>

        <div className="login-link">
          Already have an account? <a href={ROUTERS.USER.SIGNIN}>Đăng nhập</a>
        </div>
      </div>
    </div>
  )
}

export default memo(Signup)

