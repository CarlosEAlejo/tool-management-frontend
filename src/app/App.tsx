import React, { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthLandingRoute } from "../features/auth/components/AuthLandingRoute";
import { PublicOnlyRoute } from "../features/auth/components/PublicOnlyRoute";
import { ProtectedRoute } from "../features/auth/components/ProtectedRoute";
import { AuthProvider } from "../features/auth/context/AuthContext";
import { ThemeProvider } from "../features/theme/context/ThemeContext";
import { Loader } from "../shared/components/Loader";

const LoginPage = lazy(() => import("../features/auth/pages/LoginPage").then((module) => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import("../features/auth/pages/RegisterPage").then((module) => ({ default: module.RegisterPage })));
const ToolsPage = lazy(() => import("../features/tools/ToolsPage").then((module) => ({ default: module.ToolsPage })));
const WorkersPage = lazy(() => import("../features/workers/WorkersPage").then((module) => ({ default: module.WorkersPage })));
const AssignmentsPage = lazy(() => import("../features/assignments/AssignmentsPage").then((module) => ({ default: module.AssignmentsPage })));
const MaintenancePage = lazy(() => import("../features/maintenance/MaintenancePage").then((module) => ({ default: module.MaintenancePage })));
const AppShell = lazy(() => import("../shared/layout/AppShell").then((module) => ({ default: module.AppShell })));
const PlaceholderPage = lazy(() => import("../shared/layout/PlaceholderPage").then((module) => ({ default: module.PlaceholderPage })));

const withSuspense = (element: React.ReactNode) => <Suspense fallback={<Loader />}>{element}</Suspense>;

const App = () => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AuthLandingRoute />} />
          <Route
            path="/login"
            element={withSuspense(
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            )}
          />
          <Route
            path="/register"
            element={withSuspense(
              <PublicOnlyRoute>
                <RegisterPage />
              </PublicOnlyRoute>
            )}
          />
          <Route
            element={withSuspense(
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            )}
          >
            <Route path="/tools" element={withSuspense(<ToolsPage />)} />
            <Route path="/workers" element={withSuspense(<WorkersPage />)} />
            <Route path="/assignments" element={withSuspense(<AssignmentsPage />)} />
            <Route path="/maintenance" element={withSuspense(<MaintenancePage />)} />
            <Route path="/inventory" element={withSuspense(<PlaceholderPage title="Inventario general" />)} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

export default App;
