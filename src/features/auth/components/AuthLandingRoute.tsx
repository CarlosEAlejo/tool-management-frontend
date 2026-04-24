import React from "react";
import { Navigate } from "react-router-dom";
import { Loader } from "../../../shared/components/Loader";
import { useAuth } from "../context/AuthContext";

export const AuthLandingRoute = () => {
  const { initializing, isAuthenticated } = useAuth();

  if (initializing) {
    return <Loader />;
  }

  return <Navigate to={isAuthenticated ? "/tools" : "/login"} replace />;
};
