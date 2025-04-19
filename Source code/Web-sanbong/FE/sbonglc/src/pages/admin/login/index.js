"use client"

import { memo, useState } from "react"
import "./style.scss"
import { useNavigate } from "react-router-dom" // Import useNavigate
import { ROUTERS } from "utils/router"

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate() // Initialize useNavigate

  const handleLogin = async (e) => {
    e.preventDefault()

    // Basic validation (replace with your actual authentication logic)
    if (username === "admin" && password === "password") {
      // Simulate successful login
      localStorage.setItem("isAdmin", "true") // Set admin status in local storage
      navigate(ROUTERS.ADMIN.DASHBOARD) // Redirect to the admin dashboard (assuming you have a route for it)
    } else {
      setError("Invalid username or password")
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
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
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

