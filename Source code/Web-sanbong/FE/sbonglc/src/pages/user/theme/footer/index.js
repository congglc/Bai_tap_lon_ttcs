import { memo } from "react"
import "./style.scss"
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <div className="footer__brand">
            <h2 className="footer__title">Sân Bóng LC</h2>
            <div className="footer__logo">LC</div>
            <ul className="footer__social">
              <li>
                <a href="" aria-label="Facebook">
                  <FaFacebook />
                </a>
              </li>
              <li>
                <a href="" aria-label="Instagram">
                  <FaInstagram />
                </a>
              </li>
              <li>
                <a href="" aria-label="YouTube">
                  <FaYoutube />
                </a>
              </li>
              <li>
                <a href="" aria-label="Twitter">
                  <FaTwitter />
                </a>
              </li>
            </ul>
            <p className="footer__slogan">Ultimated with love</p>
            <p className="footer__description">Quis labore ut labore proident in ea est aliqua.</p>
          </div>
          <div className="footer__contact">
            <h3 className="footer__subtitle">Liên Hệ</h3>
            <ul className="footer__info">
              <li>Địa Chỉ: KM10 Nguyễn Trãi, Hà Đông</li>
              <li>SĐT: 0123456789</li>
              <li>Email: LCbongda@football.com</li>
              <li>Website: LCbongda.com</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default memo(Footer)

