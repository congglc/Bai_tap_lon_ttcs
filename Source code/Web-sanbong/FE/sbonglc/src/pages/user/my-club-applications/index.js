"use client"

import { useState, useEffect } from "react"
import "./style.scss"
import { useNavigate } from "react-router-dom"
import { MdOutlineDisabledByDefault } from "react-icons/md"
import { clubApplicationAPI } from "../../../services/api"
import { formatDate } from "../../../utils/formatDate"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8081";
const getFullAvatarUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return API_URL.replace("/api", "") + url;
};

const MyClubApplications = () => {
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])
  const [userInfo, setUserInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)

    const storedUserInfo = localStorage.getItem("userInfo")
    if (!storedUserInfo) {
      navigate("/dang-nhap")
      return
    }

    const userInfoObj = JSON.parse(storedUserInfo)
    setUserInfo(userInfoObj)
    fetchUserApplications(userInfoObj)
  }, [navigate])

  const fetchUserApplications = async (user) => {
    try {
      setIsLoading(true)
      setError(null)

      if (user._id) {
        const response = await clubApplicationAPI.getClubApplicationsByUser(user._id)
        setApplications(response.data.data.applications)
      } else {
        const response = await clubApplicationAPI.getClubApplications()
        const userApplications = response.data.data.applications.filter(
          app => app.email === user.email
        )
        setApplications(userApplications)
      }
    } catch (err) {
      console.error("Error fetching club applications:", err)
      setError("Không thể tải danh sách đơn đăng ký CLB. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleExitClick = () => {
    navigate(-1)
  }

  const handleApplyNow = () => {
    navigate("/dang-ky-club")
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "approved":
        return "status-approved"
      case "pending":
        return "status-pending"
      case "rejected":
        return "status-rejected"
      default:
        return ""
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "approved":
        return "Đã duyệt"
      case "pending":
        return "Chờ duyệt"
      case "rejected":
        return "Từ chối"
      default:
        return status
    }
  }

  return (
    <div className="my-applications-container">
      <div className="my-applications-header">
        <h1>Đơn đăng ký CLB của tôi</h1>
        <button className="exit-button" onClick={handleExitClick}>
          <MdOutlineDisabledByDefault />
        </button>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button className="retry-button" onClick={() => fetchUserApplications(userInfo)}>
            Thử lại
          </button>
        </div>
      ) : (
        <div className="applications-content">
          {applications.length === 0 ? (
            <div className="no-applications">
              <p>Bạn chưa có đơn đăng ký CLB nào.</p>
              <button className="apply-now-button" onClick={handleApplyNow}>
                Đăng ký ngay
              </button>
            </div>
          ) : (
            <div className="applications-list">
              {applications.map((application) => (
                <div className="application-card" key={application._id}>
                  <div className="application-header">
                    <div className="avatar-container">
                      {application.avatar ? (
                        <img src={getFullAvatarUrl(application.avatar) || "/placeholder.svg"} alt="Avatar" />
                      ) : (
                        <div className="avatar-placeholder">
                          {application.fullName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="application-status">
                      <span className={`status-badge ${getStatusClass(application.status)}`}>
                        {getStatusText(application.status)}
                      </span>
                    </div>
                  </div>

                  <div className="application-details">
                    <h3>{application.fullName}</h3>
                    <p><strong>Email:</strong> {application.email}</p>
                    <p><strong>Số điện thoại:</strong> {application.phone}</p>
                    <p><strong>Địa chỉ:</strong> {application.address}</p>
                    <p><strong>Ngày đăng ký:</strong> {formatDate(application.submittedAt)}</p>

                    <div className="application-section">
                      <h4>Giới thiệu bản thân</h4>
                      <p>{application.bio}</p>
                    </div>

                    <div className="application-section">
                      <h4>Kỹ năng bóng đá</h4>
                      <p>{application.footballSkill}</p>
                    </div>

                    {application.status === "approved" && application.approvedAt && (
                      <div className="application-section">
                        <h4>Thông tin duyệt</h4>
                        <p>Duyệt vào: {formatDate(application.approvedAt)}</p>
                      </div>
                    )}

                    {application.status === "rejected" && (
                      <div className="application-section">
                        <h4>Thông tin từ chối</h4>
                        <p>Từ chối vào: {formatDate(application.rejectedAt)}</p>
                        <p>Lý do: {application.rejectionReason}</p>
                      </div>
                    )}
                  </div>

                  {application.status === "rejected" && (
                    <div className="application-actions">
                      <button className="apply-again-button" onClick={handleApplyNow}>
                        Đăng ký lại
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MyClubApplications
