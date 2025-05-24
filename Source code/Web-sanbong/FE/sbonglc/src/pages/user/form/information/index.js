"use client"

import { memo, useEffect, useState } from "react"
import "./style.scss"
import { FaUserCircle } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { MdOutlineDisabledByDefault } from "react-icons/md"
import { clubApplicationAPI } from "../../../../services/api"
import { ROUTERS } from "utils/router"

const Info = () => {
  const navigate = useNavigate()

  // State để lưu thông tin form
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    footballSkill: '',
    // avatar: '', // Tạm thời bỏ qua upload ảnh
  });

  // State cho loading và error
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lấy userId từ localStorage
  const [userId, setUserId] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState("")

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const userInfoObj = JSON.parse(storedUserInfo);
      setUserId(userInfoObj._id);
    } else {
        // Nếu không có userInfo, có thể chuyển hướng đến trang đăng nhập hoặc xử lý tùy ý
        console.warn("User info not found in localStorage");
        // navigate('/dang-nhap'); // Tùy chọn: chuyển hướng nếu không đăng nhập
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Handler cho sự thay đổi input
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      setAvatarUrl(URL.createObjectURL(file))
    }
  }

  // Handler cho sự kiện submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
        alert("Vui lòng đăng nhập để đăng ký CLB.");
        return;
    }
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.bio || !formData.footballSkill) {
      alert("Vui lòng điền đầy đủ các trường bắt buộc.");
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const payload = {
        ...formData,
        userId: userId,
      };
      // Gọi API đăng ký CLB
      const response = await clubApplicationAPI.createClubApplication(payload);
      if (response.data && response.data.success && response.data.application && avatarFile) {
        // Nếu có file ảnh, upload tiếp
        const formDataImg = new FormData()
        formDataImg.append("avatar", avatarFile)
        await clubApplicationAPI.uploadAvatar(response.data.application._id, formDataImg)
      }
      if (response.data && response.data.success) {
        alert("Đơn đăng ký CLB của bạn đã được gửi thành công!");
        navigate(ROUTERS.USER.MY_CLUB_APPLICATIONS);
      } else {
        setError(response.data.message || "Có lỗi xảy ra khi gửi đơn đăng ký.");
        alert("Có lỗi xảy ra: " + (response.data.message || "Vui lòng thử lại."));
      }
    } catch (err) {
      console.error("Error submitting club application:", err);
      setError("Không thể gửi đơn đăng ký. Vui lòng thử lại sau.");
      alert("Không thể gửi đơn đăng ký. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExitClick = () => {
    navigate(-1) // Quay lại trang trước
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <button className="exit-button" onClick={handleExitClick}>
          <MdOutlineDisabledByDefault />
        </button>
        <h2>Đăng ký thành viên CLB</h2>

        {/* XÓA PHẦN UPLOAD ẢNH */}
        {/* <div className="avatar-section">
          <div className="avatar-placeholder">
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className="avatar-img" />
            ) : (
            <FaUserCircle className="avatar-icon" />
            )}
          </div>
          <div className="avatar-actions">
            <p>Tải ảnh lên</p>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id="avatar-upload"
              onChange={handleAvatarChange}
              disabled={isLoading}
            />
            <button
              type="button"
              className="upload-button"
              disabled={isLoading}
              onClick={() => document.getElementById('avatar-upload').click()}
            >
              Chọn ảnh
            </button>
            <button
              className="remove-button"
              disabled={isLoading || !avatarUrl}
              onClick={() => {
                setAvatarFile(null)
                setAvatarUrl("")
              }}
            >
              Xóa
            </button>
          </div>
        </div> */}

        {/* Sử dụng form element và thêm onSubmit handler */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Họ và tên</label>
            <input type="text" id="fullName" placeholder="Your full name" value={formData.fullName} onChange={handleInputChange} disabled={isLoading} />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Your email" value={formData.email} onChange={handleInputChange} disabled={isLoading} />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Số điện thoại</label>
            <input type="tel" id="phone" placeholder="Your phone number" value={formData.phone} onChange={handleInputChange} disabled={isLoading} /> {/* id là phone theo BE */}
          </div>

          <div className="form-group">
            <label htmlFor="address">Địa chỉ</label>
            <input type="text" id="address" placeholder="Location" value={formData.address} onChange={handleInputChange} disabled={isLoading} />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Giới thiệu bản thân</label>
            <textarea id="bio" placeholder="Tell something about yourself" value={formData.bio} onChange={handleInputChange} disabled={isLoading} />
          </div>

          <div className="form-group">
            <label htmlFor="footballSkill">Tự đánh giá khả năng chơi bóng bản thân hiện tại</label>
            <textarea id="footballSkill" placeholder="Tell something about yourself" value={formData.footballSkill} onChange={handleInputChange} disabled={isLoading} />
          </div>

          {error && <div className="error-message">{error}</div>} {/* Hiển thị lỗi */}

          <div className="form-actions">
            <button className="cancel-button" type="button" onClick={handleExitClick} disabled={isLoading}> {/* type="button" để ngăn submit */}
              Hủy
            </button>
            <button className="submit-button" type="submit" disabled={isLoading}> {/* type="submit" để kích hoạt onSubmit */}
              {isLoading ? 'Đang gửi...' : 'Nộp đơn'} {/* Thay đổi text khi loading */}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default memo(Info)

