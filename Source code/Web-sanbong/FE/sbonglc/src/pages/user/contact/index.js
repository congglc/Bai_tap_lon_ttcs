"use client"

import { memo, useEffect } from "react"
import "./style.scss"
import { FaMapMarkerAlt, FaPhone, FaRegEnvelope } from "react-icons/fa"

import banner from "../../../assets/user/contact/baner.png"

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <div className="contact-content">
      <div className="container">
        <div className="contact-section">
          <h1>Sân bóng LC</h1>
          <h2>Hân hạnh được phục vụ tất cả các cầu thủ!</h2>

          <div className="contact-card">
            <img src={banner} alt="Sân bóng LC" className="contact-image" />
            <div className="contact-info">
              <p>
                <FaPhone /> 0123456789
              </p>
              <p>
                <FaMapMarkerAlt /> KM10 Nguyễn Trãi - Hà Đông
              </p>
              <p>
                <FaRegEnvelope /> LCbongda@football.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(Contact)

