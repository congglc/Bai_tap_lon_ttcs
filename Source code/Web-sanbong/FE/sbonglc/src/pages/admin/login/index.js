"use client"

import { memo, useState } from "react"
import "./style.scss"
import { useNavigate } from "react-router-dom" // Import useNavigate
import { ROUTERS } from "utils/router"
import { authAPI } from "../../../services/api"

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate() // Initialize useNavigate

  const handleLogin = async (e) => {
    e.preventDefault()

    // Basic validation (replace with your actual authentication logic)
    // if (username === "admin" && password === "password") {
    //   // Simulate successful login
    //   localStorage.setItem("isAdmin", "true") // Set admin status in local storage
    //   navigate(ROUTERS.ADMIN.DASHBOARD) // Redirect to the admin dashboard (assuming you have a route for it)
    // } else {
    //   setError("Invalid username or password")
    // }

    try {
      setError(""); // Xóa lỗi cũ
      console.log("Attempting admin login with email:", username, "and password:", password); // Log thông tin đăng nhập

      const res = await authAPI.login({ email: username, password }); // Giả sử username admin dùng email để đăng nhập

      console.log("API Login Response:", res); // Log toàn bộ response từ API

      // Kiểm tra cấu trúc response và dữ liệu user/role/token
      if (res && res.data && res.data.data && res.data.data.user && res.data.data.user.role === 'admin' && res.data.data.tokens && res.data.data.tokens.access && res.data.data.tokens.refresh) { // Kiểm tra các trường token và refresh token
         console.log("Admin login successful. User data:", res.data.data.user);
         console.log("Tokens received:", res.data.data.tokens.access.token, res.data.data.tokens.refresh.token); // Log token từ đúng vị trí

         localStorage.setItem("userInfo", JSON.stringify(res.data.data.user));
         localStorage.setItem("isAdmin", "true"); // Hoặc lưu role
         localStorage.setItem("token", res.data.data.tokens.access.token); // Lấy access token từ đúng vị trí
         localStorage.setItem("refreshToken", res.data.data.tokens.refresh.token); // Lấy refresh token từ đúng vị trí

         console.log("Token saved:", localStorage.getItem("token")); // Kiểm tra lại token trong localStorage sau khi lưu
         console.log("RefreshToken saved:", localStorage.getItem("refreshToken")); // Kiểm tra lại refresh token trong localStorage sau khi lưu

         navigate(ROUTERS.ADMIN.DASHBOARD); // Redirect to the admin dashboard
      } else {
          console.warn("Admin login failed: Invalid user data or not an admin.", res);
          setError("Invalid username or password or not an admin account");
      }

    } catch (err) {
      console.error("Admin Login error caught:", err); // Log lỗi chi tiết
      // Kiểm tra nếu có response từ BE trong lỗi (ví dụ: lỗi validation)
      if (err.response) {
          console.error("Error response data:", err.response.data);
          console.error("Error response status:", err.response.status);
          setError(err.response.data.message || "Invalid username or password"); // Hiển thị thông báo lỗi từ BE nếu có
      } else {
          setError("An error occurred during login. Please try again."); // Lỗi không có response (lỗi mạng, CORS...)
      }
    }
  }

  const handleClose = () => {
    navigate(-1) // Go back to the previous page
  }

  return (
    <div className="login-container">
      <div className="login-header">
        <h2>Admin Login</h2>
        <span className="close-button" onClick={handleClose}>
          ×
        </span>
      </div>
      <form className="login-form" onSubmit={handleLogin}>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label htmlFor="username">Email:</label>
          <input type="email" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default memo(Login)

