"use client"

import { memo, useState, useEffect } from "react"
import "./style.scss"
import { useNavigate } from "react-router-dom"
import { MdOutlineDisabledByDefault } from "react-icons/md"

const MyClubApplications = () => {
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])
  const [userInfo, setUserInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)

    // Kiểm tra đăng nhập
    const storedUserInfo = localStorage.getItem("userInfo")
    if (!storedUserInfo) {
      navigate("/dang-nhap")
      return
    }

    setUserInfo(JSON.parse(storedUserInfo))

    // Mô phỏng việc lấy đơn đăng ký CLB của người dùng
    // Trong thực tế, dữ liệu này sẽ được lấy từ API dựa trên ID người dùng
    setIsLoading(true)

    // Giả lập dữ liệu đơn đăng ký CLB
    const userEmail = JSON.parse(storedUserInfo).email

    // Lấy danh sách đơn đăng ký từ localStorage (nếu có)
    const allApplications = JSON.parse(localStorage.getItem("clubApplications") || "[]")

    // Lọc đơn đăng ký của người dùng hiện tại (dựa vào email)
    const userApplications = allApplications.filter((app) => app.email === userEmail)

    // Nếu không có đơn nào, tạo một đơn mẫu
    if (userApplications.length === 0) {
      const mockApplication = {
        id: Date.now(),
        fullName: JSON.parse(storedUserInfo).name,
        email: userEmail,
        phone: JSON.parse(storedUserInfo).phone,
        address: JSON.parse(storedUserInfo).address || "Hà Nội",
        bio: "Tôi là một người đam mê bóng đá từ nhỏ và muốn tham gia CLB để rèn luyện kỹ năng.",
        footballSkill: "Tôi có thể chơi ở vị trí tiền vệ, có khả năng chuyền bóng tốt.",
        status: "pending",
        submittedAt: new Date().toISOString(),
        avatar: null,
      }

      setApplications([mockApplication])
    } else {
      setApplications(userApplications)
    }

    setIsLoading(false)
  }, [navigate])

  const handleExitClick = () => {
    navigate(-1) // Quay lại trang trước
  }

  const handleApplyNow = () => {
    navigate("/dang-ky-club") // Chuyển đến trang đăng ký CLB
  }

  // Format ngày tháng
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
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
                <div className="application-card" key={application.id}>
                  <div className="application-header">
                    <div className="avatar-container">
                      {application.avatar ? (
                        <img src={application.avatar || "/placeholder.svg"} alt="Avatar" />
                      ) : (
                        <div className="avatar-placeholder">{application.fullName.charAt(0)}</div>
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
                    <p>
                      <strong>Email:</strong> {application.email}
                    </p>
                    <p>
                      <strong>Số điện thoại:</strong> {application.phone}
                    </p>
                    <p>
                      <strong>Địa chỉ:</strong> {application.address}
                    </p>
                    <p>
                      <strong>Ngày đăng ký:</strong> {formatDate(application.submittedAt)}
                    </p>

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

export default memo(MyClubApplications)

