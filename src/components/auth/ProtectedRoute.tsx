import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  redirectPath?: string;
  requiredRole: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAuthenticated,
  redirectPath = "/login",
  requiredRole
}) => {

  const user = JSON.parse(localStorage.getItem("user") || "{}");


  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }


  if (user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;