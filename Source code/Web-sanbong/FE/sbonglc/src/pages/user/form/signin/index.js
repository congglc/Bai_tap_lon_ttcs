"use client"

import { memo, useState } from "react"
import "./style.scss"
import { ROUTERS } from "utils/router"
import { useNavigate } from "react-router-dom"
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa"

const Signin = () => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  const handleExitClick = () => {
    navigate(ROUTERS.USER.HOME)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Kiểm tra đăng nhập đơn giản (trong thực tế sẽ gọi API)
    if (phone === "0123456789" && password === "password") {
      // Tạo thông tin người dùng mẫu
      const userInfo = {
        name: "Nguyễn Văn A",
        phone: phone,
        email: "nguyenvana@example.com",
        address: "Hà Nội",
        isLoggedIn: true,
      }

      // Lưu thông tin người dùng vào localStorage
      localStorage.setItem("userInfo", JSON.stringify(userInfo))

      // Chuyển hướng về trang chủ
      navigate(ROUTERS.USER.HOME)
    } else {
      setError("Số điện thoại hoặc mật khẩu không đúng")
    }
  }

  return (
    <div className="login-page">
      <div className="login-form">
        <button className="exit-button" onClick={handleExitClick}>
          <FaTimes />
        </button>
        <h1>Đăng Nhập</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={togglePasswordVisibility}
                aria-label={passwordVisible ? "Hide password" : "Show password"}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>

          <button type="submit" className="login-button">
            Đăng nhập
          </button>
        </form>

        <div className="signup-link">
          Bạn chưa có tài khoản? <a href={ROUTERS.USER.SIGNUP}>Đăng kí</a>
        </div>
      </div>
    </div>
  )
}

export default memo(Signin)

