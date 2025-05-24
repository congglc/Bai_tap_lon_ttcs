"use client"

import { memo, useState, useEffect } from "react"
import "./style.scss"
import AdminSidebar from "../components/Sidebar"
import { FaEye, FaEdit, FaTrash, FaPlus, FaTimes, FaSearch } from "react-icons/fa"
import { userAPI } from "../../../services/api"
import { formatDate } from "../../../utils/formatDate"

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

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 10,
    total: 0,
  })
  const [userData, setUserData] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "user",
    status: "active",
    registeredAt: "",
    bio: "",
  })
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "user",
    status: "active",
  })
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);

  // Fetch users from API
  const fetchUsers = async (page = 1) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await userAPI.getUsers(page, pagination.limit)
      setUsers(response.data.data.users)
      setPagination(response.data.data.pagination)
    } catch (err) {
      console.error("Error fetching users:", err)
      setError("Không thể tải danh sách người dùng. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Filtered users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm),
  )

  const handleViewUser = (user) => {
    setSelectedUser(user)
  }

  const handleCloseDetail = () => {
    setSelectedUser(null)
  }

  const handleAddNewClick = () => {
    setUserData({
      id: null,
      name: "",
      email: "",
      phone: "",
      address: "",
      role: "user",
      status: "active",
      registeredAt: "",
      bio: "",
    })
    setEditingUser(null)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingUser(null)
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setEditFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "user",
      status: user.status || "active",
    })
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        await userAPI.deleteUser(userId)
        // Refresh user list
        fetchUsers(pagination.currentPage)

        // If viewing deleted user details, close modal
        if (selectedUser && selectedUser._id === userId) {
          setSelectedUser(null)
        }

        alert("Xóa người dùng thành công!")
      } catch (err) {
        console.error("Error deleting user:", err)
        alert("Không thể xóa người dùng. Vui lòng thử lại sau.")
      }
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserData({
      ...userData,
      [name]: value,
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditFormData({
      ...editFormData,
      [name]: value,
    })
  }

  const handleSaveUser = async (e) => {
    e.preventDefault()
    if (!selectedUser) return

    try {
      setIsLoading(true)
      setError(null)

      const payload = {
        name,
        email,
        phone,
        role: selectedRole,
        status: selectedStatus,
        isBlocked,
      }

      Object.keys(payload).forEach(key => (payload[key] == null || payload[key] === '') && delete payload[key]);

      console.log("Updating user with ID:", selectedUser._id);
      console.log("Payload being sent:", payload);

      await userAPI.updateUser(selectedUser._id, payload)

      alert("Cập nhật người dùng thành công!")
      handleCloseDetail()
      fetchUsers(pagination.currentPage)
    } catch (err) {
      console.error("Error saving user:", err)
      if (err.response && err.response.data && err.response.data.message) {
          setError(`Lỗi cập nhật: ${err.response.data.message}`);
      } else {
          setError("Không thể cập nhật người dùng. Vui lòng thử lại sau.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handlePageChange = (page) => {
    fetchUsers(page)
  }

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "admin":
        return "role-admin"
      case "manager":
        return "role-manager"
      default:
        return "role-user"
    }
  }

  const getStatusBadgeClass = (status) => {
    return status === "active" ? "status-active" : "status-inactive"
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1>Quản lý người dùng</h1>
          <Button variant="primary" onClick={handleAddNewClick}>
            <FaPlus className="icon-margin-right" /> Thêm người dùng mới
          </Button>
        </div>

        <div className="search-container">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {showForm ? (
          <div className="add-user-container">
            <div className="form-header">
              <h2>{editingUser ? "Cập nhật thông tin người dùng" : "Thêm người dùng mới"}</h2>
              <button className="close-button" onClick={handleCloseForm}>
                <FaTimes />
              </button>
            </div>
            <form className="add-user-form" onSubmit={handleSaveUser}>
              <div className="form-group">
                <label htmlFor="name">Họ và tên</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  placeholder="Nhập địa chỉ email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Số điện thoại</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={userData.phone}
                  onChange={handleChange}
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Địa chỉ</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={userData.address}
                  onChange={handleChange}
                  placeholder="Nhập địa chỉ"
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Vai trò</label>
                <select id="role" name="role" value={userData.role} onChange={handleChange} required>
                  <option value="user">Người dùng</option>
                  <option value="manager">Quản lý</option>
                  <option value="admin">Quản trị viên</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="status">Trạng thái</label>
                <select id="status" name="status" value={userData.status} onChange={handleChange} required>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="bio">Giới thiệu</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={userData.bio}
                  onChange={handleChange}
                  placeholder="Nhập thông tin giới thiệu"
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <Button type="button" variant="secondary" onClick={handleCloseForm}>
                  Hủy
                </Button>
                <Button type="submit" variant="primary">
                  {editingUser ? "Cập nhật" : "Thêm người dùng"}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="users-list-container">
            {isLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Đang tải dữ liệu...</p>
              </div>
            ) : error ? (
              <div className="error-message">
                <p>{error}</p>
                <Button variant="primary" onClick={() => fetchUsers()}>
                  Thử lại
                </Button>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="no-users">
                <p>Không tìm thấy người dùng nào phù hợp với từ khóa tìm kiếm.</p>
              </div>
            ) : (
              <>
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Họ và tên</th>
                      <th>Email</th>
                      <th>Số điện thoại</th>
                      <th>Vai trò</th>
                      <th>Trạng thái</th>
                      <th>Ngày đăng ký</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user._id}>
                        <td>#{user._id.slice(-4)}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>
                          <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                            {user.role === "admin"
                              ? "Quản trị viên"
                              : user.role === "manager"
                                ? "Quản lý"
                                : "Người dùng"}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${getStatusBadgeClass(user.status)}`}>
                            {user.status === "active" ? "Hoạt động" : "Không hoạt động"}
                          </span>
                        </td>
                        <td>{formatDate(user.createdAt)}</td>
                        <td className="action-buttons">
                          <button className="view-button" onClick={() => handleViewUser(user)} title="Xem chi tiết">
                            <FaEye />
                          </button>
                          <button className="edit-button" onClick={() => handleEditUser(user)} title="Chỉnh sửa">
                            <FaEdit />
                          </button>
                          <button className="delete-button" onClick={() => handleDeleteUser(user._id)} title="Xóa">
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {pagination.totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="pagination-button"
                      disabled={pagination.currentPage === 1}
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                    >
                      &laquo; Trước
                    </button>

                    {[...Array(pagination.totalPages)].map((_, index) => (
                      <button
                        key={index}
                        className={`pagination-button ${pagination.currentPage === index + 1 ? "active" : ""}`}
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      className="pagination-button"
                      disabled={pagination.currentPage === pagination.totalPages}
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                    >
                      Sau &raquo;
                    </button>
                  </div>
                )}

                {selectedUser && (
                  <div className="user-detail-modal">
                    <div className="modal-content">
                      <span className="close" onClick={handleCloseDetail}>
                        &times;
                      </span>
                      <h2>Chỉnh sửa người dùng</h2>
                      <form onSubmit={handleSaveUser} className="add-user-form">
                        <div className="form-group">
                          <label htmlFor="editName">Tên:</label>
                          <input type="text" id="editName" name="name" value={editFormData.name} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                          <label htmlFor="editEmail">Email:</label>
                          <input type="email" id="editEmail" name="email" value={editFormData.email} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                          <label htmlFor="editPhone">Số điện thoại:</label>
                          <input type="tel" id="editPhone" name="phone" value={editFormData.phone} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                          <label htmlFor="editRole">Vai trò:</label>
                          <select id="editRole" name="role" value={editFormData.role} onChange={handleInputChange}>
                            <option value="user">Người dùng</option>
                            <option value="manager">Quản lý</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label htmlFor="editStatus">Trạng thái:</label>
                          <select id="editStatus" name="status" value={editFormData.status} onChange={handleInputChange}>
                            <option value="active">Hoạt động</option>
                            <option value="inactive">Khóa</option>
                          </select>
                        </div>
                        {error && <div className="error-message">{error}</div>}
                        <div className="modal-actions">
                          <Button variant="secondary" onClick={handleCloseDetail}>Hủy</Button>
                          <Button type="submit" variant="primary" disabled={isLoading}>
                            {isLoading ? 'Đang lưu...' : 'Lưu'}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(UserManagement)
