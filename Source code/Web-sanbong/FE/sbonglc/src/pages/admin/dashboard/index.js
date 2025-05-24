"use client"

import { memo, useState, useEffect } from "react"
import "./style.scss"
import AdminSidebar from "../components/Sidebar"
import { FaUsers, FaFutbol, FaCalendarAlt, FaClipboardList, FaUserFriends } from "react-icons/fa"
import { Link } from "react-router-dom"
import { ROUTERS } from "utils/router"
import { fieldAPI, bookingAPI, clubApplicationAPI, userAPI } from "../../../services/api"

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalFields: 0,
    pendingBookings: 0,
    clubApplications: 0,
    todayBookings: 0,
    totalUsers: 0,
  })

  const [recentBookings, setRecentBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch Total Fields
        const fieldsRes = await fieldAPI.getFields();
        const totalFields = fieldsRes.data && fieldsRes.data.data && fieldsRes.data.data.fields ? fieldsRes.data.data.fields.length : 0;

        // Fetch Pending Bookings
        const pendingBookingsRes = await bookingAPI.getBookings(1, 100, 'pending'); // Lấy tối đa 100 đơn chờ
        const pendingBookings = pendingBookingsRes.data && pendingBookingsRes.data.data ? pendingBookingsRes.data.data.totalResults : 0; // Giả sử API trả về totalResults

        // Fetch Total Club Applications
        const clubApplicationsRes = await clubApplicationAPI.getClubApplications();
        let clubApplications = 0;
        if (clubApplicationsRes.data && clubApplicationsRes.data.data && Array.isArray(clubApplicationsRes.data.data.applications)) {
          clubApplications = clubApplicationsRes.data.data.applications.filter(app => app.status === 'pending').length;
        }

        // Fetch Total Users
        const usersRes = await userAPI.getUsers(1, 100); // Lấy tối đa 100 user
        let totalUsers = 0;
        if (usersRes.data && usersRes.data.data) {
          if (Array.isArray(usersRes.data.data.users)) {
            totalUsers = usersRes.data.data.users.length;
          } else if (typeof usersRes.data.data.totalResults === 'number') {
            totalUsers = usersRes.data.data.totalResults;
          }
        }

        // Fetch Today's Bookings and Recent Bookings
        const allBookingsRes = await bookingAPI.getBookings(1, 1000); // Lấy tất cả booking để lọc

        const allBookings = (allBookingsRes.data && allBookingsRes.data.data && Array.isArray(allBookingsRes.data.data.bookings))
            ? allBookingsRes.data.data.bookings
            : []; // Nếu không phải mảng, gán mảng rỗng

        // Lọc đơn đặt hôm nay từ allBookings đã kiểm tra an toàn
        const today = new Date();
        const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const todayBookings = allBookings.filter(booking => {
            // Giả sử booking có trường 'date' định dạng YYYY-MM-DD
            // Thêm kiểm tra an toàn cho booking.date
            return booking.date === todayString;
        }).length;

        // Sắp xếp booking mới nhất lên đầu, lấy 5 booking gần đây nhất
        const recentBookingsData = [...allBookings]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setStats({
          totalFields,
          pendingBookings,
          clubApplications,
          todayBookings,
          totalUsers,
        });
        setRecentBookings(recentBookingsData);

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Không thể tải dữ liệu dashboard.");
        if(err.response) {
            console.error("Error response data:", err.response.data);
            console.error("Error response status:", err.response.status);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Chạy 1 lần khi component mount

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

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải dữ liệu dashboard...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
          </div>
        ) : (
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
        )}

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
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
                    <tr key={booking._id || booking.id}>
                      <td>{booking.teamName || 'N/A'}</td>
                      <td>{booking.fieldName || 'N/A'}</td>
                      <td>{booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A'}</td>
                      <td>{booking.time || 'N/A'}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(booking.status || '')}`}>
                          {getStatusText(booking.status || 'unknown')}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>Không có đơn đặt sân gần đây.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(Dashboard)

