"use client"

import { memo, useState } from "react"
import "./style.scss"
import { ROUTERS } from "utils/router"
import { useNavigate } from "react-router-dom" // Import useNavigate
import { FaTimes } from "react-icons/fa"
import { authAPI } from "../../../../services/api"

const Signup = () => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate() // Khởi tạo hook useNavigate

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  const handleExitClick = () => {
    navigate(ROUTERS.USER.HOME) // Chuyển hướng đến trang chủ
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    try {
      await authAPI.register({ name, email, phone, password })
      alert("Đăng ký thành công!")
      navigate(ROUTERS.USER.SIGNIN)
    } catch (err) {
      console.error("Signup error:", err)
      alert("Đăng ký thất bại!") // Hiển thị lỗi từ server hoặc lỗi mặc định
    }
  }

  return (
    <div className="signup-page">
      <div className="signup-form">
        <button className="exit-button" onClick={handleExitClick}>
          <FaTimes />
        </button>
        <h1>Welcome.</h1>
        <p>Tạo một tài khoản.</p>

        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              placeholder="Enter your phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                placeholder="Enter at least 8+ characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" className="toggle-password" onClick={togglePasswordVisibility}>
                <i className={`fas ${passwordVisible ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
          </div>

          <div className="terms-agreement">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">Tôi đồng í với điều khoản</label>
          </div>

          <button type="submit" className="signup-button">
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

