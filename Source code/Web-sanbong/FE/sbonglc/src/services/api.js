import axios from "axios"

// Tạo instance Axios với cấu hình mặc định
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8081/api"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

// Interceptor để thêm token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Interceptor để xử lý response
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const rs = await api.post("/auth/refresh-tokens", { refreshToken });

          const { access, refresh } = rs.data.data.tokens;
          localStorage.setItem("token", access.token);
          localStorage.setItem("refreshToken", refresh.token);

          api.defaults.headers.common['Authorization'] = `Bearer ${access.token}`;
          originalRequest.headers['Authorization'] = `Bearer ${access.token}`;

          return api(originalRequest);
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("userInfo");
          return Promise.reject(error);
        }
      } catch (_error) {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        return Promise.reject(_error);
      }
    }

    return Promise.reject(error)
  },
)

// Auth API
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  logout: () => api.post("/auth/logout", { refreshToken: localStorage.getItem("refreshToken") }),
  refreshToken: () => api.post("/auth/refresh-token", { refreshToken: localStorage.getItem("refreshToken") }),
}

// User API
export const userAPI = {
  getUsers: (page = 1, limit = 10) => api.get(`/users?page=${page}&limit=${limit}`),
  getUserById: (userId) => api.get(`/users/${userId}`),
  getUserByEmailOrPhone: (email, phone) => api.get(`/users/search?email=${email || ""}&phone=${phone || ""}`),
  createUser: (userData) => api.post("/users", userData),
  updateUser: (userId, userData) => api.put(`/users/${userId}`, userData),
  deleteUser: (userId) => api.delete(`/users/${userId}`),
  uploadAvatar: (userId, formData) => api.put(`/users/${userId}/avatar`, formData, { headers: { "Content-Type": "multipart/form-data" } }),
}

// Field API
export const fieldAPI = {
  getFields: () => api.get("/fields"),
  getFieldById: (fieldId) => api.get(`/fields/${fieldId}`),
  createField: (fieldData) => api.post("/fields", fieldData),
  updateField: (fieldId, fieldData) => api.put(`/fields/${fieldId}`, fieldData),
  deleteField: (fieldId) => api.delete(`/fields/${fieldId}`),
}

// Field Status API
export const fieldStatusAPI = {
  getFieldStatusByDate: (date) => api.get(`/field-status/date/${date}`),
  getFieldStatusByFieldAndDate: (fieldId, date) => api.get(`/field-status/${fieldId}/date/${date}`),
  createOrUpdateFieldStatus: (fieldId, date, timeSlots) => api.post(`/field-status/${fieldId}/date/${date}`, { timeSlots }),
  updateTimeSlotStatus: (fieldId, date, slotId, statusData) =>
    api.put(`/field-status/${fieldId}/date/${date}/slot/${slotId}`, statusData),
}

// Booking API
export const bookingAPI = {
  getBookings: (page = 1, limit = 10, status) =>
    api.get(`/bookings?page=${page}&limit=${limit}${status ? `&status=${status}` : ""}`),
  getBookingById: (bookingId) => api.get(`/bookings/${bookingId}`),
  getBookingsByUser: (userId, page = 1, limit = 10, status) =>
    api.get(`/bookings/user/${userId}?page=${page}&limit=${limit}${status ? `&status=${status}` : ""}`),
  getBookingsByEmailOrPhone: (email, phone, page = 1, limit = 10, status) =>
    api.get(
      `/bookings/search?email=${email || ""}&phone=${phone || ""}&page=${page}&limit=${limit}${status ? `&status=${status}` : ""}`,
    ),
  createBooking: (bookingData) => api.post("/bookings", bookingData),
  updateBooking: (bookingId, bookingData) => api.put(`/bookings/${bookingId}`, bookingData),
  confirmBooking: (bookingId) => api.put(`/bookings/${bookingId}/confirm`),
  cancelBooking: (bookingId, reason) => api.put(`/bookings/${bookingId}/cancel`, { reason }),
  deleteBooking: (bookingId) => api.delete(`/bookings/${bookingId}`),
}

// Club Application API
export const clubApplicationAPI = {
  getClubApplications: (status) => api.get(`/club-applications${status ? `?status=${status}` : ""}`),
  getClubApplicationById: (applicationId) => api.get(`/club-applications/${applicationId}`),
  getClubApplicationsByUser: (userId) => api.get(`/club-applications/user/${userId}`),
  createClubApplication: (applicationData) => api.post("/club-applications", applicationData),
  updateClubApplication: (applicationId, applicationData) =>
    api.put(`/club-applications/${applicationId}`, applicationData),
  approveClubApplication: (applicationId) => api.put(`/club-applications/${applicationId}/approve`),
  rejectClubApplication: (applicationId, reason) => api.put(`/club-applications/${applicationId}/reject`, { reason }),
  deleteClubApplication: (applicationId) => api.delete(`/club-applications/${applicationId}`),
  uploadAvatar: (applicationId, formData) => api.put(`/club-applications/${applicationId}/avatar`, formData, { headers: { "Content-Type": "multipart/form-data" } }),
}

// Upload API
export const uploadAPI = {
  uploadFile: (formData) => {
    return api.post("/uploads/fields", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },
}

export default api
