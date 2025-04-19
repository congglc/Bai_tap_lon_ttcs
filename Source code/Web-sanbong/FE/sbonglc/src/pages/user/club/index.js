"use client"

import { memo, useEffect } from "react"
import "./style.scss"
import banner from "../../../assets/user/club/image.png"
import club_1 from "../../../assets/user/club/club1.png"
import club_2 from "../../../assets/user/club/club2.png"
import { ROUTERS } from "utils/router"
import { Link } from "react-router-dom"

const Club = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <div className="club-content">
      <div className="container">
        <div className="main-content">
          <div className="intro">
            <h1>LC SOCCER CLUB</h1>
            <p>Liên tục tuyển thêm thành viên!</p>
            <div className="buttons">
              <button className="btn primary">
                <Link to={ROUTERS.USER.INFO}>Tham gia ngay</Link>
              </button>
              <button className="btn secondary">Tìm hiểu thêm</button>
            </div>
            <img src={banner} alt="Huấn luyện bóng đá" className="training-image" />
          </div>
          <div className="coaches-title">Đội ngũ huấn luyện viên chuyên nghiệp!</div>
          <div className="coaches">
            <div className="coach-card">
              <div className="avatar"></div>
              <h3>TenHag</h3>
              <p className="role">HLV Trưởng</p>
              <p>Nhiều kinh nghiệm huấn luyện viên cho bóng đá chuyên nghiệp.</p>
              <button className="btn contact">Contact</button>
            </div>

            <div className="coach-card">
              <div className="avatar"></div>
              <h3>Ancelotti</h3>
              <p className="role">Trợ lý HLV</p>
              <p>Huấn luyện kỹ năng phòng thủ cho toàn đội bóng.</p>
              <button className="btn contact">Contact</button>
            </div>

            <div className="coach-card">
              <div className="avatar"></div>
              <h3>Xavialonso</h3>
              <p className="role">Trợ lý HLV</p>
              <p>Người đưa đội lên tầm cao phương án tấn công hiện đại.</p>
              <button className="btn contact">Contact</button>
            </div>
          </div>
        </div>

        <div className="training-section">
          <h2>LC SOCCER CLUB</h2>
          <p>Nhận đào tạo cho những người mới bắt đầu, muốn cải thiện khả năng chơi bóng.</p>

          <div className="training-content">
            <div className="training-item">
              <div className="text">
                <h3>Đào tạo các kĩ năng cơ bản</h3>
                <ul>
                  <li>Kiểm soát bóng: Bài tập đỡ bóng bằng chân, đùi, ngực.</li>
                  <li>Dẫn bóng (Dribbling): Luyện tập rê bóng với cả hai chân, đổi hướng nhanh.</li>
                  <li>Chuyền bóng (Passing): Chuyền sệt, chọc khe, chuyền bổng.</li>
                  <li>Dứt điểm (Finishing): Sút bóng bằng mu bàn chân, lòng trong, má ngoài.</li>
                </ul>
                <button className="btn register">
                  <Link to={ROUTERS.USER.INFO}>Tham gia ngay</Link>
                </button>
              </div>
              <img src={club_1} alt="Đào tạo kỹ năng cơ bản" />
            </div>

            <div className="training-item reverse">
              <img src={club_2} alt="Tổ chức giao lưu thực chiến" />
              <div className="text">
                <h3>Tổ chức giao lưu thực chiến</h3>
                <ul>
                  <li>Sau mỗi buổi tập mọi người sẽ được thực hành trực tiếp thông qua những trận bóng giao hữu.</li>
                  <li>Giao lưu giữa các đội bóng phong trào</li>
                  <li>Giải đấu giao lưu mini</li>
                  <li>Thử thách bóng đá đối kháng</li>
                </ul>
                <button className="btn register">
                  <Link to={ROUTERS.USER.INFO}>Tham gia ngay</Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(Club)

