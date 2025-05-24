"use client"

import { memo, useState, useEffect } from "react"
import "./style.scss"
import AdminSidebar from "../components/Sidebar"
import { FaCheck, FaTimes, FaEye } from "react-icons/fa"
import { clubApplicationAPI } from "../../../services/api"
import { formatDate } from "../../../utils/formatDate"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8081";
const getFullAvatarUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return API_URL.replace("/api", "") + url;
};

const Button = ({ children, variant = "primary", type = "button", onClick, disabled = false }) => {
  return (
    <button
      type={type}
      className={`admin-button ${variant} ${disabled ? "disabled" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

const ClubApplications = () => {
  const [applications, setApplications] = useState([])
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [filter, setFilter] = useState("pending") // pending, approved, rejected, all
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch club applications from API
  const fetchApplications = async (status = null) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await clubApplicationAPI.getClubApplications(status !== "all" ? status : null)
      setApplications(response.data.data.applications)
    } catch (err) {
      console.error("Error fetching club applications:", err)
      setError("Không thể tải danh sách đơn đăng ký CLB. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications(filter)
  }, [filter])

  const handleViewApplication = async (applicationId) => {
    try {
      setIsLoading(true)
      const response = await clubApplicationAPI.getClubApplicationById(applicationId)
      setSelectedApplication(response.data.data.application)
    } catch (err) {
      console.error("Error fetching application details:", err)
      alert("Không thể tải chi tiết đơn đăng ký. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleApproveApplication = async (id) => {
    try {
      await clubApplicationAPI.approveClubApplication(id)

      // Refresh application list
      fetchApplications(filter)

      // Update selected application if it's the one being approved
      if (selectedApplication && selectedApplication._id === id) {
        const response = await clubApplicationAPI.getClubApplicationById(id)
        setSelectedApplication(response.data.data.application)
      }

      alert("Đơn đăng ký đã được duyệt thành công!")
    } catch (err) {
      console.error("Error approving application:", err)
      alert("Không thể duyệt đơn đăng ký. Vui lòng thử lại sau.")
    }
  }

  const handleRejectApplication = async (id, reason = "Không đáp ứng yêu cầu") => {
    try {
      await clubApplicationAPI.rejectClubApplication(id, reason)

      // Refresh application list
      fetchApplications(filter)

      // Update selected application if it's the one being rejected
      if (selectedApplication && selectedApplication._id === id) {
        const response = await clubApplicationAPI.getClubApplicationById(id)
        setSelectedApplication(response.data.data.application)
      }

      alert("Đơn đăng ký đã bị từ chối!")
    } catch (err) {
      console.error("Error rejecting application:", err)
      alert("Không thể từ chối đơn đăng ký. Vui lòng thử lại sau.")
    }
  }

  const handleCloseDetail = () => {
    setSelectedApplication(null)
  }

  // Lấy class CSS cho trạng thái
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

  // Lấy text cho trạng thái
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
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1>Quản lý đơn đăng ký CLB</h1>
          <div className="filter-buttons">
            <button className={`filter-button ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
              Tất cả
            </button>
            <button
              className={`filter-button ${filter === "pending" ? "active" : ""}`}
              onClick={() => setFilter("pending")}
            >
              Chờ duyệt
            </button>
            <button
              className={`filter-button ${filter === "approved" ? "active" : ""}`}
              onClick={() => setFilter("approved")}
            >
              Đã duyệt
            </button>
            <button
              className={`filter-button ${filter === "rejected" ? "active" : ""}`}
              onClick={() => setFilter("rejected")}
            >
              Từ chối
            </button>
          </div>
        </div>

        {isLoading && !selectedApplication ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <Button variant="primary" onClick={() => fetchApplications(filter)}>
              Thử lại
            </Button>
          </div>
        ) : (
          <div className="applications-container">
            <table className="applications-table">
              <thead>
                <tr>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Ngày đăng ký</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-data">
                      Không có đơn đăng ký nào
                    </td>
                  </tr>
                ) : (
                  applications.map((application) => (
                    <tr key={application._id}>
                      <td>{application.fullName}</td>
                      <td>{application.email}</td>
                      <td>{application.phone}</td>
                      <td>{formatDate(application.submittedAt)}</td>
                      <td>
                        <span className={`status-badge status-${application.status}`}>
                          {getStatusText(application.status)}
                        </span>
                      </td>
                      <td className="action-buttons">
                        <button
                          className="view-button"
                          onClick={() => handleViewApplication(application._id)}
                          title="Xem chi tiết"
                        >
                          <FaEye />
                        </button>

                        {application.status === "pending" && (
                          <>
                            <button
                              className="approve-button"
                              onClick={() => handleApproveApplication(application._id)}
                              title="Duyệt đơn"
                            >
                              <FaCheck />
                            </button>
                            <button
                              className="reject-button"
                              onClick={() => {
                                const reason = window.prompt("Nhập lý do từ chối:")
                                if (reason) handleRejectApplication(application._id, reason)
                              }}
                              title="Từ chối"
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {selectedApplication && (
          <div className="application-detail-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Chi tiết đơn đăng ký</h3>
                <button className="close-button" onClick={handleCloseDetail}>
                  ×
                </button>
              </div>

              <div className="application-detail">
                <div className="detail-header">
                  <div className="avatar-container">
                    {selectedApplication.avatar ? (
                      <img src={getFullAvatarUrl(selectedApplication.avatar) || "/placeholder.svg"} alt="Avatar" />
                    ) : (
                      <div className="avatar-placeholder">{selectedApplication.fullName.charAt(0)}</div>
                    )}
                  </div>

                  <div className="basic-info">
                    <h4>{selectedApplication.fullName}</h4>
                    <p className="email">{selectedApplication.email}</p>
                    <p className="phone">{selectedApplication.phone}</p>
                    <p className="address">{selectedApplication.address}</p>
                    <p className="submitted-date">Ngày đăng ký: {formatDate(selectedApplication.submittedAt)}</p>
                    <span className={`status-badge status-${selectedApplication.status}`}>
                      {getStatusText(selectedApplication.status)}
                    </span>
                  </div>
                </div>

                <div className="detail-section">
                  <h5>Giới thiệu bản thân</h5>
                  <p>{selectedApplication.bio}</p>
                </div>

                <div className="detail-section">
                  <h5>Kỹ năng bóng đá</h5>
                  <p>{selectedApplication.footballSkill}</p>
                </div>

                {selectedApplication.status === "approved" && (
                  <div className="detail-section">
                    <h5>Thông tin duyệt</h5>
                    <p>Duyệt vào: {formatDate(selectedApplication.approvedAt)}</p>
                  </div>
                )}

                {selectedApplication.status === "rejected" && (
                  <div className="detail-section">
                    <h5>Thông tin từ chối</h5>
                    <p>Từ chối vào: {formatDate(selectedApplication.rejectedAt)}</p>
                    <p>Lý do: {selectedApplication.rejectionReason}</p>
                  </div>
                )}

                {selectedApplication.status === "pending" && (
                  <div className="action-buttons">
                    <Button
                      variant="danger"
                      onClick={() => {
                        const reason = window.prompt("Nhập lý do từ chối:")
                        if (reason) {
                          handleRejectApplication(selectedApplication._id, reason)
                        }
                      }}
                    >
                      Từ chối đơn
                    </Button>
                    <Button variant="primary" onClick={() => handleApproveApplication(selectedApplication._id)}>
                      Duyệt đơn
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(ClubApplications)
