import React from "react";
import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { Loader } from "../../../shared/components/Loader";
import { useAuth } from "../context/AuthContext";

export const PublicOnlyRoute = ({ children }: PropsWithChildren) => {
  const { initializing, isAuthenticated } = useAuth();

  if (initializing) {
    return <Loader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
