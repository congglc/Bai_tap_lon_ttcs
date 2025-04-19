export const ADMIN_PATH = "/quan-tri"

export const ROUTERS = {
  USER: {
    HOME: "/",
    ORDER: "/dat-san",
    CLUB: "/cau-lac-bo",
    CONTACT: "/lien-he",
    SIGNUP: "/dang-ky-tai-khoan",
    SIGNIN: "/dang-nhap",
    PAYMENT: "/thanh-toan",
    PROFILE: "/thong-tin-ca-nhan",
    INFO: "/dang-ky-club",
    MY_BOOKINGS: "/don-dat-san",
    MY_CLUB_APPLICATIONS: "/don-dang-ky-clb",
  },

  ADMIN: {
    LOGIN: `${ADMIN_PATH}/dang-nhap`,
    DASHBOARD: `${ADMIN_PATH}/dashboard`,
    ORDER: `${ADMIN_PATH}/trang-thai-don`,
    ADD_FIELD: `${ADMIN_PATH}/them-san-bong`,
    FIELD_STATUS: `${ADMIN_PATH}/trang-thai-san`,
    CLUB_APPLICATIONS: `${ADMIN_PATH}/don-dang-ky-clb`,
    USERS: `${ADMIN_PATH}/quan-ly-nguoi-dung`,
  },
}

