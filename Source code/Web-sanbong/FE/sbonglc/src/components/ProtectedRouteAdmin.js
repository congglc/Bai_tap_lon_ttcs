import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ROUTERS } from '../utils/router';

const ProtectedRouteAdmin = () => {
  // Kiểm tra xem người dùng có phải admin không (dựa vào localStorage hoặc context)
  const isAdmin = localStorage.getItem('isAdmin') === 'true'; // Hoặc kiểm tra token/role

  // Nếu không phải admin, chuyển hướng về trang login admin
  if (!isAdmin) {
    return <Navigate to={ROUTERS.ADMIN.LOGIN} replace />;
  }

  // Nếu là admin, cho phép truy cập route con
  return <Outlet />;
};

export default ProtectedRouteAdmin; 