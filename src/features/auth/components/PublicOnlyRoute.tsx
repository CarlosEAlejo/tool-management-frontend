import React from "react";
import type { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader } from "../../../shared/components/Loader";
import { useAuth } from "../context/AuthContext";

export const PublicOnlyRoute = ({ children }: PropsWithChildren) => {
  const { initializing, isAuthenticated } = useAuth();
  const location = useLocation();
  const redirectTo =
    typeof location.state === "object" && location.state !== null && "from" in location.state && typeof location.state.from === "string"
      ? location.state.from
      : "/tools";

  if (initializing) {
    return <Loader />;
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
