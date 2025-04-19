import { useLocation } from "react-router-dom"
import Footer from "../footer"
import { ROUTERS } from "utils/router"

const MasterAdminLayout = ({ children, ...props }) => {
  const location = useLocation()
  const isSignInPage = location.pathname === ROUTERS.ADMIN.LOGIN

  return (
    <div {...props}>
      <main>{children}</main>
      {!isSignInPage && <Footer />}
    </div>
  )
}
export default MasterAdminLayout

