import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthLandingRoute } from "../features/auth/components/AuthLandingRoute";
import { PublicOnlyRoute } from "../features/auth/components/PublicOnlyRoute";
import { ProtectedRoute } from "../features/auth/components/ProtectedRoute";
import { AuthProvider } from "../features/auth/context/AuthContext";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { RegisterPage } from "../features/auth/pages/RegisterPage";
import { ThemeProvider } from "../features/theme/context/ThemeContext";
import { ToolsPage } from "../features/tools/ToolsPage";
import { AppShell } from "../shared/layout/AppShell";
import { PlaceholderPage } from "../shared/layout/PlaceholderPage";

const App = () => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AuthLandingRoute />} />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <RegisterPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/loans" element={<PlaceholderPage title="Prestamos" />} />
            <Route path="/maintenance" element={<PlaceholderPage title="Mantenimiento" />} />
            <Route path="/inventory" element={<PlaceholderPage title="Inventario general" />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

export default App;
