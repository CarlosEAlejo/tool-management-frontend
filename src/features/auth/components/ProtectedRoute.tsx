import React from "react";
import type { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader } from "../../../shared/components/Loader";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { initializing, isAuthenticated } = useAuth();
  const location = useLocation();

  if (initializing) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}${location.hash}` }} />;
  }

  return <>{children}</>;
};
