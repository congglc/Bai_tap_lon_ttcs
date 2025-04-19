"use client"

import { memo, useState, useEffect } from "react"
import "./style.scss"
import AdminSidebar from "../components/Sidebar"
import { FaUsers, FaFutbol, FaCalendarAlt, FaClipboardList, FaUserFriends } from "react-icons/fa"
import { Link } from "react-router-dom"
import { ROUTERS } from "utils/router"

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalFields: 0,
    pendingBookings: 0,
    clubApplications: 0,
    todayBookings: 0,
    totalUsers: 0,
  })

  const [recentBookings, setRecentBookings] = useState([])

  // Mô phỏng dữ liệu thống kê
  useEffect(() => {
    // Trong thực tế, dữ liệu này sẽ được lấy từ API
    setStats({
      totalFields: 3,
      pendingBookings: 8,
      clubApplications: 3,
      todayBookings: 12,
      totalUsers: 5, // Thêm số lượng người dùng
    })

    const mockRecentBookings = [
      {
        id: 1,
        teamName: "FC Hà Nội",
        field: "Sân số 1",
        date: "15/03/2023",
        time: "17h-18h30",
        status: "confirmed",
      },
      {
        id: 2,
        teamName: "FC Thăng Long",
        field: "Sân số 2",
        date: "15/03/2023",
        time: "18h30-20h",
        status: "pending",
      },
      {
        id: 3,
        teamName: "FC Cầu Giấy",
        field: "Sân số 3",
        date: "16/03/2023",
        time: "14h-15h30",
        status: "confirmed",
      },
      {
        id: 4,
        teamName: "FC Đống Đa",
        field: "Sân số 1",
        date: "16/03/2023",
        time: "20h-21h30",
        status: "cancelled",
      },
      {
        id: 5,
        teamName: "FC Thanh Xuân",
        field: "Sân số 2",
        date: "17/03/2023",
        time: "17h-18h30",
        status: "pending",
      },
    ]

    setRecentBookings(mockRecentBookings)
  }, [])

  const getStatusClass = (status) => {
    switch (status) {
      case "confirmed":
        return "status-confirmed"
      case "pending":
        return "status-pending"
      case "cancelled":
        return "status-cancelled"
      default:
        return ""
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận"
      case "pending":
        return "Chờ xác nhận"
      case "cancelled":
        return "Đã hủy"
      default:
        return status
    }
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1>Dashboard</h1>
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">
              <FaFutbol />
            </div>
            <div className="stat-content">
              <h3>Tổng số sân</h3>
              <p>{stats.totalFields}</p>
            </div>
            <Link to={ROUTERS.ADMIN.ADD_FIELD} className="stat-link">
              Quản lý
            </Link>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaCalendarAlt />
            </div>
            <div className="stat-content">
              <h3>Đơn đặt sân chờ xử lý</h3>
              <p>{stats.pendingBookings}</p>
            </div>
            <Link to={ROUTERS.ADMIN.ORDER} className="stat-link">
              Xem
            </Link>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaUsers />
            </div>
            <div className="stat-content">
              <h3>Đơn đăng ký CLB</h3>
              <p>{stats.clubApplications}</p>
            </div>
            <Link to={ROUTERS.ADMIN.CLUB_APPLICATIONS} className="stat-link">
              Duyệt
            </Link>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaClipboardList />
            </div>
            <div className="stat-content">
              <h3>Đặt sân hôm nay</h3>
              <p>{stats.todayBookings}</p>
            </div>
            <Link to={ROUTERS.ADMIN.FIELD_STATUS} className="stat-link">
              Xem lịch
            </Link>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaUserFriends />
            </div>
            <div className="stat-content">
              <h3>Tổng số người dùng</h3>
              <p>{stats.totalUsers}</p>
            </div>
            <Link to={ROUTERS.ADMIN.USERS} className="stat-link">
              Quản lý
            </Link>
          </div>
        </div>

        <div className="recent-bookings">
          <div className="section-header">
            <h2>Đơn đặt sân gần đây</h2>
            <Link to={ROUTERS.ADMIN.ORDER} className="view-all">
              Xem tất cả
            </Link>
          </div>

          <div className="bookings-table-container">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Đội bóng</th>
                  <th>Sân</th>
                  <th>Ngày</th>
                  <th>Giờ</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.teamName}</td>
                    <td>{booking.field}</td>
                    <td>{booking.date}</td>
                    <td>{booking.time}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(Dashboard)

