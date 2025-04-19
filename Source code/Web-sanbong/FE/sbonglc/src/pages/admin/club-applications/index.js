"use client"

import { memo, useState, useEffect } from "react"
import "./style.scss"
import AdminSidebar from "../components/Sidebar"
import { FaCheck, FaTimes, FaEye } from "react-icons/fa"

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
  const [filter, setFilter] = useState("pending") // pending, approved, rejected

  // Mô phỏng dữ liệu đơn đăng ký
  useEffect(() => {
    // Trong thực tế, dữ liệu này sẽ được lấy từ API
    const mockApplications = [
      {
        id: 1,
        fullName: "Nguyễn Văn A",
        email: "nguyenvana@example.com",
        phone: "0987654321",
        address: "Hà Nội",
        bio: "Tôi là một người đam mê bóng đá từ nhỏ và đã chơi trong đội bóng trường đại học.",
        footballSkill: "Tôi có thể chơi ở vị trí tiền vệ trung tâm, có khả năng chuyền bóng tốt và tầm nhìn sân rộng.",
        status: "pending",
        submittedAt: "2023-03-15T08:30:00Z",
        avatar: null,
      },
      {
        id: 2,
        fullName: "Trần Thị B",
        email: "tranthib@example.com",
        phone: "0912345678",
        address: "Hồ Chí Minh",
        bio: "Tôi là huấn luyện viên bóng đá trẻ và muốn tham gia CLB để nâng cao kỹ năng.",
        footballSkill: "Tôi có 5 năm kinh nghiệm huấn luyện đội bóng trẻ, am hiểu chiến thuật và kỹ thuật cơ bản.",
        status: "approved",
        submittedAt: "2023-03-10T14:20:00Z",
        approvedAt: "2023-03-12T09:15:00Z",
        avatar: null,
      },
      {
        id: 3,
        fullName: "Lê Văn C",
        email: "levanc@example.com",
        phone: "0978123456",
        address: "Đà Nẵng",
        bio: "Tôi muốn tham gia CLB để rèn luyện sức khỏe và kết bạn với những người có cùng đam mê.",
        footballSkill: "Tôi mới chơi bóng được 1 năm, kỹ năng còn hạn chế nhưng rất nhiệt tình và chăm chỉ tập luyện.",
        status: "rejected",
        submittedAt: "2023-03-08T10:45:00Z",
        rejectedAt: "2023-03-09T16:30:00Z",
        rejectionReason: "Không đáp ứng yêu cầu kỹ thuật tối thiểu của CLB",
        avatar: null,
      },
      {
        id: 4,
        fullName: "Phạm Văn D",
        email: "phamvand@example.com",
        phone: "0965432109",
        address: "Hải Phòng",
        bio: "Tôi đã chơi bóng đá chuyên nghiệp trong 3 năm và muốn tìm một CLB để duy trì phong độ.",
        footballSkill:
          "Tôi có kinh nghiệm thi đấu ở giải hạng Nhất, chơi ở vị trí tiền đạo cánh với tốc độ tốt và khả năng dứt điểm.",
        status: "pending",
        submittedAt: "2023-03-14T11:20:00Z",
        avatar: null,
      },
      {
        id: 5,
        fullName: "Hoàng Thị E",
        email: "hoangthie@example.com",
        phone: "0932109876",
        address: "Cần Thơ",
        bio: "Tôi là người mới bắt đầu chơi bóng đá và muốn học hỏi từ những người có kinh nghiệm.",
        footballSkill: "Tôi mới tập chơi bóng được vài tháng, còn nhiều hạn chế nhưng rất đam mê và quyết tâm học hỏi.",
        status: "pending",
        submittedAt: "2023-03-16T09:10:00Z",
        avatar: null,
      },
    ]

    setApplications(mockApplications)
  }, [])

  const handleViewApplication = (application) => {
    setSelectedApplication(application)
  }

  const handleApproveApplication = (id) => {
    setApplications(
      applications.map((app) =>
        app.id === id ? { ...app, status: "approved", approvedAt: new Date().toISOString() } : app,
      ),
    )

    if (selectedApplication && selectedApplication.id === id) {
      setSelectedApplication({ ...selectedApplication, status: "approved", approvedAt: new Date().toISOString() })
    }
  }

  const handleRejectApplication = (id, reason = "Không đáp ứng yêu cầu") => {
    setApplications(
      applications.map((app) =>
        app.id === id
          ? { ...app, status: "rejected", rejectedAt: new Date().toISOString(), rejectionReason: reason }
          : app,
      ),
    )

    if (selectedApplication && selectedApplication.id === id) {
      setSelectedApplication({
        ...selectedApplication,
        status: "rejected",
        rejectedAt: new Date().toISOString(),
        rejectionReason: reason,
      })
    }
  }

  const handleCloseDetail = () => {
    setSelectedApplication(null)
  }

  const filteredApplications = applications.filter((app) => {
    if (filter === "all") return true
    return app.status === filter
  })

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
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data">
                    Không có đơn đăng ký nào
                  </td>
                </tr>
              ) : (
                filteredApplications.map((application) => (
                  <tr key={application.id}>
                    <td>{application.fullName}</td>
                    <td>{application.email}</td>
                    <td>{application.phone}</td>
                    <td>{formatDate(application.submittedAt)}</td>
                    <td>
                      <span className={`status-badge status-${application.status}`}>
                        {application.status === "pending" && "Chờ duyệt"}
                        {application.status === "approved" && "Đã duyệt"}
                        {application.status === "rejected" && "Từ chối"}
                      </span>
                    </td>
                    <td className="action-buttons">
                      <button
                        className="view-button"
                        onClick={() => handleViewApplication(application)}
                        title="Xem chi tiết"
                      >
                        <FaEye />
                      </button>

                      {application.status === "pending" && (
                        <>
                          <button
                            className="approve-button"
                            onClick={() => handleApproveApplication(application.id)}
                            title="Duyệt đơn"
                          >
                            <FaCheck />
                          </button>
                          <button
                            className="reject-button"
                            onClick={() => handleRejectApplication(application.id)}
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
                      <img src={selectedApplication.avatar || "/placeholder.svg"} alt="Avatar" />
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
                      {selectedApplication.status === "pending" && "Chờ duyệt"}
                      {selectedApplication.status === "approved" && "Đã duyệt"}
                      {selectedApplication.status === "rejected" && "Từ chối"}
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
                          handleRejectApplication(selectedApplication.id, reason)
                        }
                      }}
                    >
                      Từ chối đơn
                    </Button>
                    <Button variant="primary" onClick={() => handleApproveApplication(selectedApplication.id)}>
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

