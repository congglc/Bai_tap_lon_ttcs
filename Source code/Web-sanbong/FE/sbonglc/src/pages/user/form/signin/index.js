"use client"

import { memo, useState } from "react"
import "./style.scss"
import { ROUTERS } from "utils/router"
import { useNavigate } from "react-router-dom"
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa"
import { authAPI } from "../../../../services/api"

const Signin = () => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  const handleExitClick = () => {
    navigate(ROUTERS.USER.HOME)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Kiểm tra đăng nhập đơn giản (trong thực tế sẽ gọi API)
    // if (phone === "0123456789" && password === "password") {
    //   // Tạo thông tin người dùng mẫu
    //   const userInfo = {
    //     name: "Nguyễn Văn A",
    //     phone: phone,
    //     email: "nguyenvana@example.com",
    //     address: "Hà Nội",
    //     isLoggedIn: true,
    //   }

    //   // Lưu thông tin người dùng vào localStorage
    //   localStorage.setItem("userInfo", JSON.stringify(userInfo))

    //   // Chuyển hướng về trang chủ
    //   navigate(ROUTERS.USER.HOME)
    // } else {
    //   setError("Số điện thoại hoặc mật khẩu không đúng")
    // }

    try {
      const res = await authAPI.login({ email, password })
      // Lưu thông tin user hoặc token nếu cần
      localStorage.setItem("userInfo", JSON.stringify(res.data.data.user))
      // Có thể lưu thêm token nếu API trả về token
      // localStorage.setItem("token", res.data.data.token);
      // localStorage.setItem("refreshToken", res.data.data.refreshToken);
      // Chuyển hướng về trang chủ
      navigate(ROUTERS.USER.HOME)
    } catch (err) {
      console.error("Login error:", err)
      setError("Số điện thoại hoặc mật khẩu không đúng") // Hiển thị lỗi từ server hoặc lỗi mặc định
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

