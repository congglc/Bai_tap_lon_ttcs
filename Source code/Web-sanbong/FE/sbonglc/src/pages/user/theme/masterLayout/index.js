import { useLocation } from "react-router-dom"
import Footer from "../footer"
import Header from "../header"

const MasterUserLayout = ({ children, ...props }) => {
  const location = useLocation()
  const isSignInPage = location.pathname === "/dang-nhap"
  const isSignUpPage = location.pathname === "/dang-ky-tai-khoan"
  const isPayMentPage = location.pathname === "/thanh-toan"
  const isProfilePage = location.pathname === "/thong-tin-ca-nhan"
  const isInFoPage = location.pathname === "/dang-ky-club"

  return (
    <div {...props}>
      {!isSignInPage && !isSignUpPage && !isPayMentPage && !isProfilePage && !isInFoPage && <Header />}
      <main>{children}</main>
      {!isSignInPage && !isSignUpPage && !isPayMentPage && !isProfilePage && !isInFoPage && <Footer />}
    </div>
  )
}
export default MasterUserLayout

