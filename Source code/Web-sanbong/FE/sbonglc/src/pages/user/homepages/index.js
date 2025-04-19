"use client"

import { memo, useEffect } from "react"
import "./style.scss"
import sanbong from "../../../assets/user/hompages/view.png"
import { Link } from "react-router-dom"
import { ROUTERS } from "utils/router"
import { FaCalendarAlt, FaUsers, FaFutbol, FaTrophy } from "react-icons/fa"

const HomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <div className="homepage-content">
      <section className="hero-section">
        <div className="overlay"></div>
        <div className="hero-text">
          <div className="tittle-text">
            <h1>Sân bóng LC</h1>
            <p>Nơi thỏa mãn những đam mê!</p>
          </div>
          <div className="booking-box">
            <input type="text" placeholder="Nhập số điện thoại của bạn" />
            <Link to={ROUTERS.USER.PAYMENT}>
              <button>Đặt sân ngay</button>
            </Link>
          </div>
        </div>
      </section>

      <section className="services">
        <div className="container">
          <div className="services-content">
            <div className="services-title">
              <h2>Sân bóng LC</h2>
              <p>Chuyên cung cấp dịch vụ bóng đá</p>
            </div>

            <div className="services-container">
              <div className="image-container">
                <img src={sanbong || "/placeholder.svg"} alt="Sân bóng" />
              </div>
              <div className="services-wrapper">
                <div className="service-list">
                  <div className="service-item">
                    <div className="icon icon-1">
                      <FaCalendarAlt />
                    </div>
                    <div className="service-text">
                      <h3>Đặt sân bóng</h3>
                      <p>Cho thuê sân theo ca 1-3 giờ</p>
                    </div>
                  </div>
                  <div className="service-item">
                    <div className="icon icon-2">
                      <FaUsers />
                    </div>
                    <div className="service-text">
                      <h3>Tổ chức giao lưu tìm đối</h3>
                      <p>Kết nối các đội bóng</p>
                    </div>
                  </div>
                  <div className="service-item">
                    <div className="icon icon-3">
                      <FaFutbol />
                    </div>
                    <div className="service-text">
                      <h3>CLB tập luyện</h3>
                      <p>Tạo và quản lý đội bóng hằng tuần</p>
                    </div>
                  </div>
                  <div className="service-item">
                    <div className="icon icon-4">
                      <FaTrophy />
                    </div>
                    <div className="service-text">
                      <h3>Tổ chức các giải đấu</h3>
                      <p>Từ cấp nhỏ đến giải lớn</p>
                    </div>
                  </div>
                </div>
                <button className="cta-button">
                  <Link to={ROUTERS.USER.INFO}>Tham gia ngay</Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default memo(HomePage)

   