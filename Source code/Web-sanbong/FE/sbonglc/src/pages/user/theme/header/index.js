"use client"

import { memo, useState, useEffect, useRef } from "react"
import "./style.scss"
import { ROUTERS } from "utils/router"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { FaUserCircle } from "react-icons/fa"

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [menu] = useState([
    { name: "Trang chủ", path: ROUTERS.USER.HOME },
    { name: "Đặt sân", path: ROUTERS.USER.ORDER },
    { name: "Câu lạc bộ", path: ROUTERS.USER.CLUB },
    { name: "Liên hệ", path: ROUTERS.USER.CONTACT },
  ])
  const [isOpen, setIsOpen] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const headerRef = useRef(null)
  const dropdownRef = useRef(null)

  // Kiểm tra trạng thái đăng nhập khi component được mount
  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo")
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo))
    }
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown)
  }

  const handleLogout = () => {
    // Xóa thông tin người dùng khỏi localStorage
    localStorage.removeItem("userInfo")
    setUserInfo(null)
    setShowDropdown(false)

    // Chuyển hướng về trang chủ
    navigate(ROUTERS.USER.HOME)
  }

  // Xử lý click bên ngoài để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target) && isOpen) {
        setIsOpen(false)
      }

      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && showDropdown) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, showDropdown])

  return (
    <>
      <button className="menu-toggle" onClick={toggleMenu} aria-label="Mở menu">
        ☰
      </button>
      <header className={`header ${isOpen ? "open" : ""}`} ref={headerRef}>
        <div className="container">
          <div className="row">
            <Link to={ROUTERS.USER.HOME} className="header_logo">
              LC
            </Link>
            <nav className="header_menu">
              <ul>
                {menu?.map((menuItem, menuKey) => {
                  return (
                    <li key={menuKey} className={location.pathname === menuItem.path ? "active" : ""}>
                      <Link to={menuItem?.path}>{menuItem?.name}</Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
            <div className="header_login">
              {userInfo ? (
                <div className="user-profile" ref={dropdownRef}>
                  <div className="avatar" onClick={toggleDropdown}>
                    <FaUserCircle className="avatar-icon" />
                    <span className="user-name">{userInfo.name}</span>
                  </div>
                  {showDropdown && (
                    <div className="dropdown-menu">
                      <Link to={ROUTERS.USER.PROFILE} className="dropdown-item">
                        Thông tin cá nhân
                      </Link>
                      <Link to="/don-dat-san" className="dropdown-item">
                        Đơn đặt sân của tôi
                      </Link>
                      <Link to="/don-dang-ky-clb" className="dropdown-item">
                        Đơn đăng ký CLB
                      </Link>
                      <button className="dropdown-item logout-button" onClick={handleLogout}>
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <ul>
                  <li>
                    <Link to={ROUTERS.USER.SIGNIN}>Đăng nhập</Link>
                  </li>
                  <li>
                    <Link to={ROUTERS.USER.SIGNUP}>Đăng ký</Link>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
export default memo(Header)

