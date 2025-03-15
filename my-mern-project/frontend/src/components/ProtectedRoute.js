// frontend/src/components/ProtectedRoute.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const location = useLocation();

  if (!token) return <Navigate to="/login" />;

  if (location.pathname.includes("student") && role !== "student") {
    return <Navigate to="/dashboard/professor" />;
  }
  if (location.pathname.includes("professor") && role !== "professor") {
    return <Navigate to="/dashboard/student" />;
  }

  return children;
};

export default ProtectedRoute;
