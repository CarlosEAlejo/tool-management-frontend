import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, expect, test, vi } from "vitest";
import { ThemeProvider } from "../../theme/context/ThemeContext";
import { AuthLandingRoute } from "./AuthLandingRoute";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicOnlyRoute } from "./PublicOnlyRoute";
import { LoginPage } from "../pages/LoginPage";

const mockAuthState = {
  user: null,
  logout: vi.fn<() => Promise<void>>(),
  login: vi.fn(),
  register: vi.fn(),
  refreshProfile: vi.fn(),
  initializing: false,
  isAuthenticated: false,
};

vi.mock("../context/AuthContext", () => ({
  useAuth: () => mockAuthState,
}));

beforeEach(() => {
  mockAuthState.user = null;
  mockAuthState.initializing = false;
  mockAuthState.isAuthenticated = false;
  mockAuthState.login.mockReset();
  window.sessionStorage.clear();
});

test("redirects unauthenticated users from root to login", async () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<AuthLandingRoute />} />
        <Route path="/login" element={<div>Login screen</div>} />
      </Routes>
    </MemoryRouter>
  );

  expect(await screen.findByText("Login screen")).toBeInTheDocument();
});

test("blocks direct navigation to a protected route without a session", async () => {
  render(
    <MemoryRouter initialEntries={["/inventory"]}>
      <Routes>
        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <div>Inventory screen</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div>Login screen</div>} />
      </Routes>
    </MemoryRouter>
  );

  expect(await screen.findByText("Login screen")).toBeInTheDocument();
  expect(screen.queryByText("Inventory screen")).not.toBeInTheDocument();
});

test("returns authenticated users to the original protected route after login", async () => {
  mockAuthState.login.mockResolvedValue({ email: "admin@empresa.com" });

  render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[{ pathname: "/login", state: { from: "/maintenance" } }]}>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />
          <Route path="/maintenance" element={<div>Maintenance screen</div>} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  );

  fireEvent.change(screen.getByLabelText(/Correo/i), { target: { value: "admin@empresa.com" } });
  fireEvent.change(screen.getByLabelText(/Contrasena/i), { target: { value: "secret123" } });
  fireEvent.click(screen.getByRole("button", { name: /Entrar/i }));

  await waitFor(() => {
    expect(mockAuthState.login).toHaveBeenCalledWith({
      email: "admin@empresa.com",
      password: "secret123",
    });
  });

  expect(await screen.findByText("Maintenance screen")).toBeInTheDocument();
});
