import { Route, Routes, useLocation } from "react-router-dom"
import { ADMIN_PATH, ROUTERS } from "./utils/router"
import HomePage from "./pages/user/homepages"
import MasterUserLayout from "./pages/user/theme/masterLayout"
import Order from "./pages/user/order"
import Club from "./pages/user/club"
import Contact from "./pages/user/contact"
import Signup from "pages/user/form/signup"
import Signin from "pages/user/form/signin"
import Payment from "pages/user/form/payment"
import Profile from "pages/user/form/profile"
import Info from "pages/user/form/information"
import MasterAdminLayout from "pages/admin/theme/masterLayout"
import MyBookings from "pages/user/my-bookings"
import MyClubApplications from "pages/user/my-club-applications"

import Login from "pages/admin/login"
import Dashboard from "pages/admin/dashboard"
import AddField from "pages/admin/add-field"
import FieldStatus from "pages/admin/field-status"
import ClubApplications from "pages/admin/club-applications"
import OrderManagement from "pages/admin/order"
import UserManagement from "pages/admin/users"

const renderUserRouter = () => {
  const UserRouters = [
    {
      path: ROUTERS.USER.HOME,
      component: <HomePage />,
    },
    {
      path: ROUTERS.USER.ORDER,
      component: <Order />,
    },
    {
      path: ROUTERS.USER.CLUB,
      component: <Club />,
    },
    {
      path: ROUTERS.USER.CONTACT,
      component: <Contact />,
    },
    {
      path: ROUTERS.USER.SIGNUP,
      component: <Signup />,
    },
    {
      path: ROUTERS.USER.SIGNIN,
      component: <Signin />,
    },
    {
      path: ROUTERS.USER.PAYMENT,
      component: <Payment />,
    },
    {
      path: ROUTERS.USER.PROFILE,
      component: <Profile />,
    },
    {
      path: ROUTERS.USER.INFO,
      component: <Info />,
    },
    {
      path: ROUTERS.USER.MY_BOOKINGS,
      component: <MyBookings />,
    },
    {
      path: ROUTERS.USER.MY_CLUB_APPLICATIONS,
      component: <MyClubApplications />,
    },
  ]
  return (
    <MasterUserLayout>
      <Routes>
        {UserRouters.map((item, key) => (
          <Route key={key} path={item.path} element={item.component} />
        ))}
      </Routes>
    </MasterUserLayout>
  )
}

const renderAdminRouter = () => {
  // Thêm route cho trang Statistics vào AdminRouters
  const AdminRouters = [
    {
      path: ROUTERS.ADMIN.LOGIN,
      component: <Login />,
    },
    {
      path: ROUTERS.ADMIN.DASHBOARD,
      component: <Dashboard />,
    },
    {
      path: ROUTERS.ADMIN.ADD_FIELD,
      component: <AddField />,
    },
    {
      path: ROUTERS.ADMIN.FIELD_STATUS,
      component: <FieldStatus />,
    },
    {
      path: ROUTERS.ADMIN.CLUB_APPLICATIONS,
      component: <ClubApplications />,
    },
    {
      path: ROUTERS.ADMIN.ORDER,
      component: <OrderManagement />,
    },
    {
      path: ROUTERS.ADMIN.USERS,
      component: <UserManagement />,
    },
  ]
  return (
    <MasterAdminLayout>
      <Routes>
        {AdminRouters.map((item, key) => (
          <Route key={key} path={item.path} element={item.component} />
        ))}
      </Routes>
    </MasterAdminLayout>
  )
}

const RouterCustom = () => {
  const location = useLocation()
  const isAdminRouter = location.pathname.startsWith(ADMIN_PATH)

  return isAdminRouter ? renderAdminRouter() : renderUserRouter()
}

export default RouterCustom

